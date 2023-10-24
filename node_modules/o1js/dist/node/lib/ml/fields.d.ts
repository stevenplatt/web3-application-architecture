import { ConstantField, Field, FieldConst, FieldVar } from '../field.js';
import { MlArray } from './base.js';
export { MlFieldArray, MlFieldConstArray };
type MlFieldArray = MlArray<FieldVar>;
declare const MlFieldArray: {
    to(arr: Field[]): MlArray<FieldVar>;
    from([, ...arr]: MlArray<FieldVar>): Field[];
};
type MlFieldConstArray = MlArray<FieldConst>;
declare const MlFieldConstArray: {
    to(arr: Field[]): MlArray<Uint8Array>;
    from([, ...arr]: MlArray<Uint8Array>): ConstantField[];
};
