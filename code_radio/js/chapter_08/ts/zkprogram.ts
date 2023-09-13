// this zero knowledge application takes a number of listening minutes and generates a zero knowledge proof

import {
  Field,
  SelfProof,
  Experimental,
  verify,
} from 'o1js';

const ListeningTime = Experimental.ZkProgram({
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

async function premiumTier() {

  console.log('o1js loaded');

  console.log('compiling...');
  const { verificationKey } = await ListeningTime.compile();

  console.log('setting initial zero knowledge proof to 0')
  const proof0 = await ListeningTime.init(Field(0));

  console.log('making proof 1')
  const proof1 = await ListeningTime.addNumber(Field(4), proof0, Field(4));

  console.log('making proof 2')
  const proof2 = await ListeningTime.add(Field(4), proof1, proof0);

  console.log('verifying proof 2');
  console.log('proof 2 data', proof2.publicInput.toString());

  const ok = await verify(proof2.toJSON(), verificationKey);
  console.log('ok', ok);

  console.log('Shutting down');
}

premiumTier();