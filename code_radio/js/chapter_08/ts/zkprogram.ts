// additional (O)1 Labs example: https://github.com/o1-labs/o1js/blob/main/src/examples/program.ts
// publicOutput blog post: https://blog.o1labs.org/whats-new-in-snarkyjs-june-2023-8a75e46cd849

// O(1) Labs recursion tutorial: https://docs.minaprotocol.com/zkapps/tutorials/recursion

import {
    SelfProof,
    Field,
    Experimental,
    Empty,
  } from 'o1js';

let timeIncrement = 5;

// declare ZkProgram
export let listeningProof = Experimental.ZkProgram({
    publicOutput: Field,

    methods: {
        baseCase: {
            privateInputs: [],
            method() {
                return Field(0);
            },
            },
        
            inductiveCase: {
            privateInputs: [SelfProof],
            method(earlierProof: SelfProof<Empty, Field>) {
                earlierProof.verify();
                return earlierProof.publicOutput.add(timeIncrement);
                },
            },
        },
});