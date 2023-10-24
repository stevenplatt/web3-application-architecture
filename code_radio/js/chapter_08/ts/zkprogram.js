"use strict";
// additional (O)1 Labs example: https://github.com/o1-labs/o1js/blob/main/src/examples/program.ts
// publicOutput blog post: https://blog.o1labs.org/whats-new-in-snarkyjs-june-2023-8a75e46cd849
Object.defineProperty(exports, "__esModule", { value: true });
exports.listeningProof = void 0;
// O(1) Labs recursion tutorial: https://docs.minaprotocol.com/zkapps/tutorials/recursion
const o1js_1 = require("o1js");
let timeIncrement = 5;
// declare ZkProgram
exports.listeningProof = o1js_1.Experimental.ZkProgram({
    publicOutput: o1js_1.Field,
    methods: {
        baseCase: {
            privateInputs: [],
            method() {
                return (0, o1js_1.Field)(0);
            },
        },
        inductiveCase: {
            privateInputs: [o1js_1.SelfProof],
            method(earlierProof) {
                earlierProof.verify();
                return earlierProof.publicOutput.add(timeIncrement);
            },
        },
    },
});
