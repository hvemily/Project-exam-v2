export function storeAccessToken(token) {
  localStorage.setItem('authToken', token);
}

export function getAccessToken() {
  return localStorage.getItem('authToken');
}
