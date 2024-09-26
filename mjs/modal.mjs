export function showErrorModal(message) {
  const modal = document.getElementById('error-modal');
  const modalMessage = document.getElementById('modal-message');
  
  modalMessage.innerText = message; // Sett feilmeldingen i modalen
  modal.style.display = 'block'; // Vis modalen
  
  const closeButton = document.querySelector('.close');
  closeButton.onclick = function() {
      modal.style.display = 'none';
  };

  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = 'none';
      }
  };
}
