export { primitiveTypes, primitiveTypeMap, EmptyNull, EmptyUndefined, EmptyVoid, };
const emptyType = {
    sizeInFields: () => 0,
    toFields: () => [],
    toAuxiliary: () => [],
    fromFields: () => null,
    check: () => { },
    toInput: () => ({}),
    toJSON: () => null,
    fromJSON: () => null,
};
const undefinedType = {
    ...emptyType,
    fromFields: () => undefined,
    toJSON: () => null,
    fromJSON: () => undefined,
};
let primitiveTypes = new Set(['number', 'string', 'null']);
function EmptyNull() {
    return emptyType;
}
function EmptyUndefined() {
    return undefinedType;
}
function EmptyVoid() {
    return undefinedType;
}
function primitiveTypeMap() {
    return primitiveTypeMap_;
}
const primitiveTypeMap_ = {
    number: {
        ...emptyType,
        toAuxiliary: (value = 0) => [value],
        toJSON: (value) => value,
        fromJSON: (value) => value,
        fromFields: (_, [value]) => value,
    },
    string: {
        ...emptyType,
        toAuxiliary: (value = '') => [value],
        toJSON: (value) => value,
        fromJSON: (value) => value,
        fromFields: (_, [value]) => value,
    },
    null: emptyType,
};
//# sourceMappingURL=generic.js.map