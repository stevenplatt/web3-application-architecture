import { Field, FieldVar } from './field.js';
import { Scalar } from './scalar.js';
import { Bool } from './bool.js';
export { Group };
/**
 * An element of a Group.
 */
declare class Group {
    #private;
    x: Field;
    y: Field;
    /**
     * The generator `g` of the Group.
     */
    static get generator(): Group;
    /**
     * Unique representation of the `zero` element of the Group (the identity element of addition in this Group).
     *
     * **Note**: The `zero` element is represented as `(0, 0)`.
     *
     * ```typescript
     * // g + -g = 0
     * g.add(g.neg()).assertEquals(zero);
     * // g + 0 = g
     * g.add(zero).assertEquals(g);
     * ```
     */
    static get zero(): Group;
    /**
     * Coerces anything group-like to a {@link Group}.
     */
    constructor({ x, y, }: {
        x: FieldVar | Field | number | string | bigint;
        y: FieldVar | Field | number | string | bigint;
    });
    /**
     * Checks if this element is the `zero` element `{x: 0, y: 0}`.
     */
    isZero(): Bool;
    /**
     * Adds this {@link Group} element to another {@link Group} element.
     *
     * ```ts
     * let g1 = Group({ x: -1, y: 2})
     * let g2 = g1.add(g1)
     * ```
     */
    add(g: Group): Group;
    /**
     * Subtracts another {@link Group} element from this one.
     */
    sub(g: Group): Group;
    /**
     * Negates this {@link Group}. Under the hood, it simply negates the `y` coordinate and leaves the `x` coordinate as is.
     */
    neg(): Group;
    /**
     * Elliptic curve scalar multiplication. Scales the {@link Group} element `n`-times by itself, where `n` is the {@link Scalar}.
     *
     * ```typescript
     * let s = Scalar(5);
     * let 5g = g.scale(s);
     * ```
     */
    scale(s: Scalar | number | bigint): Group;
    /**
     * Assert that this {@link Group} element equals another {@link Group} element.
     * Throws an error if the assertion fails.
     *
     * ```ts
     * g1.assertEquals(g2);
     * ```
     */
    assertEquals(g: Group, message?: string): void;
    /**
     * Check if this {@link Group} element equals another {@link Group} element.
     * Returns a {@link Bool}.
     *
     * ```ts
     * g1.equals(g1); // Bool(true)
     * ```
     */
    equals(g: Group): Bool;
    /**
     * Serializes this {@link Group} element to a JSON object.
     *
     * This operation does NOT affect the circuit and can't be used to prove anything about the representation of the element.
     */
    toJSON(): {
        x: string;
        y: string;
    };
    /**
     * Part of the {@link Provable} interface.
     *
     * Returns an array containing this {@link Group} element as an array of {@link Field} elements.
     */
    toFields(): Field[];
    /**
     * Coerces two x and y coordinates into a {@link Group} element.
     */
    static from(x: FieldVar | Field | number | string | bigint, y: FieldVar | Field | number | string | bigint): Group;
    /**
     * @deprecated Please use the method `.add` on the instance instead
     *
     * Adds a {@link Group} element to another one.
     */
    static add(g1: Group, g2: Group): Group;
    /**
     * @deprecated Please use the method `.sub` on the instance instead
     *
     * Subtracts a {@link Group} element from another one.
     */
    static sub(g1: Group, g2: Group): Group;
    /**
     * @deprecated Please use the method `.neg` on the instance instead
     *
     * Negates a {@link Group} element. Under the hood, it simply negates the `y` coordinate and leaves the `x` coordinate as is.
     *
     * ```typescript
     * let gNeg = Group.neg(g);
     * ```
     */
    static neg(g: Group): Group;
    /**
     * @deprecated Please use the method `.scale` on the instance instead
     *
     * Elliptic curve scalar multiplication. Scales a {@link Group} element `n`-times by itself, where `n` is the {@link Scalar}.
     *
     * ```typescript
     * let s = Scalar(5);
     * let 5g = Group.scale(g, s);
     * ```
     */
    static scale(g: Group, s: Scalar): Group;
    /**
     * @deprecated Please use the method `.assertEqual` on the instance instead.
     *
     * Assert that two {@link Group} elements are equal to another.
     * Throws an error if the assertion fails.
     *
     * ```ts
     * Group.assertEquals(g1, g2);
     * ```
     */
    static assertEqual(g1: Group, g2: Group): void;
    /**
     * @deprecated Please use the method `.equals` on the instance instead.
     *
     * Checks if a {@link Group} element is equal to another {@link Group} element.
     * Returns a {@link Bool}.
     *
     * ```ts
     * Group.equal(g1, g2); // Bool(true)
     * ```
     */
    static equal(g1: Group, g2: Group): Bool;
    /**
     * Part of the {@link Provable} interface.
     *
     * Returns an array containing a {@link Group} element as an array of {@link Field} elements.
     */
    static toFields(g: Group): Field[];
    /**
     * Part of the {@link Provable} interface.
     *
     * Returns an empty array.
     */
    static toAuxiliary(g?: Group): never[];
    /**
     * Part of the {@link Provable} interface.
     *
     * Deserializes a {@link Group} element from a list of field elements.
     */
    static fromFields([x, y]: Field[]): Group;
    /**
     * Part of the {@link Provable} interface.
     *
     * Returns 2.
     */
    static sizeInFields(): number;
    /**
     * Serializes a {@link Group} element to a JSON object.
     *
     * This operation does NOT affect the circuit and can't be used to prove anything about the representation of the element.
     */
    static toJSON(g: Group): {
        x: string;
        y: string;
    };
    /**
     * Deserializes a JSON-like structure to a {@link Group} element.
     *
     * This operation does NOT affect the circuit and can't be used to prove anything about the representation of the element.
     */
    static fromJSON({ x, y, }: {
        x: string | number | bigint | Field | FieldVar;
        y: string | number | bigint | Field | FieldVar;
    }): Group;
    /**
     * Checks that a {@link Group} element is constraint properly by checking that the element is on the curve.
     */
    static check(g: Group): unknown;
}
