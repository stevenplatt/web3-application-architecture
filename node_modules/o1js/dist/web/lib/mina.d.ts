import { Field } from './core.js';
import { UInt32, UInt64 } from './int.js';
import { PrivateKey, PublicKey } from './signature.js';
import { ZkappCommand, AccountUpdate, ZkappPublicInput } from './account_update.js';
import * as Fetch from './fetch.js';
import { NetworkValue } from './precondition.js';
import { Empty, Proof } from './proof_system.js';
import { Context } from './global-context.js';
import { Types } from '../bindings/mina-transaction/types.js';
import { Account } from './mina/account.js';
export { createTransaction, BerkeleyQANet, Network, LocalBlockchain, currentTransaction, CurrentTransaction, Transaction, TransactionId, activeInstance, setActiveInstance, transaction, sender, currentSlot, getAccount, hasAccount, getBalance, getNetworkState, accountCreationFee, sendTransaction, fetchEvents, fetchActions, getActions, FeePayerSpec, ActionStates, faucet, waitForFunding, getProofsEnabled, filterGroups, };
interface TransactionId {
    isSuccess: boolean;
    wait(options?: {
        maxAttempts?: number;
        interval?: number;
    }): Promise<void>;
    hash(): string | undefined;
}
type Transaction = {
    /**
     * Transaction structure used to describe a state transition on the Mina blockchain.
     */
    transaction: ZkappCommand;
    /**
     * Returns a JSON representation of the {@link Transaction}.
     */
    toJSON(): string;
    /**
     * Returns a pretty-printed JSON representation of the {@link Transaction}.
     */
    toPretty(): any;
    /**
     * Returns the GraphQL query for the Mina daemon.
     */
    toGraphqlQuery(): string;
    /**
     * Signs all {@link AccountUpdate}s included in the {@link Transaction} that require a signature.
     *
     * {@link AccountUpdate}s that require a signature can be specified with `{AccountUpdate|SmartContract}.requireSignature()`.
     *
     * @param additionalKeys The list of keys that should be used to sign the {@link Transaction}
     */
    sign(additionalKeys?: PrivateKey[]): Transaction;
    /**
     * Generates proofs for the {@link Transaction}.
     *
     * This can take some time.
     */
    prove(): Promise<(Proof<ZkappPublicInput, Empty> | undefined)[]>;
    /**
     * Sends the {@link Transaction} to the network.
     */
    send(): Promise<TransactionId>;
};
declare const Transaction: {
    fromJSON(json: Types.Json.ZkappCommand): Transaction;
};
type FetchMode = 'fetch' | 'cached' | 'test';
type CurrentTransaction = {
    sender?: PublicKey;
    accountUpdates: AccountUpdate[];
    fetchMode: FetchMode;
    isFinalRunOutsideCircuit: boolean;
    numberOfRuns: 0 | 1 | undefined;
};
declare let currentTransaction: Context.t<CurrentTransaction>;
/**
 * Allows you to specify information about the fee payer account and the transaction.
 */
type FeePayerSpec = PublicKey | {
    sender: PublicKey;
    fee?: number | string | UInt64;
    memo?: string;
    nonce?: number;
} | undefined;
type DeprecatedFeePayerSpec = PublicKey | PrivateKey | (({
    feePayerKey: PrivateKey;
    sender?: PublicKey;
} | {
    feePayerKey?: PrivateKey;
    sender: PublicKey;
}) & {
    fee?: number | string | UInt64;
    memo?: string;
    nonce?: number;
}) | undefined;
type ActionStates = {
    fromActionState?: Field;
    endActionState?: Field;
};
declare function createTransaction(feePayer: DeprecatedFeePayerSpec, f: () => unknown, numberOfRuns: 0 | 1 | undefined, { fetchMode, isFinalRunOutsideCircuit, proofsEnabled, }?: {
    fetchMode?: FetchMode | undefined;
    isFinalRunOutsideCircuit?: boolean | undefined;
    proofsEnabled?: boolean | undefined;
}): Transaction;
interface Mina {
    transaction(sender: DeprecatedFeePayerSpec, f: () => void): Promise<Transaction>;
    currentSlot(): UInt32;
    hasAccount(publicKey: PublicKey, tokenId?: Field): boolean;
    getAccount(publicKey: PublicKey, tokenId?: Field): Account;
    getNetworkState(): NetworkValue;
    getNetworkConstants(): {
        genesisTimestamp: UInt64;
        /**
         * Duration of 1 slot in millisecondw
         */
        slotTime: UInt64;
        accountCreationFee: UInt64;
    };
    accountCreationFee(): UInt64;
    sendTransaction(transaction: Transaction): Promise<TransactionId>;
    fetchEvents: (publicKey: PublicKey, tokenId?: Field, filterOptions?: Fetch.EventActionFilterOptions) => ReturnType<typeof Fetch.fetchEvents>;
    fetchActions: (publicKey: PublicKey, actionStates?: ActionStates, tokenId?: Field) => ReturnType<typeof Fetch.fetchActions>;
    getActions: (publicKey: PublicKey, actionStates?: ActionStates, tokenId?: Field) => {
        hash: string;
        actions: string[][];
    }[];
    proofsEnabled: boolean;
}
/**
 * A mock Mina blockchain running locally and useful for testing.
 */
