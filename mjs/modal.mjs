export function showModal(message) {
    const modal = document.getElementById('errorModal');
    const modalMessage = document.getElementById('modal-message');
    const closeButton = document.querySelector('.close-btn');

    if (!modal || !modalMessage) {
        console.error('Modal or modal-message not found in the DOM');
        return;
    }

    // Sett feilmeldingen
    modalMessage.textContent = message;

    // Vis modalen
    modal.style.display = 'block';

    // Lukk modalen når brukeren klikker på close-knappen
    closeButton.onclick = function() {
        modal.style.display = 'none';
    };

    // Lukk modalen når brukeren klikker utenfor modalinnholdet
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}




export function showErrorModal(message) {
    // Opprett modal container
    const modal = document.createElement('div');
    modal.id = 'error-modal';
    modal.style.display = 'block'; // Vis modalen

    // Opprett modal innhold
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content'); // Bruk eksisterende CSS-klasse for modal innhold

    // Opprett feilmeldingsteksten
    const modalMessage = document.createElement('p');
    modalMessage.textContent = message; // Sett feilmeldingen

    // Opprett lukkeknappen
    const closeButton = document.createElement('span');
    closeButton.textContent = '×'; // Lukkeknappens symbol
    closeButton.classList.add('close'); // Bruk eksisterende CSS-klasse for lukkeknappen

    // Når brukeren klikker på lukkeknappen
    closeButton.onclick = function() {
        document.body.removeChild(modal);
    };

    // Når brukeren klikker utenfor modalinnholdet
    window.onclick = function(event) {
        if (event.target === modal) {
            document.body.removeChild(modal);
        }
    };

    // Sett sammen modalens elementer
    modalContent.appendChild(closeButton);
    modalContent.appendChild(modalMessage);
    modal.appendChild(modalContent);

    // Legg til modalen i dokumentet
    document.body.appendChild(modal);
}
