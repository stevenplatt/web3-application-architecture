// source: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/generateKey

// document.addEventListener('DOMContentLoaded', generateKeyPair);

// async function generateKeyPair() {
//     const algorithm = {
//       name: 'RSA-OAEP',
//       modulusLength: 2048,
//       publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
//       hash: { name: 'SHA-256' },
//     };
  
//     const keys = await crypto.subtle.generateKey(algorithm, true, [
//       'encrypt',
//       'decrypt',
//     ]);
  
//     const publicKey = await crypto.subtle.exportKey('spki', keys.publicKey);
//     const privateKey = await crypto.subtle.exportKey('pkcs8', keys.privateKey);
  
//     // Convert keys to Base64 for display
//     const publicKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(publicKey)));
//     const privateKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(privateKey)));
  
//     document.getElementById('publicKey').innerHTML = publicKeyBase64 + '</pre>';
//     document.getElementById('privateKey').innerHTML = privateKeyBase64 + '</pre>';
//   }

document.addEventListener('DOMContentLoaded', generateKeyPair);

async function generateKeyPair() {
  const algorithm = {
    name: 'ECDSA',
    namedCurve: 'P-256',
  };

  const keys = await crypto.subtle.generateKey(algorithm, true, [
    'sign',
    'verify',
  ]);

  const publicKey = await crypto.subtle.exportKey('spki', keys.publicKey);
  const privateKey = await crypto.subtle.exportKey('pkcs8', keys.privateKey);

  // Convert keys to Base64 for display
  const publicKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(publicKey)));
  const privateKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(privateKey)));

  document.getElementById('publicKey').innerHTML = publicKeyBase64 + '</pre>';
  document.getElementById('privateKey').innerHTML = privateKeyBase64 + '</pre>';
}
