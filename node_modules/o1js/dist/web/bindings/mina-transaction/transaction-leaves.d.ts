import { Field, Bool } from '../../lib/core.js';
import { UInt32, UInt64, Sign } from '../../lib/int.js';
import { PublicKey } from '../../lib/signature.js';
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
    emptyValue(): import("../../lib/field.js").Field;
    toJSON(x: import("../../lib/field.js").Field): string;
    fromJSON(x: string): import("../../lib/field.js").Field;
    toFields: (x: import("../../lib/field.js").Field) => import("../../lib/field.js").Field[];
    toAuxiliary: (x?: import("../../lib/field.js").Field | undefined) => any[];
    fromFields: (x: import("../../lib/field.js").Field[], aux: any[]) => import("../../lib/field.js").Field;
    sizeInFields(): number;
    check: (x: import("../../lib/field.js").Field) => void;
    toInput: (x: import("../../lib/field.js").Field) => {
        fields?: import("../../lib/field.js").Field[] | undefined;
        packed?: [import("../../lib/field.js").Field, number][] | undefined;
    };
}, StateHash: {
    toJSON(x: import("../../lib/field.js").Field): string;
    fromJSON(x: string): import("../../lib/field.js").Field;
    toFields: (x: import("../../lib/field.js").Field) => import("../../lib/field.js").Field[];
    toAuxiliary: (x?: import("../../lib/field.js").Field | undefined) => any[];
    fromFields: (x: import("../../lib/field.js").Field[], aux: any[]) => import("../../lib/field.js").Field;
    sizeInFields(): number;
    check: (x: import("../../lib/field.js").Field) => void;
    toInput: (x: import("../../lib/field.js").Field) => {
        fields?: import("../../lib/field.js").Field[] | undefined;
        packed?: [import("../../lib/field.js").Field, number][] | undefined;
    };
    emptyValue?: (() => import("../../lib/field.js").Field) | undefined;
}, TokenSymbol: {
    toInput({ field }: {
        symbol: string;
        field: import("../../lib/field.js").Field;
    }): import("../lib/generic.js").GenericHashInput<import("../../lib/field.js").Field>;
    toJSON({ symbol }: {
        symbol: string;
        field: import("../../lib/field.js").Field;
    }): string;
    fromJSON(symbol: string): {
        symbol: string;
        field: import("../../lib/field.js").Field;
    };
    toFields: (x: {
        field: import("../../lib/field.js").Field;
        symbol: string;
    }) => import("../../lib/field.js").Field[];
    toAuxiliary: (x?: {
        field: import("../../lib/field.js").Field;
        symbol: string;
    } | undefined) => any[];
    fromFields: (x: import("../../lib/field.js").Field[], aux: any[]) => {
        field: import("../../lib/field.js").Field;
        symbol: string;
    };
    sizeInFields(): number;
    check: (x: {
        field: import("../../lib/field.js").Field;
        symbol: string;
    }) => void;
    emptyValue?: (() => {
        field: import("../../lib/field.js").Field;
        symbol: string;
    }) | undefined;
}, AuthRequired: {
    emptyValue(): {
        constant: import("../../lib/bool.js").Bool;
        signatureNecessary: import("../../lib/bool.js").Bool;
        signatureSufficient: import("../../lib/bool.js").Bool;
    };
    toJSON(x: {
        constant: import("../../lib/bool.js").Bool;
        signatureNecessary: import("../../lib/bool.js").Bool;
        signatureSufficient: import("../../lib/bool.js").Bool;
    }): import("./transaction-leaves-json.js").AuthRequired;
    fromJSON(json: import("./transaction-leaves-json.js").AuthRequired): {
        constant: import("../../lib/bool.js").Bool;
        signatureNecessary: import("../../lib/bool.js").Bool;
        signatureSufficient: import("../../lib/bool.js").Bool;
    };
    toFields: (x: {
        constant: import("../../lib/bool.js").Bool;
        signatureNecessary: import("../../lib/bool.js").Bool;
        signatureSufficient: import("../../lib/bool.js").Bool;
    }) => import("../../lib/field.js").Field[];
    toAuxiliary: (x?: {
        constant: import("../../lib/bool.js").Bool;
        signatureNecessary: import("../../lib/bool.js").Bool;
        signatureSufficient: import("../../lib/bool.js").Bool;
    } | undefined) => any[];
    fromFields: (x: import("../../lib/field.js").Field[], aux: any[]) => {
        constant: import("../../lib/bool.js").Bool;
        signatureNecessary: import("../../lib/bool.js").Bool;
        signatureSufficient: import("../../lib/bool.js").Bool;
    };
    sizeInFields(): number;
    check: (x: {
        constant: import("../../lib/bool.js").Bool;
        signatureNecessary: import("../../lib/bool.js").Bool;
        signatureSufficient: import("../../lib/bool.js").Bool;
    }) => void;
    toInput: (x: {
        constant: import("../../lib/bool.js").Bool;
        signatureNecessary: import("../../lib/bool.js").Bool;
        signatureSufficient: import("../../lib/bool.js").Bool;
    }) => {
        fields?: import("../../lib/field.js").Field[] | undefined;
        packed?: [import("../../lib/field.js").Field, number][] | undefined;
    };
}, ZkappUri: import("../lib/generic.js").GenericProvable<{
    data: string;
    hash: import("../../lib/field.js").Field;
}, import("../../lib/field.js").Field> & {
    toInput: (x: {
        data: string;
        hash: import("../../lib/field.js").Field;
    }) => {
        fields?: import("../../lib/field.js").Field[] | undefined;
        packed?: [import("../../lib/field.js").Field, number][] | undefined;
    };
    toJSON: (x: {
        data: string;
        hash: import("../../lib/field.js").Field;
    }) => string;
    fromJSON: (x: string) => {
        data: string;
        hash: import("../../lib/field.js").Field;
    };
    emptyValue?: (() => {
        data: string;
        hash: import("../../lib/field.js").Field;
    }) | undefined;
} & {
    emptyValue(): {
        data: string;
        hash: import("../../lib/field.js").Field;
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
        data: import("../../lib/field.js").Field[][];
        hash: import("../../lib/field.js").Field;
    }) => import("../../lib/field.js").Field[];
    toAuxiliary: (x?: {
        data: import("../../lib/field.js").Field[][];
        hash: import("../../lib/field.js").Field;
    } | undefined) => any[];
    fromFields: (x: import("../../lib/field.js").Field[], aux: any[]) => {
        data: import("../../lib/field.js").Field[][];
        hash: import("../../lib/field.js").Field;
    };
    sizeInFields(): number;
    check: (x: {
        data: import("../../lib/field.js").Field[][];
        hash: import("../../lib/field.js").Field;
    }) => void;
    toInput: (x: {
        data: import("../../lib/field.js").Field[][];
        hash: import("../../lib/field.js").Field;
    }) => {
        fields?: import("../../lib/field.js").Field[] | undefined;
        packed?: [import("../../lib/field.js").Field, number][] | undefined;
    };
    toJSON: (x: {
        data: import("../../lib/field.js").Field[][];
        hash: import("../../lib/field.js").Field;
    }) => string[][];
    fromJSON: (x: string[][]) => {
        data: import("../../lib/field.js").Field[][];
        hash: import("../../lib/field.js").Field;
    };
    emptyValue: (() => {
        data: import("../../lib/field.js").Field[][];
        hash: import("../../lib/field.js").Field;
    }) & (() => {
        data: import("../../lib/field.js").Field[][];
        hash: import("../../lib/field.js").Field;
    });
    empty(): {
        hash: import("../../lib/field.js").Field;
        data: import("../../lib/field.js").Field[][];
    };
    pushEvent(events: {
        hash: import("../../lib/field.js").Field;
        data: import("../../lib/field.js").Field[][];
    }, event: import("../../lib/field.js").Field[]): {
        hash: import("../../lib/field.js").Field;
        data: import("../../lib/field.js").Field[][];
    };
    fromList(events: import("../../lib/field.js").Field[][]): {
        hash: import("../../lib/field.js").Field;
        data: import("../../lib/field.js").Field[][];
    };
    hash(events: import("../../lib/field.js").Field[][]): import("../../lib/field.js").Field;
}, Actions: {
    toFields: (x: {
        data: import("../../lib/field.js").Field[][];
        hash: import("../../lib/field.js").Field;
    }) => import("../../lib/field.js").Field[];
    toAuxiliary: (x?: {
        data: import("../../lib/field.js").Field[][];
        hash: import("../../lib/field.js").Field;
    } | undefined) => any[];
    fromFields: (x: import("../../lib/field.js").Field[], aux: any[]) => {
        data: import("../../lib/field.js").Field[][];
        hash: import("../../lib/field.js").Field;
    };
    sizeInFields(): number;
    check: (x: {
        data: import("../../lib/field.js").Field[][];
        hash: import("../../lib/field.js").Field;
    }) => void;
    toInput: (x: {
        data: import("../../lib/field.js").Field[][];
        hash: import("../../lib/field.js").Field;
    }) => {
        fields?: import("../../lib/field.js").Field[] | undefined;
        packed?: [import("../../lib/field.js").Field, number][] | undefined;
    };
    toJSON: (x: {
        data: import("../../lib/field.js").Field[][];
        hash: import("../../lib/field.js").Field;
    }) => string[][];
    fromJSON: (x: string[][]) => {
        data: import("../../lib/field.js").Field[][];
        hash: import("../../lib/field.js").Field;
    };
    emptyValue: (() => {
        data: import("../../lib/field.js").Field[][];
        hash: import("../../lib/field.js").Field;
    }) & (() => {
        data: import("../../lib/field.js").Field[][];
        hash: import("../../lib/field.js").Field;
    });
    empty(): {
        hash: import("../../lib/field.js").Field;
        data: import("../../lib/field.js").Field[][];
    };
    pushEvent(actions: {
        hash: import("../../lib/field.js").Field;
        data: import("../../lib/field.js").Field[][];
    }, event: import("../../lib/field.js").Field[]): {
        hash: import("../../lib/field.js").Field;
        data: import("../../lib/field.js").Field[][];
    };
    fromList(events: import("../../lib/field.js").Field[][]): {
        hash: import("../../lib/field.js").Field;
        data: import("../../lib/field.js").Field[][];
    };
    hash(events: import("../../lib/field.js").Field[][]): import("../../lib/field.js").Field;
    emptyActionState(): import("../../lib/field.js").Field;
    updateSequenceState(state: import("../../lib/field.js").Field, sequenceEventsHash: import("../../lib/field.js").Field): import("../../lib/field.js").Field;
};
type ActionState = Field;
declare const ActionState: {
    emptyValue: () => import("../../lib/field.js").Field;
    toFields: (value: import("../../lib/field.js").Field) => import("../../lib/field.js").Field[];
    toAuxiliary: (value?: import("../../lib/field.js").Field | undefined) => any[];
    fromFields: (fields: import("../../lib/field.js").Field[], aux: any[]) => import("../../lib/field.js").Field;
    sizeInFields(): number;
    check: (value: import("../../lib/field.js").Field) => void;
    toInput: (x: import("../../lib/field.js").Field) => {
        fields?: import("../../lib/field.js").Field[] | undefined;
        packed?: [import("../../lib/field.js").Field, number][] | undefined;
    };
    toJSON: (x: import("../../lib/field.js").Field) => string;
    fromJSON: (x: string) => import("../../lib/field.js").Field;
};
type VerificationKeyHash = Field;
declare const VerificationKeyHash: {
    emptyValue: () => import("../../lib/field.js").Field;
    toFields: (value: import("../../lib/field.js").Field) => import("../../lib/field.js").Field[];
    toAuxiliary: (value?: import("../../lib/field.js").Field | undefined) => any[];
    fromFields: (fields: import("../../lib/field.js").Field[], aux: any[]) => import("../../lib/field.js").Field;
    sizeInFields(): number;
    check: (value: import("../../lib/field.js").Field) => void;
    toInput: (x: import("../../lib/field.js").Field) => {
        fields?: import("../../lib/field.js").Field[] | undefined;
        packed?: [import("../../lib/field.js").Field, number][] | undefined;
    };
    toJSON: (x: import("../../lib/field.js").Field) => string;
    fromJSON: (x: string) => import("../../lib/field.js").Field;
};
type ReceiptChainHash = Field;
declare const ReceiptChainHash: {
    emptyValue: () => import("../../lib/field.js").Field;
    toFields: (value: import("../../lib/field.js").Field) => import("../../lib/field.js").Field[];
    toAuxiliary: (value?: import("../../lib/field.js").Field | undefined) => any[];
    fromFields: (fields: import("../../lib/field.js").Field[], aux: any[]) => import("../../lib/field.js").Field;
    sizeInFields(): number;
    check: (value: import("../../lib/field.js").Field) => void;
    toInput: (x: import("../../lib/field.js").Field) => {
        fields?: import("../../lib/field.js").Field[] | undefined;
        packed?: [import("../../lib/field.js").Field, number][] | undefined;
    };
    toJSON: (x: import("../../lib/field.js").Field) => string;
    fromJSON: (x: string) => import("../../lib/field.js").Field;
};
