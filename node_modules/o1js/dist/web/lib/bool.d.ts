import { Field, FieldConst, FieldType, FieldVar } from './field.js';
import { NonNegativeInteger } from '../bindings/crypto/non-negative.js';
export { BoolVar, Bool, isBool };
type BoolVar = FieldVar;
type ConstantBoolVar = [FieldType.Constant, FieldConst];
/**
 * A boolean value. You can use it like this:
 *
 * ```
 * const x = new Bool(true);
 * ```
 *
 * You can also combine multiple booleans via [[`not`]], [[`and`]], [[`or`]].
 *
 * Use [[assertEquals]] to enforce the value of a Bool.
 */
declare class Bool {
    #private;
    value: BoolVar;
    constructor(x: boolean | Bool | BoolVar);
    isConstant(): this is {
        value: ConstantBoolVar;
    };
    /**
     * Converts a {@link Bool} to a {@link Field}. `false` becomes 0 and `true` becomes 1.
     */
    toField(): Field;
    /**
     * @returns a new {@link Bool} that is the negation of this {@link Bool}.
     */
    not(): Bool;
    /**
     * @param y A {@link Bool} to AND with this {@link Bool}.
     * @returns a new {@link Bool} that is set to true only if
     * this {@link Bool} and `y` are also true.
     */
    and(y: Bool | boolean): Bool;
    /**
     * @param y a {@link Bool} to OR with this {@link Bool}.
     * @returns a new {@link Bool} that is set to true if either
     * this {@link Bool} or `y` is true.
     */
    or(y: Bool | boolean): Bool;
    /**
     * Proves that this {@link Bool} is equal to `y`.
     * @param y a {@link Bool}.
     */
    assertEquals(y: Bool | boolean, message?: string): void;
    /**
     * Proves that this {@link Bool} is `true`.
     */
    assertTrue(message?: string): void;
    /**
     * Proves that this {@link Bool} is `false`.
     */
    assertFalse(message?: string): void;
    /**
     * Returns true if this {@link Bool} is equal to `y`.
     * @param y a {@link Bool}.
     */
    equals(y: Bool | boolean): Bool;
    /**
     * Returns the size of this type.
     */
    sizeInFields(): number;
    /**
     * Serializes this {@link Bool} into {@link Field} elements.
     */
    toFields(): Field[];
    /**
     * Serialize the {@link Bool} to a string, e.g. for printing.
     * This operation does _not_ affect the circuit and can't be used to prove anything about the string representation of the Field.
     */
    toString(): string;
    /**
     * Serialize the {@link Bool} to a JSON string.
     * This operation does _not_ affect the circuit and can't be used to prove anything about the string representation of the Field.
     */
    toJSON(): boolean;
    /**
     * This converts the {@link Bool} to a javascript [[boolean]].
     * This can only be called on non-witness values.
     */
    toBoolean(): boolean;
    static toField(x: Bool | boolean): Field;
    /**
     * Boolean negation.
     */
    static not(x: Bool | boolean): Bool;
    /**
     * Boolean AND operation.
     */
    static and(x: Bool | boolean, y: Bool | boolean): Bool;
    /**
     * Boolean OR operation.
     */
    static or(x: Bool | boolean, y: Bool | boolean): Bool;
    /**
     * Asserts if both {@link Bool} are equal.
     */
    static assertEqual(x: Bool, y: Bool | boolean): void;
    /**
     * Checks two {@link Bool} for equality.
     */
    static equal(x: Bool | boolean, y: Bool | boolean): Bool;
    /**
     * Static method to serialize a {@link Bool} into an array of {@link Field} elements.
     */
    static toFields(x: Bool): Field[];
    /**
     * Static method to serialize a {@link Bool} into its auxiliary data.
     */
    static toAuxiliary(_?: Bool): [];
    /**
     * Creates a data structure from an array of serialized {@link Field} elements.
     */
    static fromFields(fields: Field[]): Bool;
    /**
     * Serialize a {@link Bool} to a JSON string.
     * This operation does _not_ affect the circuit and can't be used to prove anything about the string representation of the Field.
     */
    static toJSON(x: Bool): boolean;
    /**
     * Deserialize a JSON structure into a {@link Bool}.
     * This operation does _not_ affect the circuit and can't be used to prove anything about the string representation of the Field.
     */
    static fromJSON(b: boolean): Bool;
    /**
     * Returns the size of this type.
     */
    static sizeInFields(): number;
    static toInput(x: Bool): {
        packed: [Field, number][];
    };
    static toBytes(b: Bool): number[];
    static fromBytes(bytes: number[]): Bool;
    static readBytes<N extends number>(bytes: number[], offset: NonNegativeInteger<N>): [value: Bool, offset: number];
    static sizeInBytes(): number;
    static check(x: Bool): void;
    static Unsafe: {
        /**
         * Converts a {@link Field} into a {@link Bool}. This is a **dangerous** operation
         * as it assumes that the field element is either 0 or 1 (which might not be true).
         *
         * Only use this with constants or if you have already constrained the Field element to be 0 or 1.
         *
         * @param x a {@link Field}
         */
        ofField(x: Field): Bool;
    };
}
declare function isBool(x: unknown): boolean;
