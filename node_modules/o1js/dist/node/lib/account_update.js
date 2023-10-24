import { cloneCircuitValue, provable, provablePure, } from './circuit_value.js';
import { memoizationContext, memoizeWitness, Provable } from './provable.js';
import { Field, Bool } from './core.js';
import { Pickles, Test } from '../snarky.js';
import { jsLayout } from '../bindings/mina-transaction/gen/js-layout.js';
import { Types, TypesBigint, toJSONEssential, } from '../bindings/mina-transaction/types.js';
import { PrivateKey, PublicKey } from './signature.js';
import { UInt64, UInt32, Int64 } from './int.js';
import * as Mina from './mina.js';
import { SmartContract } from './zkapp.js';
import * as Precondition from './precondition.js';
import { dummyBase64Proof, Prover } from './proof_system.js';
import { Memo } from '../mina-signer/src/memo.js';
import { Events, Actions, } from '../bindings/mina-transaction/transaction-leaves.js';
import { TokenId as Base58TokenId } from './base58-encodings.js';
import { hashWithPrefix, packToFields } from './hash.js';
import { mocks, prefixes } from '../bindings/crypto/constants.js';
import { Context } from './global-context.js';
import { assert } from './errors.js';
import { MlArray } from './ml/base.js';
import { Signature, signFieldElement } from '../mina-signer/src/signature.js';
import { MlFieldConstArray } from './ml/fields.js';
import { transactionCommitments } from '../mina-signer/src/sign-zkapp-command.js';
// external API
export { AccountUpdate, Permissions, ZkappPublicInput };
// internal API
export { smartContractContext, Permission, Preconditions, Body, Authorization, ZkappCommand, addMissingSignatures, addMissingProofs, ZkappStateLength, Events, Actions, TokenId, Token, CallForest, createChildAccountUpdate, zkAppProver, dummySignature, };
const ZkappStateLength = 8;
let smartContractContext = Context.create({
    default: null,
});
let zkAppProver = Prover();
const True = () => Bool(true);
const False = () => Bool(false);
let Permission = {
    /**
     * Modification is impossible.
     */
    impossible: () => ({
        constant: True(),
        signatureNecessary: True(),
        signatureSufficient: False(),
    }),
    /**
     * Modification is always permitted
     */
    none: () => ({
        constant: True(),
        signatureNecessary: False(),
        signatureSufficient: True(),
    }),
    /**
     * Modification is permitted by zkapp proofs only
     */
    proof: () => ({
        constant: False(),
        signatureNecessary: False(),
        signatureSufficient: False(),
    }),
    /**
     * Modification is permitted by signatures only, using the private key of the zkapp account
     */
    signature: () => ({
        constant: False(),
        signatureNecessary: True(),
        signatureSufficient: True(),
    }),
    /**
     * Modification is permitted by zkapp proofs or signatures
     */
    proofOrSignature: () => ({
        constant: False(),
        signatureNecessary: False(),
        signatureSufficient: True(),
    }),
};
let Permissions = {
    ...Permission,
    /**
     * Default permissions are:
     *
     *   {@link Permissions.editState} = {@link Permission.proof}
     *
     *   {@link Permissions.send} = {@link Permission.signature}
     *
     *   {@link Permissions.receive} = {@link Permission.none}
     *
     *   {@link Permissions.setDelegate} = {@link Permission.signature}
     *
     *   {@link Permissions.setPermissions} = {@link Permission.signature}
     *
     *   {@link Permissions.setVerificationKey} = {@link Permission.signature}
     *
     *   {@link Permissions.setZkappUri} = {@link Permission.signature}
     *
     *   {@link Permissions.editActionState} = {@link Permission.proof}
     *
     *   {@link Permissions.setTokenSymbol} = {@link Permission.signature}
     *
     */
    default: () => ({
        editState: Permission.proof(),
        send: Permission.proof(),
        receive: Permission.none(),
        setDelegate: Permission.signature(),
        setPermissions: Permission.signature(),
        setVerificationKey: Permission.signature(),
        setZkappUri: Permission.signature(),
        editActionState: Permission.proof(),
        setTokenSymbol: Permission.signature(),
        incrementNonce: Permission.signature(),
        setVotingFor: Permission.signature(),
        setTiming: Permission.signature(),
        access: Permission.none(),
    }),
    initial: () => ({
        editState: Permission.signature(),
        send: Permission.signature(),
        receive: Permission.none(),
        setDelegate: Permission.signature(),
        setPermissions: Permission.signature(),
        setVerificationKey: Permission.signature(),
        setZkappUri: Permission.signature(),
        editActionState: Permission.signature(),
        setTokenSymbol: Permission.signature(),
        incrementNonce: Permission.signature(),
        setVotingFor: Permission.signature(),
        setTiming: Permission.signature(),
        access: Permission.none(),
    }),
    dummy: () => ({
        editState: Permission.none(),
        send: Permission.none(),
        receive: Permission.none(),
        access: Permission.none(),
        setDelegate: Permission.none(),
        setPermissions: Permission.none(),
        setVerificationKey: Permission.none(),
        setZkappUri: Permission.none(),
        editActionState: Permission.none(),
        setTokenSymbol: Permission.none(),
        incrementNonce: Permission.none(),
        setVotingFor: Permission.none(),
        setTiming: Permission.none(),
    }),
    allImpossible: () => ({
        editState: Permission.impossible(),
        send: Permission.impossible(),
        receive: Permission.impossible(),
        access: Permission.impossible(),
        setDelegate: Permission.impossible(),
        setPermissions: Permission.impossible(),
        setVerificationKey: Permission.impossible(),
        setZkappUri: Permission.impossible(),
        editActionState: Permission.impossible(),
        setTokenSymbol: Permission.impossible(),
        incrementNonce: Permission.impossible(),
        setVotingFor: Permission.impossible(),
        setTiming: Permission.impossible(),
    }),
    fromString: (permission) => {
        switch (permission) {
            case 'None':
                return Permission.none();
            case 'Either':
                return Permission.proofOrSignature();
            case 'Proof':
                return Permission.proof();
            case 'Signature':
                return Permission.signature();
            case 'Impossible':
                return Permission.impossible();
            default:
                throw Error(`Cannot parse invalid permission. ${permission} does not exist.`);
        }
    },
    fromJSON: (permissions) => {
        return Object.fromEntries(Object.entries(permissions).map(([k, v]) => [
            k,
            Permissions.fromString(v),
        ]));
    },
};
const Body = {
    /**
     * A body that doesn't change the underlying account record
     */
    keepAll(publicKey, tokenId, mayUseToken) {
        let { body } = Types.AccountUpdate.emptyValue();
        body.publicKey = publicKey;
        if (tokenId) {
            body.tokenId = tokenId;
            body.mayUseToken = Provable.if(tokenId.equals(TokenId.default), AccountUpdate.MayUseToken.type, AccountUpdate.MayUseToken.No, AccountUpdate.MayUseToken.ParentsOwnToken);
        }
        if (mayUseToken) {
            body.mayUseToken = mayUseToken;
        }
        return body;
    },
    dummy() {
        return Types.AccountUpdate.emptyValue().body;
    },
};
const FeePayerBody = {
    keepAll(publicKey, nonce) {
        return {
            publicKey,
            nonce,
            fee: UInt64.zero,
            validUntil: undefined,
        };
    },
};
let NetworkPrecondition = {
    ignoreAll() {
        let stakingEpochData = {
            ledger: { hash: ignore(Field(0)), totalCurrency: ignore(uint64()) },
            seed: ignore(Field(0)),
            startCheckpoint: ignore(Field(0)),
            lockCheckpoint: ignore(Field(0)),
            epochLength: ignore(uint32()),
        };
        let nextEpochData = cloneCircuitValue(stakingEpochData);
        return {
            snarkedLedgerHash: ignore(Field(0)),
            blockchainLength: ignore(uint32()),
            minWindowDensity: ignore(uint32()),
            totalCurrency: ignore(uint64()),
            globalSlotSinceGenesis: ignore(uint32()),
            stakingEpochData,
            nextEpochData,
        };
    },
};
/**
 * Ignores a `dummy`
 *
 * @param dummy The value to ignore
 * @returns Always an ignored value regardless of the input.
 */
