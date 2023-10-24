import { Scalar as Fq } from '../provable/curve-bigint.js';
import { Field, FieldVar } from './field.js';
import { MlArray } from './ml/base.js';
import { Bool } from './bool.js';
export { Scalar, ScalarConst, unshift, shift };
export { constantScalarToBigint };
type BoolVar = FieldVar;
type ScalarConst = Uint8Array;
declare const ScalarConst: {
    fromBigint: typeof constFromBigint;
    toBigint: typeof constToBigint;
};
type ConstantScalar = Scalar & {
    constantValue: ScalarConst;
};
/**
 * Represents a {@link Scalar}.
 */
declare class Scalar {
    #private;
    value: MlArray<BoolVar>;
    constantValue?: ScalarConst;
    static ORDER: bigint;
    private constructor();
    /**
     * Create a constant {@link Scalar} from a bigint, number, string or Scalar.
     *
     * If the input is too large, it is reduced modulo the scalar field size.
     */
    static from(x: Scalar | Uint8Array | bigint | number | string): Scalar;
    /**
     * Check whether this {@link Scalar} is a hard-coded constant in the constraint system.
     * If a {@link Scalar} is constructed outside provable code, it is a constant.
     */
    isConstant(): this is Scalar & {
        constantValue: ScalarConst;
    };
    /**
     * Convert this {@link Scalar} into a constant if it isn't already.
     *
     * If the scalar is a variable, this only works inside `asProver` or `witness` blocks.
     *
     * See {@link FieldVar} for an explanation of constants vs. variables.
     */
    toConstant(): ConstantScalar;
    /**
     * @deprecated use {@link Scalar.from}
     */
    static fromBigInt(x: bigint): Scalar;
    /**
     * Convert this {@link Scalar} into a bigint
     */
    toBigInt(): bigint;
    /**
     * Creates a data structure from an array of serialized {@link Bool}.
     *
     * **Warning**: The bits are interpreted as the bits of 2s + 1 + 2^255, where s is the Scalar.
     */
    static fromBits(bits: Bool[]): Scalar;
    /**
     * Returns a random {@link Scalar}.
     * Randomness can not be proven inside a circuit!
     */
    static random(): Scalar;
    /**
     * Negate a scalar field element.
     *
     * **Warning**: This method is not available for provable code.
     */
    neg(): Scalar;
    /**
     * Add scalar field elements.
     *
     * **Warning**: This method is not available for provable code.
     */
    add(y: Scalar): Scalar;
    /**
     * Subtract scalar field elements.
     *
     * **Warning**: This method is not available for provable code.
     */
    sub(y: Scalar): Scalar;
    /**
     * Multiply scalar field elements.
     *
     * **Warning**: This method is not available for provable code.
     */
    mul(y: Scalar): Scalar;
    /**
     * Divide scalar field elements.
     * Throws if the denominator is zero.
     *
     * **Warning**: This method is not available for provable code.
     */
    div(y: Scalar): Scalar;
    shift(): Scalar;
    unshift(): Scalar;
    /**
     * Serialize a Scalar into a Field element plus one bit, where the bit is represented as a Bool.
     *
     * **Warning**: This method is not available for provable code.
     *
     * Note: Since the Scalar field is slightly larger than the base Field, an additional high bit
     * is needed to represent all Scalars. However, for a random Scalar, the high bit will be `false` with overwhelming probability.
     */
    toFieldsCompressed(): {
        field: Field;
        highBit: Bool;
    };
    /**
     * Part of the {@link Provable} interface.
     *
     * Serialize a {@link Scalar} into an array of {@link Field} elements.
     *
     * **Warning**: This function is for internal usage. It returns 255 field elements
     * which represent the Scalar in a shifted, bitwise format.
     * The fields are not constrained to be boolean.
     */
    static toFields(x: Scalar): Field[];
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
    toFields(): Field[];
    /**
     * Part of the {@link Provable} interface.
     *
     * Serialize a {@link Scalar} into its auxiliary data, which are empty.
     */
    static toAuxiliary(): never[];
    /**
     * Part of the {@link Provable} interface.
     *
     * Creates a data structure from an array of serialized {@link Field} elements.
     */
    static fromFields(fields: Field[]): Scalar;
    /**
     * Part of the {@link Provable} interface.
     *
     * Returns the size of this type in {@link Field} elements.
     */
    static sizeInFields(): number;
    /**
     * Part of the {@link Provable} interface.
     *
     * Does nothing.
     */
    static check(): void;
    /**
     * Serialize a {@link Scalar} to a JSON string.
     * This operation does _not_ affect the circuit and can't be used to prove anything about the string representation of the Scalar.
     */
    static toJSON(x: Scalar): string;
    /**
     * Serializes this Scalar to a string
     */
    toJSON(): string;
    /**
     * Deserialize a JSON structure into a {@link Scalar}.
     * This operation does _not_ affect the circuit and can't be used to prove anything about the string representation of the Scalar.
     */
    static fromJSON(x: string): Scalar;
}
/**
 * s -> 2s + 1 + 2^255
 */
declare function shift(s: Fq): Fq;
/**
 * inverse of shift, 2s + 1 + 2^255 -> s
 */
declare function unshift(s: Fq): Fq;
declare function constToBigint(x: ScalarConst): Fq;
declare function constFromBigint(x: Fq): Uint8Array;
declare function constantScalarToBigint(s: Scalar, name: string): bigint;
