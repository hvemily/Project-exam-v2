// accessToken.mjs
export function storeAccessToken(token) {
  localStorage.setItem('authToken', token); // Sørg for at token lagres som 'authToken'
}


export function getAccessToken() {
  return localStorage.getItem('authToken'); // Dette skal returnere tokenet korrekt
}
