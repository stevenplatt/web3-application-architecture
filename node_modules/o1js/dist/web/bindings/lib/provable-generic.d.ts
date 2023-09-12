import { GenericHashInput, GenericProvable, GenericProvableExtended } from './generic.js';
export { createProvable, createHashInput, ProvableConstructor };
type ProvableConstructor<Field> = <A>(typeObj: A, options?: {
    customObjectKeys?: string[];
    isPure?: boolean;
}) => GenericProvableExtended<InferProvable<A, Field>, InferJson<A>, Field>;
declare function createProvable<Field>(): ProvableConstructor<Field>;
declare function createHashInput<Field>(): {
    readonly empty: {};
    append(input1: GenericHashInput<Field>, input2: GenericHashInput<Field>): GenericHashInput<Field>;
};
type JSONValue = number | string | boolean | null | Array<JSONValue> | {
    [key: string]: JSONValue;
};
type Constructor<T> = new (...args: any) => T;
type Tuple<T> = [T, ...T[]] | [];
type Primitive = typeof String | typeof Number | typeof Boolean | typeof BigInt | null | undefined;
type InferPrimitive<P extends Primitive> = P extends typeof String ? string : P extends typeof Number ? number : P extends typeof Boolean ? boolean : P extends typeof BigInt ? bigint : P extends null ? null : P extends undefined ? undefined : any;
type InferPrimitiveJson<P extends Primitive> = P extends typeof String ? string : P extends typeof Number ? number : P extends typeof Boolean ? boolean : P extends typeof BigInt ? string : P extends null ? null : P extends undefined ? null : JSONValue;
type InferProvable<A, Field> = A extends Constructor<infer U> ? A extends GenericProvable<U, Field> ? U : InferProvableBase<A, Field> : InferProvableBase<A, Field>;
type InferProvableBase<A, Field> = A extends GenericProvable<infer U, Field> ? U : A extends Primitive ? InferPrimitive<A> : A extends Tuple<any> ? {
    [I in keyof A]: InferProvable<A[I], Field>;
} : A extends (infer U)[] ? InferProvable<U, Field>[] : A extends Record<any, any> ? {
    [K in keyof A]: InferProvable<A[K], Field>;
} : never;
type WithJson<J> = {
    toJSON: (x: any) => J;
};
type InferJson<A> = A extends WithJson<infer J> ? J : A extends Primitive ? InferPrimitiveJson<A> : A extends Tuple<any> ? {
    [I in keyof A]: InferJson<A[I]>;
} : A extends WithJson<infer U>[] ? U[] : A extends Record<any, any> ? {
    [K in keyof A]: InferJson<A[K]>;
} : JSONValue;
