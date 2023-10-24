// this zero knowledge application takes a number of listening minutes and generates a zero knowledge proof

import {
    Field,
    Experimental,
    verify,
    Proof,
    JsonProof,
  } from 'o1js';

import { listeningProof } from './zkProgram';
  
// these should go into indexedDB
let initialized: boolean = false;
let listeningTime = 0;
let timeIncrement = 5;
let listeningGoal: number = 30;
let ok: boolean = false;
let proof: Proof<undefined, Field>;

let latestProof = Experimental.ZkProgram.Proof(listeningProof);

async function init() {
    console.log('o1js loaded...');
    console.log('compiling zero knowledge proof system...');
    let { verificationKey } = await listeningProof.compile();
    // console.log('program digest:', listeningProof.digest());
    // console.log('user verification key:', verificationKey.slice(0, 10) + '..');

    proof = await listeningProof.baseCase();
    console.log('creating initial proof...');
    proof = proofPrinter(latestProof, proof);

    console.log('verifying base case...');
    let ok = await verify(proof.toJSON(), verificationKey);
    console.log('verification result', ok);

    console.log('verifying alternative...');
    ok = await listeningProof.verify(proof);
    console.log('verification result (alternative):', ok);

    initialized = true;
}

// convert proof to JSON, log output, then convert and return original proof
function proofPrinter<
        P extends Proof<any, any>,
        latestProof extends { fromJSON(jsonProof: JsonProof): P }
    >(latestProof: latestProof, proof: P) {
    let jsonProof = proof.toJSON();
    console.log(
        'json proof',
        JSON.stringify({
            ...jsonProof,
            proof: jsonProof.proof.slice(0, 10) + '..', // prints first 10 chars of proof
            })
        );
    return latestProof.fromJSON(jsonProof);
    }

async function recordListeningTime() {
    console.log('recording listening time...');
    console.log(`Listening time: ${listeningTime} minute(s)`);

    setInterval(async () => {
        listeningTime += timeIncrement;

        if (!initialized) {
            init();
            checkPremiumTier();
        } else {
            let { verificationKey } = await listeningProof.compile();
            // console.log('user verification key:', verificationKey.slice(0, 10) + '..');

            console.log('creating updated listening proof...');
            proof = await listeningProof.inductiveCase(proof);
            proof = proofPrinter(latestProof, proof);

            console.log('verifying base case...');
            ok = await verify(proof, verificationKey);
            console.log('verification result:', ok);

            console.log('verify alternative...');
            ok = await listeningProof.verify(proof);
            console.log('verification result (alternative):', ok);

            checkPremiumTier();
        }}, 300000); // 300000 milliseconds = 5 minutes
    };

async function checkPremiumTier() {
    console.log('checking for premium tier...');
    if (ok && proof.publicOutput.toString() >= String(listeningGoal)) {
        console.log('user qualifies for premium tier');
        // console.log(proof.publicOutput.toString());
    } else {
        console.log('user does not qualify for premium tier');
    };
}

recordListeningTime();