function ignore(dummy) {
    return { isSome: Bool(false), value: dummy };
}
/**
 * Ranges between all uint32 values
 */
const uint32 = () => ({ lower: UInt32.from(0), upper: UInt32.MAXINT() });
/**
 * Ranges between all uint64 values
 */
const uint64 = () => ({ lower: UInt64.from(0), upper: UInt64.MAXINT() });
const AccountPrecondition = {
    ignoreAll() {
        let appState = [];
        for (let i = 0; i < ZkappStateLength; ++i) {
            appState.push(ignore(Field(0)));
        }
        return {
            balance: ignore(uint64()),
            nonce: ignore(uint32()),
            receiptChainHash: ignore(Field(0)),
            delegate: ignore(PublicKey.empty()),
            state: appState,
            actionState: ignore(Actions.emptyActionState()),
            provedState: ignore(Bool(false)),
            isNew: ignore(Bool(false)),
        };
    },
    nonce(nonce) {
        let p = AccountPrecondition.ignoreAll();
        AccountUpdate.assertEquals(p.nonce, nonce);
        return p;
    },
};
const GlobalSlotPrecondition = {
    ignoreAll() {
        return ignore(uint32());
    },
};
const Preconditions = {
    ignoreAll() {
        return {
            account: AccountPrecondition.ignoreAll(),
            network: NetworkPrecondition.ignoreAll(),
            validWhile: GlobalSlotPrecondition.ignoreAll(),
        };
    },
};
const AccountId = provable({ tokenOwner: PublicKey, parentTokenId: Field }, { customObjectKeys: ['tokenOwner', 'parentTokenId'] });
const TokenId = {
    ...Types.TokenId,
    ...Base58TokenId,
    get default() {
        return Field(1);
    },
    derive(tokenOwner, parentTokenId = Field(1)) {
        let input = AccountId.toInput({ tokenOwner, parentTokenId });
        return hashWithPrefix(prefixes.deriveTokenId, packToFields(input));
    },
};
/**
 * @deprecated use `TokenId` instead of `Token.Id` and `TokenId.derive()` instead of `Token.getId()`
 */
class Token {
    static getId(tokenOwner, parentTokenId = TokenId.default) {
        return TokenId.derive(tokenOwner, parentTokenId);
    }
    constructor({ tokenOwner, parentTokenId = TokenId.default, }) {
        this.parentTokenId = parentTokenId;
        this.tokenOwner = tokenOwner;
        try {
            this.id = TokenId.derive(tokenOwner, parentTokenId);
        }
        catch (e) {
            throw new Error(`Could not create a custom token id:\nError: ${e.message}`);
        }
    }
}
Token.Id = TokenId;
/**
 * An {@link AccountUpdate} is a set of instructions for the Mina network.
 * It includes {@link Preconditions} and a list of state updates, which need to
 * be authorized by either a {@link Signature} or {@link Proof}.
 */
