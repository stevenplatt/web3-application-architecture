import { Binable } from './binable.js';
export { GenericProvable, GenericProvablePure, GenericProvableExtended, GenericField, GenericBool, GenericHashInput, primitiveTypes, primitiveTypeMap, EmptyNull, EmptyUndefined, EmptyVoid, };
type GenericProvable<T, Field> = {
    toFields: (x: T) => Field[];
    toAuxiliary: (x?: T) => any[];
    fromFields: (x: Field[], aux: any[]) => T;
    sizeInFields(): number;
    check: (x: T) => void;
};
interface GenericProvablePure<T, Field> extends GenericProvable<T, Field> {
    toFields: (x: T) => Field[];
    toAuxiliary: (x?: T) => [];
    fromFields: (x: Field[]) => T;
    sizeInFields(): number;
    check: (x: T) => void;
}
type GenericProvableExtended<T, TJson, Field> = GenericProvable<T, Field> & {
    toInput: (x: T) => {
        fields?: Field[];
        packed?: [Field, number][];
    };
    toJSON: (x: T) => TJson;
    fromJSON: (x: TJson) => T;
    emptyValue?: () => T;
};
type GenericField<Field> = ((value: number | string | bigint) => Field) & GenericProvableExtended<Field, string, Field> & Binable<Field> & {
    sizeInBytes(): number;
};
type GenericBool<Field, Bool = unknown> = ((value: boolean) => Bool) & GenericProvableExtended<Bool, boolean, Field> & Binable<Bool> & {
    sizeInBytes(): number;
};
type GenericHashInput<Field> = {
    fields?: Field[];
    packed?: [Field, number][];
};
declare let primitiveTypes: Set<string>;
declare function EmptyNull<Field>(): GenericProvableExtended<null, null, Field> & GenericProvablePure<null, Field>;
declare function EmptyUndefined<Field>(): GenericProvableExtended<undefined, null, Field> & GenericProvablePure<undefined, Field>;
declare function EmptyVoid<Field>(): GenericProvableExtended<void, null, Field> & GenericProvablePure<void, Field>;
declare function primitiveTypeMap<Field>(): {
    number: GenericProvableExtended<number, number, Field>;
    string: GenericProvableExtended<string, string, Field>;
    null: GenericProvableExtended<null, null, Field>;
};
