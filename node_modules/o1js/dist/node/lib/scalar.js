var _Scalar_instances, _Scalar_assertConstant;
import { __classPrivateFieldGet } from "tslib";
import { Snarky } from '../snarky.js';
import { Scalar as Fq } from '../provable/curve-bigint.js';
import { Field, FieldConst, FieldVar } from './field.js';
import { Bool } from './bool.js';
export { Scalar, ScalarConst, unshift, shift };
// internal API
export { constantScalarToBigint };
const ScalarConst = {
    fromBigint: constFromBigint,
    toBigint: constToBigint,
};
let scalarShift = Fq(1n + 2n ** 255n);
let oneHalf = Fq.inverse(2n);
/**
 * Represents a {@link Scalar}.
 */
class Scalar {
    constructor(bits, constantValue) {
        _Scalar_instances.add(this);
        this.value = bits;
        constantValue ?? (constantValue = toConstantScalar(bits));
        if (constantValue !== undefined) {
            this.constantValue = ScalarConst.fromBigint(constantValue);
        }
    }
    /**
     * Create a constant {@link Scalar} from a bigint, number, string or Scalar.
     *
     * If the input is too large, it is reduced modulo the scalar field size.
     */
    static from(x) {
        if (x instanceof Scalar)
            return x;
        if (x instanceof Uint8Array)
            x = ScalarConst.toBigint(x);
        let scalar = Fq(x);
        let bits = toBits(scalar);
        return new Scalar(bits, scalar);
    }
    /**
     * Check whether this {@link Scalar} is a hard-coded constant in the constraint system.
     * If a {@link Scalar} is constructed outside provable code, it is a constant.
     */
    isConstant() {
        return this.constantValue !== undefined;
    }
    /**
     * Convert this {@link Scalar} into a constant if it isn't already.
     *
     * If the scalar is a variable, this only works inside `asProver` or `witness` blocks.
     *
     * See {@link FieldVar} for an explanation of constants vs. variables.
     */
    toConstant() {
        if (this.constantValue !== undefined)
            return this;
        let [, ...bits] = this.value;
        let constBits = bits.map((b) => FieldVar.constant(Snarky.field.readVar(b)));
        return new Scalar([0, ...constBits]);
    }
    /**
     * @deprecated use {@link Scalar.from}
     */
    static fromBigInt(x) {
        return Scalar.from(x);
    }
    /**
     * Convert this {@link Scalar} into a bigint
     */
    toBigInt() {
        return __classPrivateFieldGet(this, _Scalar_instances, "m", _Scalar_assertConstant).call(this, 'toBigInt');
    }
    // TODO: fix this API. we should represent "shifted status" internally and use
    // and use shifted Group.scale only if the scalar bits representation is shifted
    /**
     * Creates a data structure from an array of serialized {@link Bool}.
     *
     * **Warning**: The bits are interpreted as the bits of 2s + 1 + 2^255, where s is the Scalar.
     */
    static fromBits(bits) {
        return Scalar.fromFields(bits.map((b) => b.toField()));
    }
    /**
     * Returns a random {@link Scalar}.
     * Randomness can not be proven inside a circuit!
     */
    static random() {
        return Scalar.from(Fq.random());
    }
    /**
     * Negate a scalar field element.
     *
     * **Warning**: This method is not available for provable code.
     */
    neg() {
        let x = __classPrivateFieldGet(this, _Scalar_instances, "m", _Scalar_assertConstant).call(this, 'neg');
        let z = Fq.negate(x);
        return Scalar.from(z);
    }
    /**
     * Add scalar field elements.
     *
     * **Warning**: This method is not available for provable code.
     */
    add(y) {
        let x = __classPrivateFieldGet(this, _Scalar_instances, "m", _Scalar_assertConstant).call(this, 'add');
        let y0 = __classPrivateFieldGet(y, _Scalar_instances, "m", _Scalar_assertConstant).call(y, 'add');
        let z = Fq.add(x, y0);
        return Scalar.from(z);
    }
    /**
     * Subtract scalar field elements.
     *
     * **Warning**: This method is not available for provable code.
     */
    sub(y) {
        let x = __classPrivateFieldGet(this, _Scalar_instances, "m", _Scalar_assertConstant).call(this, 'sub');
        let y0 = __classPrivateFieldGet(y, _Scalar_instances, "m", _Scalar_assertConstant).call(y, 'sub');
        let z = Fq.sub(x, y0);
        return Scalar.from(z);
    }
    /**
     * Multiply scalar field elements.
     *
     * **Warning**: This method is not available for provable code.
     */
    mul(y) {
        let x = __classPrivateFieldGet(this, _Scalar_instances, "m", _Scalar_assertConstant).call(this, 'mul');
        let y0 = __classPrivateFieldGet(y, _Scalar_instances, "m", _Scalar_assertConstant).call(y, 'mul');
        let z = Fq.mul(x, y0);
        return Scalar.from(z);
    }
    /**
     * Divide scalar field elements.
     * Throws if the denominator is zero.
     *
     * **Warning**: This method is not available for provable code.
     */
    div(y) {
        let x = __classPrivateFieldGet(this, _Scalar_instances, "m", _Scalar_assertConstant).call(this, 'div');
        let y0 = __classPrivateFieldGet(y, _Scalar_instances, "m", _Scalar_assertConstant).call(y, 'div');
        let z = Fq.div(x, y0);
        if (z === undefined)
            throw Error('Scalar.div(): Division by zero');
        return Scalar.from(z);
    }
    // TODO don't leak 'shifting' to the user and remove these methods
    shift() {
        let x = __classPrivateFieldGet(this, _Scalar_instances, "m", _Scalar_assertConstant).call(this, 'shift');
        return Scalar.from(shift(x));
    }
    unshift() {
        let x = __classPrivateFieldGet(this, _Scalar_instances, "m", _Scalar_assertConstant).call(this, 'unshift');
        return Scalar.from(unshift(x));
    }
    /**
     * Serialize a Scalar into a Field element plus one bit, where the bit is represented as a Bool.
     *
     * **Warning**: This method is not available for provable code.
     *
     * Note: Since the Scalar field is slightly larger than the base Field, an additional high bit
     * is needed to represent all Scalars. However, for a random Scalar, the high bit will be `false` with overwhelming probability.
     */
    toFieldsCompressed() {
        let s = __classPrivateFieldGet(this, _Scalar_instances, "m", _Scalar_assertConstant).call(this, 'toFieldsCompressed');
        let lowBitSize = BigInt(Fq.sizeInBits - 1);
        let lowBitMask = (1n << lowBitSize) - 1n;
        return {
            field: new Field(s & lowBitMask),
            highBit: new Bool(s >> lowBitSize === 1n),
        };
    }
    // internal stuff
    // Provable<Scalar>
    /**
     * Part of the {@link Provable} interface.
     *
     * Serialize a {@link Scalar} into an array of {@link Field} elements.
     *
     * **Warning**: This function is for internal usage. It returns 255 field elements
     * which represent the Scalar in a shifted, bitwise format.
     * The fields are not constrained to be boolean.
     */
    static toFields(x) {
        let [, ...bits] = x.value;
        return bits.map((b) => new Field(b));
    }
    /**
     * Serialize this Scalar to Field elements.
     *
     * **Warning**: This function is for internal usage. It returns 255 field elements
     * which represent the Scalar in a shifted, bitwise format.
     * The fields are not constrained to be boolean.
     *
     * Check out {@link Scalar.toFieldsCompressed} for a user-friendly serialization
     * that can be used outside proofs.
     */
    toFields() {
        return Scalar.toFields(this);
    }
    /**
     * Part of the {@link Provable} interface.
     *
     * Serialize a {@link Scalar} into its auxiliary data, which are empty.
     */
    static toAuxiliary() {
        return [];
    }
    /**
     * Part of the {@link Provable} interface.
     *
     * Creates a data structure from an array of serialized {@link Field} elements.
     */
    static fromFields(fields) {
        return new Scalar([0, ...fields.map((x) => x.value)]);
    }
    /**
     * Part of the {@link Provable} interface.
     *
     * Returns the size of this type in {@link Field} elements.
     */
    static sizeInFields() {
        return Fq.sizeInBits;
    }
    /**
     * Part of the {@link Provable} interface.
     *
     * Does nothing.
     */
    static check() {
        /* It is not necessary to boolean constrain the bits of a scalar for the following
         reasons:
    
         The only provable methods which can be called with a scalar value are
    
         - if
         - assertEqual
         - equal
         - Group.scale
    
         The only one of these whose behavior depends on the bit values of the input scalars
         is Group.scale, and that function boolean constrains the scalar input itself.
         */
    }
    // ProvableExtended<Scalar>
    /**
     * Serialize a {@link Scalar} to a JSON string.
     * This operation does _not_ affect the circuit and can't be used to prove anything about the string representation of the Scalar.
     */
    static toJSON(x) {
        let s = __classPrivateFieldGet(x, _Scalar_instances, "m", _Scalar_assertConstant).call(x, 'toJSON');
        return s.toString();
    }
    /**
     * Serializes this Scalar to a string
     */
    toJSON() {
        return Scalar.toJSON(this);
    }
    /**
     * Deserialize a JSON structure into a {@link Scalar}.
     * This operation does _not_ affect the circuit and can't be used to prove anything about the string representation of the Scalar.
     */
    static fromJSON(x) {
        return Scalar.from(Fq.fromJSON(x));
    }
}
_Scalar_instances = new WeakSet(), _Scalar_assertConstant = function _Scalar_assertConstant(name) {
    return constantScalarToBigint(this, `Scalar.${name}`);
};
Scalar.ORDER = Fq.modulus;
function toConstantScalar([, ...bits]) {
    if (bits.length !== Fq.sizeInBits)
        throw Error(`Scalar: expected bits array of length ${Fq.sizeInBits}, got ${bits.length}`);
    let constantBits = Array(bits.length);
    for (let i = 0; i < bits.length; i++) {
        let bool = bits[i];
        if (!FieldVar.isConstant(bool))
            return undefined;
        constantBits[i] = FieldConst.equal(bool[1], FieldConst[1]);
    }
    let sShifted = Fq.fromBits(constantBits);
    return shift(sShifted);
}
function toBits(constantValue) {
    return [
        0,
        ...Fq.toBits(unshift(constantValue)).map((b) => FieldVar.constant(BigInt(b))),
    ];
}
/**
 * s -> 2s + 1 + 2^255
 */
function shift(s) {
    return Fq.add(Fq.add(s, s), scalarShift);
}
/**
 * inverse of shift, 2s + 1 + 2^255 -> s
 */
function unshift(s) {
    return Fq.mul(Fq.sub(s, scalarShift), oneHalf);
}
function constToBigint(x) {
    return Fq.fromBytes([...x]);
}
function constFromBigint(x) {
    return Uint8Array.from(Fq.toBytes(x));
}
function constantScalarToBigint(s, name) {
    if (s.constantValue === undefined)
        throw Error(`${name}() is not available in provable code.
That means it can't be called in a @method or similar environment, and there's no alternative implemented to achieve that.`);
    return ScalarConst.toBigint(s.constantValue);
}
//# sourceMappingURL=scalar.js.map