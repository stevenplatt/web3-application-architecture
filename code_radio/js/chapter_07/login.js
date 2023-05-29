
// login configuration
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
    window.location.href = './index.html'; 
  }

function logout() {
    // Removing credentials from localStorage
    localStorage.removeItem('pubkey');
    localStorage.removeItem('privkey');
    
    console.log('Logout successful!');

    // Redirect the user to the login page
    window.location.href = './login.html'; 
  }
  