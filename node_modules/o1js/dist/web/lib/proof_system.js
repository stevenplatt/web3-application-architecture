import { EmptyNull, EmptyUndefined, EmptyVoid, } from '../bindings/lib/generic.js';
import { withThreadPool } from '../bindings/js/wrapper.js';
import { Pickles } from '../snarky.js';
import { Field, Bool } from './core.js';
import { provablePure, toConstant, } from './circuit_value.js';
import { Provable } from './provable.js';
import { assert, prettifyStacktracePromise } from './errors.js';
import { snarkContext } from './provable-context.js';
import { hashConstant } from './hash.js';
import { MlArray, MlTuple } from './ml/base.js';
import { MlFieldArray, MlFieldConstArray } from './ml/fields.js';
// public API
export { Proof, SelfProof, ZkProgram, verify, Empty, Undefined, Void, };
// internal API
export { CompiledTag, sortMethodArguments, getPreviousProofsForProver, GenericArgument, picklesRuleFromFunction, compileProgram, analyzeMethod, emptyValue, emptyWitness, synthesizeMethodArguments, methodArgumentsToConstant, methodArgumentTypesAndValues, isAsFields, Prover, dummyBase64Proof, };
const Undefined = EmptyUndefined();
const Empty = Undefined;
const Void = EmptyVoid();
class Proof {
    verify() {
        this.shouldVerify = Bool(true);
    }
    verifyIf(condition) {
        this.shouldVerify = condition;
    }
    toJSON() {
        let type = getStatementType(this.constructor);
        return {
            publicInput: type.input.toFields(this.publicInput).map(String),
            publicOutput: type.output.toFields(this.publicOutput).map(String),
            maxProofsVerified: this.maxProofsVerified,
            proof: Pickles.proofToBase64([this.maxProofsVerified, this.proof]),
        };
    }
    static fromJSON({ maxProofsVerified, proof: proofString, publicInput: publicInputJson, publicOutput: publicOutputJson, }) {
        let [, proof] = Pickles.proofOfBase64(proofString, maxProofsVerified);
        let type = getStatementType(this);
        let publicInput = type.input.fromFields(publicInputJson.map(Field));
        let publicOutput = type.output.fromFields(publicOutputJson.map(Field));
        return new this({
            publicInput,
            publicOutput,
            proof,
            maxProofsVerified,
        });
    }
    constructor({ proof, publicInput, publicOutput, maxProofsVerified, }) {
        this.shouldVerify = Bool(false);
        this.publicInput = publicInput;
        this.publicOutput = publicOutput;
        this.proof = proof; // TODO optionally convert from string?
        this.maxProofsVerified = maxProofsVerified;
    }
}
Proof.publicInputType = undefined;
Proof.publicOutputType = undefined;
Proof.tag = () => {
    throw Error(`You cannot use the \`Proof\` class directly. Instead, define a subclass:\n` +
        `class MyProof extends Proof<PublicInput, PublicOutput> { ... }`);
};
async function verify(proof, verificationKey) {
    let picklesProof;
    let statement;
    if (typeof proof.proof === 'string') {
        // json proof
        [, picklesProof] = Pickles.proofOfBase64(proof.proof, proof.maxProofsVerified);
        let input = MlFieldConstArray.to(proof.publicInput.map(Field));
        let output = MlFieldConstArray.to(proof.publicOutput.map(Field));
        statement = MlTuple(input, output);
    }
    else {
        // proof class
        picklesProof = proof.proof;
        let type = getStatementType(proof.constructor);
        let input = toFieldConsts(type.input, proof.publicInput);
        let output = toFieldConsts(type.output, proof.publicOutput);
        statement = MlTuple(input, output);
    }
    return prettifyStacktracePromise(withThreadPool(() => Pickles.verify(statement, picklesProof, verificationKey)));
}
let compiledTags = new WeakMap();
let CompiledTag = {
    get(tag) {
        return compiledTags.get(tag);
    },
    store(tag, compiledTag) {
        compiledTags.set(tag, compiledTag);
    },
};
function ZkProgram(config) {
    let methods = config.methods;
    let publicInputType = config.publicInput ?? Undefined;
    let publicOutputType = config.publicOutput ?? Void;
    let selfTag = { name: `Program${i++}` };
    class SelfProof extends Proof {
    }
    SelfProof.publicInputType = publicInputType;
    SelfProof.publicOutputType = publicOutputType;
    SelfProof.tag = () => selfTag;
    let keys = Object.keys(methods).sort(); // need to have methods in (any) fixed order
    let methodIntfs = keys.map((key) => sortMethodArguments('program', key, methods[key].privateInputs, SelfProof));
    let methodFunctions = keys.map((key) => methods[key].method);
    let maxProofsVerified = methodIntfs.reduce((acc, { proofArgs }) => Math.max(acc, proofArgs.length), 0);
    let compileOutput;
    async function compile() {
        let { provers, verify, verificationKey } = await compileProgram(publicInputType, publicOutputType, methodIntfs, methodFunctions, selfTag);
        compileOutput = { provers, verify };
        return { verificationKey: verificationKey.data };
    }
    function toProver(key, i) {
        async function prove_(publicInput, ...args) {
            let picklesProver = compileOutput?.provers?.[i];
            if (picklesProver === undefined) {
                throw Error(`Cannot prove execution of program.${key}(), no prover found. ` +
                    `Try calling \`await program.compile()\` first, this will cache provers in the background.`);
            }
            let publicInputFields = toFieldConsts(publicInputType, publicInput);
            let previousProofs = MlArray.to(getPreviousProofsForProver(args, methodIntfs[i]));
            let id = snarkContext.enter({ witnesses: args, inProver: true });
            let result;
            try {
                result = await picklesProver(publicInputFields, previousProofs);
            }
            finally {
                snarkContext.leave(id);
            }
            let [publicOutputFields, proof] = MlTuple.from(result);
            let publicOutput = fromFieldConsts(publicOutputType, publicOutputFields);
            class ProgramProof extends Proof {
            }
            ProgramProof.publicInputType = publicInputType;
            ProgramProof.publicOutputType = publicOutputType;
            ProgramProof.tag = () => selfTag;
            return new ProgramProof({
                publicInput,
                publicOutput,
                proof,
                maxProofsVerified,
            });
        }
        let prove;
        if (publicInputType === Undefined ||
            publicInputType === Void) {
            prove = ((...args) => prove_(undefined, ...args));
        }
        else {
            prove = prove_;
        }
        return [key, prove];
    }
    let provers = Object.fromEntries(keys.map(toProver));
    function verify(proof) {
        if (compileOutput?.verify === undefined) {
            throw Error(`Cannot verify proof, verification key not found. Try calling \`await program.compile()\` first.`);
        }
        let statement = MlTuple(toFieldConsts(publicInputType, proof.publicInput), toFieldConsts(publicOutputType, proof.publicOutput));
        return compileOutput.verify(statement, proof.proof);
    }
    function digest() {
        let methodData = methodIntfs.map((methodEntry, i) => analyzeMethod(publicInputType, methodEntry, methodFunctions[i]));
        let hash = hashConstant(Object.values(methodData).map((d) => Field(BigInt('0x' + d.digest))));
        return hash.toBigInt().toString(16);
    }
    function analyzeMethods() {
        return methodIntfs.map((methodEntry, i) => analyzeMethod(publicInputType, methodEntry, methodFunctions[i]));
    }
    return Object.assign(selfTag, {
        compile,
        verify,
        digest,
        publicInputType: publicInputType,
        publicOutputType: publicOutputType,
        analyzeMethods,
    }, provers);
}
let i = 0;
class SelfProof extends Proof {
}
function sortMethodArguments(programName, methodName, privateInputs, selfProof) {
    let witnessArgs = [];
    let proofArgs = [];
    let allArgs = [];
    let genericArgs = [];
    for (let i = 0; i < privateInputs.length; i++) {
        let privateInput = privateInputs[i];
        if (isProof(privateInput)) {
            if (privateInput === Proof) {
                throw Error(`You cannot use the \`Proof\` class directly. Instead, define a subclass:\n` +
                    `class MyProof extends Proof<PublicInput, PublicOutput> { ... }`);
            }
            allArgs.push({ type: 'proof', index: proofArgs.length });
            if (privateInput === SelfProof) {
                proofArgs.push(selfProof);
            }
            else {
                proofArgs.push(privateInput);
            }
        }
        else if (isAsFields(privateInput)) {
            allArgs.push({ type: 'witness', index: witnessArgs.length });
            witnessArgs.push(privateInput);
        }
        else if (isGeneric(privateInput)) {
            allArgs.push({ type: 'generic', index: genericArgs.length });
            genericArgs.push(privateInput);
        }
        else {
            throw Error(`Argument ${i + 1} of method ${methodName} is not a provable type: ${privateInput}`);
        }
    }
    if (proofArgs.length > 2) {
        throw Error(`${programName}.${methodName}() has more than two proof arguments, which is not supported.\n` +
            `Suggestion: You can merge more than two proofs by merging two at a time in a binary tree.`);
    }
    return {
        methodName,
        witnessArgs,
        proofArgs,
        allArgs,
        genericArgs,
    };
}
function isAsFields(type) {
    return ((typeof type === 'function' || typeof type === 'object') &&
        type !== null &&
        ['toFields', 'fromFields', 'sizeInFields', 'toAuxiliary'].every((s) => s in type));
}
function isProof(type) {
    // the second case covers subclasses
    return (type === Proof ||
        (typeof type === 'function' && type.prototype instanceof Proof));
}
class GenericArgument {
    constructor(isEmpty = false) {
        this.isEmpty = isEmpty;
    }
}
let emptyGeneric = () => new GenericArgument(true);
function isGeneric(type) {
    // the second case covers subclasses
    return (type === GenericArgument ||
        (typeof type === 'function' && type.prototype instanceof GenericArgument));
}
function getPreviousProofsForProver(methodArgs, { allArgs }) {
    let previousProofs = [];
    for (let i = 0; i < allArgs.length; i++) {
        let arg = allArgs[i];
        if (arg.type === 'proof') {
            previousProofs[arg.index] = methodArgs[i].proof;
        }
    }
    return previousProofs;
}
async function compileProgram(publicInputType, publicOutputType, methodIntfs, methods, proofSystemTag) {
    let rules = methodIntfs.map((methodEntry, i) => picklesRuleFromFunction(publicInputType, publicOutputType, methods[i], proofSystemTag, methodEntry));
    let { verificationKey, provers, verify, tag } = await prettifyStacktracePromise(withThreadPool(async () => {
        let result;
        let id = snarkContext.enter({ inCompile: true });
        try {
            result = Pickles.compile(MlArray.to(rules), {
                publicInputSize: publicInputType.sizeInFields(),
                publicOutputSize: publicOutputType.sizeInFields(),
            });
        }
        finally {
            snarkContext.leave(id);
        }
        let { getVerificationKey, provers, verify, tag } = result;
        CompiledTag.store(proofSystemTag, tag);
        let [, data, hash] = getVerificationKey();
        let verificationKey = { data, hash: Field(hash) };
        return { verificationKey, provers: MlArray.from(provers), verify, tag };
    }));
    // wrap provers
    let wrappedProvers = provers.map((prover) => async function picklesProver(publicInput, previousProofs) {
        return prettifyStacktracePromise(withThreadPool(() => prover(publicInput, previousProofs)));
    });
    // wrap verify
    let wrappedVerify = async function picklesVerify(statement, proof) {
        return prettifyStacktracePromise(withThreadPool(() => verify(statement, proof)));
    };
    return {
        verificationKey,
        provers: wrappedProvers,
        verify: wrappedVerify,
        tag,
    };
}
function analyzeMethod(publicInputType, methodIntf, method) {
    return Provable.constraintSystem(() => {
        let args = synthesizeMethodArguments(methodIntf, true);
        let publicInput = emptyWitness(publicInputType);
        if (publicInputType === Undefined || publicInputType === Void)
            return method(...args);
        return method(publicInput, ...args);
    });
}
function picklesRuleFromFunction(publicInputType, publicOutputType, func, proofSystemTag, { methodName, witnessArgs, proofArgs, allArgs }) {
    function main(publicInput) {
        let { witnesses: argsWithoutPublicInput, inProver } = snarkContext.get();
        assert(!(inProver && argsWithoutPublicInput === undefined));
        let finalArgs = [];
        let proofs = [];
        let previousStatements = [];
        for (let i = 0; i < allArgs.length; i++) {
            let arg = allArgs[i];
            if (arg.type === 'witness') {
                let type = witnessArgs[arg.index];
                finalArgs[i] = Provable.witness(type, () => {
                    return argsWithoutPublicInput?.[i] ?? emptyValue(type);
                });
            }
            else if (arg.type === 'proof') {
                let Proof = proofArgs[arg.index];
                let type = getStatementType(Proof);
                let proof_ = argsWithoutPublicInput?.[i] ?? {
                    proof: undefined,
                    publicInput: emptyValue(type.input),
                    publicOutput: emptyValue(type.output),
                };
                let { proof, publicInput, publicOutput } = proof_;
                publicInput = Provable.witness(type.input, () => publicInput);
                publicOutput = Provable.witness(type.output, () => publicOutput);
                let proofInstance = new Proof({ publicInput, publicOutput, proof });
                finalArgs[i] = proofInstance;
                proofs.push(proofInstance);
                let input = toFieldVars(type.input, publicInput);
                let output = toFieldVars(type.output, publicOutput);
                previousStatements.push(MlTuple(input, output));
            }
            else if (arg.type === 'generic') {
                finalArgs[i] = argsWithoutPublicInput?.[i] ?? emptyGeneric();
            }
        }
        let result;
        if (publicInputType === Undefined || publicInputType === Void) {
            result = func(...finalArgs);
        }
        else {
            let input = fromFieldVars(publicInputType, publicInput);
            result = func(input, ...finalArgs);
        }
        // if the public output is empty, we don't evaluate `toFields(result)` to allow the function to return something else in that case
        let hasPublicOutput = publicOutputType.sizeInFields() !== 0;
        let publicOutput = hasPublicOutput ? publicOutputType.toFields(result) : [];
        return {
            publicOutput: MlFieldArray.to(publicOutput),
            previousStatements: MlArray.to(previousStatements),
            shouldVerify: MlArray.to(proofs.map((proof) => proof.shouldVerify.toField().value)),
        };
    }
    if (proofArgs.length > 2) {
        throw Error(`${proofSystemTag.name}.${methodName}() has more than two proof arguments, which is not supported.\n` +
            `Suggestion: You can merge more than two proofs by merging two at a time in a binary tree.`);
    }
    let proofsToVerify = proofArgs.map((Proof) => {
        let tag = Proof.tag();
        if (tag === proofSystemTag)
            return { isSelf: true };
        else {
            let compiledTag = CompiledTag.get(tag);
            if (compiledTag === undefined) {
                throw Error(`${proofSystemTag.name}.compile() depends on ${tag.name}, but we cannot find compilation output for ${tag.name}.\n` +
                    `Try to run ${tag.name}.compile() first.`);
            }
            return { isSelf: false, tag: compiledTag };
        }
    });
    return {
        identifier: methodName,
        main,
        proofsToVerify: MlArray.to(proofsToVerify),
    };
}
function synthesizeMethodArguments({ allArgs, proofArgs, witnessArgs }, asVariables = false) {
    let args = [];
    let empty = asVariables ? emptyWitness : emptyValue;
    for (let arg of allArgs) {
        if (arg.type === 'witness') {
            args.push(empty(witnessArgs[arg.index]));
        }
        else if (arg.type === 'proof') {
            let Proof = proofArgs[arg.index];
            let type = getStatementType(Proof);
            let publicInput = empty(type.input);
            let publicOutput = empty(type.output);
            args.push(new Proof({ publicInput, publicOutput, proof: undefined }));
        }
        else if (arg.type === 'generic') {
            args.push(emptyGeneric());
        }
    }
    return args;
}
function methodArgumentsToConstant({ allArgs, proofArgs, witnessArgs }, args) {
    let constArgs = [];
    for (let i = 0; i < allArgs.length; i++) {
        let arg = args[i];
        let { type, index } = allArgs[i];
        if (type === 'witness') {
            constArgs.push(toConstant(witnessArgs[index], arg));
        }
        else if (type === 'proof') {
            let Proof = proofArgs[index];
            let type = getStatementType(Proof);
            let publicInput = toConstant(type.input, arg.publicInput);
            let publicOutput = toConstant(type.output, arg.publicOutput);
            constArgs.push(new Proof({ publicInput, publicOutput, proof: arg.proof }));
        }
        else if (type === 'generic') {
            constArgs.push(arg);
        }
    }
    return constArgs;
}
let Generic = EmptyNull();
function methodArgumentTypesAndValues({ allArgs, proofArgs, witnessArgs }, args) {
    let typesAndValues = [];
    for (let i = 0; i < allArgs.length; i++) {
        let arg = args[i];
        let { type, index } = allArgs[i];
        if (type === 'witness') {
            typesAndValues.push({ type: witnessArgs[index], value: arg });
        }
        else if (type === 'proof') {
            let Proof = proofArgs[index];
            let proof = arg;
            let types = getStatementType(Proof);
            // TODO this is cumbersome, would be nicer to have a single Provable for the statement stored on Proof
            let type = provablePure({ input: types.input, output: types.output });
            let value = { input: proof.publicInput, output: proof.publicOutput };
            typesAndValues.push({ type, value });
        }
        else if (type === 'generic') {
            typesAndValues.push({ type: Generic, value: arg });
        }
    }
    return typesAndValues;
}
function emptyValue(type) {
    return type.fromFields(Array(type.sizeInFields()).fill(Field(0)), type.toAuxiliary());
}
function emptyWitness(type) {
    return Provable.witness(type, () => emptyValue(type));
}
function getStatementType(Proof) {
    if (Proof.publicInputType === undefined ||
        Proof.publicOutputType === undefined) {
        throw Error(`You cannot use the \`Proof\` class directly. Instead, define a subclass:\n` +
            `class MyProof extends Proof<PublicInput, PublicOutput> { ... }`);
    }
    return {
        input: Proof.publicInputType,
        output: Proof.publicOutputType,
    };
}
function fromFieldVars(type, fields) {
    return type.fromFields(MlFieldArray.from(fields));
}
function toFieldVars(type, value) {
    return MlFieldArray.to(type.toFields(value));
}
function fromFieldConsts(type, fields) {
    return type.fromFields(MlFieldConstArray.from(fields));
}
function toFieldConsts(type, value) {
    return MlFieldConstArray.to(type.toFields(value));
}
ZkProgram.Proof = function (program) {
    var _a;
    return _a = class ZkProgramProof extends Proof {
        },
        _a.publicInputType = program.publicInputType,
        _a.publicOutputType = program.publicOutputType,
        _a.tag = () => program,
        _a;
};
function dummyBase64Proof() {
    return withThreadPool(async () => Pickles.dummyBase64Proof());
}
// helpers for circuit context
function Prover() {
    return {
        async run(witnesses, proverData, callback) {
            let id = snarkContext.enter({ witnesses, proverData, inProver: true });
            try {
                return await callback();
            }
            finally {
                snarkContext.leave(id);
            }
        },
        getData() {
            return snarkContext.get().proverData;
        },
    };
}
//# sourceMappingURL=proof_system.js.map