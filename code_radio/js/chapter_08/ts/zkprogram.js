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
let initialProof;
let previousProof;
let latestProof;
let listeningGoal = 100;
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('o1js loaded');
        console.log('creating verification key...');
        const { verificationKey } = yield listeningTime.compile();
        console.log('creating initial listening time proof');
        const initialProof = yield listeningTime.init((0, o1js_1.Field)(0));
        return initialProof;
    });
}
const listeningTime = o1js_1.Experimental.ZkProgram({
    publicInput: o1js_1.Field,
    methods: {
        init: {
            privateInputs: [],
            method(state) {
                state.assertEquals((0, o1js_1.Field)(0));
            },
        },
        addNumber: {
            privateInputs: [o1js_1.SelfProof, o1js_1.Field],
            method(newState, earlierProof, numberToAdd) {
                earlierProof.verify();
                newState.assertEquals(earlierProof.publicInput.add(numberToAdd));
            },
        },
        add: {
            privateInputs: [o1js_1.SelfProof, o1js_1.SelfProof],
            method(newState, earlierProof1, earlierProof2) {
                earlierProof1.verify();
                earlierProof2.verify();
                newState.assertEquals(earlierProof1.publicInput.add(earlierProof2.publicInput));
            },
        },
    },
});
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        const output = yield init();
        console.log(output);
    });
}
test();
//////////////////////////////
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('o1js loaded');
        console.log('compiling...');
        const { verificationKey } = yield listeningTime.compile();
        console.log('making proof 0');
        const proof0 = yield listeningTime.init((0, o1js_1.Field)(0));
        console.log('making proof 1');
        const proof1 = yield listeningTime.addNumber((0, o1js_1.Field)(4), proof0, (0, o1js_1.Field)(4));
        console.log('making proof 2');
        const proof2 = yield listeningTime.add((0, o1js_1.Field)(4), proof1, proof0);
        console.log('verifying proof 2');
        console.log('proof 2 data', proof2.publicInput.toString());
        const ok = yield (0, o1js_1.verify)(proof2.toJSON(), verificationKey);
        console.log('ok', ok);
        console.log('Shutting down');
    });
}
//  main();