class AccountUpdate {
    constructor(body, authorization = {}, isSelf = false) {
        /**
         * A human-readable label for the account update, indicating how that update
         * was created. Can be modified by applications to add richer information.
         */
        this.label = '';
        this.lazyAuthorization = undefined;
        this.children = {
            callsType: { type: 'None' },
            accountUpdates: [],
        };
        this.parent = undefined;
        this.id = Math.random();
        this.body = body;
        this.authorization = authorization;
        let { account, network, currentSlot } = Precondition.preconditions(this, isSelf);
        this.account = account;
        this.network = network;
        this.currentSlot = currentSlot;
        this.isSelf = isSelf;
    }
    /**
     * Clones the {@link AccountUpdate}.
     */
    static clone(accountUpdate) {
        let body = cloneCircuitValue(accountUpdate.body);
        let authorization = cloneCircuitValue(accountUpdate.authorization);
        let cloned = new AccountUpdate(body, authorization, accountUpdate.isSelf);
        cloned.lazyAuthorization = accountUpdate.lazyAuthorization;
        cloned.children.callsType = accountUpdate.children.callsType;
        cloned.children.accountUpdates = accountUpdate.children.accountUpdates.map(AccountUpdate.clone);
        cloned.id = accountUpdate.id;
        cloned.label = accountUpdate.label;
        cloned.parent = accountUpdate.parent;
        return cloned;
    }
    token() {
        let thisAccountUpdate = this;
        let tokenOwner = this.publicKey;
        let parentTokenId = this.tokenId;
        let id = TokenId.derive(tokenOwner, parentTokenId);
        function getApprovedAccountUpdate(accountLike, label) {
            if (accountLike instanceof SmartContract) {
                accountLike = accountLike.self;
            }
            if (accountLike instanceof AccountUpdate) {
                accountLike.tokenId.assertEquals(id);
                thisAccountUpdate.approve(accountLike);
            }
            if (accountLike instanceof PublicKey) {
                accountLike = AccountUpdate.defaultAccountUpdate(accountLike, id);
                makeChildAccountUpdate(thisAccountUpdate, accountLike);
            }
            if (!accountLike.label)
                accountLike.label = `${thisAccountUpdate.label ?? 'Unlabeled'}.${label}`;
            return accountLike;
        }
        return {
            id,
            parentTokenId,
            tokenOwner,
            /**
             * Mints token balance to `address`. Returns the mint account update.
             */
            mint({ address, amount, }) {
                let receiver = getApprovedAccountUpdate(address, 'token.mint()');
                receiver.balance.addInPlace(amount);
                return receiver;
            },
            /**
             * Burn token balance on `address`. Returns the burn account update.
             */
            burn({ address, amount, }) {
                let sender = getApprovedAccountUpdate(address, 'token.burn()');
                // Sub the amount to burn from the sender's account
                sender.balance.subInPlace(amount);
                // Require signature from the sender account being deducted
                sender.body.useFullCommitment = Bool(true);
                Authorization.setLazySignature(sender);
                return sender;
            },
            /**
             * Move token balance from `from` to `to`. Returns the `to` account update.
             */
            send({ from, to, amount, }) {
                let sender = getApprovedAccountUpdate(from, 'token.send() (sender)');
                sender.balance.subInPlace(amount);
                sender.body.useFullCommitment = Bool(true);
                Authorization.setLazySignature(sender);
                let receiver = getApprovedAccountUpdate(to, 'token.send() (receiver)');
                receiver.balance.addInPlace(amount);
                return receiver;
            },
        };
    }
    get tokenId() {
        return this.body.tokenId;
    }
    /**
     * @deprecated use `this.account.tokenSymbol`
     */
    get tokenSymbol() {
        let accountUpdate = this;
        return {
            set(tokenSymbol) {
                accountUpdate.account.tokenSymbol.set(tokenSymbol);
            },
        };
    }
    send({ to, amount, }) {
        let receiver;
        if (to instanceof AccountUpdate) {
            receiver = to;
            receiver.body.tokenId.assertEquals(this.body.tokenId);
        }
        else if (to instanceof SmartContract) {
            receiver = to.self;
            receiver.body.tokenId.assertEquals(this.body.tokenId);
        }
        else {
            receiver = AccountUpdate.defaultAccountUpdate(to, this.body.tokenId);
            receiver.label = `${this.label ?? 'Unlabeled'}.send()`;
            this.approve(receiver);
        }
        // Sub the amount from the sender's account
        this.body.balanceChange = Int64.fromObject(this.body.balanceChange).sub(amount);
        // Add the amount to the receiver's account
        receiver.body.balanceChange = Int64.fromObject(receiver.body.balanceChange).add(amount);
        return receiver;
    }
    /**
     * Makes an {@link AccountUpdate} a child-{@link AccountUpdate} of this and
     * approves it.
     */
    approve(childUpdate, layout = AccountUpdate.Layout.NoChildren) {
        makeChildAccountUpdate(this, childUpdate);
        AccountUpdate.witnessChildren(childUpdate, layout, { skipCheck: true });
    }
    get balance() {
        let accountUpdate = this;
        return {
            addInPlace(x) {
                let { magnitude, sgn } = accountUpdate.body.balanceChange;
                accountUpdate.body.balanceChange = new Int64(magnitude, sgn).add(x);
            },
            subInPlace(x) {
                let { magnitude, sgn } = accountUpdate.body.balanceChange;
                accountUpdate.body.balanceChange = new Int64(magnitude, sgn).sub(x);
            },
        };
    }
    get update() {
        return this.body.update;
    }
    static setValue(maybeValue, value) {
        maybeValue.isSome = Bool(true);
        maybeValue.value = value;
    }
    /**
     * Constrain a property to lie between lower and upper bounds.
     *
     * @param property The property to constrain
     * @param lower The lower bound
     * @param upper The upper bound
     *
     * Example: To constrain the account balance of a SmartContract to lie between
     * 0 and 20 MINA, you can use
     *
     * ```ts
     * \@method onlyRunsWhenBalanceIsLow() {
     *   let lower = UInt64.zero;
     *   let upper = UInt64.from(20e9);
     *   AccountUpdate.assertBetween(this.self.body.preconditions.account.balance, lower, upper);
     *   // ...
     * }
     * ```
     */
    static assertBetween(property, lower, upper) {
        property.isSome = Bool(true);
        property.value.lower = lower;
        property.value.upper = upper;
    }
    // TODO: assertGreaterThan, assertLowerThan?
    /**
     * Fix a property to a certain value.
     *
     * @param property The property to constrain
     * @param value The value it is fixed to
     *
     * Example: To fix the account nonce of a SmartContract to 0, you can use
     *
     * ```ts
     * \@method onlyRunsWhenNonceIsZero() {
     *   AccountUpdate.assertEquals(this.self.body.preconditions.account.nonce, UInt32.zero);
     *   // ...
     * }
     * ```
     */
    static assertEquals(property, value) {
        property.isSome = Bool(true);
        if ('lower' in property.value && 'upper' in property.value) {
            property.value.lower = value;
            property.value.upper = value;
        }
        else {
            property.value = value;
        }
    }
    get publicKey() {
        return this.body.publicKey;
    }
    /**
     * Use this command if this account update should be signed by the account
     * owner, instead of not having any authorization.
     *
     * If you use this and are not relying on a wallet to sign your transaction,
     * then you should use the following code before sending your transaction:
     *
     * ```ts
     * let tx = Mina.transaction(...); // create transaction as usual, using `requireSignature()` somewhere
     * tx.sign([privateKey]); // pass the private key of this account to `sign()`!
     * ```
     *
     * Note that an account's {@link Permissions} determine which updates have to
     * be (can be) authorized by a signature.
     */
    requireSignature() {
        this.sign();
    }
    /**
     * @deprecated `.sign()` is deprecated in favor of `.requireSignature()`
     */
    sign(privateKey) {
        let { nonce, isSameAsFeePayer } = AccountUpdate.getSigningInfo(this);
        // if this account is the same as the fee payer, we use the "full commitment" for replay protection
        this.body.useFullCommitment = isSameAsFeePayer;
        this.body.implicitAccountCreationFee = Bool(false);
        // otherwise, we increment the nonce
        let doIncrementNonce = isSameAsFeePayer.not();
        this.body.incrementNonce = doIncrementNonce;
        // in this case, we also have to set a nonce precondition
        let lower = Provable.if(doIncrementNonce, UInt32, nonce, UInt32.zero);
        let upper = Provable.if(doIncrementNonce, UInt32, nonce, UInt32.MAXINT());
        this.body.preconditions.account.nonce.isSome = doIncrementNonce;
        this.body.preconditions.account.nonce.value.lower = lower;
        this.body.preconditions.account.nonce.value.upper = upper;
        // set lazy signature
        Authorization.setLazySignature(this, { privateKey });
    }
    static signFeePayerInPlace(feePayer, privateKey) {
        feePayer.body.nonce = this.getNonce(feePayer);
        feePayer.authorization = dummySignature();
        feePayer.lazyAuthorization = { kind: 'lazy-signature', privateKey };
    }
    static getNonce(accountUpdate) {
        return AccountUpdate.getSigningInfo(accountUpdate).nonce;
    }
    static getSigningInfo(accountUpdate) {
        return memoizeWitness(AccountUpdate.signingInfo, () => AccountUpdate.getSigningInfoUnchecked(accountUpdate));
    }
    static getSigningInfoUnchecked(update) {
        let publicKey = update.body.publicKey;
        let tokenId = update instanceof AccountUpdate ? update.body.tokenId : TokenId.default;
        let nonce = Number(Precondition.getAccountPreconditions(update.body).nonce.toString());
        // if the fee payer is the same account update as this one, we have to start
        // the nonce predicate at one higher, bc the fee payer already increases its
        // nonce
        let isFeePayer = Mina.currentTransaction()?.sender?.equals(publicKey);
        let isSameAsFeePayer = !!isFeePayer
            ?.and(tokenId.equals(TokenId.default))
            .toBoolean();
        if (isSameAsFeePayer)
            nonce++;
        // now, we check how often this account update already updated its nonce in
        // this tx, and increase nonce from `getAccount` by that amount
        CallForest.forEachPredecessor(Mina.currentTransaction.get().accountUpdates, update, (otherUpdate) => {
            let shouldIncreaseNonce = otherUpdate.publicKey
                .equals(publicKey)
                .and(otherUpdate.tokenId.equals(tokenId))
                .and(otherUpdate.body.incrementNonce);
            if (shouldIncreaseNonce.toBoolean())
                nonce++;
        });
        return {
            nonce: UInt32.from(nonce),
            isSameAsFeePayer: Bool(isSameAsFeePayer),
        };
    }
    toJSON() {
        return Types.AccountUpdate.toJSON(this);
    }
    static toJSON(a) {
        return Types.AccountUpdate.toJSON(a);
    }
    static fromJSON(json) {
        let accountUpdate = Types.AccountUpdate.fromJSON(json);
        return new AccountUpdate(accountUpdate.body, accountUpdate.authorization);
    }
    hash() {
        // these two ways of hashing are (and have to be) consistent / produce the same hash
        // TODO: there's no reason anymore to use two different hashing methods here!
        // -- the "inCheckedComputation" branch works in all circumstances now
        // we just leave this here for a couple more weeks, because it checks
        // consistency between JS & OCaml hashing on *every single account update
        // proof* we create. It will give us 100% confidence that the two
        // implementations are equivalent, and catch regressions quickly
        if (Provable.inCheckedComputation()) {
            let input = Types.AccountUpdate.toInput(this);
            return hashWithPrefix(prefixes.body, packToFields(input));
        }
        else {
            let json = Types.AccountUpdate.toJSON(this);
            return Field(Test.hashFromJson.accountUpdate(JSON.stringify(json)));
        }
    }
    toPublicInput() {
        let accountUpdate = this.hash();
        let calls = CallForest.hashChildren(this);
        return { accountUpdate, calls };
    }
    static defaultAccountUpdate(address, tokenId) {
        return new AccountUpdate(Body.keepAll(address, tokenId));
    }
    static dummy() {
        return new AccountUpdate(Body.dummy());
    }
    isDummy() {
        return this.body.publicKey.isEmpty();
    }
    static defaultFeePayer(address, nonce) {
        let body = FeePayerBody.keepAll(address, nonce);
        return {
            body,
            authorization: dummySignature(),
            lazyAuthorization: { kind: 'lazy-signature' },
        };
    }
    static dummyFeePayer() {
        let body = FeePayerBody.keepAll(PublicKey.empty(), UInt32.zero);
        return { body, authorization: dummySignature() };
    }
    /**
     * Creates an account update. If this is inside a transaction, the account
     * update becomes part of the transaction. If this is inside a smart contract
     * method, the account update will not only become part of the transaction,
     * but also becomes available for the smart contract to modify, in a way that
     * becomes part of the proof.
     */
    static create(publicKey, tokenId) {
        let accountUpdate = AccountUpdate.defaultAccountUpdate(publicKey, tokenId);
        let insideContract = smartContractContext.get();
        if (insideContract) {
            let self = insideContract.this.self;
            self.approve(accountUpdate);
            accountUpdate.label = `${self.label || 'Unlabeled'} > AccountUpdate.create()`;
        }
        else {
            Mina.currentTransaction()?.accountUpdates.push(accountUpdate);
            accountUpdate.label = `Mina.transaction > AccountUpdate.create()`;
        }
        return accountUpdate;
    }
    /**
     * Attach account update to the current transaction
     * -- if in a smart contract, to its children
     */
    static attachToTransaction(accountUpdate) {
        let insideContract = smartContractContext.get();
        if (insideContract) {
            let selfUpdate = insideContract.this.self;
            // avoid redundant attaching & cycle in account update structure, happens
            // when calling attachToTransaction(this.self) inside a @method
            // TODO avoid account update cycles more generally
            if (selfUpdate === accountUpdate)
                return;
            insideContract.this.self.approve(accountUpdate);
        }
        else {
            if (!Mina.currentTransaction.has())
                return;
            let updates = Mina.currentTransaction.get().accountUpdates;
            if (!updates.find((update) => update.id === accountUpdate.id)) {
                updates.push(accountUpdate);
            }
        }
    }
    /**
     * Disattach an account update from where it's currently located in the transaction
     */
    static unlink(accountUpdate) {
        let siblings = accountUpdate.parent?.children.accountUpdates ??
            Mina.currentTransaction()?.accountUpdates;
        if (siblings === undefined)
            return;
        let i = siblings?.findIndex((update) => update.id === accountUpdate.id);
        if (i !== undefined && i !== -1) {
            siblings.splice(i, 1);
        }
        accountUpdate.parent === undefined;
    }
    static createSigned(signer, tokenId) {
        let publicKey = signer instanceof PrivateKey ? signer.toPublicKey() : signer;
        let accountUpdate = AccountUpdate.create(publicKey, tokenId);
        accountUpdate.label = accountUpdate.label.replace('.create()', '.createSigned()');
        if (signer instanceof PrivateKey) {
            accountUpdate.sign(signer);
        }
        else {
            accountUpdate.requireSignature();
        }
        return accountUpdate;
    }
    static fundNewAccount(feePayer, numberOfAccounts) {
        let accountUpdate = AccountUpdate.createSigned(feePayer);
        accountUpdate.label = 'AccountUpdate.fundNewAccount()';
        let fee = Mina.accountCreationFee();
        numberOfAccounts ?? (numberOfAccounts = 1);
        if (typeof numberOfAccounts === 'number')
            fee = fee.mul(numberOfAccounts);
        else
            fee = fee.add(UInt64.from(numberOfAccounts.initialBalance ?? 0));
        accountUpdate.balance.subInPlace(fee);
        return accountUpdate;
    }
    static toAuxiliary(a) {
        let aux = Types.AccountUpdate.toAuxiliary(a);
        let children = {
            callsType: { type: 'None' },
            accountUpdates: [],
        };
        let lazyAuthorization = a && a.lazyAuthorization;
        if (a) {
            children.callsType = a.children.callsType;
            children.accountUpdates = a.children.accountUpdates.map(AccountUpdate.clone);
        }
        let parent = a?.parent;
        let id = a?.id ?? Math.random();
        let label = a?.label ?? '';
        return [{ lazyAuthorization, children, parent, id, label }, aux];
    }
    static fromFields(fields, [other, aux]) {
        let accountUpdate = Types.AccountUpdate.fromFields(fields, aux);
        return Object.assign(new AccountUpdate(accountUpdate.body, accountUpdate.authorization), other);
    }
    static witness(type, compute, { skipCheck = false } = {}) {
        // construct the circuit type for a accountUpdate + other result
        let accountUpdateType = skipCheck
            ? { ...provable(AccountUpdate), check() { } }
            : AccountUpdate;
        let combinedType = provable({
            accountUpdate: accountUpdateType,
            result: type,
        });
        return Provable.witness(combinedType, compute);
    }
    static witnessChildren(accountUpdate, childLayout, options) {
        // just witness children's hash if childLayout === null
        if (childLayout === AccountUpdate.Layout.AnyChildren) {
            accountUpdate.children.callsType = { type: 'Witness' };
            return;
        }
        if (childLayout === AccountUpdate.Layout.NoDelegation) {
            accountUpdate.children.callsType = { type: 'Witness' };
            accountUpdate.body.mayUseToken.parentsOwnToken.assertFalse();
            accountUpdate.body.mayUseToken.inheritFromParent.assertFalse();
            return;
        }
        let childArray = typeof childLayout === 'number'
            ? Array(childLayout).fill(AccountUpdate.Layout.NoChildren)
            : childLayout;
        let n = childArray.length;
        for (let i = 0; i < n; i++) {
            accountUpdate.children.accountUpdates[i] = AccountUpdate.witnessTree(provable(null), childArray[i], () => ({
                accountUpdate: accountUpdate.children.accountUpdates[i] ?? AccountUpdate.dummy(),
                result: null,
            }), options).accountUpdate;
        }
        if (n === 0) {
            accountUpdate.children.callsType = {
                type: 'Equals',
                value: CallForest.emptyHash(),
            };
        }
    }
    /**
     * Like AccountUpdate.witness, but lets you specify a layout for the
     * accountUpdate's children, which also get witnessed
     */
    static witnessTree(resultType, childLayout, compute, options) {
        // witness the root accountUpdate
        let { accountUpdate, result } = AccountUpdate.witness(resultType, compute, options);
        // witness child account updates
        AccountUpdate.witnessChildren(accountUpdate, childLayout, options);
        return { accountUpdate, result };
    }
    static get MayUseToken() {
        return {
            type: provablePure({ parentsOwnToken: Bool, inheritFromParent: Bool }, { customObjectKeys: ['parentsOwnToken', 'inheritFromParent'] }),
            No: { parentsOwnToken: Bool(false), inheritFromParent: Bool(false) },
            ParentsOwnToken: {
                parentsOwnToken: Bool(true),
                inheritFromParent: Bool(false),
            },
            InheritFromParent: {
                parentsOwnToken: Bool(false),
                inheritFromParent: Bool(true),
            },
            isNo({ body: { mayUseToken: { parentsOwnToken, inheritFromParent }, }, }) {
                return parentsOwnToken.or(inheritFromParent).not();
            },
            isParentsOwnToken(a) {
                return a.body.mayUseToken.parentsOwnToken;
            },
            isInheritFromParent(a) {
                return a.body.mayUseToken.inheritFromParent;
            },
        };
    }
    /**
     * Returns a JSON representation of only the fields that differ from the
     * default {@link AccountUpdate}.
     */
    toPretty() {
        function short(s) {
            return '..' + s.slice(-4);
        }
        let jsonUpdate = toJSONEssential(jsLayout.AccountUpdate, this);
        let body = jsonUpdate.body;
        delete body.callData;
        body.publicKey = short(body.publicKey);
        if (body.balanceChange?.magnitude === '0')
            delete body.balanceChange;
        if (body.tokenId === TokenId.toBase58(TokenId.default)) {
            delete body.tokenId;
        }
        else {
            body.tokenId = short(body.tokenId);
        }
        if (body.callDepth === 0)
            delete body.callDepth;
        if (body.incrementNonce === false)
            delete body.incrementNonce;
        if (body.useFullCommitment === false)
            delete body.useFullCommitment;
        if (body.implicitAccountCreationFee === false)
            delete body.implicitAccountCreationFee;
        if (body.events?.length === 0)
            delete body.events;
        if (body.actions?.length === 0)
            delete body.actions;
        if (body.preconditions?.account) {
            body.preconditions.account = JSON.stringify(body.preconditions.account);
        }
        if (body.preconditions?.network) {
            body.preconditions.network = JSON.stringify(body.preconditions.network);
        }
        if (body.preconditions?.validWhile) {
            body.preconditions.validWhile = JSON.stringify(body.preconditions.validWhile);
        }
        if (jsonUpdate.authorization?.proof) {
            jsonUpdate.authorization.proof = short(jsonUpdate.authorization.proof);
        }
        if (jsonUpdate.authorization?.signature) {
            jsonUpdate.authorization.signature = short(jsonUpdate.authorization.signature);
        }
        if (body.update?.verificationKey) {
            body.update.verificationKey = JSON.stringify({
                data: short(body.update.verificationKey.data),
                hash: short(body.update.verificationKey.hash),
            });
        }
        for (let key of ['permissions', 'appState', 'timing']) {
            if (body.update?.[key]) {
                body.update[key] = JSON.stringify(body.update[key]);
            }
        }
        for (let key of ['events', 'actions']) {
            if (body[key]) {
                body[key] = JSON.stringify(body[key]);
            }
        }
        if (jsonUpdate.authorization !== undefined ||
            body.authorizationKind?.isProved === true ||
            body.authorizationKind?.isSigned === true) {
            body.authorization = jsonUpdate.authorization;
        }
        body.mayUseToken = {
            parentsOwnToken: this.body.mayUseToken.parentsOwnToken.toBoolean(),
            inheritFromParent: this.body.mayUseToken.inheritFromParent.toBoolean(),
        };
        let pretty = { ...body };
        let withId = false;
        if (withId)
            pretty = { id: Math.floor(this.id * 1000), ...pretty };
        if (this.label)
            pretty = { label: this.label, ...pretty };
        return pretty;
    }
}
AccountUpdate.Actions = Actions;
AccountUpdate.signingInfo = provable({
    nonce: UInt32,
    isSameAsFeePayer: Bool,
});
// static methods that implement Provable<AccountUpdate>
AccountUpdate.sizeInFields = Types.AccountUpdate.sizeInFields;
AccountUpdate.toFields = Types.AccountUpdate.toFields;
AccountUpdate.toInput = Types.AccountUpdate.toInput;
AccountUpdate.check = Types.AccountUpdate.check;
/**
 * Describes the children of an account update, which are laid out in a tree.
 *
 * The tree layout is described recursively by using a combination of `AccountUpdate.Layout.NoChildren`, `AccountUpdate.Layout.StaticChildren(...)` and `AccountUpdate.Layout.AnyChildren`.
 * - `NoChildren` means an account update that can't have children
 * - `AnyChildren` means an account update can have an arbitrary amount of children, which means you can't access those children in your circuit (because the circuit is static).
 * - `StaticChildren` means the account update must have a certain static amount of children and expects as arguments a description of each of those children.
 *   As a shortcut, you can also pass `StaticChildren` a number, which means it has that amount of children but no grandchildren.
 *
 * This is best understood by examples:
 *
 * ```ts
 * let { NoChildren, AnyChildren, StaticChildren } = AccounUpdate.Layout;
 *
 * NoChildren                 // an account update with no children
 * AnyChildren                // an account update with arbitrary children
 * StaticChildren(NoChildren) // an account update with 1 child, which doesn't have children itself
 * StaticChildren(1)          // shortcut for StaticChildren(NoChildren)
 * StaticChildren(2)          // shortcut for StaticChildren(NoChildren, NoChildren)
 * StaticChildren(0)          // equivalent to NoChildren
 *
 * // an update with 2 children, of which one has arbitrary children and the other has exactly 1 descendant
 * StaticChildren(AnyChildren, StaticChildren(1))
 * ```
 */