declare function LocalBlockchain({ accountCreationFee, proofsEnabled, enforceTransactionLimits, }?: {
    accountCreationFee?: string | number | undefined;
    proofsEnabled?: boolean | undefined;
    enforceTransactionLimits?: boolean | undefined;
}): {
    proofsEnabled: boolean;
    accountCreationFee: () => UInt64;
    getNetworkConstants(): {
        genesisTimestamp: UInt64;
        accountCreationFee: UInt64;
        slotTime: UInt64;
    };
    currentSlot(): UInt32;
    hasAccount(publicKey: PublicKey, tokenId?: Field): boolean;
    getAccount(publicKey: PublicKey, tokenId?: Field): Account;
    getNetworkState(): {
        snarkedLedgerHash: import("./field.js").Field;
        blockchainLength: UInt32;
        minWindowDensity: UInt32;
        totalCurrency: UInt64;
        globalSlotSinceGenesis: UInt32;
        stakingEpochData: {
            ledger: {
                hash: import("./field.js").Field;
                totalCurrency: UInt64;
            };
            seed: import("./field.js").Field;
            startCheckpoint: import("./field.js").Field;
            lockCheckpoint: import("./field.js").Field;
            epochLength: UInt32;
        };
        nextEpochData: {
            ledger: {
                hash: import("./field.js").Field;
                totalCurrency: UInt64;
            };
            seed: import("./field.js").Field;
            startCheckpoint: import("./field.js").Field;
            lockCheckpoint: import("./field.js").Field;
            epochLength: UInt32;
        };
    };
    sendTransaction(txn: Transaction): Promise<TransactionId>;
    transaction(sender: DeprecatedFeePayerSpec, f: () => void): Promise<Transaction>;
    applyJsonTransaction(json: string): void;
    fetchEvents(publicKey: PublicKey, tokenId?: Field): Promise<any>;
    fetchActions(publicKey: PublicKey, actionStates?: ActionStates, tokenId?: Field): Promise<{
        hash: string;
        actions: string[][];
    }[]>;
    getActions(publicKey: PublicKey, actionStates?: ActionStates, tokenId?: Field): {
        hash: string;
        actions: string[][];
    }[];
    addAccount: (publicKey: PublicKey, balance: string) => void;
    /**
     * An array of 10 test accounts that have been pre-filled with
     * 30000000000 units of currency.
     */
    testAccounts: {
        publicKey: PublicKey;
        privateKey: PrivateKey;
    }[];
    setGlobalSlot(slot: UInt32 | number): void;
    incrementGlobalSlot(increment: UInt32 | number): void;
    setBlockchainLength(height: UInt32): void;
    setTotalCurrency(currency: UInt64): void;
    setProofsEnabled(newProofsEnabled: boolean): void;
};
/**
 * Represents the Mina blockchain running on a real network
 */
declare function Network(graphqlEndpoint: string): Mina;
declare function Network(graphqlEndpoints: {
    mina: string | string[];
    archive: string | string[];
}): Mina;
/**
 *
 * @deprecated This is deprecated in favor of {@link Mina.Network}, which is exactly the same function.
 * The name `BerkeleyQANet` was misleading because it suggested that this is specific to a particular network.
 */
declare function BerkeleyQANet(graphqlEndpoint: string): Mina;
declare let activeInstance: Mina;
/**
 * Set the currently used Mina instance.
 */
