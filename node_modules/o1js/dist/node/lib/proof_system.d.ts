import { ProvablePure, Pickles } from '../snarky.js';
import { Bool } from './core.js';
import { FlexibleProvable, FlexibleProvablePure, InferProvable, ProvablePureExtended } from './circuit_value.js';
import { Provable } from './provable.js';
export { Proof, SelfProof, JsonProof, ZkProgram, verify, Empty, Undefined, Void, };
export { CompiledTag, sortMethodArguments, getPreviousProofsForProver, MethodInterface, GenericArgument, picklesRuleFromFunction, compileProgram, analyzeMethod, emptyValue, emptyWitness, synthesizeMethodArguments, methodArgumentsToConstant, methodArgumentTypesAndValues, isAsFields, Prover, dummyBase64Proof, };
type Undefined = undefined;
declare const Undefined: ProvablePureExtended<undefined, null>;
type Empty = Undefined;
declare const Empty: ProvablePureExtended<undefined, null>;
type Void = undefined;
declare const Void: ProvablePureExtended<void, null>;
declare class Proof<Input, Output> {
    static publicInputType: FlexibleProvablePure<any>;
    static publicOutputType: FlexibleProvablePure<any>;
    static tag: () => {
        name: string;
    };
    publicInput: Input;
    publicOutput: Output;
    proof: Pickles.Proof;
    maxProofsVerified: 0 | 1 | 2;
    shouldVerify: import("./bool.js").Bool;
    verify(): void;
    verifyIf(condition: Bool): void;
    toJSON(): JsonProof;
    static fromJSON<S extends Subclass<typeof Proof>>(this: S, { maxProofsVerified, proof: proofString, publicInput: publicInputJson, publicOutput: publicOutputJson, }: JsonProof): Proof<InferProvable<S['publicInputType']>, InferProvable<S['publicOutputType']>>;
    constructor({ proof, publicInput, publicOutput, maxProofsVerified, }: {
        proof: Pickles.Proof;
        publicInput: Input;
        publicOutput: Output;
        maxProofsVerified: 0 | 1 | 2;
    });
}
declare function verify(proof: Proof<any, any> | JsonProof, verificationKey: string): Promise<boolean>;
type JsonProof = {
    publicInput: string[];
    publicOutput: string[];
    maxProofsVerified: 0 | 1 | 2;
    proof: string;
};
type CompiledTag = unknown;
declare let CompiledTag: {
    get(tag: any): CompiledTag | undefined;
    store(tag: any, compiledTag: CompiledTag): void;
};
declare function ZkProgram<StatementType extends {
    publicInput?: FlexibleProvablePure<any>;
    publicOutput?: FlexibleProvablePure<any>;
}, Types extends {
    [I in string]: Tuple<PrivateInput>;
}>(config: StatementType & {
    methods: {
        [I in keyof Types]: Method<InferProvableOrUndefined<Get<StatementType, 'publicInput'>>, InferProvableOrVoid<Get<StatementType, 'publicOutput'>>, Types[I]>;
    };
}): {
    name: string;
    compile: () => Promise<{
        verificationKey: string;
    }>;
    verify: (proof: Proof<InferProvableOrUndefined<Get<StatementType, 'publicInput'>>, InferProvableOrVoid<Get<StatementType, 'publicOutput'>>>) => Promise<boolean>;
    digest: () => string;
    analyzeMethods: () => ReturnType<typeof analyzeMethod>[];
    publicInputType: ProvableOrUndefined<Get<StatementType, 'publicInput'>>;
    publicOutputType: ProvableOrVoid<Get<StatementType, 'publicOutput'>>;
} & {
    [I in keyof Types]: Prover<InferProvableOrUndefined<Get<StatementType, 'publicInput'>>, InferProvableOrVoid<Get<StatementType, 'publicOutput'>>, Types[I]>;
};
declare namespace ZkProgram {
    var Proof: <PublicInputType extends FlexibleProvablePure<any>, PublicOutputType extends FlexibleProvablePure<any>>(program: {
        name: string;
        publicInputType: PublicInputType;
        publicOutputType: PublicOutputType;
    }) => {
        new ({ proof, publicInput, publicOutput, maxProofsVerified, }: {
            proof: unknown;
            publicInput: InferProvable<PublicInputType>;
            publicOutput: InferProvable<PublicOutputType>;
            maxProofsVerified: 0 | 2 | 1;
        }): {
            publicInput: InferProvable<PublicInputType>;
            publicOutput: InferProvable<PublicOutputType>;
            proof: unknown;
            maxProofsVerified: 0 | 2 | 1;
            shouldVerify: import("./bool.js").Bool;
            verify(): void;
            verifyIf(condition: import("./bool.js").Bool): void;
            toJSON(): JsonProof;
        };
        publicInputType: PublicInputType;
        publicOutputType: PublicOutputType;
        tag: () => {
            name: string;
            publicInputType: PublicInputType;
            publicOutputType: PublicOutputType;
        };
        fromJSON<S extends Subclass<typeof import("./proof_system.js").Proof>>(this: S, { maxProofsVerified, proof: proofString, publicInput: publicInputJson, publicOutput: publicOutputJson, }: JsonProof): Proof<InferProvable<S["publicInputType"]>, InferProvable<S["publicOutputType"]>>;
    };
}
declare class SelfProof<PublicInput, PublicOutput> extends Proof<PublicInput, PublicOutput> {
}
declare function sortMethodArguments(programName: string, methodName: string, privateInputs: unknown[], selfProof: Subclass<typeof Proof>): MethodInterface;
declare function isAsFields(type: unknown): type is Provable<unknown> & ObjectConstructor;
declare class GenericArgument {
    isEmpty: boolean;
    constructor(isEmpty?: boolean);
}
declare function getPreviousProofsForProver(methodArgs: any[], { allArgs }: MethodInterface): unknown[];
type MethodInterface = {
    methodName: string;
    witnessArgs: Provable<unknown>[];
    proofArgs: Subclass<typeof Proof>[];
    genericArgs: Subclass<typeof GenericArgument>[];
    allArgs: {
        type: 'witness' | 'proof' | 'generic';
        index: number;
    }[];
    returnType?: Provable<any>;
};
declare function compileProgram(publicInputType: ProvablePure<any>, publicOutputType: ProvablePure<any>, methodIntfs: MethodInterface[], methods: ((...args: any) => void)[], proofSystemTag: {
    name: string;
}): Promise<{
    verificationKey: {
        data: string;
        hash: import("./field.js").Field;
    };
    provers: Pickles.Prover[];
    verify: (statement: Pickles.Statement<Uint8Array>, proof: Pickles.Proof) => Promise<boolean>;
    tag: unknown;
}>;
declare function analyzeMethod<T>(publicInputType: ProvablePure<any>, methodIntf: MethodInterface, method: (...args: any) => T): {
    rows: number;
    digest: string;
    result: T;
    gates: import("../snarky.js").Gate[];
    publicInputSize: number;
};
declare function picklesRuleFromFunction(publicInputType: ProvablePure<unknown>, publicOutputType: ProvablePure<unknown>, func: (...args: unknown[]) => any, proofSystemTag: {
    name: string;
}, { methodName, witnessArgs, proofArgs, allArgs }: MethodInterface): Pickles.Rule;
declare function synthesizeMethodArguments({ allArgs, proofArgs, witnessArgs }: MethodInterface, asVariables?: boolean): unknown[];
declare function methodArgumentsToConstant({ allArgs, proofArgs, witnessArgs }: MethodInterface, args: any[]): any[];
type TypeAndValue<T> = {
    type: Provable<T>;
    value: T;
};
declare function methodArgumentTypesAndValues({ allArgs, proofArgs, witnessArgs }: MethodInterface, args: unknown[]): TypeAndValue<any>[];
declare function emptyValue<T>(type: FlexibleProvable<T>): T;
declare function emptyWitness<T>(type: FlexibleProvable<T>): T;
declare function dummyBase64Proof(): Promise<string>;
declare function Prover<ProverData>(): {
    run<Result>(witnesses: unknown[], proverData: ProverData, callback: () => Promise<Result>): Promise<Result>;
    getData(): ProverData;
};
type Infer<T> = T extends Subclass<typeof Proof> ? InstanceType<T> : InferProvable<T>;
type Tuple<T> = [T, ...T[]] | [];
type TupleToInstances<T> = {
    [I in keyof T]: Infer<T[I]>;
} & any[];
type Subclass<Class extends new (...args: any) => any> = (new (...args: any) => InstanceType<Class>) & {
    [K in keyof Class]: Class[K];
} & {
    prototype: InstanceType<Class>;
};
type PrivateInput = Provable<any> | Subclass<typeof Proof>;
type Method<PublicInput, PublicOutput, Args extends Tuple<PrivateInput>> = PublicInput extends undefined ? {
    privateInputs: Args;
    method(...args: TupleToInstances<Args>): PublicOutput;
} : {
    privateInputs: Args;
    method(publicInput: PublicInput, ...args: TupleToInstances<Args>): PublicOutput;
};
type Prover<PublicInput, PublicOutput, Args extends Tuple<PrivateInput>> = PublicInput extends undefined ? (...args: TupleToInstances<Args>) => Promise<Proof<PublicInput, PublicOutput>> : (publicInput: PublicInput, ...args: TupleToInstances<Args>) => Promise<Proof<PublicInput, PublicOutput>>;
type ProvableOrUndefined<A> = A extends undefined ? typeof Undefined : A;
type ProvableOrVoid<A> = A extends undefined ? typeof Void : A;
type InferProvableOrUndefined<A> = A extends undefined ? undefined : InferProvable<A>;
type InferProvableOrVoid<A> = A extends undefined ? void : InferProvable<A>;
/**
 * helper to get property type from an object, in place of `T[Key]`
 *
 * assume `T extends { Key?: Something }`.
 * if we use `Get<T, Key>` instead of `T[Key]`, we allow `T` to be inferred _without_ the `Key` key,
 * and thus retain the precise type of `T` during inference
 */
type Get<T, Key extends string> = T extends {
    [K in Key]: infer Value;
} ? Value : undefined;
