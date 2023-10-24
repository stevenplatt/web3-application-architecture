/**
 * this file contains conversion functions between JS and OCaml
 */
import { Bool, Field } from '../core.js';
import { Scalar } from '../scalar.js';
import { PrivateKey, PublicKey } from '../signature.js';
import { MlTuple, MlBool, MlArray } from './base.js';
import { MlFieldConstArray } from './fields.js';
export { Ml, MlHashInput };
const Ml = {
    constFromField,
    constToField,
    varFromField,
    varToField,
    fromScalar,
    toScalar,
    fromPrivateKey,
    toPrivateKey,
    fromPublicKey,
    toPublicKey,
    fromPublicKeyVar,
    toPublicKeyVar,
};
const MlHashInput = {
    to({ fields = [], packed = [] }) {
        return [
            0,
            MlFieldConstArray.to(fields),
            MlArray.to(packed.map(([field, size]) => [0, Ml.constFromField(field), size])),
        ];
    },
    from([, fields, packed]) {
        return {
            fields: MlFieldConstArray.from(fields),
            packed: MlArray.from(packed).map(([, field, size]) => [Field(field), size]),
        };
    },
};
function constFromField(x) {
    return x.toConstant().value[1];
}
function constToField(x) {
    return Field(x);
}
function varFromField(x) {
    return x.value;
}
function varToField(x) {
    return Field(x);
}
function fromScalar(s) {
    return s.toConstant().constantValue;
}
function toScalar(s) {
    return Scalar.from(s);
}
function fromPrivateKey(sk) {
    return fromScalar(sk.s);
}
function toPrivateKey(sk) {
    return new PrivateKey(Scalar.from(sk));
}
function fromPublicKey(pk) {
    return MlTuple(pk.x.toConstant().value[1], MlBool(pk.isOdd.toBoolean()));
}
function toPublicKey([, x, isOdd]) {
    return PublicKey.from({
        x: Field(x),
        isOdd: Bool(MlBool.from(isOdd)),
    });
}
function fromPublicKeyVar(pk) {
    return MlTuple(pk.x.value, pk.isOdd.toField().value);
}
function toPublicKeyVar([, x, isOdd]) {
    return PublicKey.from({
        x: Field(x),
        // TODO
        isOdd: Bool.Unsafe.ofField(Field(isOdd)),
    });
}
//# sourceMappingURL=conversion.js.map