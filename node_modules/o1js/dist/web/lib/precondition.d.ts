import { Bool, Field } from './core.js';
import { AccountUpdate, Preconditions } from './account_update.js';
import { UInt32, UInt64 } from './int.js';
import { PublicKey } from './signature.js';
export { preconditions, Account, Network, CurrentSlot, assertPreconditionInvariants, cleanPreconditionsCache, AccountValue, NetworkValue, getAccountPreconditions, };
declare function preconditions(accountUpdate: AccountUpdate, isSelf: boolean): {
    account: Account;
    network: Network;
    currentSlot: CurrentSlot;
};
declare function Network(accountUpdate: AccountUpdate): Network;
declare function Account(accountUpdate: AccountUpdate): Account;
declare function CurrentSlot(accountUpdate: AccountUpdate): CurrentSlot;
declare function getAccountPreconditions(body: {
    publicKey: PublicKey;
    tokenId?: Field;
}): AccountValue;
declare function cleanPreconditionsCache(accountUpdate: AccountUpdate): void;
declare function assertPreconditionInvariants(accountUpdate: AccountUpdate): void;
type NetworkPrecondition = Preconditions['network'];
type NetworkValue = PreconditionBaseTypes<NetworkPrecondition>;
type RawNetwork = PreconditionClassType<NetworkPrecondition>;
type Network = RawNetwork & {
    timestamp: PreconditionSubclassRangeType<UInt64>;
};
type AccountPrecondition = Omit<Preconditions['account'], 'state'>;
type AccountValue = PreconditionBaseTypes<AccountPrecondition>;
type Account = PreconditionClassType<AccountPrecondition> & Update;
type CurrentSlot = {
    assertBetween(lower: UInt32, upper: UInt32): void;
};
type PreconditionBaseTypes<T> = {
    [K in keyof T]: T[K] extends RangeCondition<infer U> ? U : T[K] extends FlaggedOptionCondition<infer U> ? U : T[K] extends Field ? Field : PreconditionBaseTypes<T[K]>;
};
type PreconditionSubclassType<U> = {
    get(): U;
    getAndAssertEquals(): U;
    assertEquals(value: U): void;
    assertNothing(): void;
};
type PreconditionSubclassRangeType<U> = PreconditionSubclassType<U> & {
    assertBetween(lower: U, upper: U): void;
};
type PreconditionClassType<T> = {
    [K in keyof T]: T[K] extends RangeCondition<infer U> ? PreconditionSubclassRangeType<U> : T[K] extends FlaggedOptionCondition<infer U> ? PreconditionSubclassType<U> : T[K] extends Field ? PreconditionSubclassType<Field> : PreconditionClassType<T[K]>;
};
type Update_ = Omit<AccountUpdate['body']['update'], 'appState'>;
type Update = {
    [K in keyof Update_]: {
        set(value: UpdateValue[K]): void;
    };
};
type UpdateValue = {
    [K in keyof Update_]: K extends 'zkappUri' | 'tokenSymbol' ? string : Update_[K]['value'];
};
type RangeCondition<T> = {
    isSome: Bool;
    value: {
        lower: T;
        upper: T;
    };
};
type FlaggedOptionCondition<T> = {
    isSome: Bool;
    value: T;
};
