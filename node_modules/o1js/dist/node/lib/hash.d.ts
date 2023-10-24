import { HashInput } from './circuit_value.js';
import { Field } from './core.js';
import { Provable } from './provable.js';
export { Poseidon, TokenSymbol };
export { HashInput, Hash, emptyHashWithPrefix, hashWithPrefix, salt, packToFields, emptyReceiptChainHash, hashConstant, };
declare class Sponge {
    private sponge;
    constructor();
    absorb(x: Field): void;
    squeeze(): Field;
}
declare const Poseidon: {
    hash(input: Field[]): import("./field.js").Field;
    update(state: [Field, Field, Field], input: Field[]): import("./field.js").Field[];
    hashToGroup(input: Field[]): {
        x: import("./field.js").Field;
        y: {
            x0: import("./field.js").Field;
            x1: import("./field.js").Field;
        };
    };
    initialState(): [Field, Field, Field];
    Sponge: typeof Sponge;
};
declare function hashConstant(input: Field[]): import("./field.js").Field;
declare const Hash: {
    salt: (prefix: string) => import("./field.js").Field[];
    emptyHashWithPrefix: (prefix: string) => import("./field.js").Field;
    hashWithPrefix: (prefix: string, input: import("./field.js").Field[]) => import("./field.js").Field;
};
declare let salt: (prefix: string) => import("./field.js").Field[], emptyHashWithPrefix: (prefix: string) => import("./field.js").Field, hashWithPrefix: (prefix: string, input: import("./field.js").Field[]) => import("./field.js").Field;
/**
 * Convert the {fields, packed} hash input representation to a list of field elements
 * Random_oracle_input.Chunked.pack_to_fields
 */
declare function packToFields({ fields, packed }: HashInput): import("./field.js").Field[];
declare const TokenSymbol_base: (new (value: {
    symbol: string;
    field: import("./field.js").Field;
}) => {
    symbol: string;
    field: import("./field.js").Field;
}) & {
    _isStruct: true;
} & Provable<{
    symbol: string;
    field: import("./field.js").Field;
}> & {
    toInput: (x: {
        symbol: string;
        field: import("./field.js").Field;
    }) => {
        fields?: import("./field.js").Field[] | undefined;
        packed?: [import("./field.js").Field, number][] | undefined;
    };
    toJSON: (x: {
        symbol: string;
        field: import("./field.js").Field;
    }) => string;
    fromJSON: (x: string) => {
        symbol: string;
        field: import("./field.js").Field;
    };
};
declare class TokenSymbol extends TokenSymbol_base {
    static get empty(): {
        symbol: string;
        field: import("./field.js").Field;
    };
    static from(symbol: string): TokenSymbol;
}
declare function emptyReceiptChainHash(): import("./field.js").Field;
