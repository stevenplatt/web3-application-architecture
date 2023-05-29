// source: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/generateKey

async function generateKeyPair() {
    const algorithm = {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: { name: 'SHA-256' },
    };
  
    const keys = await crypto.subtle.generateKey(algorithm, true, [
      'encrypt',
      'decrypt',
    ]);
  
    const publicKey = await crypto.subtle.exportKey('spki', keys.publicKey);
    const privateKey = await crypto.subtle.exportKey('pkcs8', keys.privateKey);
  
    // Convert keys to Base64 for display
    const publicKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(publicKey)));
    const privateKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(privateKey)));
  
    // Load keygen.html page
    window.location.href = '../keygen.html';
  
    // Wait for the page to load before accessing elements
    window.addEventListener('DOMContentLoaded', () => {
      document.getElementById('publicKey').innerHTML = publicKeyBase64 + '</pre>';
      document.getElementById('privateKey').innerHTML = privateKeyBase64 + '</pre>';
    });
  }  

// handle login button press
function handleLogin(event) {
    // Prevent the form from submitting
    event.preventDefault(); 
  
    var publicKey = document.getElementById('pubkey').value;
    var privateKey = document.getElementById('privkey').value;
    
    login(publicKey, privateKey);
  }

function login(publicKey, privateKey) {
    // Saving user credentials to localStorage
    localStorage.setItem('pubkey', publicKey);
    localStorage.setItem('privkey', privateKey);
    
    console.log('Login successful!');

    // Redirect the user to index.html
    window.location.href = '../index.html'; 
  }

function logout() {
    // Removing credentials from localStorage
    localStorage.removeItem('pubkey');
    localStorage.removeItem('privkey');
    
    console.log('Logout successful!');

    // Redirect the user to the login page
    window.location.href = '../login.html'; 
  }
  