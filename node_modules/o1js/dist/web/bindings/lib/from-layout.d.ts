import { GenericProvableExtended } from './generic.js';
export { ProvableFromLayout, GenericLayout, genericLayoutFold };
type GenericTypeMap<Field, Bool, UInt32, UInt64, Sign, PublicKey, AuthRequired, TokenId> = {
    Field: Field;
    Bool: Bool;
    UInt32: UInt32;
    UInt64: UInt64;
    Sign: Sign;
    PublicKey: PublicKey;
    AuthRequired: AuthRequired;
    TokenId: TokenId;
};
type AnyTypeMap = GenericTypeMap<any, any, any, any, any, any, any, any>;
type TypeMapValues<TypeMap extends AnyTypeMap, JsonMap extends AnyTypeMap> = {
    [K in keyof TypeMap & keyof JsonMap]: GenericProvableExtended<TypeMap[K], JsonMap[K], TypeMap['Field']>;
};
declare function ProvableFromLayout<TypeMap extends AnyTypeMap, JsonMap extends AnyTypeMap>(TypeMap: TypeMapValues<TypeMap, JsonMap>, customTypes: Record<string, GenericProvableExtended<any, any, TypeMap['Field']>>): {
    provableFromLayout: <T, TJson>(typeData: GenericLayout<TypeMap>) => {
        sizeInFields(): number;
        toFields(value: T): TypeMap["Field"][];
        toAuxiliary(value?: T | undefined): any[];
        fromFields(fields: TypeMap["Field"][], aux: any[]): T;
        toJSON(value: T): TJson;
        fromJSON(json: TJson): T;
        check(value: T): void;
        toInput(value: T): {
            fields?: TypeMap["Field"][] | undefined;
            packed?: [TypeMap["Field"], number][] | undefined;
        };
        emptyValue(): T;
    };
    toJSONEssential: (typeData: GenericLayout<TypeMap>, value: any) => any;
    emptyValue: (typeData: GenericLayout<TypeMap>) => any;
};
type GenericFoldSpec<T, R, TypeMap extends AnyTypeMap> = {
    map: (type: GenericProvableExtended<any, any, TypeMap['Field']>, value?: T, name?: string) => R;
    reduceArray: (array: R[], typeData: ArrayLayout<TypeMap>) => R;
    reduceObject: (keys: string[], record: Record<string, R>) => R;
    reduceFlaggedOption: (option: {
        isSome: R;
        value: R;
    }, typeData: FlaggedOptionLayout<TypeMap>) => R;
    reduceOrUndefined: (value: R | undefined, innerTypeData: GenericLayout<TypeMap>) => R;
};
declare function genericLayoutFold<T, R, TypeMap extends AnyTypeMap, JsonMap extends AnyTypeMap>(TypeMap: TypeMapValues<TypeMap, JsonMap>, customTypes: Record<string, GenericProvableExtended<any, any, TypeMap['Field']>>, spec: GenericFoldSpec<T, R, TypeMap>, typeData: GenericLayout<TypeMap>, value?: T): R;
type WithChecked<TypeMap extends AnyTypeMap> = {
    checkedType?: GenericLayout<TypeMap>;
    checkedTypeName?: string;
};
type BaseLayout<TypeMap extends AnyTypeMap> = {
    type: keyof TypeMap & string;
} & WithChecked<TypeMap>;
type RangeLayout<TypeMap extends AnyTypeMap, T = BaseLayout<TypeMap>> = {
    type: 'object';
    name: string;
    keys: ['lower', 'upper'];
    entries: {
        lower: T;
        upper: T;
    };
} & WithChecked<TypeMap>;
type OptionLayout<TypeMap extends AnyTypeMap, T = BaseLayout<AnyTypeMap>> = {
    type: 'option';
} & ({
    optionType: 'closedInterval';
    rangeMin: any;
    rangeMax: any;
    inner: RangeLayout<TypeMap, T>;
} | {
    optionType: 'flaggedOption';
    inner: T;
} | {
    optionType: 'orUndefined';
    inner: T;
}) & WithChecked<TypeMap>;
type FlaggedOptionLayout<TypeMap extends AnyTypeMap, T = BaseLayout<AnyTypeMap>> = Exclude<OptionLayout<TypeMap, T>, {
    optionType: 'orUndefined';
}>;
type ArrayLayout<TypeMap extends AnyTypeMap> = {
    type: 'array';
    inner: GenericLayout<TypeMap>;
    staticLength: number | null;
} & WithChecked<TypeMap>;
type ObjectLayout<TypeMap extends AnyTypeMap> = {
    type: 'object';
    name: string;
    keys: string[];
    entries: Record<string, GenericLayout<TypeMap>>;
} & WithChecked<TypeMap>;
type GenericLayout<TypeMap extends AnyTypeMap> = OptionLayout<TypeMap> | BaseLayout<TypeMap> | ObjectLayout<TypeMap> | ArrayLayout<TypeMap>;