declare function setActiveInstance(m: Mina): void;
/**
 * Construct a smart contract transaction. Within the callback passed to this function,
 * you can call into the methods of smart contracts.
 *
 * ```
 * let tx = await Mina.transaction(sender, () => {
 *   myZkapp.update();
 *   someOtherZkapp.someOtherMethod();
 * });
 * ```
 *
 * @return A transaction that can subsequently be submitted to the chain.
 */
declare function transaction(sender: FeePayerSpec, f: () => void): Promise<Transaction>;
declare function transaction(f: () => void): Promise<Transaction>;
/**
 * @deprecated It's deprecated to pass in the fee payer's private key. Pass in the public key instead.
 * ```
 * // good
 * Mina.transaction(publicKey, ...);
 * Mina.transaction({ sender: publicKey }, ...);
 *
 * // deprecated
 * Mina.transaction(privateKey, ...);
 * Mina.transaction({ feePayerKey: privateKey }, ...);
 * ```
 */
declare function transaction(sender: DeprecatedFeePayerSpec, f: () => void): Promise<Transaction>;
/**
 * Returns the public key of the current transaction's sender account.
 *
 * Throws an error if not inside a transaction, or the sender wasn't passed in.
 */
declare function sender(): PublicKey;
/**
 * @return The current slot number, according to the active Mina instance.
 */
declare function currentSlot(): UInt32;
/**
 * @return The account data associated to the given public key.
 */
declare function getAccount(publicKey: PublicKey, tokenId?: Field): Account;
/**
 * Checks if an account exists within the ledger.
 */
declare function hasAccount(publicKey: PublicKey, tokenId?: Field): boolean;
/**
 * @return Data associated with the current state of the Mina network.
 */
declare function getNetworkState(): {
    snarkedLedgerHash: import("./field.js").Field;
    blockchainLength: UInt32;
    minWindowDensity: UInt32;
    totalCurrency: UInt64;
    globalSlotSinceGenesis: UInt32;
    stakingEpochData: {
        ledger: {
            hash: import("./field.js").Field;
            totalCurrency: UInt64;
        };
        seed: import("./field.js").Field;
        startCheckpoint: import("./field.js").Field;
        lockCheckpoint: import("./field.js").Field;
        epochLength: UInt32;
    };
    nextEpochData: {
        ledger: {
            hash: import("./field.js").Field;
            totalCurrency: UInt64;
        };
        seed: import("./field.js").Field;
        startCheckpoint: import("./field.js").Field;
        lockCheckpoint: import("./field.js").Field;
        epochLength: UInt32;
    };
};
/**
 * @return The balance associated to the given public key.
 */
declare function getBalance(publicKey: PublicKey, tokenId?: Field): UInt64;
/**
 * Returns the default account creation fee.
 */
declare function accountCreationFee(): UInt64;
declare function sendTransaction(txn: Transaction): Promise<TransactionId>;
/**
 * @return A list of emitted events associated to the given public key.
 */
declare function fetchEvents(publicKey: PublicKey, tokenId: Field, filterOptions?: Fetch.EventActionFilterOptions): Promise<{
    events: {
        data: string[];
        transactionInfo: {
            hash: string;
            memo: string;
            status: string;
        };
    }[];
    blockHeight: UInt32;
    blockHash: string;
    parentBlockHash: string;
    globalSlot: UInt32;
    chainStatus: string;
}[]>;
/**
 * @return A list of emitted sequencing actions associated to the given public key.
 */
declare function fetchActions(publicKey: PublicKey, actionStates?: ActionStates, tokenId?: Field): Promise<{
    actions: string[][];
    hash: string;
}[] | {
    error: {
        statusCode: number;
        statusText: string;
    };
}>;
/**
 * @return A list of emitted sequencing actions associated to the given public key.
 */
declare function getActions(publicKey: PublicKey, actionStates?: ActionStates, tokenId?: Field): {
    hash: string;
    actions: string[][];
}[];
declare function getProofsEnabled(): boolean;
type AuthorizationKind = {
    isProved: boolean;
    isSigned: boolean;
};
declare function filterGroups(xs: AuthorizationKind[]): {
    signedPair: number;
    signedSingle: number;
    proof: number;
};
declare function waitForFunding(address: string): Promise<void>;
/**
 * Requests the [testnet faucet](https://faucet.minaprotocol.com/api/v1/faucet) to fund a public key.
 */
declare function faucet(pub: PublicKey, network?: string): Promise<void>;
