import { LOGIN_API_ENDPOINT, REGISTER_API_ENDPOINT } from './constants.mjs';
import { storeAccessToken } from './accessToken.mjs'; 
import { showModal } from './modal.mjs';

// handle registration
export function handleRegister() {
    document.getElementById('register-form').addEventListener('submit', function(event) {
        event.preventDefault(); 

        const name = document.getElementById('name-input').value;
        const email = document.getElementById('email-input').value;
        const password = document.getElementById('password-input').value;

        // Validere e-postformat
        if (!email.endsWith('@stud.noroff.no')) {
            showModal('Email must end with @stud.noroff.no.');
            return;
        }

        // Validere passordlengde
        if (password.length < 8) {
            showModal('Password must be at least 8 characters long.');
            return; 
        }

        // Send POST-forespørsel til API for registrering
        fetch('https://v2.api.noroff.dev/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        })
        .then(response => response.json()
        .then(data => {
            if (!response.ok) {

                const errorMessage = data.errors && data.errors.length > 0 
                    ? data.errors[0].message 
                    : 'Unknown error occurred';
                    
                showModal(`Registration failed: ${errorMessage}`);
                return;
            }

            showModal('Registration successful! Redirecting to login page.');
            setTimeout(() => {
                window.location.href = './login.html';
            }, 2000);
        }))
        .catch(error => {
            showModal(`Registration failed: ${error.message}`);
        });
    });
}






// handle login function
export function handleLogin() {
    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault(); 

        const email = document.getElementById('email-input').value;
        const password = document.getElementById('password-input').value;

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
                    const errorMessage = err.message || 'Wrong password. Try Again.';
                    
                    if (errorMessage.includes('email')) {
                        throw new Error('Email not found.');
                    } else if (errorMessage.includes('password')) {
                        throw new Error('Incorrect password.');
                    } else {
                        throw new Error(`Login failed: ${errorMessage}`);
                    }
                });
            }
            return response.json(); 
        })
        .then(data => {
            if (data?.data?.accessToken && data.data.name) {
                storeAccessToken(data.data.accessToken);
                localStorage.setItem('username', data.data.name);

                //redirecting to the main post/index after successful login
                window.location.href = '../post/index.html';
            } else {
                throw new Error('Invalid response from server.');
            }
        })
        .catch(error => {
            showModal(`Login failed: ${error.message}`); 
        });
    });
}




// function to check if the user is logged in or not
export function checkAuth() {
    const token = localStorage.getItem('authToken');
    const username = localStorage.getItem('username');
    
    if (!token || !username) {
        showModal('You are not logged in. Redirecting to login page.');
        window.location.href = '/account/login.html';
        return false;
    }
    return true;
}

export function setupCreatePostButton() {
    document.addEventListener('DOMContentLoaded', () => {
        // getting username from local storage
        const username = localStorage.getItem('username');

        const newPostButton = document.getElementById('new-post-button');

        if (!newPostButton) {
            return;
        }

        // Vis knappen kun hvis brukeren er emilyadmin
        if (username === 'emilyadmin') {
            newPostButton.style.display = 'inline-block'; // Vis knappen for emilyadmin som inline-block
        }
    });
}



