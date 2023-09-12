/**
 * This module contains basic methods for interacting with OCaml
 */
export { MlArray, MlTuple, MlBool };
const MlArray = {
    to(arr) {
        return [0, ...arr];
    },
    from([, ...arr]) {
        return arr;
    },
};
const MlTuple = Object.assign(function MlTuple(x, y) {
    return [0, x, y];
}, {
    from([, x, y]) {
        return [x, y];
    },
    first(t) {
        return t[1];
    },
    second(t) {
        return t[2];
    },
});
const MlBool = Object.assign(function MlBool(b) {
    return b ? 1 : 0;
}, {
    from(b) {
        return !!b;
    },
});
//# sourceMappingURL=base.js.map