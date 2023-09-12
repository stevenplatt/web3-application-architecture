import 'isomorphic-fetch';
import { Field } from './core.js';
import { UInt32, UInt64 } from './int.js';
import { PublicKey } from './signature.js';
import { Types } from '../bindings/mina-transaction/types.js';
import { ActionStates } from './mina.js';
import { Account, parseFetchedAccount, PartialAccount } from './mina/account.js';
export { fetchAccount, fetchLastBlock, checkZkappTransaction, parseFetchedAccount, markAccountToBeFetched, markNetworkToBeFetched, markActionsToBeFetched, fetchMissingData, fetchTransactionStatus, TransactionStatus, EventActionFilterOptions, getCachedAccount, getCachedNetwork, getCachedActions, addCachedAccount, networkConfig, setGraphqlEndpoint, setGraphqlEndpoints, setMinaGraphqlFallbackEndpoints, setArchiveGraphqlEndpoint, setArchiveGraphqlFallbackEndpoints, sendZkappQuery, sendZkapp, removeJsonQuotes, fetchEvents, fetchActions, };
declare let networkConfig: {
    minaEndpoint: string;
    minaFallbackEndpoints: string[];
    archiveEndpoint: string;
    archiveFallbackEndpoints: string[];
};
declare function setGraphqlEndpoints([graphqlEndpoint, ...fallbackEndpoints]: string[]): void;
declare function setGraphqlEndpoint(graphqlEndpoint: string): void;
declare function setMinaGraphqlFallbackEndpoints(graphqlEndpoints: string[]): void;
/**
 * Sets up a GraphQL endpoint to be used for fetching information from an Archive Node.
 *
 * @param A GraphQL endpoint.
 */
declare function setArchiveGraphqlEndpoint(graphqlEndpoint: string): void;
declare function setArchiveGraphqlFallbackEndpoints(graphqlEndpoints: string[]): void;
/**
 * Gets account information on the specified publicKey by performing a GraphQL query
 * to the specified endpoint. This will call the 'GetAccountInfo' query which fetches
 * zkapp related account information.
 *
 * If an error is returned by the specified endpoint, an error is thrown. Otherwise,
 * the data is returned.
 *
 * @param publicKey The specified publicKey to get account information on
 * @param tokenId The specified tokenId to get account information on
 * @param graphqlEndpoint The graphql endpoint to fetch from
 * @param config An object that exposes an additional timeout option
 * @returns zkapp information on the specified account or an error is thrown
 */
declare function fetchAccount(accountInfo: {
    publicKey: string | PublicKey;
    tokenId?: string | Field;
}, graphqlEndpoint?: string, { timeout }?: {
    timeout?: number | undefined;
}): Promise<{
    account: Types.Account;
    error: undefined;
} | {
    account: undefined;
    error: FetchError;
}>;
type FetchResponse = {
    data: any;
    errors?: any;
};
type FetchError = {
    statusCode: number;
    statusText: string;
};
type ActionStatesStringified = {
    [K in keyof ActionStates]: string;
};
declare function markAccountToBeFetched(publicKey: PublicKey, tokenId: Field, graphqlEndpoint: string): void;
declare function markNetworkToBeFetched(graphqlEndpoint: string): void;
declare function markActionsToBeFetched(publicKey: PublicKey, tokenId: Field, graphqlEndpoint: string, actionStates?: ActionStates): void;
declare function fetchMissingData(graphqlEndpoint: string, archiveEndpoint?: string): Promise<void>;
declare function getCachedAccount(publicKey: PublicKey, tokenId: Field, graphqlEndpoint?: string): Account | undefined;
declare function getCachedNetwork(graphqlEndpoint?: string): {
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
declare function getCachedActions(publicKey: PublicKey, tokenId: Field, graphqlEndpoint?: string): {
    hash: string;
    actions: string[][];
}[];
/**
 * Adds an account to the local cache, indexed by a GraphQL endpoint.
 */
declare function addCachedAccount(partialAccount: PartialAccount, graphqlEndpoint?: string): void;
/**
 * Fetches the last block on the Mina network.
 */
declare function fetchLastBlock(graphqlEndpoint?: string): Promise<{
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
}>;
declare function checkZkappTransaction(txnId: string): Promise<{
    success: boolean;
    failureReason: string[];
} | {
    success: boolean;
    failureReason: null;
}>;
/**
 * Fetches the status of a transaction.
 */
declare function fetchTransactionStatus(txId: string, graphqlEndpoint?: string): Promise<TransactionStatus>;
/**
 * INCLUDED: A transaction that is on the longest chain
 *
 * PENDING: A transaction either in the transition frontier or in transaction pool but is not on the longest chain
 *
 * UNKNOWN: The transaction has either been snarked, reached finality through consensus or has been dropped
 *
 */
type TransactionStatus = 'INCLUDED' | 'PENDING' | 'UNKNOWN';
/**
 * Sends a zkApp command (transaction) to the specified GraphQL endpoint.
 */
declare function sendZkapp(json: string, graphqlEndpoint?: string, { timeout }?: {
    timeout?: number | undefined;
}): Promise<[FetchResponse, undefined] | [undefined, FetchError]>;
declare function sendZkappQuery(json: string): string;
type EventActionFilterOptions = {
    to?: UInt32;
    from?: UInt32;
};
/**
 * Asynchronously fetches event data for an account from the Mina Archive Node GraphQL API.
 * @async
 * @param accountInfo - The account information object.
 * @param accountInfo.publicKey - The account public key.
 * @param [accountInfo.tokenId] - The optional token ID for the account.
 * @param [graphqlEndpoint=networkConfig.archiveEndpoint] - The GraphQL endpoint to query. Defaults to the Archive Node GraphQL API.
 * @param [filterOptions={}] - The optional filter options object.
 * @returns A promise that resolves to an array of objects containing event data, block information and transaction information for the account.
 * @throws If the GraphQL request fails or the response is invalid.
 * @example
 * const accountInfo = { publicKey: 'B62qiwmXrWn7Cok5VhhB3KvCwyZ7NHHstFGbiU5n7m8s2RqqNW1p1wF' };
 * const events = await fetchEvents(accountInfo);
 * console.log(events);
 */
declare function fetchEvents(accountInfo: {
    publicKey: string;
    tokenId?: string;
}, graphqlEndpoint?: string, filterOptions?: EventActionFilterOptions): Promise<{
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
declare function fetchActions(accountInfo: {
    publicKey: string;
    actionStates: ActionStatesStringified;
    tokenId?: string;
}, graphqlEndpoint?: string): Promise<{
    actions: string[][];
    hash: string;
}[] | {
    error: {
        statusCode: number;
        statusText: string;
    };
}>;
declare function removeJsonQuotes(json: string): string;
