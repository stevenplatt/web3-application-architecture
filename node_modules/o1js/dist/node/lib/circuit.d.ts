import { ProvablePure, Snarky } from '../snarky.js';
export { public_, circuitMain, Circuit, Keypair, Proof, VerificationKey };
declare class Circuit {
    static _main: CircuitData<any, any>;
    /**
     * Generates a proving key and a verification key for this circuit.
     * @example
     * ```ts
     * const keypair = await MyCircuit.generateKeypair();
     * ```
     */
    static generateKeypair(): Promise<Keypair>;
    /**
     * Proves a statement using the private input, public input, and the {@link Keypair} of the circuit.
     * @example
     * ```ts
     * const keypair = await MyCircuit.generateKeypair();
     * const proof = await MyCircuit.prove(privateInput, publicInput, keypair);
     * ```
     */
    static prove(privateInput: any[], publicInput: any[], keypair: Keypair): Promise<Proof>;
    /**
     * Verifies a proof using the public input, the proof, and the initial {@link Keypair} of the circuit.
     * @example
     * ```ts
     * const keypair = await MyCircuit.generateKeypair();
     * const proof = await MyCircuit.prove(privateInput, publicInput, keypair);
     * const isValid = await MyCircuit.verify(publicInput, keypair.vk, proof);
     * ```
     */
    static verify(publicInput: any[], verificationKey: VerificationKey, proof: Proof): Promise<boolean>;
    /**
     * @deprecated use {@link Provable.witness}
     */
    static witness: <T, S extends import("./circuit_value.js").FlexibleProvable<T> = import("./circuit_value.js").FlexibleProvable<T>>(type: S, compute: () => T) => T;
    /**
     * @deprecated use {@link Provable.asProver}
     */
    static asProver: typeof import("./provable-context.js").asProver;
    /**
     * @deprecated use {@link Provable.runAndCheck}
     */
    static runAndCheck: typeof import("./provable-context.js").runAndCheck;
    /**
     * @deprecated use {@link Provable.runUnchecked}
     */
    static runUnchecked: typeof import("./provable-context.js").runUnchecked;
    /**
     * @deprecated use {@link Provable.constraintSystem}
     */
    static constraintSystem: typeof import("./provable-context.js").constraintSystem;
    /**
     * @deprecated use {@link Provable.Array}
     */
    static array: <A extends import("./circuit_value.js").FlexibleProvable<any>>(elementType: A, length: number) => import("../bindings/lib/provable-snarky.js").InferredProvable<A[]>;
    /**
     * @deprecated use {@link Provable.assertEqual}
     */
    static assertEqual: {
        <T>(type: import("./circuit_value.js").FlexibleProvable<T>, x: T, y: T): void;
        <T_1 extends {
            toFields(): import("./field.js").Field[];
        }>(x: T_1, y: T_1): void;
    };
    /**
     * @deprecated use {@link Provable.equal}
     */
    static equal: {
        <T>(type: import("./circuit_value.js").FlexibleProvable<T>, x: T, y: T): import("./bool.js").Bool;
        <T_1 extends {
            toFields(): import("./field.js").Field[];
        }>(x: T_1, y: T_1): import("./bool.js").Bool;
    };
    /**
     * @deprecated use {@link Provable.if}
     */
    static if: {
        <T>(condition: import("./bool.js").Bool, type: import("./circuit_value.js").FlexibleProvable<T>, x: T, y: T): T;
        <T_1 extends {
            toFields(): import("./field.js").Field[];
        }>(condition: import("./bool.js").Bool, x: T_1, y: T_1): T_1;
    };
    /**
     * @deprecated use {@link Provable.switch}
     */
    static switch: <T, A extends import("./circuit_value.js").FlexibleProvable<T>>(mask: import("./bool.js").Bool[], type: A, values: T[]) => T;
    /**
     * @deprecated use {@link Provable.inProver}
     */
    static inProver: typeof import("./provable-context.js").inProver;
    /**
     * @deprecated use {@link Provable.inCheckedComputation}
     */
    static inCheckedComputation: typeof import("./provable-context.js").inCheckedComputation;
    /**
     * @deprecated use {@link Provable.log}
     */
    static log: (...args: any) => void;
}
declare class Keypair {
    value: Snarky.Keypair;
    constructor(value: Snarky.Keypair);
    verificationKey(): VerificationKey;
    /**
     * Returns a low-level JSON representation of the {@link Circuit} from its {@link Keypair}:
     * a list of gates, each of which represents a row in a table, with certain coefficients and wires to other (row, column) pairs
     * @example
     * ```ts
     * const keypair = await MyCircuit.generateKeypair();
     * const json = MyProvable.witnessFromKeypair(keypair);
     * ```
     */
    constraintSystem(): import("../snarky.js").Gate[];
}
/**
 * Proofs can be verified using a {@link VerificationKey} and the public input.
 */
declare class Proof {
    value: Snarky.Proof;
    constructor(value: Snarky.Proof);
}
/**
 * Part of the circuit {@link Keypair}. A verification key can be used to verify a {@link Proof} when you provide the correct public input.
 */
declare class VerificationKey {
    value: Snarky.VerificationKey;
    constructor(value: Snarky.VerificationKey);
}
declare function public_(target: any, _key: string | symbol, index: number): void;
type CircuitData<P, W> = {
    main(publicInput: P, privateInput: W): void;
    publicInputType: ProvablePure<P>;
    privateInputType: ProvablePure<W>;
};
declare function circuitMain(target: typeof Circuit, propertyName: string, _descriptor?: PropertyDescriptor): any;
