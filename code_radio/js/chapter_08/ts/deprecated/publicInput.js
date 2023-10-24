/* 
"use strict";
// demonstration of publicInput with o1js
// this zero knowledge application takes a number of listening minutes and generates a zero knowledge proof
// listeningTime is used as the publicInput
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
// alternate O(1) Labs example: https://github.com/es92/zkApp-examples/blob/main/09-recursion/src/main.ts
const o1js_1 = require("o1js");
// these should go into indexedDB
let initialized = false;
let listeningTime = 0;
let latestProof;
function recordListeningTime() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('o1js loaded');
        console.log('recording listening time...');
        generateProof();
        setInterval(() => {
            listeningTime += 5;
            console.log(`Listening time: ${listeningTime} minute(s)`);
            generateProof(); // this function makes a proof of time at fixed intervals
        }, 300000); // 300000 milliseconds = 5 minutes
    });
}
function generateProof() {
    return __awaiter(this, void 0, void 0, function* () {
        if (initialized) {
            console.log(`generating listening time proof with ${listeningTime} minute(s)`);
            latestProof = yield listeningProof.addNumber((0, o1js_1.Field)(listeningTime), latestProof, (0, o1js_1.Field)(5));
            // console.log(latestProof.toJSON());
        }
        else {
            //previousProof = await init();
            console.log("previous listening time proof not found");
            console.log('creating verification key...');
            const { verificationKey } = yield listeningProof.compile();
            console.log('creating initial listening time proof');
            latestProof = yield listeningProof.init((0, o1js_1.Field)(0));
            initialized = true;
            //return latestProof
        }
    });
}
const listeningProof = o1js_1.Experimental.ZkProgram({
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
    },
});
recordListeningTime();
 */