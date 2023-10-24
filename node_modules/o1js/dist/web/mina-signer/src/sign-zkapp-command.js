import { Bool, Field, Sign, UInt32 } from '../../provable/field-bigint.js';
import { PrivateKey, PublicKey } from '../../provable/curve-bigint.js';
import { AccountUpdate, ZkappCommand, } from '../../bindings/mina-transaction/gen/transaction-bigint.js';
import { hashWithPrefix, packToFields, prefixes, } from '../../provable/poseidon-bigint.js';
import { Memo } from './memo.js';
import { Signature, signFieldElement, verifyFieldElement, } from './signature.js';
import { mocks } from '../../bindings/crypto/constants.js';
// external API
export { signZkappCommand, verifyZkappCommandSignature };
// internal API
export { transactionCommitments, verifyAccountUpdateSignature, accountUpdatesToCallForest, callForestHash, accountUpdateHash, feePayerHash, createFeePayer, accountUpdateFromFeePayer, isCallDepthValid, };
function signZkappCommand(zkappCommand_, privateKeyBase58, networkId) {
    let zkappCommand = ZkappCommand.fromJSON(zkappCommand_);
    let { commitment, fullCommitment } = transactionCommitments(zkappCommand);
    let privateKey = PrivateKey.fromBase58(privateKeyBase58);
    let publicKey = zkappCommand.feePayer.body.publicKey;
    // sign fee payer
    let signature = signFieldElement(fullCommitment, privateKey, networkId);
    zkappCommand.feePayer.authorization = Signature.toBase58(signature);
    // sign other updates with the same public key that require a signature
    for (let update of zkappCommand.accountUpdates) {
        if (update.body.authorizationKind.isSigned === 0n)
            continue;
        if (!PublicKey.equal(update.body.publicKey, publicKey))
            continue;
        let { useFullCommitment } = update.body;
        let usedCommitment = useFullCommitment === 1n ? fullCommitment : commitment;
        let signature = signFieldElement(usedCommitment, privateKey, networkId);
        update.authorization = { signature: Signature.toBase58(signature) };
    }
    return ZkappCommand.toJSON(zkappCommand);
}
function verifyZkappCommandSignature(zkappCommand_, publicKeyBase58, networkId) {
    let zkappCommand = ZkappCommand.fromJSON(zkappCommand_);
    let { commitment, fullCommitment } = transactionCommitments(zkappCommand);
    let publicKey = PublicKey.fromBase58(publicKeyBase58);
    // verify fee payer signature
    let signature = Signature.fromBase58(zkappCommand.feePayer.authorization);
    let ok = verifyFieldElement(signature, fullCommitment, publicKey, networkId);
    if (!ok)
        return false;
    // verify other signatures for the same public key
    for (let update of zkappCommand.accountUpdates) {
        if (update.body.authorizationKind.isSigned === 0n)
            continue;
        if (!PublicKey.equal(update.body.publicKey, publicKey))
            continue;
        let { useFullCommitment } = update.body;
        let usedCommitment = useFullCommitment === 1n ? fullCommitment : commitment;
        if (update.authorization.signature === undefined)
            return false;
        let signature = Signature.fromBase58(update.authorization.signature);
        ok = verifyFieldElement(signature, usedCommitment, publicKey, networkId);
        if (!ok)
            return false;
    }
    return ok;
}
function verifyAccountUpdateSignature(update, transactionCommitments, networkId) {
    if (update.authorization.signature === undefined)
        return false;
    let { publicKey, useFullCommitment } = update.body;
    let { commitment, fullCommitment } = transactionCommitments;
    let usedCommitment = useFullCommitment === 1n ? fullCommitment : commitment;
    let signature = Signature.fromBase58(update.authorization.signature);
    return verifyFieldElement(signature, usedCommitment, publicKey, networkId);
}
function transactionCommitments(zkappCommand) {
    if (!isCallDepthValid(zkappCommand)) {
        throw Error('zkapp command: invalid call depth');
    }
    let callForest = accountUpdatesToCallForest(zkappCommand.accountUpdates);
    let commitment = callForestHash(callForest);
    let memoHash = Memo.hash(Memo.fromBase58(zkappCommand.memo));
    let feePayerDigest = feePayerHash(zkappCommand.feePayer);
    let fullCommitment = hashWithPrefix(prefixes.accountUpdateCons, [
        memoHash,
        feePayerDigest,
        commitment,
    ]);
    return { commitment, fullCommitment };
}
/**
 * Turn flat list into a hierarchical structure (forest) by letting the callDepth
 * determine parent-child relationships
 */
