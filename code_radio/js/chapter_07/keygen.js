


///////////////////////////
// Keygen Code
//////////////////////////

// document.addEventListener('DOMContentLoaded', async () => {
//   try {
//     const keys = await generateKeyPair();

//     document.getElementById('publicKey').innerHTML = keys.publicKey + '</pre>';
//     document.getElementById('privateKey').innerHTML = keys.privateKey + '</pre>';
//   } catch (error) {
//     console.error('Error generating key pair:', error);
//   }
// });

let publicKey;
let privateKey;

async function generateKeyPair() {
  const algorithm = {
    name: 'ECDSA',
    namedCurve: 'P-256',
  };

  const keys = await crypto.subtle.generateKey(algorithm, true, ['sign', 'verify']);

  const publicKey = await crypto.subtle.exportKey('spki', keys.publicKey);
  const privateKey = await crypto.subtle.exportKey('pkcs8', keys.privateKey);

  // Convert keys to Base64 for display
  const publicKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(publicKey)));
  const privateKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(privateKey)));

  return {
    publicKey: publicKeyBase64,
    privateKey: privateKeyBase64,
  };
}

///////////////////////////
// Signature Code
//////////////////////////

generateKeyPair()
  .then(keys => {
    publicKey = keys.publicKey;
    privateKey = keys.privateKey;

    // Use the publicKey and privateKey as needed
    console.log('Public Key:', publicKey);
    console.log('Private Key:', privateKey);

    // Call the signMessage function with the privateKey and message
    signMessage(privateKey, 'Hello, world!');
  })
  .catch(error => {
    console.error('Error generating key pair:', error);
  });

async function signMessage(privateKey, message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);

  try {
    const importedKey = await crypto.subtle.importKey(
      'pkcs8',
      base64ToArrayBuffer(privateKey),
      {
        name: 'ECDSA',
        namedCurve: 'P-256',
      },
      true,
      ['sign']
    );

    // Rest of the signing logic...
  } catch (error) {
    console.error('Error importing private key:', error);
  }
}

function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const length = binaryString.length;
  const bytes = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes.buffer;
}

  
// Call the signMessage function with the privateKey and message
signMessage(privateKey, 'Hello, world!');


// async function verifySignature(publicKey, message, signature) {
//     const encoder = new TextEncoder();
//     const data = encoder.encode(message);
  
//     const key = await crypto.subtle.importKey(
//       'spki', publicKey,
//       { name: 'ECDSA', namedCurve: 'P-256' },
//       true, ['verify']
//     );
  
//     const isSignatureValid = await crypto.subtle.verify(
//       'ECDSA', key, signature, data
//     );
  
//     return isSignatureValid;
//   }


// // Verifying the signature
// //const isSignatureValid = await verifySignature(publicKey, message, signature);

// //console.log('Signature valid:', isSignatureValid);

