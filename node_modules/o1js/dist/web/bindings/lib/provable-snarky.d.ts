import { Provable, ProvablePure } from '../../snarky.js';
import { Field } from '../../lib/core.js';
export { ProvableExtended, provable, provablePure };
export { NonMethods, HashInput, InferProvable, InferJson, InferredProvable, IsPure, };
type ProvableExtension<T, TJson = any> = {
    toInput: (x: T) => {
        fields?: Field[];
        packed?: [Field, number][];
    };
    toJSON: (x: T) => TJson;
    fromJSON: (x: TJson) => T;
};
type ProvableExtended<T, TJson = any> = Provable<T> & ProvableExtension<T, TJson>;
type ProvableExtendedPure<T, TJson = any> = ProvablePure<T> & ProvableExtension<T, TJson>;
type Struct<T> = ProvableExtended<NonMethods<T>> & Constructor<T> & {
    _isStruct: true;
};
type HashInput = {
    fields?: Field[];
    packed?: [Field, number][];
};
declare const HashInput: {
    readonly empty: {};
    append(input1: HashInput, input2: HashInput): HashInput;
};
declare function provable<A>(typeObj: A, options?: {
    customObjectKeys?: string[];
    isPure?: boolean;
}): ProvableExtended<InferProvable<A>, InferJson<A>>;
declare function provablePure<A>(typeObj: A, options?: {
    customObjectKeys?: string[];
}): ProvablePure<InferProvable<A>> & ProvableExtension<InferProvable<A>, InferJson<A>>;
type Constructor<T> = new (...args: any) => T;
type NonMethodKeys<T> = {
    [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
type NonMethods<T> = Pick<T, NonMethodKeys<T>>;
type Tuple<T> = [T, ...T[]] | [];
type Primitive = typeof String | typeof Number | typeof Boolean | typeof BigInt | null | undefined;
type InferPrimitive<P extends Primitive> = P extends typeof String ? string : P extends typeof Number ? number : P extends typeof Boolean ? boolean : P extends typeof BigInt ? bigint : P extends null ? null : P extends undefined ? undefined : any;
type InferPrimitiveJson<P extends Primitive> = P extends typeof String ? string : P extends typeof Number ? number : P extends typeof Boolean ? boolean : P extends typeof BigInt ? string : P extends null ? null : P extends undefined ? null : any;
type InferProvable<A> = A extends Constructor<infer U> ? A extends Provable<U> ? U : A extends Struct<U> ? U : InferProvableBase<A> : InferProvableBase<A>;
type InferProvableBase<A> = A extends Provable<infer U> ? U : A extends Primitive ? InferPrimitive<A> : A extends Tuple<any> ? {
    [I in keyof A]: InferProvable<A[I]>;
} : A extends (infer U)[] ? InferProvable<U>[] : A extends Record<any, any> ? {
    [K in keyof A]: InferProvable<A[K]>;
} : never;
type WithJson<J> = {
    toJSON: (x: any) => J;
};
type InferJson<A> = A extends WithJson<infer J> ? J : A extends Primitive ? InferPrimitiveJson<A> : A extends Tuple<any> ? {
    [I in keyof A]: InferJson<A[I]>;
} : A extends WithJson<infer U>[] ? U[] : A extends Record<any, any> ? {
    [K in keyof A]: InferJson<A[K]>;
} : any;
type IsPure<A> = IsPureBase<A> extends true ? true : false;
type IsPureBase<A> = A extends ProvablePure<any> ? true : A extends Provable<any> ? false : A extends Primitive ? false : A extends (infer U)[] ? IsPure<U> : A extends Record<any, any> ? {
    [K in keyof A]: IsPure<A[K]>;
}[keyof A] : false;
type InferredProvable<A> = IsPure<A> extends true ? ProvableExtendedPure<InferProvable<A>, InferJson<A>> : ProvableExtended<InferProvable<A>, InferJson<A>>;
