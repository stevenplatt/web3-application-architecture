import { HashInput, Struct } from './circuit_value.js';
import { Snarky } from '../snarky.js';
import { Field } from './core.js';
import { createHashHelpers } from './hash-generic.js';
import { Provable } from './provable.js';
import { MlFieldArray } from './ml/fields.js';
import { Poseidon as PoseidonBigint } from '../bindings/crypto/poseidon.js';
import { assert } from './errors.js';
// external API
export { Poseidon, TokenSymbol };
// internal API
export { HashInput, Hash, emptyHashWithPrefix, hashWithPrefix, salt, packToFields, emptyReceiptChainHash, hashConstant, };
class Sponge {
    constructor() {
        let isChecked = Provable.inCheckedComputation();
        this.sponge = Snarky.poseidon.sponge.create(isChecked);
    }
    absorb(x) {
        Snarky.poseidon.sponge.absorb(this.sponge, x.value);
    }
    squeeze() {
        return Field(Snarky.poseidon.sponge.squeeze(this.sponge));
    }
}
const Poseidon = {
    hash(input) {
        if (isConstant(input)) {
            return Field(PoseidonBigint.hash(toBigints(input)));
        }
        return Poseidon.update(this.initialState(), input)[0];
    },
    update(state, input) {
        if (isConstant(state) && isConstant(input)) {
            let newState = PoseidonBigint.update(toBigints(state), toBigints(input));
            return newState.map(Field);
        }
        let newState = Snarky.poseidon.update(MlFieldArray.to(state), MlFieldArray.to(input));
        return MlFieldArray.from(newState);
    },
    hashToGroup(input) {
        if (isConstant(input)) {
            let result = PoseidonBigint.hashToGroup(toBigints(input));
            assert(result !== undefined, 'hashToGroup works on all inputs');
            let { x, y } = result;
            return {
                x: Field(x),
                y: { x0: Field(y.x0), x1: Field(y.x1) },
            };
        }
        // y = sqrt(y^2)
        let [, xv, yv] = Snarky.poseidon.hashToGroup(MlFieldArray.to(input));
        let x = Field(xv);
        let y = Field(yv);
        let x0 = Provable.witness(Field, () => {
            // the even root of y^2 will become x0, so the APIs are uniform
            let isEven = y.toBigInt() % 2n === 0n;
            // we just change the order so the even root is x0
            // y.mul(-1); is the second root of sqrt(y^2)
            return isEven ? y : y.mul(-1);
        });
        let x1 = x0.mul(-1);
        // we check that either x0 or x1 match the original root y
        y.equals(x0).or(y.equals(x1)).assertTrue();
        return { x, y: { x0, x1 } };
    },
    initialState() {
        return [Field(0), Field(0), Field(0)];
    },
    Sponge,
};
function hashConstant(input) {
    return Field(PoseidonBigint.hash(toBigints(input)));
}
const Hash = createHashHelpers(Field, Poseidon);
let { salt, emptyHashWithPrefix, hashWithPrefix } = Hash;
// same as Random_oracle.prefix_to_field in OCaml
function prefixToField(prefix) {
    if (prefix.length * 8 >= 255)
        throw Error('prefix too long');
    let bits = [...prefix]
        .map((char) => {
        // convert char to 8 bits
        let bits = [];
        for (let j = 0, c = char.charCodeAt(0); j < 8; j++, c >>= 1) {
            bits.push(!!(c & 1));
        }
        return bits;
    })
        .flat();
    return Field.fromBits(bits);
}
/**
 * Convert the {fields, packed} hash input representation to a list of field elements
 * Random_oracle_input.Chunked.pack_to_fields
 */
function packToFields({ fields = [], packed = [] }) {
    if (packed.length === 0)
        return fields;
    let packedBits = [];
    let currentPackedField = Field(0);
    let currentSize = 0;
    for (let [field, size] of packed) {
        currentSize += size;
        if (currentSize < 255) {
            currentPackedField = currentPackedField
                .mul(Field(1n << BigInt(size)))
                .add(field);
        }
        else {
            packedBits.push(currentPackedField);
            currentSize = size;
            currentPackedField = field;
        }
    }
    packedBits.push(currentPackedField);
    return fields.concat(packedBits);
}
const TokenSymbolPure = {
    toFields({ field }) {
        return [field];
    },
    toAuxiliary(value) {
        return [value?.symbol ?? ''];
    },
    fromFields([field], [symbol]) {
        return { symbol, field };
    },
    sizeInFields() {
        return 1;
    },
    check({ field }) {
        let actual = field.rangeCheckHelper(48);
        actual.assertEquals(field);
    },
    toJSON({ symbol }) {
        return symbol;
    },
    fromJSON(symbol) {
        let field = prefixToField(symbol);
        return { symbol, field };
    },
    toInput({ field }) {
        return { packed: [[field, 48]] };
    },
};
class TokenSymbol extends Struct(TokenSymbolPure) {
    static get empty() {
        return { symbol: '', field: Field(0) };
    }
    static from(symbol) {
        let bytesLength = new TextEncoder().encode(symbol).length;
        if (bytesLength > 6)
            throw Error(`Token symbol ${symbol} should be a maximum of 6 bytes, but is ${bytesLength}`);
        let field = prefixToField(symbol);
        return { symbol, field };
    }
}
function emptyReceiptChainHash() {
    return emptyHashWithPrefix('CodaReceiptEmpty');
}
function isConstant(fields) {
    return fields.every((x) => x.isConstant());
}
function toBigints(fields) {
    return fields.map((x) => x.toBigInt());
}
//# sourceMappingURL=hash.js.map