AccountUpdate.Layout = {
    StaticChildren: ((...args) => {
        if (args.length === 1 && typeof args[0] === 'number')
            return args[0];
        if (args.length === 0)
            return 0;
        return args;
    }),
    NoChildren: 0,
    AnyChildren: 'AnyChildren',
    NoDelegation: 'NoDelegation',
};
const CallForest = {
    // similar to Mina_base.ZkappCommand.Call_forest.to_account_updates_list
    // takes a list of accountUpdates, which each can have children, so they form a "forest" (list of trees)
    // returns a flattened list, with `accountUpdate.body.callDepth` specifying positions in the forest
    // also removes any "dummy" accountUpdates
    toFlatList(forest, mutate = true, depth = 0) {
        let accountUpdates = [];
        for (let accountUpdate of forest) {
            if (accountUpdate.isDummy().toBoolean())
                continue;
            if (mutate)
                accountUpdate.body.callDepth = depth;
            let children = accountUpdate.children.accountUpdates;
            accountUpdates.push(accountUpdate, ...CallForest.toFlatList(children, mutate, depth + 1));
        }
        return accountUpdates;
    },
    // Mina_base.Zkapp_command.Digest.Forest.empty
    emptyHash() {
        return Field(0);
    },
    // similar to Mina_base.Zkapp_command.Call_forest.accumulate_hashes
    // hashes a accountUpdate's children (and their children, and ...) to compute
    // the `calls` field of ZkappPublicInput
    hashChildren(update) {
        let { callsType } = update.children;
        // compute hash outside the circuit if callsType is "Witness"
        // i.e., allowing accountUpdates with arbitrary children
        if (callsType.type === 'Witness') {
            return Provable.witness(Field, () => CallForest.hashChildrenBase(update));
        }
        let calls = CallForest.hashChildrenBase(update);
        if (callsType.type === 'Equals' && Provable.inCheckedComputation()) {
            calls.assertEquals(callsType.value);
        }
        return calls;
    },
    hashChildrenBase({ children }) {
        let stackHash = CallForest.emptyHash();
        for (let accountUpdate of [...children.accountUpdates].reverse()) {
            let calls = CallForest.hashChildren(accountUpdate);
            let nodeHash = hashWithPrefix(prefixes.accountUpdateNode, [
                accountUpdate.hash(),
                calls,
            ]);
            let newHash = hashWithPrefix(prefixes.accountUpdateCons, [
                nodeHash,
                stackHash,
            ]);
            // skip accountUpdate if it's a dummy
            stackHash = Provable.if(accountUpdate.isDummy(), stackHash, newHash);
        }
        return stackHash;
    },
    // Mina_base.Zkapp_command.Call_forest.add_callers
    // TODO: currently unused, but could come back when we add caller to the
    // public input
    addCallers(updates, context = {
        self: TokenId.default,
        caller: TokenId.default,
    }) {
        let withCallers = [];
        for (let update of updates) {
            let { mayUseToken } = update.body;
            let caller = Provable.if(mayUseToken.parentsOwnToken, context.self, Provable.if(mayUseToken.inheritFromParent, context.caller, TokenId.default));
            let self = TokenId.derive(update.body.publicKey, update.body.tokenId);
            let childContext = { caller, self };
            withCallers.push({
                accountUpdate: update,
                caller,
                children: CallForest.addCallers(update.children.accountUpdates, childContext),
            });
        }
        return withCallers;
    },
    /**
     * Used in the prover to witness the context from which to compute its caller
     *
     * TODO: currently unused, but could come back when we add caller to the
     * public input
     */
    computeCallerContext(update) {
        // compute the line of ancestors
        let current = update;
        let ancestors = [];
        while (true) {
            let parent = current.parent;
            if (parent === undefined)
                break;
            ancestors.unshift(parent);
            current = parent;
        }
        let context = { self: TokenId.default, caller: TokenId.default };
        for (let update of ancestors) {
            if (update.body.mayUseToken.parentsOwnToken.toBoolean()) {
                context.caller = context.self;
            }
            else if (!update.body.mayUseToken.inheritFromParent.toBoolean()) {
                context.caller = TokenId.default;
            }
            context.self = TokenId.derive(update.body.publicKey, update.body.tokenId);
        }
        return context;
    },
    callerContextType: provablePure({ self: Field, caller: Field }),
    computeCallDepth(update) {
        for (let callDepth = 0;; callDepth++) {
            if (update.parent === undefined)
                return callDepth;
            update = update.parent;
        }
    },
    map(updates, map) {
        let newUpdates = [];
        for (let update of updates) {
            let newUpdate = map(update);
            newUpdate.children.accountUpdates = CallForest.map(update.children.accountUpdates, map);
            newUpdates.push(newUpdate);
        }
        return newUpdates;
    },
    forEach(updates, callback) {
        for (let update of updates) {
            callback(update);
            CallForest.forEach(update.children.accountUpdates, callback);
        }
    },
    forEachPredecessor(updates, update, callback) {
        let isPredecessor = true;
        CallForest.forEach(updates, (otherUpdate) => {
            if (otherUpdate.id === update.id)
                isPredecessor = false;
            if (isPredecessor)
                callback(otherUpdate);
        });
    },
};
function createChildAccountUpdate(parent, childAddress, tokenId) {
    let child = AccountUpdate.defaultAccountUpdate(childAddress, tokenId);
    makeChildAccountUpdate(parent, child);
    return child;
}
function makeChildAccountUpdate(parent, child) {
    child.body.callDepth = parent.body.callDepth + 1;
    let wasChildAlready = parent.children.accountUpdates.find((update) => update.id === child.id);
    // add to our children if not already here
    if (!wasChildAlready) {
        parent.children.accountUpdates.push(child);
        // remove the child from the top level list / its current parent
        AccountUpdate.unlink(child);
    }
    child.parent = parent;
}
const ZkappCommand = {
    toPretty(transaction) {
        let feePayer = ZkappCommand.toJSON(transaction).feePayer;
        feePayer.body.publicKey = '..' + feePayer.body.publicKey.slice(-4);
        feePayer.body.authorization = '..' + feePayer.authorization.slice(-4);
        if (feePayer.body.validUntil === null)
            delete feePayer.body.validUntil;
        return [
            { label: 'feePayer', ...feePayer.body },
            ...transaction.accountUpdates.map((a) => a.toPretty()),
        ];
    },
    fromJSON(json) {
        let { feePayer } = Types.ZkappCommand.fromJSON({
            feePayer: json.feePayer,
            accountUpdates: [],
            memo: json.memo,
        });
        let memo = Memo.toString(Memo.fromBase58(json.memo));
        let accountUpdates = json.accountUpdates.map(AccountUpdate.fromJSON);
        return { feePayer, accountUpdates, memo };
    },
    toJSON({ feePayer, accountUpdates, memo }) {
        memo = Memo.toBase58(Memo.fromString(memo));
        return Types.ZkappCommand.toJSON({ feePayer, accountUpdates, memo });
    },
};
const Authorization = {
    hasLazyProof(accountUpdate) {
        return accountUpdate.lazyAuthorization?.kind === 'lazy-proof';
    },
    hasAny(accountUpdate) {
        let { authorization: auth, lazyAuthorization: lazyAuth } = accountUpdate;
        return !!(lazyAuth || 'proof' in auth || 'signature' in auth);
    },
    setSignature(accountUpdate, signature) {
        accountUpdate.authorization = { signature };
        accountUpdate.lazyAuthorization = undefined;
    },
    setProof(accountUpdate, proof) {
        accountUpdate.authorization = { proof };
        accountUpdate.lazyAuthorization = undefined;
        return accountUpdate;
    },
    setLazySignature(accountUpdate, signature) {
        signature ?? (signature = {});
        accountUpdate.body.authorizationKind.isSigned = Bool(true);
        accountUpdate.body.authorizationKind.isProved = Bool(false);
        accountUpdate.body.authorizationKind.verificationKeyHash = Field(mocks.dummyVerificationKeyHash);
        accountUpdate.authorization = {};
        accountUpdate.lazyAuthorization = { ...signature, kind: 'lazy-signature' };
    },
    setProofAuthorizationKind({ body, id }, priorAccountUpdates) {
        body.authorizationKind.isSigned = Bool(false);
        body.authorizationKind.isProved = Bool(true);
        let hash = Provable.witness(Field, () => {
            let proverData = zkAppProver.getData();
            let isProver = proverData !== undefined;
            assert(isProver || priorAccountUpdates !== undefined, 'Called `setProofAuthorizationKind()` outside the prover without passing in `priorAccountUpdates`.');
            let myAccountUpdateId = isProver ? proverData.accountUpdate.id : id;
            priorAccountUpdates ?? (priorAccountUpdates = proverData.transaction.accountUpdates);
            priorAccountUpdates = priorAccountUpdates.filter((a) => a.id !== myAccountUpdateId);
            let priorAccountUpdatesFlat = CallForest.toFlatList(priorAccountUpdates, false);
            let accountUpdate = [...priorAccountUpdatesFlat]
                .reverse()
                .find((body_) => body_.update.verificationKey.isSome
                .and(body_.tokenId.equals(body.tokenId))
                .and(body_.publicKey.equals(body.publicKey))
                .toBoolean());
            if (accountUpdate !== undefined) {
                return accountUpdate.body.update.verificationKey.value.hash;
            }
            try {
                let account = Mina.getAccount(body.publicKey, body.tokenId);
                return account.zkapp?.verificationKey?.hash ?? Field(0);
            }
            catch {
                return Field(0);
            }
        });
        body.authorizationKind.verificationKeyHash = hash;
    },
    setLazyProof(accountUpdate, proof, priorAccountUpdates) {
        Authorization.setProofAuthorizationKind(accountUpdate, priorAccountUpdates);
        accountUpdate.authorization = {};
        accountUpdate.lazyAuthorization = { ...proof, kind: 'lazy-proof' };
    },
    setLazyNone(accountUpdate) {
        accountUpdate.body.authorizationKind.isSigned = Bool(false);
        accountUpdate.body.authorizationKind.isProved = Bool(false);
        accountUpdate.body.authorizationKind.verificationKeyHash = Field(mocks.dummyVerificationKeyHash);
        accountUpdate.authorization = {};
        accountUpdate.lazyAuthorization = { kind: 'lazy-none' };
    },
};
function addMissingSignatures(zkappCommand, additionalKeys = []) {
    let additionalPublicKeys = additionalKeys.map((sk) => sk.toPublicKey());
    let { commitment, fullCommitment } = transactionCommitments(TypesBigint.ZkappCommand.fromJSON(ZkappCommand.toJSON(zkappCommand)));
    function addFeePayerSignature(accountUpdate) {
        let { body, authorization, lazyAuthorization } = cloneCircuitValue(accountUpdate);
        if (lazyAuthorization === undefined)
            return { body, authorization };
        let { privateKey } = lazyAuthorization;
        if (privateKey === undefined) {
            let i = additionalPublicKeys.findIndex((pk) => pk.equals(accountUpdate.body.publicKey).toBoolean());
            if (i === -1) {
                // private key is missing, but we are not throwing an error here
                // there is a change signature will be added by the wallet
                // if not, error will be thrown by verifyAccountUpdate
                // while .send() execution
                return { body, authorization: dummySignature() };
            }
            privateKey = additionalKeys[i];
        }
        let signature = signFieldElement(fullCommitment, privateKey.toBigInt(), 'testnet');
        return { body, authorization: Signature.toBase58(signature) };
    }
    function addSignature(accountUpdate) {
        accountUpdate = AccountUpdate.clone(accountUpdate);
        if (accountUpdate.lazyAuthorization?.kind !== 'lazy-signature') {
            return accountUpdate;
        }
        let { privateKey } = accountUpdate.lazyAuthorization;
        if (privateKey === undefined) {
            let i = additionalPublicKeys.findIndex((pk) => pk.equals(accountUpdate.body.publicKey).toBoolean());
            if (i === -1) {
                // private key is missing, but we are not throwing an error here
                // there is a change signature will be added by the wallet
                // if not, error will be thrown by verifyAccountUpdate
                // while .send() execution
                Authorization.setSignature(accountUpdate, dummySignature());
                return accountUpdate;
            }
            privateKey = additionalKeys[i];
        }
        let transactionCommitment = accountUpdate.body.useFullCommitment.toBoolean()
            ? fullCommitment
            : commitment;
        let signature = signFieldElement(transactionCommitment, privateKey.toBigInt(), 'testnet');
        Authorization.setSignature(accountUpdate, Signature.toBase58(signature));
        return accountUpdate;
    }
    let { feePayer, accountUpdates, memo } = zkappCommand;
    return {
        feePayer: addFeePayerSignature(feePayer),
        accountUpdates: accountUpdates.map(addSignature),
        memo,
    };
}
function dummySignature() {
    return Signature.toBase58(Signature.dummy());
}
let ZkappPublicInput = provablePure({ accountUpdate: Field, calls: Field }, { customObjectKeys: ['accountUpdate', 'calls'] });
async function addMissingProofs(zkappCommand, { proofsEnabled = true }) {
    let { feePayer, accountUpdates, memo } = zkappCommand;
    // compute proofs serially. in parallel would clash with our global variable
    // hacks
    let accountUpdatesProved = [];
    let proofs = [];
    for (let i = 0; i < accountUpdates.length; i++) {
        let { accountUpdateProved, proof } = await addProof(zkappCommand, i, proofsEnabled);
        accountUpdatesProved.push(accountUpdateProved);
        proofs.push(proof);
    }
    return {
        zkappCommand: { feePayer, accountUpdates: accountUpdatesProved, memo },
        proofs,
    };
}
async function addProof(transaction, index, proofsEnabled) {
    let accountUpdate = transaction.accountUpdates[index];
    accountUpdate = AccountUpdate.clone(accountUpdate);
    if (accountUpdate.lazyAuthorization?.kind !== 'lazy-proof') {
        return {
            accountUpdateProved: accountUpdate,
            proof: undefined,
        };
    }
    if (!proofsEnabled) {
        Authorization.setProof(accountUpdate, await dummyBase64Proof());
        return {
            accountUpdateProved: accountUpdate,
            proof: undefined,
        };
    }
    let lazyProof = accountUpdate.lazyAuthorization;
    let prover = getZkappProver(lazyProof);
    let proverData = { transaction, accountUpdate, index };
    let proof = await createZkappProof(prover, lazyProof, proverData);
    let accountUpdateProved = Authorization.setProof(accountUpdate, Pickles.proofToBase64Transaction(proof.proof));
    return { accountUpdateProved, proof };
}
async function createZkappProof(prover, { methodName, args, previousProofs, ZkappClass, memoized, blindingValue, }, { transaction, accountUpdate, index }) {
    let publicInput = accountUpdate.toPublicInput();
    let publicInputFields = MlFieldConstArray.to(ZkappPublicInput.toFields(publicInput));
    let [, , proof] = await zkAppProver.run([accountUpdate.publicKey, accountUpdate.tokenId, ...args], { transaction, accountUpdate, index }, async () => {
        let id = memoizationContext.enter({
            memoized,
            currentIndex: 0,
            blindingValue,
        });
        try {
            return await prover(publicInputFields, MlArray.to(previousProofs));
        }
        catch (err) {
            console.error(`Error when proving ${ZkappClass.name}.${methodName}()`);
            throw err;
        }
        finally {
            memoizationContext.leave(id);
        }
    });
    let maxProofsVerified = ZkappClass._maxProofsVerified;
    const Proof = ZkappClass.Proof();
    return new Proof({
        publicInput,
        publicOutput: undefined,
        proof,
        maxProofsVerified,
    });
}
function getZkappProver({ methodName, ZkappClass }) {
    if (ZkappClass._provers === undefined)
        throw Error(`Cannot prove execution of ${methodName}(), no prover found. ` +
            `Try calling \`await ${ZkappClass.name}.compile()\` first, this will cache provers in the background.`);
    let provers = ZkappClass._provers;
    let methodError = `Error when computing proofs: Method ${methodName} not found. ` +
        `Make sure your environment supports decorators, and annotate with \`@method ${methodName}\`.`;
    if (ZkappClass._methods === undefined)
        throw Error(methodError);
    let i = ZkappClass._methods.findIndex((m) => m.methodName === methodName);
    if (i === -1)
        throw Error(methodError);
    return provers[i];
}
//# sourceMappingURL=account_update.js.map