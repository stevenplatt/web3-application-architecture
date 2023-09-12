import { PublicKey, UInt64, UInt32, TokenId, Field, Bool, AuthRequired, Sign } from '../transaction-leaves-bigint.js';
import { GenericProvableExtended } from '../../lib/generic.js';
import { GenericLayout } from '../../lib/from-layout.js';
import * as Json from './transaction-json.js';
export { customTypes, ZkappCommand, AccountUpdate, Account };
export { Json };
export * from '../transaction-leaves-bigint.js';
export { provableFromLayout, toJSONEssential, emptyValue, Layout, TypeMap };
type TypeMap = {
    PublicKey: PublicKey;
    UInt64: UInt64;
    UInt32: UInt32;
    TokenId: TokenId;
    Field: Field;
    Bool: Bool;
    AuthRequired: AuthRequired;
    Sign: Sign;
};
declare const TypeMap: {
    [K in keyof TypeMap]: ProvableExtended<TypeMap[K], Json.TypeMap[K]>;
};
type ProvableExtended<T, TJson> = GenericProvableExtended<T, TJson, Field>;
type Layout = GenericLayout<TypeMap>;
type CustomTypes = {
    ZkappUri: ProvableExtended<{
        data: string;
        hash: Field;
    }, string>;
    TokenSymbol: ProvableExtended<{
        symbol: string;
        field: Field;
    }, string>;
    StateHash: ProvableExtended<Field, Json.TypeMap['Field']>;
    Events: ProvableExtended<{
        data: Field[][];
        hash: Field;
    }, Json.TypeMap['Field'][][]>;
    Actions: ProvableExtended<{
        data: Field[][];
        hash: Field;
    }, Json.TypeMap['Field'][][]>;
    ActionState: ProvableExtended<Field, Json.TypeMap['Field']>;
    VerificationKeyHash: ProvableExtended<Field, Json.TypeMap['Field']>;
    ReceiptChainHash: ProvableExtended<Field, Json.TypeMap['Field']>;
};
declare let customTypes: CustomTypes;
declare let provableFromLayout: <T, TJson>(typeData: GenericLayout<TypeMap>) => {
    sizeInFields(): number;
    toFields(value: T): bigint[];
    toAuxiliary(value?: T | undefined): any[];
    fromFields(fields: bigint[], aux: any[]): T;
    toJSON(value: T): TJson;
    fromJSON(json: TJson): T;
    check(value: T): void;
    toInput(value: T): {
        fields?: bigint[] | undefined;
        packed?: [bigint, number][] | undefined;
    };
    emptyValue(): T;
}, toJSONEssential: (typeData: GenericLayout<TypeMap>, value: any) => any, emptyValue: (typeData: GenericLayout<TypeMap>) => any;
type ZkappCommand = {
    feePayer: {
        body: {
            publicKey: PublicKey;
            fee: UInt64;
            validUntil?: UInt32;
            nonce: UInt32;
        };
        authorization: string;
    };
    accountUpdates: {
        body: {
            publicKey: PublicKey;
            tokenId: TokenId;
            update: {
                appState: {
                    isSome: Bool;
                    value: Field;
                }[];
                delegate: {
                    isSome: Bool;
                    value: PublicKey;
                };
                verificationKey: {
                    isSome: Bool;
                    value: {
                        data: string;
                        hash: Field;
                    };
                };
                permissions: {
                    isSome: Bool;
                    value: {
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
                    };
                };
                zkappUri: {
                    isSome: Bool;
                    value: {
                        data: string;
                        hash: Field;
                    };
                };
                tokenSymbol: {
                    isSome: Bool;
                    value: {
                        symbol: string;
                        field: Field;
                    };
                };
                timing: {
                    isSome: Bool;
                    value: {
                        initialMinimumBalance: UInt64;
                        cliffTime: UInt32;
                        cliffAmount: UInt64;
                        vestingPeriod: UInt32;
                        vestingIncrement: UInt64;
                    };
                };
                votingFor: {
                    isSome: Bool;
                    value: Field;
                };
            };
            balanceChange: {
                magnitude: UInt64;
                sgn: Sign;
            };
            incrementNonce: Bool;
            events: {
                data: Field[][];
                hash: Field;
            };
            actions: {
                data: Field[][];
                hash: Field;
            };
            callData: Field;
            callDepth: number;
            preconditions: {
                network: {
                    snarkedLedgerHash: {
                        isSome: Bool;
                        value: Field;
                    };
                    blockchainLength: {
                        isSome: Bool;
                        value: {
                            lower: UInt32;
                            upper: UInt32;
                        };
                    };
                    minWindowDensity: {
                        isSome: Bool;
                        value: {
                            lower: UInt32;
                            upper: UInt32;
                        };
                    };
                    totalCurrency: {
                        isSome: Bool;
                        value: {
                            lower: UInt64;
                            upper: UInt64;
                        };
                    };
                    globalSlotSinceGenesis: {
                        isSome: Bool;
                        value: {
                            lower: UInt32;
                            upper: UInt32;
                        };
                    };
                    stakingEpochData: {
                        ledger: {
                            hash: {
                                isSome: Bool;
                                value: Field;
                            };
                            totalCurrency: {
                                isSome: Bool;
                                value: {
                                    lower: UInt64;
                                    upper: UInt64;
                                };
                            };
                        };
                        seed: {
                            isSome: Bool;
                            value: Field;
                        };
                        startCheckpoint: {
                            isSome: Bool;
                            value: Field;
                        };
                        lockCheckpoint: {
                            isSome: Bool;
                            value: Field;
                        };
                        epochLength: {
                            isSome: Bool;
                            value: {
                                lower: UInt32;
                                upper: UInt32;
                            };
                        };
                    };
                    nextEpochData: {
                        ledger: {
                            hash: {
                                isSome: Bool;
                                value: Field;
                            };
                            totalCurrency: {
                                isSome: Bool;
                                value: {
                                    lower: UInt64;
                                    upper: UInt64;
                                };
                            };
                        };
                        seed: {
                            isSome: Bool;
                            value: Field;
                        };
                        startCheckpoint: {
                            isSome: Bool;
                            value: Field;
                        };
                        lockCheckpoint: {
                            isSome: Bool;
                            value: Field;
                        };
                        epochLength: {
                            isSome: Bool;
                            value: {
                                lower: UInt32;
                                upper: UInt32;
                            };
                        };
                    };
                };
                account: {
                    balance: {
                        isSome: Bool;
                        value: {
                            lower: UInt64;
                            upper: UInt64;
                        };
                    };
                    nonce: {
                        isSome: Bool;
                        value: {
                            lower: UInt32;
                            upper: UInt32;
                        };
                    };
                    receiptChainHash: {
                        isSome: Bool;
                        value: Field;
                    };
                    delegate: {
                        isSome: Bool;
                        value: PublicKey;
                    };
                    state: {
                        isSome: Bool;
                        value: Field;
                    }[];
                    actionState: {
                        isSome: Bool;
                        value: Field;
                    };
                    provedState: {
                        isSome: Bool;
                        value: Bool;
                    };
                    isNew: {
                        isSome: Bool;
                        value: Bool;
                    };
                };
                validWhile: {
                    isSome: Bool;
                    value: {
                        lower: UInt32;
                        upper: UInt32;
                    };
                };
            };
            useFullCommitment: Bool;
            implicitAccountCreationFee: Bool;
            mayUseToken: {
                parentsOwnToken: Bool;
                inheritFromParent: Bool;
            };
            authorizationKind: {
                isSigned: Bool;
                isProved: Bool;
                verificationKeyHash: Field;
            };
        };
        authorization: {
            proof?: string;
            signature?: string;
        };
    }[];
    memo: string;
};
declare let ZkappCommand: {
    sizeInFields(): number;
    toFields(value: ZkappCommand): bigint[];
    toAuxiliary(value?: ZkappCommand | undefined): any[];
    fromFields(fields: bigint[], aux: any[]): ZkappCommand;
    toJSON(value: ZkappCommand): Json.ZkappCommand;
    fromJSON(json: Json.ZkappCommand): ZkappCommand;
    check(value: ZkappCommand): void;
    toInput(value: ZkappCommand): {
        fields?: bigint[] | undefined;
        packed?: [bigint, number][] | undefined;
    };
    emptyValue(): ZkappCommand;
};
type AccountUpdate = {
    body: {
        publicKey: PublicKey;
        tokenId: TokenId;
        update: {
            appState: {
                isSome: Bool;
                value: Field;
            }[];
            delegate: {
                isSome: Bool;
                value: PublicKey;
            };
            verificationKey: {
                isSome: Bool;
                value: {
                    data: string;
                    hash: Field;
                };
            };
            permissions: {
                isSome: Bool;
                value: {
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
                };
            };
            zkappUri: {
                isSome: Bool;
                value: {
                    data: string;
                    hash: Field;
                };
            };
            tokenSymbol: {
                isSome: Bool;
                value: {
                    symbol: string;
                    field: Field;
                };
            };
            timing: {
                isSome: Bool;
                value: {
                    initialMinimumBalance: UInt64;
                    cliffTime: UInt32;
                    cliffAmount: UInt64;
                    vestingPeriod: UInt32;
                    vestingIncrement: UInt64;
                };
            };
            votingFor: {
                isSome: Bool;
                value: Field;
            };
        };
        balanceChange: {
            magnitude: UInt64;
            sgn: Sign;
        };
        incrementNonce: Bool;
        events: {
            data: Field[][];
            hash: Field;
        };
        actions: {
            data: Field[][];
            hash: Field;
        };
        callData: Field;
        callDepth: number;
        preconditions: {
            network: {
                snarkedLedgerHash: {
                    isSome: Bool;
                    value: Field;
                };
                blockchainLength: {
                    isSome: Bool;
                    value: {
                        lower: UInt32;
                        upper: UInt32;
                    };
                };
                minWindowDensity: {
                    isSome: Bool;
                    value: {
                        lower: UInt32;
                        upper: UInt32;
                    };
                };
                totalCurrency: {
                    isSome: Bool;
                    value: {
                        lower: UInt64;
                        upper: UInt64;
                    };
                };
                globalSlotSinceGenesis: {
                    isSome: Bool;
                    value: {
                        lower: UInt32;
                        upper: UInt32;
                    };
                };
                stakingEpochData: {
                    ledger: {
                        hash: {
                            isSome: Bool;
                            value: Field;
                        };
                        totalCurrency: {
                            isSome: Bool;
                            value: {
                                lower: UInt64;
                                upper: UInt64;
                            };
                        };
                    };
                    seed: {
                        isSome: Bool;
                        value: Field;
                    };
                    startCheckpoint: {
                        isSome: Bool;
                        value: Field;
                    };
                    lockCheckpoint: {
                        isSome: Bool;
                        value: Field;
                    };
                    epochLength: {
                        isSome: Bool;
                        value: {
                            lower: UInt32;
                            upper: UInt32;
                        };
                    };
                };
                nextEpochData: {
                    ledger: {
                        hash: {
                            isSome: Bool;
                            value: Field;
                        };
                        totalCurrency: {
                            isSome: Bool;
                            value: {
                                lower: UInt64;
                                upper: UInt64;
                            };
                        };
                    };
                    seed: {
                        isSome: Bool;
                        value: Field;
                    };
                    startCheckpoint: {
                        isSome: Bool;
                        value: Field;
                    };
                    lockCheckpoint: {
                        isSome: Bool;
                        value: Field;
                    };
                    epochLength: {
                        isSome: Bool;
                        value: {
                            lower: UInt32;
                            upper: UInt32;
                        };
                    };
                };
            };
            account: {
                balance: {
                    isSome: Bool;
                    value: {
                        lower: UInt64;
                        upper: UInt64;
                    };
                };
                nonce: {
                    isSome: Bool;
                    value: {
                        lower: UInt32;
                        upper: UInt32;
                    };
                };
                receiptChainHash: {
                    isSome: Bool;
                    value: Field;
                };
                delegate: {
                    isSome: Bool;
                    value: PublicKey;
                };
                state: {
                    isSome: Bool;
                    value: Field;
                }[];
                actionState: {
                    isSome: Bool;
                    value: Field;
                };
                provedState: {
                    isSome: Bool;
                    value: Bool;
                };
                isNew: {
                    isSome: Bool;
                    value: Bool;
                };
            };
            validWhile: {
                isSome: Bool;
                value: {
                    lower: UInt32;
                    upper: UInt32;
                };
            };
        };
        useFullCommitment: Bool;
        implicitAccountCreationFee: Bool;
        mayUseToken: {
            parentsOwnToken: Bool;
            inheritFromParent: Bool;
        };
        authorizationKind: {
            isSigned: Bool;
            isProved: Bool;
            verificationKeyHash: Field;
        };
    };
    authorization: {
        proof?: string;
        signature?: string;
    };
};
declare let AccountUpdate: {
    sizeInFields(): number;
    toFields(value: AccountUpdate): bigint[];
    toAuxiliary(value?: AccountUpdate | undefined): any[];
    fromFields(fields: bigint[], aux: any[]): AccountUpdate;
    toJSON(value: AccountUpdate): Json.AccountUpdate;
    fromJSON(json: Json.AccountUpdate): AccountUpdate;
    check(value: AccountUpdate): void;
    toInput(value: AccountUpdate): {
        fields?: bigint[] | undefined;
        packed?: [bigint, number][] | undefined;
    };
    emptyValue(): AccountUpdate;
};
type Account = {
    publicKey: PublicKey;
    tokenId: TokenId;
    tokenSymbol: string;
    balance: UInt64;
    nonce: UInt32;
    receiptChainHash: Field;
    delegate?: PublicKey;
    votingFor: Field;
    timing: {
        isTimed: Bool;
        initialMinimumBalance: UInt64;
        cliffTime: UInt32;
        cliffAmount: UInt64;
        vestingPeriod: UInt32;
        vestingIncrement: UInt64;
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
    };
    zkapp?: {
        appState: Field[];
        verificationKey?: {
            data: string;
            hash: Field;
        };
        zkappVersion: UInt32;
        actionState: Field[];
        lastActionSlot: UInt32;
        provedState: Bool;
        zkappUri: string;
    };
};
declare let Account: {
    sizeInFields(): number;
    toFields(value: Account): bigint[];
    toAuxiliary(value?: Account | undefined): any[];
    fromFields(fields: bigint[], aux: any[]): Account;
    toJSON(value: Account): Json.Account;
    fromJSON(json: Json.Account): Account;
    check(value: Account): void;
    toInput(value: Account): {
        fields?: bigint[] | undefined;
        packed?: [bigint, number][] | undefined;
    };
    emptyValue(): Account;
};
