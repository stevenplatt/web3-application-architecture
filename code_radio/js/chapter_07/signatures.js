// Function to generate an ECDSA key
async function generateECDSAKey() {
    try {
      const keyPair = await crypto.subtle.generateKey(
        {
          name: 'ECDSA',
          namedCurve: 'P-256', // Change the curve if desired
        },
        true,
        ['sign', 'verify']
      );
  
      return keyPair;
    } catch (error) {
      console.error('Key generation failed:', error);
      throw error;
    }
  }
  
// Function to sign a message using the ECDSA key
async function signMessage(message, keyPair) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(message);
      const signature = await crypto.subtle.sign(
        {
          name: 'ECDSA',
          hash: { name: 'SHA-256' }, // Change the hash algorithm if desired
        },
        keyPair.privateKey,
        data
      );
  
      return signature;
    } catch (error) {
      console.error('Signing failed:', error);
      throw error;
    }
  }
  
// Function to verify the signature of a message using the ECDSA key
async function verifySignature(message, signature, keyPair) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(message);
      const isVerified = await crypto.subtle.verify(
        {
          name: 'ECDSA',
          hash: { name: 'SHA-256' }, // Change the hash algorithm if desired
        },
        keyPair.publicKey,
        signature,
        data
      );
  
      return isVerified;
    } catch (error) {
      console.error('Signature verification failed:', error);
      throw error;
    }
  }
  
// Example usage
async function signatureTest() {
    // Generate the ECDSA key
    const keyPair = await generateECDSAKey();
    console.log('Key pair:', keyPair);
  
    // Sign a message using the key
    const message = 'Hello, World!';
    const signature = await signMessage(message, keyPair);
    console.log('Signature:', signature);
  
    // Verify the signature
    const isVerified = await verifySignature(message, signature, keyPair);
    console.log('Signature verified:', isVerified);
  }
  
signatureTest();
  