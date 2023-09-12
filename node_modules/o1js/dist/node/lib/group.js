var _Group_instances, _a, _Group_fromAffine, _Group_fromProjective, _Group_toTuple, _Group_isConstant, _Group_toProjective;
import { __classPrivateFieldGet } from "tslib";
import { Field, isField } from './field.js';
import { Scalar } from './scalar.js';
import { Snarky } from '../snarky.js';
import { Field as Fp } from '../provable/field-bigint.js';
import { Pallas } from '../bindings/crypto/elliptic_curve.js';
import { Provable } from './provable.js';
import { Bool } from './bool.js';
export { Group };
/**
 * An element of a Group.
 */
class Group {
    /**
     * The generator `g` of the Group.
     */
    static get generator() {
        return new Group({ x: Pallas.one.x, y: Pallas.one.y });
    }
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
    static get zero() {
        return new Group({
            x: 0,
            y: 0,
        });
    }
    /**
     * Coerces anything group-like to a {@link Group}.
     */
    constructor({ x, y, }) {
        _Group_instances.add(this);
        this.x = isField(x) ? x : new Field(x);
        this.y = isField(y) ? y : new Field(y);
        if (__classPrivateFieldGet(this, _Group_instances, "m", _Group_isConstant).call(this)) {
            // we also check the zero element (0, 0) here
            if (this.x.equals(0).and(this.y.equals(0)).toBoolean())
                return;
            const { add, mul, square } = Fp;
            let x_bigint = this.x.toBigInt();
            let y_bigint = this.y.toBigInt();
            let onCurve = add(mul(x_bigint, mul(x_bigint, x_bigint)), Pallas.b) ===
                square(y_bigint);
            if (!onCurve) {
                throw Error(`(x: ${x_bigint}, y: ${y_bigint}) is not a valid group element`);
            }
        }
    }
    /**
     * Checks if this element is the `zero` element `{x: 0, y: 0}`.
     */
    isZero() {
        // only the zero element can have x = 0, there are no other (valid) group elements with x = 0
        return this.x.equals(0);
    }
    /**
     * Adds this {@link Group} element to another {@link Group} element.
     *
     * ```ts
     * let g1 = Group({ x: -1, y: 2})
     * let g2 = g1.add(g1)
     * ```
     */
    add(g) {
        var _b, _c, _d;
        if (__classPrivateFieldGet(this, _Group_instances, "m", _Group_isConstant).call(this) && __classPrivateFieldGet(g, _Group_instances, "m", _Group_isConstant).call(g)) {
            // we check if either operand is zero, because adding zero to g just results in g (and vise versa)
            if (this.isZero().toBoolean()) {
                return g;
            }
            else if (g.isZero().toBoolean()) {
                return this;
            }
            else {
                let g_proj = Pallas.add(__classPrivateFieldGet(this, _Group_instances, "m", _Group_toProjective).call(this), __classPrivateFieldGet(g, _Group_instances, "m", _Group_toProjective).call(g));
                return __classPrivateFieldGet(Group, _a, "m", _Group_fromProjective).call(Group, g_proj);
            }
        }
        else {
            const { x: x1, y: y1 } = this;
            const { x: x2, y: y2 } = g;
            let zero = new Field(0);
            let same_x = Provable.witness(Field, () => x1.equals(x2).toField());
            let inf = Provable.witness(Bool, () => x1.equals(x2).and(y1.equals(y2).not()));
            let inf_z = Provable.witness(Field, () => {
                if (y1.equals(y2).toBoolean())
                    return zero;
                else if (x1.equals(x2).toBoolean())
                    return y2.sub(y1).inv();
                else
                    return zero;
            });
            let x21_inv = Provable.witness(Field, () => {
                if (x1.equals(x2).toBoolean())
                    return zero;
                else
                    return x2.sub(x1).inv();
            });
            let s = Provable.witness(Field, () => {
                if (x1.equals(x2).toBoolean()) {
                    let x1_squared = x1.square();
                    return x1_squared.add(x1_squared).add(x1_squared).div(y1.add(y1));
                }
                else
                    return y2.sub(y1).div(x2.sub(x1));
            });
            let x3 = Provable.witness(Field, () => {
                return s.square().sub(x1.add(x2));
            });
            let y3 = Provable.witness(Field, () => {
                return s.mul(x1.sub(x3)).sub(y1);
            });
            let [, x, y] = Snarky.group.ecadd(__classPrivateFieldGet((_b = Group.from(x1.seal(), y1.seal())), _Group_instances, "m", _Group_toTuple).call(_b), __classPrivateFieldGet((_c = Group.from(x2.seal(), y2.seal())), _Group_instances, "m", _Group_toTuple).call(_c), __classPrivateFieldGet((_d = Group.from(x3, y3)), _Group_instances, "m", _Group_toTuple).call(_d), inf.toField().value, same_x.value, s.value, inf_z.value, x21_inv.value);
            // similarly to the constant implementation, we check if either operand is zero
            // and the implementation above (original OCaml implementation) returns something wild -> g + 0 != g where it should be g + 0 = g
            let gIsZero = g.isZero();
            let thisIsZero = this.isZero();
            let bothZero = gIsZero.and(thisIsZero);
            let onlyGisZero = gIsZero.and(thisIsZero.not());
            let onlyThisIsZero = thisIsZero.and(gIsZero.not());
            let isNegation = inf;
            let isNewElement = bothZero
                .not()
                .and(isNegation.not())
                .and(onlyThisIsZero.not())
                .and(onlyGisZero.not());
            const zero_g = Group.zero;
            return Provable.switch([bothZero, onlyGisZero, onlyThisIsZero, isNegation, isNewElement], Group, [zero_g, this, g, zero_g, new Group({ x, y })]);
        }
    }
    /**
     * Subtracts another {@link Group} element from this one.
     */
    sub(g) {
        return this.add(g.neg());
    }
    /**
     * Negates this {@link Group}. Under the hood, it simply negates the `y` coordinate and leaves the `x` coordinate as is.
     */
    neg() {
        let { x, y } = this;
        return new Group({ x, y: y.neg() });
    }
    /**
     * Elliptic curve scalar multiplication. Scales the {@link Group} element `n`-times by itself, where `n` is the {@link Scalar}.
     *
     * ```typescript
     * let s = Scalar(5);
     * let 5g = g.scale(s);
     * ```
     */
    scale(s) {
        let scalar = Scalar.from(s);
        if (__classPrivateFieldGet(this, _Group_instances, "m", _Group_isConstant).call(this) && scalar.isConstant()) {
            let g_proj = Pallas.scale(__classPrivateFieldGet(this, _Group_instances, "m", _Group_toProjective).call(this), scalar.toBigInt());
            return __classPrivateFieldGet(Group, _a, "m", _Group_fromProjective).call(Group, g_proj);
        }
        else {
            let [, ...bits] = scalar.value;
            bits.reverse();
            let [, x, y] = Snarky.group.scale(__classPrivateFieldGet(this, _Group_instances, "m", _Group_toTuple).call(this), [0, ...bits]);
            return new Group({ x, y });
        }
    }
    /**
     * Assert that this {@link Group} element equals another {@link Group} element.
     * Throws an error if the assertion fails.
     *
     * ```ts
     * g1.assertEquals(g2);
     * ```
     */
    assertEquals(g, message) {
        let { x: x1, y: y1 } = this;
        let { x: x2, y: y2 } = g;
        x1.assertEquals(x2, message);
        y1.assertEquals(y2, message);
    }
    /**
     * Check if this {@link Group} element equals another {@link Group} element.
     * Returns a {@link Bool}.
     *
     * ```ts
     * g1.equals(g1); // Bool(true)
     * ```
     */
    equals(g) {
        let { x: x1, y: y1 } = this;
        let { x: x2, y: y2 } = g;
        return x1.equals(x2).and(y1.equals(y2));
    }
    /**
     * Serializes this {@link Group} element to a JSON object.
     *
     * This operation does NOT affect the circuit and can't be used to prove anything about the representation of the element.
     */
    toJSON() {
        return {
            x: this.x.toString(),
            y: this.y.toString(),
        };
    }
    /**
     * Part of the {@link Provable} interface.
     *
     * Returns an array containing this {@link Group} element as an array of {@link Field} elements.
     */
    toFields() {
        return [this.x, this.y];
    }
    /**
     * Coerces two x and y coordinates into a {@link Group} element.
     */
    static from(x, y) {
        return new Group({ x, y });
    }
    /**
     * @deprecated Please use the method `.add` on the instance instead
     *
     * Adds a {@link Group} element to another one.
     */
    static add(g1, g2) {
        return g1.add(g2);
    }
    /**
     * @deprecated Please use the method `.sub` on the instance instead
     *
     * Subtracts a {@link Group} element from another one.
     */
    static sub(g1, g2) {
        return g1.sub(g2);
    }
    /**
     * @deprecated Please use the method `.neg` on the instance instead
     *
     * Negates a {@link Group} element. Under the hood, it simply negates the `y` coordinate and leaves the `x` coordinate as is.
     *
     * ```typescript
     * let gNeg = Group.neg(g);
     * ```
     */
    static neg(g) {
        return g.neg();
    }
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
    static scale(g, s) {
        return g.scale(s);
    }
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
    static assertEqual(g1, g2) {
        g1.assertEquals(g2);
    }
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
    static equal(g1, g2) {
        return g1.equals(g2);
    }
    /**
     * Part of the {@link Provable} interface.
     *
     * Returns an array containing a {@link Group} element as an array of {@link Field} elements.
     */
    static toFields(g) {
        return g.toFields();
    }
    /**
     * Part of the {@link Provable} interface.
     *
     * Returns an empty array.
     */
    static toAuxiliary(g) {
        return [];
    }
    /**
     * Part of the {@link Provable} interface.
     *
     * Deserializes a {@link Group} element from a list of field elements.
     */
    static fromFields([x, y]) {
        return new Group({ x, y });
    }
    /**
     * Part of the {@link Provable} interface.
     *
     * Returns 2.
     */
    static sizeInFields() {
        return 2;
    }
    /**
     * Serializes a {@link Group} element to a JSON object.
     *
     * This operation does NOT affect the circuit and can't be used to prove anything about the representation of the element.
     */
    static toJSON(g) {
        return g.toJSON();
    }
    /**
     * Deserializes a JSON-like structure to a {@link Group} element.
     *
     * This operation does NOT affect the circuit and can't be used to prove anything about the representation of the element.
     */
    static fromJSON({ x, y, }) {
        return new Group({ x, y });
    }
    /**
     * Checks that a {@link Group} element is constraint properly by checking that the element is on the curve.
     */
    static check(g) {
        try {
            const { x, y } = g;
            let x2 = x.square();
            let x3 = x2.mul(x);
            let ax = x.mul(Pallas.a); // this will obviously be 0, but just for the sake of correctness
            // we also check the zero element (0, 0) here
            let isZero = x.equals(0).and(y.equals(0));
            isZero.or(x3.add(ax).add(Pallas.b).equals(y.square())).assertTrue();
        }
        catch (error) {
            if (!(error instanceof Error))
                return error;
            throw `${`Element (x: ${g.x}, y: ${g.y}) is not an element of the group.`}\n${error.message}`;
        }
    }
}
_a = Group, _Group_instances = new WeakSet(), _Group_fromAffine = function _Group_fromAffine({ x, y, infinity, }) {
    return infinity ? Group.zero : new Group({ x, y });
}, _Group_fromProjective = function _Group_fromProjective({ x, y, z }) {
    return __classPrivateFieldGet(this, _a, "m", _Group_fromAffine).call(this, Pallas.toAffine({ x, y, z }));
}, _Group_toTuple = function _Group_toTuple() {
    return [0, this.x.value, this.y.value];
}, _Group_isConstant = function _Group_isConstant() {
    return this.x.isConstant() && this.y.isConstant();
}, _Group_toProjective = function _Group_toProjective() {
    return Pallas.fromAffine({
        x: this.x.toBigInt(),
        y: this.y.toBigInt(),
        infinity: false,
    });
};
//# sourceMappingURL=group.js.map