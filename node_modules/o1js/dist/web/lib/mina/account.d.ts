import { Types } from '../../bindings/mina-transaction/types.js';
export { FetchedAccount, Account, PartialAccount };
export { accountQuery, parseFetchedAccount, fillPartialAccount };
type AuthRequired = Types.Json.AuthRequired;
type Account = Types.Account;
declare const Account: {
    sizeInFields(): number;
    toFields(value: Types.Account): import("../field.js").Field[];
    toAuxiliary(value?: Types.Account | undefined): any[];
    fromFields(fields: import("../field.js").Field[], aux: any[]): Types.Account;
    toJSON(value: Types.Account): Types.Json.Account;
    fromJSON(json: Types.Json.Account): Types.Account;
    check(value: Types.Account): void;
    toInput(value: Types.Account): {
        fields?: import("../field.js").Field[] | undefined;
        packed?: [import("../field.js").Field, number][] | undefined;
    };
    emptyValue(): Types.Account;
};
type PartialAccount = Omit<Partial<Account>, 'zkapp'> & {
    zkapp?: Partial<Account['zkapp']>;
};
type FetchedAccount = {
    publicKey: string;
    token: string;
    nonce: string;
    balance: {
        total: string;
    };
    tokenSymbol: string | null;
    receiptChainHash: string | null;
    timing: {
        initialMinimumBalance: string | null;
        cliffTime: string | null;
        cliffAmount: string | null;
        vestingPeriod: string | null;
        vestingIncrement: string | null;
    };
    permissions: {
        editState: AuthRequired;
        access: AuthRequired;
        send: AuthRequired;
        receive: AuthRequired;
        setDelegate: AuthRequired;
        setPermissions: AuthRequired;
        setVerificationKey: AuthRequired;
        setZkappUri: AuthRequired;
        editActionState: AuthRequired;
        setTokenSymbol: AuthRequired;
        incrementNonce: AuthRequired;
        setVotingFor: AuthRequired;
        setTiming: AuthRequired;
    } | null;
    delegateAccount: {
        publicKey: string;
    } | null;
    votingFor: string | null;
    zkappState: string[] | null;
    verificationKey: {
        verificationKey: string;
        hash: string;
    } | null;
    actionState: string[] | null;
    provedState: boolean | null;
    zkappUri: string | null;
};
declare const accountQuery: (publicKey: string, tokenId: string) => string;
declare function parseFetchedAccount({ publicKey, nonce, zkappState, balance, permissions, timing: { cliffAmount, cliffTime, initialMinimumBalance, vestingIncrement, vestingPeriod, }, delegateAccount, receiptChainHash, actionState, token, tokenSymbol, verificationKey, provedState, zkappUri, }: FetchedAccount): Account;
declare function fillPartialAccount(account: PartialAccount): Account;
