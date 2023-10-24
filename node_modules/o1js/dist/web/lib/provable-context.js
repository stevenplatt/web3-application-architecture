import { Context } from './global-context.js';
import { Snarky } from '../snarky.js';
import { bytesToBigInt } from '../bindings/crypto/bigint-helpers.js';
import { prettifyStacktrace } from './errors.js';
// internal API
export { snarkContext, asProver, runAndCheck, runUnchecked, constraintSystem, inProver, inAnalyze, inCheckedComputation, inCompile, inCompileMode, gatesFromJson, };
let snarkContext = Context.create({ default: {} });
// helpers to read circuit context
function inProver() {
    return !!snarkContext.get().inProver;
}
function inCheckedComputation() {
    let ctx = snarkContext.get();
    return !!ctx.inCompile || !!ctx.inProver || !!ctx.inCheckedComputation;
}
function inCompile() {
    return !!snarkContext.get().inCompile;
}
function inAnalyze() {
    return !!snarkContext.get().inAnalyze;
}
function inCompileMode() {
    let ctx = snarkContext.get();
    return !!ctx.inCompile || !!ctx.inAnalyze;
}
// runners for provable code
function asProver(f) {
    if (inCheckedComputation()) {
        Snarky.run.asProver(f);
    }
    else {
        f();
    }
}
function runAndCheck(f) {
    let id = snarkContext.enter({ inCheckedComputation: true });
    try {
        Snarky.run.runAndCheck(f);
    }
    catch (error) {
        throw prettifyStacktrace(error);
    }
    finally {
        snarkContext.leave(id);
    }
}
function runUnchecked(f) {
    let id = snarkContext.enter({ inCheckedComputation: true });
    try {
        Snarky.run.runUnchecked(f);
    }
    catch (error) {
        throw prettifyStacktrace(error);
    }
    finally {
        snarkContext.leave(id);
    }
}
function constraintSystem(f) {
    let id = snarkContext.enter({ inAnalyze: true, inCheckedComputation: true });
    try {
        let result;
        let { rows, digest, json } = Snarky.run.constraintSystem(() => {
            result = f();
        });
        let { gates, publicInputSize } = gatesFromJson(json);
        return { rows, digest, result: result, gates, publicInputSize };
    }
    catch (error) {
        throw prettifyStacktrace(error);
    }
    finally {
        snarkContext.leave(id);
    }
}
// helpers
function gatesFromJson(cs) {
    let gates = cs.gates.map(({ typ, wires, coeffs: byteCoeffs }) => {
        let coeffs = [];
        for (let coefficient of byteCoeffs) {
            let arr = new Uint8Array(coefficient);
            coeffs.push(bytesToBigInt(arr).toString());
        }
        return { type: typ, wires, coeffs };
    });
    return { publicInputSize: cs.public_input_size, gates };
}
//# sourceMappingURL=provable-context.js.map