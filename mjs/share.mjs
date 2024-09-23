// share.mjs

// Funksjon for å hente post-ID fra URL-en (hvis den ikke allerede finnes i en annen fil)
export function getPostIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// Funksjon for å legge til en delingsfunksjonalitet til delingsknappen
export function setupShareButton() {
  const shareButton = document.getElementById('share-button');
  if (!shareButton) {
      console.error('Share button not found');
      return;
  }

  shareButton.addEventListener('click', () => {
      const postId = getPostIdFromUrl(); // Hent post-ID fra URL
      if (!postId) {
          alert('Post ID not found');
          return;
      }
      
      const shareableUrl = `${window.location.origin}/post.html?id=${postId}`; // Lag delbar URL
      navigator.clipboard.writeText(shareableUrl)
          .then(() => {
              alert('Post URL copied to clipboard!');
          })
          .catch(err => {
              console.error('Failed to copy URL: ', err);
          });
  });
}
