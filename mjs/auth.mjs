import { LOGIN_API_ENDPOINT, REGISTER_API_ENDPOINT } from './constants.mjs';
import { storeAccessToken } from './accessToken.mjs'; // Importer storeAccessToken

// Funksjon for å håndtere innlogging
export function handleLogin() {
    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Forhindre standard form-handling

        const email = document.getElementById('email-input').value;
        const password = document.getElementById('password-input').value;

        // Send POST-forespørsel til API for innlogging
        fetch(LOGIN_API_ENDPOINT, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }) // Sender e-post og passord som JSON
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(`Login failed: ${err.message}`); // Log feilmeldingen fra API-et
                });
            }
            return response.json(); // Hvis responsen er OK, parse JSON-data
        })
        .then(data => {
            // Sjekk om dataen inneholder nødvendige felter
            if (data && data.data && data.data.accessToken && data.data.name) {
                console.log('Received token from API:', data.data.accessToken);
                console.log('Received username from API:', data.data.name);

                // Lagre token og brukernavn i localStorage
                storeAccessToken(data.data.accessToken);
                localStorage.setItem('username', data.data.name);

                // Omdiriger til hovedsiden etter vellykket innlogging
                window.location.href = '../post/index.html';
            } else {
                throw new Error('Invalid response from server');
            }
        })
        .catch(error => {
            alert(error.message); // Vis feilmelding til brukeren
            console.error('Login error:', error); // Logg feilen for utvikling/formål
        });
    });
}

// Funksjon for å håndtere registrering
export function handleRegister() {
    document.getElementById('register-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Forhindre standard form-handling

        const name = document.getElementById('name-input').value;
        const email = document.getElementById('email-input').value;
        const password = document.getElementById('password-input').value;

        // Valider passordlengde før vi sender forespørselen til API-et
        if (password.length < 8) {
            alert('Password must be at least 8 characters long.'); // Vis beskjed hvis passordet er for kort
            return; // Stopp videre utføring
        }

        // Send POST-forespørsel til API for registrering
        fetch(REGISTER_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password }) // Sender navn, e-post og passord som JSON
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(`Registration failed: ${err.message || 'Unknown error'}`); // Gi meningsfull feilbeskjed
                });
            }
            return response.json(); // Parse JSON-data hvis responsen er OK
        })
        .then(data => {
            alert('Registration successful! Redirecting to login page.');
            window.location.href = './login.html'; // Omdiriger til innloggingssiden etter registrering
        })
        .catch(error => {
            alert(`Registration failed: ${error.message}`); // Vis feilmelding til brukeren
            console.error('Registration error:', error); // Logg feilen for utvikling/formål
        });
    });
}


// Funksjon for å sjekke om brukeren er innlogget
export function checkAuth() {
    const token = localStorage.getItem('authToken'); // Hent token fra localStorage
    if (!token) {
        alert('You are not logged in. Redirecting to login page.');
        window.location.href = '/account/login.html'; // Omdiriger til innloggingssiden hvis token ikke er funnet
    }
}
