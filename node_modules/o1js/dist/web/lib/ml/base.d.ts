/**
 * This module contains basic methods for interacting with OCaml
 */
export { MlArray, MlTuple, MlList, MlOption, MlBool, MlBytes };
type MlTuple<X, Y> = [0, X, Y];
type MlArray<T> = [0, ...T[]];
type MlList<T> = [0, T, 0 | MlList<T>];
type MlOption<T> = 0 | [0, T];
type MlBool = 0 | 1;
/**
 * js_of_ocaml representation of a byte array,
 * see https://github.com/ocsigen/js_of_ocaml/blob/master/runtime/mlBytes.js
 */
type MlBytes = {
    t: number;
    c: string;
    l: number;
};
declare const MlArray: {
    to<T>(arr: T[]): MlArray<T>;
    from<T_1>([, ...arr]: MlArray<T_1>): T_1[];
};
declare const MlTuple: (<X, Y>(x: X, y: Y) => MlTuple<X, Y>) & {
    from<X_1, Y_1>([, x, y]: MlTuple<X_1, Y_1>): [X_1, Y_1];
    first<X_2>(t: MlTuple<X_2, unknown>): X_2;
    second<Y_2>(t: MlTuple<unknown, Y_2>): Y_2;
};
declare const MlBool: ((b: boolean) => MlBool) & {
    from(b: MlBool): boolean;
};
