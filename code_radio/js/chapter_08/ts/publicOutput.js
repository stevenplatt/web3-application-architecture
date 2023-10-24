"use strict";
// this zero knowledge application takes a number of listening minutes and generates a zero knowledge proof
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const o1js_1 = require("o1js");
const zkProgram_1 = require("./zkProgram");
// these should go into indexedDB
let initialized = false;
let listeningTime = 0;
let timeIncrement = 5;
let listeningGoal = 30;
let ok = false;
let proof;
let latestProof = o1js_1.Experimental.ZkProgram.Proof(zkProgram_1.listeningProof);
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('o1js loaded...');
        console.log('compiling zero knowledge proof system...');
        let { verificationKey } = yield zkProgram_1.listeningProof.compile();
        // console.log('program digest:', listeningProof.digest());
        // console.log('user verification key:', verificationKey.slice(0, 10) + '..');
        proof = yield zkProgram_1.listeningProof.baseCase();
        console.log('creating initial proof...');
        proof = proofPrinter(latestProof, proof);
        console.log('verifying base case...');
        let ok = yield (0, o1js_1.verify)(proof.toJSON(), verificationKey);
        console.log('verification result', ok);
        console.log('verifying alternative...');
        ok = yield zkProgram_1.listeningProof.verify(proof);
        console.log('verification result (alternative):', ok);
        initialized = true;
    });
}
// convert proof to JSON, log output, then convert and return original proof
function proofPrinter(latestProof, proof) {
    let jsonProof = proof.toJSON();
    console.log('json proof', JSON.stringify(Object.assign(Object.assign({}, jsonProof), { proof: jsonProof.proof.slice(0, 10) + '..' })));
    return latestProof.fromJSON(jsonProof);
}
function recordListeningTime() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('recording listening time...');
        console.log(`Listening time: ${listeningTime} minute(s)`);
        setInterval(() => __awaiter(this, void 0, void 0, function* () {
            listeningTime += timeIncrement;
            if (!initialized) {
                init();
                checkPremiumTier();
            }
            else {
                let { verificationKey } = yield zkProgram_1.listeningProof.compile();
                // console.log('user verification key:', verificationKey.slice(0, 10) + '..');
                console.log('creating updated listening proof...');
                proof = yield zkProgram_1.listeningProof.inductiveCase(proof);
                proof = proofPrinter(latestProof, proof);
                console.log('verifying base case...');
                ok = yield (0, o1js_1.verify)(proof, verificationKey);
                console.log('verification result:', ok);
                console.log('verify alternative...');
                ok = yield zkProgram_1.listeningProof.verify(proof);
                console.log('verification result (alternative):', ok);
                checkPremiumTier();
            }
        }), 300000); // 300000 milliseconds = 5 minutes
    });
}
;
function checkPremiumTier() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('checking for premium tier...');
        if (ok && proof.publicOutput.toString() >= String(listeningGoal)) {
            console.log('user qualifies for premium tier');
            // console.log(proof.publicOutput.toString());
        }
        else {
            console.log('user does not qualify for premium tier');
        }
        ;
    });
}
recordListeningTime();
