// this zero knowledge application takes a number of listening minutes and generates a zero knowledge proof

import {
  Field,
  SelfProof,
  Experimental,
  verify,
} from 'o1js';
  
let initialProof;
let previousProof;
let latestProof;

let listeningGoal: number = 100;

async function init() {
    console.log('o1js loaded');

    console.log('creating verification key...');
    const { verificationKey } = await listeningTime.compile();
  
    console.log('creating initial listening time proof')
    const initialProof = await listeningTime.init(Field(0));

    return initialProof
}

const listeningTime = Experimental.ZkProgram({
    publicInput: Field,
  
    methods: {
      init: {
        privateInputs: [],
  
        method(state: Field) {
          state.assertEquals(Field(0));
        },
      },
  
      addNumber: {
        privateInputs: [SelfProof, Field ],
  
        method(newState: Field, earlierProof: SelfProof<Field>, numberToAdd: Field) {
          earlierProof.verify();
          newState.assertEquals(earlierProof.publicInput.add(numberToAdd));
        },
      },
  
      add: {
        privateInputs: [ SelfProof, SelfProof ],
  
        method(
          newState: Field, 
          earlierProof1: SelfProof<Field>,
          earlierProof2: SelfProof<Field>,
        ) {
          earlierProof1.verify();
          earlierProof2.verify();
          newState.assertEquals(earlierProof1.publicInput.add(earlierProof2.publicInput));
        },
      },
    },
  });

async function test() {
    const output = await init();
    console.log(output);
}

test();

//////////////////////////////

async function main() {
  
    console.log('o1js loaded');
  
    console.log('compiling...');
  
    const { verificationKey } = await listeningTime.compile();
  
    console.log('making proof 0')
  
    const proof0 = await listeningTime.init(Field(0));
  
    console.log('making proof 1')
  
    const proof1 = await listeningTime.addNumber(Field(4), proof0, Field(4));
  
    console.log('making proof 2')
  
    const proof2 = await listeningTime.add(Field(4), proof1, proof0);
  
    console.log('verifying proof 2');
    console.log('proof 2 data', proof2.publicInput.toString());
  
    const ok = await verify(proof2.toJSON(), verificationKey);
    console.log('ok', ok);
  
    console.log('Shutting down');
  
  }

//  main();


