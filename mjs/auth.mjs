import { LOGIN_API_ENDPOINT, REGISTER_API_ENDPOINT } from './constants.mjs';
import { storeAccessToken } from './accessToken.mjs'; 

//handling login
export function handleLogin() {
    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault(); 

        const email = document.getElementById('email-input').value;
        const password = document.getElementById('password-input').value;

        // Send POST-forespørsel til API for innlogging
        fetch(LOGIN_API_ENDPOINT, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }) 
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(`Login failed: ${err.message}`);
                });
            }
            return response.json(); 
        })
        .then(data => {
            // does the response contain neccessary data?
            if (data?.data?.accessToken && data.data.name) {
                //save token and username in localStorage
                storeAccessToken(data.data.accessToken);
                localStorage.setItem('username', data.data.name);

                //redirecting to the main post/index after successfull login
                window.location.href = '../post/index.html';
            } else {
                throw new Error('Invalid response from server');
            }
        })
        .catch(error => {
            alert(error.message); // show error to the viewer
        });
    });
}

// function to handle registration
export function handleRegister() {
    document.getElementById('register-form').addEventListener('submit', function(event) {
        event.preventDefault(); 

        const name = document.getElementById('name-input').value;
        const email = document.getElementById('email-input').value;
        const password = document.getElementById('password-input').value;

        // Valider at passordet er langt nok før vi sender forespørselen til API-et
        if (password.length < 8) {
            alert('Password must be at least 8 characters long.');
            return; 
        }

        // send post-req to API for registration
        fetch(REGISTER_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(`Registration failed: ${err.message || 'Unknown error'}`);
                });
            }
            return response.json(); 
        })
        .then(() => {
            alert('Registration successful! Redirecting to login page.');
            window.location.href = './login.html'; 
            //redirecting to loginpage after registration
        })
        .catch(error => {
            alert(`Registration failed: ${error.message}`); 
        });
    });
}

// function to check if the user is logged in or not
export function checkAuth() {
    const token = localStorage.getItem('authToken'); 
    if (!token) {
        alert('You are not logged in. Redirecting to login page.');
        window.location.href = '/account/login.html'; 
    }
}
