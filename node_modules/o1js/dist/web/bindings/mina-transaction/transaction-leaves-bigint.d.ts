import { Field, Bool, UInt32, UInt64, Sign } from '../../provable/field-bigint.js';
import { PublicKey } from '../../provable/curve-bigint.js';
export { PublicKey, Field, Bool, AuthRequired, UInt64, UInt32, Sign, TokenId };
export { Events, Actions, ZkappUri, TokenSymbol, ActionState, VerificationKeyHash, ReceiptChainHash, StateHash, };
type AuthRequired = {
    constant: Bool;
    signatureNecessary: Bool;
    signatureSufficient: Bool;
};
type TokenId = Field;
type StateHash = Field;
type TokenSymbol = {
    symbol: string;
    field: Field;
};
type ZkappUri = {
    data: string;
    hash: Field;
};
declare const TokenId: {
    emptyValue(): bigint;
    toJSON(x: bigint): string;
    fromJSON(x: string): bigint;
    toFields: (x: bigint) => bigint[];
    toAuxiliary: (x?: bigint | undefined) => any[];
    fromFields: (x: bigint[], aux: any[]) => bigint;
    sizeInFields(): number;
    check: (x: bigint) => void;
    toInput: (x: bigint) => {
        fields?: bigint[] | undefined;
        packed?: [bigint, number][] | undefined;
    };
}, StateHash: {
    toJSON(x: bigint): string;
    fromJSON(x: string): bigint;
    toFields: (x: bigint) => bigint[];
    toAuxiliary: (x?: bigint | undefined) => any[];
    fromFields: (x: bigint[], aux: any[]) => bigint;
    sizeInFields(): number;
    check: (x: bigint) => void;
    toInput: (x: bigint) => {
        fields?: bigint[] | undefined;
        packed?: [bigint, number][] | undefined;
    };
    emptyValue?: (() => bigint) | undefined;
}, TokenSymbol: {
    toInput({ field }: {
        symbol: string;
        field: bigint;
    }): import("../lib/generic.js").GenericHashInput<bigint>;
    toJSON({ symbol }: {
        symbol: string;
        field: bigint;
    }): string;
    fromJSON(symbol: string): {
        symbol: string;
        field: bigint;
    };
    toFields: (x: {
        field: bigint;
        symbol: string;
    }) => bigint[];
    toAuxiliary: (x?: {
        field: bigint;
        symbol: string;
    } | undefined) => any[];
    fromFields: (x: bigint[], aux: any[]) => {
        field: bigint;
        symbol: string;
    };
    sizeInFields(): number;
    check: (x: {
        field: bigint;
        symbol: string;
    }) => void;
    emptyValue?: (() => {
        field: bigint;
        symbol: string;
    }) | undefined;
}, AuthRequired: {
    emptyValue(): {
        constant: Bool;
        signatureNecessary: Bool;
        signatureSufficient: Bool;
    };
    toJSON(x: {
        constant: Bool;
        signatureNecessary: Bool;
        signatureSufficient: Bool;
    }): import("./transaction-leaves-json.js").AuthRequired;
    fromJSON(json: import("./transaction-leaves-json.js").AuthRequired): {
        constant: Bool;
        signatureNecessary: Bool;
        signatureSufficient: Bool;
    };
    toFields: (x: {
        constant: Bool;
        signatureNecessary: Bool;
        signatureSufficient: Bool;
    }) => bigint[];
    toAuxiliary: (x?: {
        constant: Bool;
        signatureNecessary: Bool;
        signatureSufficient: Bool;
    } | undefined) => any[];
    fromFields: (x: bigint[], aux: any[]) => {
        constant: Bool;
        signatureNecessary: Bool;
        signatureSufficient: Bool;
    };
    sizeInFields(): number;
    check: (x: {
        constant: Bool;
        signatureNecessary: Bool;
        signatureSufficient: Bool;
    }) => void;
    toInput: (x: {
        constant: Bool;
        signatureNecessary: Bool;
        signatureSufficient: Bool;
    }) => {
        fields?: bigint[] | undefined;
        packed?: [bigint, number][] | undefined;
    };
}, ZkappUri: import("../lib/generic.js").GenericProvable<{
    data: string;
    hash: bigint;
}, bigint> & {
    toInput: (x: {
        data: string;
        hash: bigint;
    }) => {
        fields?: bigint[] | undefined;
        packed?: [bigint, number][] | undefined;
    };
    toJSON: (x: {
        data: string;
        hash: bigint;
    }) => string;
    fromJSON: (x: string) => {
        data: string;
        hash: bigint;
    };
    emptyValue?: (() => {
        data: string;
        hash: bigint;
    }) | undefined;
} & {
    emptyValue(): {
        data: string;
        hash: bigint;
    };
};
type Event = Field[];
type Events = {
    hash: Field;
    data: Event[];
};
type Actions = Events;
declare const Events: {
    toFields: (x: {
        data: bigint[][];
        hash: bigint;
    }) => bigint[];
    toAuxiliary: (x?: {
        data: bigint[][];
        hash: bigint;
    } | undefined) => any[];
    fromFields: (x: bigint[], aux: any[]) => {
        data: bigint[][];
        hash: bigint;
    };
    sizeInFields(): number;
    check: (x: {
        data: bigint[][];
        hash: bigint;
    }) => void;
    toInput: (x: {
        data: bigint[][];
        hash: bigint;
    }) => {
        fields?: bigint[] | undefined;
        packed?: [bigint, number][] | undefined;
    };
    toJSON: (x: {
        data: bigint[][];
        hash: bigint;
    }) => string[][];
    fromJSON: (x: string[][]) => {
        data: bigint[][];
        hash: bigint;
    };
    emptyValue: (() => {
        data: bigint[][];
        hash: bigint;
    }) & (() => {
        data: bigint[][];
        hash: bigint;
    });
    empty(): {
        hash: bigint;
        data: bigint[][];
    };
    pushEvent(events: {
        hash: bigint;
        data: bigint[][];
    }, event: bigint[]): {
        hash: bigint;
        data: bigint[][];
    };
    fromList(events: bigint[][]): {
        hash: bigint;
        data: bigint[][];
    };
    hash(events: bigint[][]): bigint;
}, Actions: {
    toFields: (x: {
        data: bigint[][];
        hash: bigint;
    }) => bigint[];
    toAuxiliary: (x?: {
        data: bigint[][];
        hash: bigint;
    } | undefined) => any[];
    fromFields: (x: bigint[], aux: any[]) => {
        data: bigint[][];
        hash: bigint;
    };
    sizeInFields(): number;
    check: (x: {
        data: bigint[][];
        hash: bigint;
    }) => void;
    toInput: (x: {
        data: bigint[][];
        hash: bigint;
    }) => {
        fields?: bigint[] | undefined;
        packed?: [bigint, number][] | undefined;
    };
    toJSON: (x: {
        data: bigint[][];
        hash: bigint;
    }) => string[][];
    fromJSON: (x: string[][]) => {
        data: bigint[][];
        hash: bigint;
    };
    emptyValue: (() => {
        data: bigint[][];
        hash: bigint;
    }) & (() => {
        data: bigint[][];
        hash: bigint;
    });
    empty(): {
        hash: bigint;
        data: bigint[][];
    };
    pushEvent(actions: {
        hash: bigint;
        data: bigint[][];
    }, event: bigint[]): {
        hash: bigint;
        data: bigint[][];
    };
    fromList(events: bigint[][]): {
        hash: bigint;
        data: bigint[][];
    };
    hash(events: bigint[][]): bigint;
    emptyActionState(): bigint;
    updateSequenceState(state: bigint, sequenceEventsHash: bigint): bigint;
};
type ActionState = Field;
declare const ActionState: {
    emptyValue: () => bigint;
    modulus: bigint;
    sizeInBits: number;
    t: bigint;
    twoadicRoot: bigint;
    add(x: bigint, y: bigint): bigint;
    negate(x: bigint): bigint;
    sub(x: bigint, y: bigint): bigint;
    mul(x: bigint, y: bigint): bigint;
    inverse(x: bigint): bigint | undefined;
    div(x: bigint, y: bigint): bigint | undefined;
    square(x: bigint): bigint;
    isSquare(x: bigint): boolean;
    sqrt(x: bigint): bigint | undefined;
    power(x: bigint, n: bigint): bigint;
    dot(x: bigint[], y: bigint[]): bigint;
    equal(x: bigint, y: bigint): boolean;
    isEven(x: bigint): boolean;
    random(): bigint;
    fromNumber(x: number): bigint;
    fromBigint(x: bigint): bigint;
    toBytes(t: bigint): number[];
    readBytes<N extends number>(bytes: number[], offset: import("../crypto/non-negative.js").NonNegativeInteger<N>): [value: bigint, offset: number];
    fromBytes(bytes: number[]): bigint;
    toBits(t: bigint): boolean[];
    fromBits(bits: boolean[]): bigint;
    sizeInBytes(): number;
    toFields: (x: bigint) => bigint[];
    toAuxiliary: (x?: bigint | undefined) => any[];
    fromFields: (x: bigint[], aux: any[]) => bigint;
    sizeInFields(): number;
    check: (x: bigint) => void;
    toInput: (x: bigint) => {
        fields?: bigint[] | undefined;
        packed?: [bigint, number][] | undefined;
    };
    toJSON: (x: bigint) => string;
    fromJSON: (x: string) => bigint;
};
type VerificationKeyHash = Field;
declare const VerificationKeyHash: {
    emptyValue: () => bigint;
    modulus: bigint;
    sizeInBits: number;
    t: bigint;
    twoadicRoot: bigint;
    add(x: bigint, y: bigint): bigint;
    negate(x: bigint): bigint;
    sub(x: bigint, y: bigint): bigint;
    mul(x: bigint, y: bigint): bigint;
    inverse(x: bigint): bigint | undefined;
    div(x: bigint, y: bigint): bigint | undefined;
    square(x: bigint): bigint;
    isSquare(x: bigint): boolean;
    sqrt(x: bigint): bigint | undefined;
    power(x: bigint, n: bigint): bigint;
    dot(x: bigint[], y: bigint[]): bigint;
    equal(x: bigint, y: bigint): boolean;
    isEven(x: bigint): boolean;
    random(): bigint;
    fromNumber(x: number): bigint;
    fromBigint(x: bigint): bigint;
    toBytes(t: bigint): number[];
    readBytes<N extends number>(bytes: number[], offset: import("../crypto/non-negative.js").NonNegativeInteger<N>): [value: bigint, offset: number];
    fromBytes(bytes: number[]): bigint;
    toBits(t: bigint): boolean[];
    fromBits(bits: boolean[]): bigint;
    sizeInBytes(): number;
    toFields: (x: bigint) => bigint[];
    toAuxiliary: (x?: bigint | undefined) => any[];
    fromFields: (x: bigint[], aux: any[]) => bigint;
    sizeInFields(): number;
    check: (x: bigint) => void;
    toInput: (x: bigint) => {
        fields?: bigint[] | undefined;
        packed?: [bigint, number][] | undefined;
    };
    toJSON: (x: bigint) => string;
    fromJSON: (x: string) => bigint;
};
type ReceiptChainHash = Field;
declare const ReceiptChainHash: {
    emptyValue: () => bigint;
    modulus: bigint;
    sizeInBits: number;
    t: bigint;
    twoadicRoot: bigint;
    add(x: bigint, y: bigint): bigint;
    negate(x: bigint): bigint;
    sub(x: bigint, y: bigint): bigint;
    mul(x: bigint, y: bigint): bigint;
    inverse(x: bigint): bigint | undefined;
    div(x: bigint, y: bigint): bigint | undefined;
    square(x: bigint): bigint;
    isSquare(x: bigint): boolean;
    sqrt(x: bigint): bigint | undefined;
    power(x: bigint, n: bigint): bigint;
    dot(x: bigint[], y: bigint[]): bigint;
    equal(x: bigint, y: bigint): boolean;
    isEven(x: bigint): boolean;
    random(): bigint;
    fromNumber(x: number): bigint;
    fromBigint(x: bigint): bigint;
    toBytes(t: bigint): number[];
    readBytes<N extends number>(bytes: number[], offset: import("../crypto/non-negative.js").NonNegativeInteger<N>): [value: bigint, offset: number];
    fromBytes(bytes: number[]): bigint;
    toBits(t: bigint): boolean[];
    fromBits(bits: boolean[]): bigint;
    sizeInBytes(): number;
    toFields: (x: bigint) => bigint[];
    toAuxiliary: (x?: bigint | undefined) => any[];
    fromFields: (x: bigint[], aux: any[]) => bigint;
    sizeInFields(): number;
    check: (x: bigint) => void;
    toInput: (x: bigint) => {
        fields?: bigint[] | undefined;
        packed?: [bigint, number][] | undefined;
    };
    toJSON: (x: bigint) => string;
    fromJSON: (x: string) => bigint;
};
