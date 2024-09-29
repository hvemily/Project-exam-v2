// accessToken.mjs
//storing token
export function storeAccessToken(token) {
  localStorage.setItem('authToken', token); 
}

//accessing token
export function getAccessToken() {
  return localStorage.getItem('authToken'); 
}
