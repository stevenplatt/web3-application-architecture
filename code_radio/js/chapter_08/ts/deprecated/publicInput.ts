// demonstration of publicInput with o1js
// this zero knowledge application takes a number of listening minutes and generates a zero knowledge proof
// listeningTime is used as the publicInput

// alternate O(1) Labs example: https://github.com/es92/zkApp-examples/blob/main/09-recursion/src/main.ts

import {
  Field,
  SelfProof,
  Experimental,
  verify,
} from 'o1js';

// these should go into indexedDB
let initialized: boolean = false;
let listeningTime = 0;
let latestProof: SelfProof<Field>;

async function recordListeningTime() {
    console.log('o1js loaded');
    console.log('recording listening time...');

    generateProof()

    setInterval(() => {

        listeningTime += 5;
        console.log(`Listening time: ${listeningTime} minute(s)`);

        generateProof() // this function makes a proof of time at fixed intervals

    }, 300000); // 300000 milliseconds = 5 minutes
}

async function generateProof() {
    if (initialized) {
        console.log(`generating listening time proof with ${listeningTime} minute(s)`);
        latestProof = await listeningProof.addNumber(Field(listeningTime), latestProof, Field(5));
        // console.log(latestProof.toJSON());

    } else {
        //previousProof = await init();

        console.log("previous listening time proof not found");
        console.log('creating verification key...');
        const { verificationKey } = await listeningProof.compile();
    
        console.log('creating initial listening time proof')
        latestProof = await listeningProof.init(Field(0));

        initialized = true;

        //return latestProof
    }
}

const listeningProof = Experimental.ZkProgram({
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
    },
  });

recordListeningTime(); 
