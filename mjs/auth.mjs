import { LOGIN_API_ENDPOINT, REGISTER_API_ENDPOINT } from './constants.mjs';
import { storeAccessToken } from './accessToken.mjs';
import { showModal } from './modal.mjs';

//handle register function
export function handleRegister() {
    document.getElementById('register-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name-input').value;
        const email = document.getElementById('email-input').value;
        const password = document.getElementById('password-input').value;

        if (!email.endsWith('@stud.noroff.no')) {
            showModal('Email must end with @stud.noroff.no.');
            return;
        }

        if (password.length < 8) {
            showModal('Password must be at least 8 characters long.');
            return;
        }

        fetch(REGISTER_API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        })
        .then(response => response.json()
        .then(data => {
            if (!response.ok) {
                const errorMessage = data.errors?.[0]?.message || 'Unknown error occurred';
                showModal(`Registration failed: ${errorMessage}`);
                return;
            }
            showModal('Registration successful! Redirecting to login page.', {
                onClose: () => window.location.href = './login.html'
            });
        }))
        .catch(error => showModal(`Registration failed: ${error.message}`));
    });
}

//handle login function
export function handleLogin() {
    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('email-input').value;
        const password = document.getElementById('password-input').value;

        fetch(LOGIN_API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    const errorMessage = err.message || 'Wrong password. Try again.';
                    throw new Error(errorMessage.includes('email') ? 'Email not found.' : 'Incorrect password.');
                });
            }
            return response.json();
        })
        .then(data => {
            if (data?.data?.accessToken && data.data.name) {
                storeAccessToken(data.data.accessToken);
                localStorage.setItem('username', data.data.name);
                window.location.href = '../post/index.html';
            } else {
                throw new Error('Invalid response from server.');
            }
        })
        .catch(error => showModal(`Login failed: ${error.message}`));
    });
}

//checking autorization
export function checkAuth() {
    const token = localStorage.getItem('authToken');
    const username = localStorage.getItem('username');
    
    if (!token || !username) {
        showModal('You are not logged in. Redirecting to login page.', {
            onClose: () => window.location.href = '/account/login.html'
        });
        return false;
    }
    return true;
}

export function setupCreatePostButton() {
    document.addEventListener('DOMContentLoaded', () => {
        const username = localStorage.getItem('username');
        const newPostButton = document.getElementById('new-post-button');

        if (!newPostButton) return;

        if (username === 'emilyadmin') {
            newPostButton.style.display = 'inline-block';
        }
    });
}
