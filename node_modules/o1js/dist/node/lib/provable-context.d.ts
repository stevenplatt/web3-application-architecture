import { Context } from './global-context.js';
import { Gate, JsonGate } from '../snarky.js';
export { snarkContext, SnarkContext, asProver, runAndCheck, runUnchecked, constraintSystem, inProver, inAnalyze, inCheckedComputation, inCompile, inCompileMode, gatesFromJson, };
type SnarkContext = {
    witnesses?: unknown[];
    proverData?: any;
    inProver?: boolean;
    inCompile?: boolean;
    inCheckedComputation?: boolean;
    inAnalyze?: boolean;
    inRunAndCheck?: boolean;
    inWitnessBlock?: boolean;
};
declare let snarkContext: Context.t<SnarkContext>;
declare function inProver(): boolean;
declare function inCheckedComputation(): boolean;
declare function inCompile(): boolean;
declare function inAnalyze(): boolean;
declare function inCompileMode(): boolean;
declare function asProver(f: () => void): void;
declare function runAndCheck(f: () => void): void;
declare function runUnchecked(f: () => void): void;
declare function constraintSystem<T>(f: () => T): {
    rows: number;
    digest: string;
    result: T;
    gates: Gate[];
    publicInputSize: number;
};
declare function gatesFromJson(cs: {
    gates: JsonGate[];
    public_input_size: number;
}): {
    publicInputSize: number;
    gates: Gate[];
};
