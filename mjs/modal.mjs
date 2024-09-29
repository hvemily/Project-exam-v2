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

    const closeButton = modal.querySelector('.close-btn');
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
        if (typeof options.onClose === 'function') options.onClose();
    });

    if (options.confirmText) {
        const confirmButton = document.getElementById('confirm-btn');
        confirmButton.addEventListener('click', () => {
            document.body.removeChild(modal);
            if (typeof options.onConfirm === 'function') options.onConfirm();
        });
    }

    if (options.cancelText) {
        const cancelButton = document.getElementById('cancel-btn');
        cancelButton.addEventListener('click', () => {
            document.body.removeChild(modal);
            if (typeof options.onCancel === 'function') options.onCancel();
        });
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            document.body.removeChild(modal);
            if (typeof options.onClose === 'function') options.onClose();
        }
    };
}
