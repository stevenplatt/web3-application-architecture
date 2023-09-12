var _a, _Bool_isBool, _Bool_toVar;
import { __classPrivateFieldGet } from "tslib";
import { Snarky } from '../snarky.js';
import { Field, FieldConst, FieldType, FieldVar, readVarMessage, } from './field.js';
import { Bool as B } from '../provable/field-bigint.js';
import { defineBinable } from '../bindings/lib/binable.js';
import { asProver } from './provable-context.js';
export { Bool, isBool };
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
class Bool {
    constructor(x) {
        if (__classPrivateFieldGet(Bool, _a, "m", _Bool_isBool).call(Bool, x)) {
            this.value = x.value;
            return;
        }
        if (Array.isArray(x)) {
            this.value = x;
            return;
        }
        this.value = FieldVar.constant(B(x));
    }
    isConstant() {
        return this.value[0] === FieldType.Constant;
    }
    /**
     * Converts a {@link Bool} to a {@link Field}. `false` becomes 0 and `true` becomes 1.
     */
    toField() {
        return Bool.toField(this);
    }
    /**
     * @returns a new {@link Bool} that is the negation of this {@link Bool}.
     */
    not() {
        if (this.isConstant()) {
            return new Bool(!this.toBoolean());
        }
        return new Bool(Snarky.bool.not(this.value));
    }
    /**
     * @param y A {@link Bool} to AND with this {@link Bool}.
     * @returns a new {@link Bool} that is set to true only if
     * this {@link Bool} and `y` are also true.
     */
    and(y) {
        if (this.isConstant() && isConstant(y)) {
            return new Bool(this.toBoolean() && toBoolean(y));
        }
        return new Bool(Snarky.bool.and(this.value, __classPrivateFieldGet(Bool, _a, "m", _Bool_toVar).call(Bool, y)));
    }
    /**
     * @param y a {@link Bool} to OR with this {@link Bool}.
     * @returns a new {@link Bool} that is set to true if either
     * this {@link Bool} or `y` is true.
     */
    or(y) {
        if (this.isConstant() && isConstant(y)) {
            return new Bool(this.toBoolean() || toBoolean(y));
        }
        return new Bool(Snarky.bool.or(this.value, __classPrivateFieldGet(Bool, _a, "m", _Bool_toVar).call(Bool, y)));
    }
    /**
     * Proves that this {@link Bool} is equal to `y`.
     * @param y a {@link Bool}.
     */
    assertEquals(y, message) {
        try {
            if (this.isConstant() && isConstant(y)) {
                if (this.toBoolean() !== toBoolean(y)) {
                    throw Error(`Bool.assertEquals(): ${this} != ${y}`);
                }
                return;
            }
            Snarky.bool.assertEqual(this.value, __classPrivateFieldGet(Bool, _a, "m", _Bool_toVar).call(Bool, y));
        }
        catch (err) {
            throw withMessage(err, message);
        }
    }
    /**
     * Proves that this {@link Bool} is `true`.
     */
    assertTrue(message) {
        try {
            if (this.isConstant() && !this.toBoolean()) {
                throw Error(`Bool.assertTrue(): ${this} != ${true}`);
            }
            this.assertEquals(true);
        }
        catch (err) {
            throw withMessage(err, message);
        }
    }
    /**
     * Proves that this {@link Bool} is `false`.
     */
    assertFalse(message) {
        try {
            if (this.isConstant() && this.toBoolean()) {
                throw Error(`Bool.assertFalse(): ${this} != ${false}`);
            }
            this.assertEquals(false);
        }
        catch (err) {
            throw withMessage(err, message);
        }
    }
    /**
     * Returns true if this {@link Bool} is equal to `y`.
     * @param y a {@link Bool}.
     */
    equals(y) {
        if (this.isConstant() && isConstant(y)) {
            return new Bool(this.toBoolean() === toBoolean(y));
        }
        return new Bool(Snarky.bool.equals(this.value, __classPrivateFieldGet(Bool, _a, "m", _Bool_toVar).call(Bool, y)));
    }
    /**
     * Returns the size of this type.
     */
    sizeInFields() {
        return 1;
    }
    /**
     * Serializes this {@link Bool} into {@link Field} elements.
     */
    toFields() {
        return Bool.toFields(this);
    }
    /**
     * Serialize the {@link Bool} to a string, e.g. for printing.
     * This operation does _not_ affect the circuit and can't be used to prove anything about the string representation of the Field.
     */
    toString() {
        return this.toBoolean().toString();
    }
    /**
     * Serialize the {@link Bool} to a JSON string.
     * This operation does _not_ affect the circuit and can't be used to prove anything about the string representation of the Field.
     */
    toJSON() {
        return this.toBoolean();
    }
    /**
     * This converts the {@link Bool} to a javascript [[boolean]].
     * This can only be called on non-witness values.
     */
    toBoolean() {
        let value;
        if (this.isConstant()) {
            value = this.value[1];
        }
        else if (Snarky.run.inProverBlock()) {
            value = Snarky.field.readVar(this.value);
        }
        else {
            throw Error(readVarMessage('toBoolean', 'b', 'Bool'));
        }
        return FieldConst.equal(value, FieldConst[1]);
    }
    static toField(x) {
        return new Field(__classPrivateFieldGet(Bool, _a, "m", _Bool_toVar).call(Bool, x));
    }
    /**
     * Boolean negation.
     */
    static not(x) {
        if (__classPrivateFieldGet(Bool, _a, "m", _Bool_isBool).call(Bool, x)) {
            return x.not();
        }
        return new Bool(!x);
    }
    /**
     * Boolean AND operation.
     */
    static and(x, y) {
        if (__classPrivateFieldGet(Bool, _a, "m", _Bool_isBool).call(Bool, x)) {
            return x.and(y);
        }
        return new Bool(x).and(y);
    }
    /**
     * Boolean OR operation.
     */
    static or(x, y) {
        if (__classPrivateFieldGet(Bool, _a, "m", _Bool_isBool).call(Bool, x)) {
            return x.or(y);
        }
        return new Bool(x).or(y);
    }
    /**
     * Asserts if both {@link Bool} are equal.
     */
    static assertEqual(x, y) {
        if (__classPrivateFieldGet(Bool, _a, "m", _Bool_isBool).call(Bool, x)) {
            x.assertEquals(y);
            return;
        }
        new Bool(x).assertEquals(y);
    }
    /**
     * Checks two {@link Bool} for equality.
     */
    static equal(x, y) {
        if (__classPrivateFieldGet(Bool, _a, "m", _Bool_isBool).call(Bool, x)) {
            return x.equals(y);
        }
        return new Bool(x).equals(y);
    }
    /**
     * Static method to serialize a {@link Bool} into an array of {@link Field} elements.
     */
    static toFields(x) {
        return [Bool.toField(x)];
    }
    /**
     * Static method to serialize a {@link Bool} into its auxiliary data.
     */
    static toAuxiliary(_) {
        return [];
    }
    /**
     * Creates a data structure from an array of serialized {@link Field} elements.
     */
    static fromFields(fields) {
        if (fields.length !== 1) {
            throw Error(`Bool.fromFields(): expected 1 field, got ${fields.length}`);
        }
        return new Bool(fields[0].value);
    }
    /**
     * Serialize a {@link Bool} to a JSON string.
     * This operation does _not_ affect the circuit and can't be used to prove anything about the string representation of the Field.
     */
    static toJSON(x) {
        return x.toBoolean();
    }
    /**
     * Deserialize a JSON structure into a {@link Bool}.
     * This operation does _not_ affect the circuit and can't be used to prove anything about the string representation of the Field.
     */
    static fromJSON(b) {
        return new Bool(b);
    }
    /**
     * Returns the size of this type.
     */
    static sizeInFields() {
        return 1;
    }
    static toInput(x) {
        return { packed: [[x.toField(), 1]] };
    }
    static toBytes(b) {
        return BoolBinable.toBytes(b);
    }
    static fromBytes(bytes) {
        return BoolBinable.fromBytes(bytes);
    }
    static readBytes(bytes, offset) {
        return BoolBinable.readBytes(bytes, offset);
    }
    static sizeInBytes() {
        return 1;
    }
    static check(x) {
        Snarky.field.assertBoolean(x.value);
    }
}
_a = Bool, _Bool_isBool = function _Bool_isBool(x) {
    return x instanceof Bool;
}, _Bool_toVar = function _Bool_toVar(x) {
    if (__classPrivateFieldGet(Bool, _a, "m", _Bool_isBool).call(Bool, x))
        return x.value;
    return FieldVar.constant(B(x));
};
Bool.Unsafe = {
    /**
     * Converts a {@link Field} into a {@link Bool}. This is a **dangerous** operation
     * as it assumes that the field element is either 0 or 1 (which might not be true).
     *
     * Only use this with constants or if you have already constrained the Field element to be 0 or 1.
     *
     * @param x a {@link Field}
     */
    ofField(x) {
        asProver(() => {
            let x0 = x.toBigInt();
            if (x0 !== 0n && x0 !== 1n)
                throw Error(`Bool.Unsafe.ofField(): Expected 0 or 1, got ${x0}`);
        });
        return new Bool(x.value);
    },
};
const BoolBinable = defineBinable({
    toBytes(b) {
        return [Number(b.toBoolean())];
    },
    readBytes(bytes, offset) {
        return [new Bool(!!bytes[offset]), offset + 1];
    },
});
function isConstant(x) {
    if (typeof x === 'boolean') {
        return true;
    }
    return x.isConstant();
}
function isBool(x) {
    return x instanceof Bool;
}
function toBoolean(x) {
    if (typeof x === 'boolean') {
        return x;
    }
    return x.toBoolean();
}
// TODO: This is duplicated
function withMessage(error, message) {
    if (message === undefined || !(error instanceof Error))
        return error;
    error.message = `${message}\n${error.message}`;
    return error;
}
//# sourceMappingURL=bool.js.map