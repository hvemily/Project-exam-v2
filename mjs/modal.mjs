export function showModal(message, options = {}) {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    
    const modalContent = `
        <div class="modal-content">
            <span class="close-btn">&times;</span>
            <p>${message}</p>
            ${options.confirmText ? `<button id="confirm-btn">${options.confirmText}</button>` : ''}
            ${options.cancelText ? `<button id="cancel-btn">${options.cancelText}</button>` : ''}
        </div>
    `;
    
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
    
    modal.style.display = 'block';

    // Lukk modalen med X-knappen
    const closeButton = modal.querySelector('.close-btn');
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
        if (typeof options.onClose === 'function') {
            options.onClose(); // Kjør onClose-funksjonen hvis den er definert
        }
    });

    // Håndter bekreftelsesknappen
    if (options.confirmText) {
        const confirmButton = document.getElementById('confirm-btn');
        confirmButton.addEventListener('click', () => {
            document.body.removeChild(modal);
            if (typeof options.onConfirm === 'function') {
                options.onConfirm(); // Kjør onConfirm-funksjonen hvis den er definert
            }
        });
    }

    // Håndter avbrytknappen
    if (options.cancelText) {
        const cancelButton = document.getElementById('cancel-btn');
        cancelButton.addEventListener('click', () => {
            document.body.removeChild(modal);
            if (typeof options.onCancel === 'function') {
                options.onCancel(); // Kjør onCancel-funksjonen hvis den er definert
            }
        });
    }

    // click outside modal to close
    window.onclick = function(event) {
        if (event.target === modal) {
            document.body.removeChild(modal);
            if (typeof options.onClose === 'function') {
                options.onClose(); 
            }
        }
    };
}



export function showErrorModal(message) {
    // create modal container
    const modal = document.createElement('div');
    modal.id = 'error-modal';
    modal.style.display = 'block'; // Vis modalen

    // modal content
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content'); 

    // create error message
    const modalMessage = document.createElement('p');
    modalMessage.textContent = message; 

    // Opprett lukkeknappen
    const closeButton = document.createElement('span');
    closeButton.textContent = '×'; // close btn
    closeButton.classList.add('close-btn'); 

    // clicking the close btn
    closeButton.onclick = function() {
        document.body.removeChild(modal);
    };

    // clicking outside
    window.onclick = function(event) {
        if (event.target === modal) {
            document.body.removeChild(modal);
        }
    };

    modalContent.appendChild(closeButton);
    modalContent.appendChild(modalMessage);
    modal.appendChild(modalContent);

    document.body.appendChild(modal);
}
