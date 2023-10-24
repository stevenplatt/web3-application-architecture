/**
 * this file contains conversion functions between JS and OCaml
 */
import type { MlPublicKey, MlPublicKeyVar } from '../../snarky.js';
import { HashInput } from '../circuit_value.js';
import { Field } from '../core.js';
import { FieldConst, FieldVar } from '../field.js';
import { Scalar, ScalarConst } from '../scalar.js';
import { PrivateKey, PublicKey } from '../signature.js';
import { MlTuple, MlArray } from './base.js';
export { Ml, MlHashInput };
declare const Ml: {
    constFromField: typeof constFromField;
    constToField: typeof constToField;
    varFromField: typeof varFromField;
    varToField: typeof varToField;
    fromScalar: typeof fromScalar;
    toScalar: typeof toScalar;
    fromPrivateKey: typeof fromPrivateKey;
    toPrivateKey: typeof toPrivateKey;
    fromPublicKey: typeof fromPublicKey;
    toPublicKey: typeof toPublicKey;
    fromPublicKeyVar: typeof fromPublicKeyVar;
    toPublicKeyVar: typeof toPublicKeyVar;
};
type MlHashInput = [
    flag: 0,
    field_elements: MlArray<FieldConst>,
    packed: MlArray<MlTuple<FieldConst, number>>
];
declare const MlHashInput: {
    to({ fields, packed }: HashInput): MlHashInput;
    from([, fields, packed]: MlHashInput): HashInput;
};
declare function constFromField(x: Field): FieldConst;
declare function constToField(x: FieldConst): Field;
declare function varFromField(x: Field): FieldVar;
declare function varToField(x: FieldVar): Field;
declare function fromScalar(s: Scalar): Uint8Array;
declare function toScalar(s: ScalarConst): Scalar;
declare function fromPrivateKey(sk: PrivateKey): Uint8Array;
declare function toPrivateKey(sk: ScalarConst): PrivateKey;
declare function fromPublicKey(pk: PublicKey): MlPublicKey;
declare function toPublicKey([, x, isOdd]: MlPublicKey): PublicKey;
declare function fromPublicKeyVar(pk: PublicKey): MlPublicKeyVar;
declare function toPublicKeyVar([, x, isOdd]: MlPublicKeyVar): PublicKey;