function accountUpdatesToCallForest(updates, callDepth = 0) {
    let remainingUpdates = callDepth > 0 ? updates : [...updates];
    let forest = [];
    while (remainingUpdates.length > 0) {
        let accountUpdate = remainingUpdates[0];
        if (accountUpdate.body.callDepth < callDepth)
            return forest;
        remainingUpdates.shift();
        let children = accountUpdatesToCallForest(remainingUpdates, callDepth + 1);
        forest.push({ accountUpdate, children });
    }
    return forest;
}
function accountUpdateHash(update) {
    assertAuthorizationKindValid(update);
    let input = AccountUpdate.toInput(update);
    let fields = packToFields(input);
    return hashWithPrefix(prefixes.body, fields);
}
function callForestHash(forest) {
    let stackHash = 0n;
    for (let callTree of [...forest].reverse()) {
        let calls = callForestHash(callTree.children);
        let treeHash = accountUpdateHash(callTree.accountUpdate);
        let nodeHash = hashWithPrefix(prefixes.accountUpdateNode, [
            treeHash,
            calls,
        ]);
        stackHash = hashWithPrefix(prefixes.accountUpdateCons, [
            nodeHash,
            stackHash,
        ]);
    }
    return stackHash;
}
function createFeePayer(feePayer) {
    return { authorization: '', body: feePayer };
}
function feePayerHash(feePayer) {
    let accountUpdate = accountUpdateFromFeePayer(feePayer);
    return accountUpdateHash(accountUpdate);
}
function accountUpdateFromFeePayer({ body: { fee, nonce, publicKey, validUntil }, authorization: signature, }) {
    let { body } = AccountUpdate.emptyValue();
    body.publicKey = publicKey;
    body.balanceChange = { magnitude: fee, sgn: Sign(-1) };
    body.incrementNonce = Bool(true);
    body.preconditions.network.globalSlotSinceGenesis = {
        isSome: Bool(true),
        value: { lower: UInt32(0), upper: validUntil ?? UInt32.maxValue },
    };
    body.preconditions.account.nonce = {
        isSome: Bool(true),
        value: { lower: nonce, upper: nonce },
    };
    body.useFullCommitment = Bool(true);
    body.implicitAccountCreationFee = Bool(true);
    body.authorizationKind = {
        isProved: Bool(false),
        isSigned: Bool(true),
        verificationKeyHash: Field(mocks.dummyVerificationKeyHash),
    };
    return { body, authorization: { signature } };
}
function isCallDepthValid(zkappCommand) {
    let callDepths = zkappCommand.accountUpdates.map((a) => a.body.callDepth);
    let current = callDepths.shift() ?? 0;
    if (current !== 0)
        return false;
    for (let callDepth of callDepths) {
        if (callDepth < 0)
            return false;
        if (callDepth - current > 1)
            return false;
        current = callDepth;
    }
    return true;
}
function assertAuthorizationKindValid(accountUpdate) {
    let { isSigned, isProved, verificationKeyHash } = accountUpdate.body.authorizationKind;
    if (isProved && isSigned)
        throw Error('Invalid authorization kind: Only one of `isProved` and `isSigned` may be true.');
    if (!isProved &&
        verificationKeyHash !== Field(mocks.dummyVerificationKeyHash))
        throw Error(`Invalid authorization kind: If \`isProved\` is false, verification key hash must be ${mocks.dummyVerificationKeyHash}, got ${verificationKeyHash}`);
}
//# sourceMappingURL=sign-zkapp-command.js.map