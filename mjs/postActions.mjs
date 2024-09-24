import { API_URL } from './constants.mjs';
import { getAccessToken } from './accessToken.mjs';
import { performFetch } from './fetch.mjs';
import { checkAuth } from './auth.mjs';

// Funksjon for å opprette ny post
export async function createPost(postData) {
    if (!checkAuth()) return;

    const url = `${API_URL}/blog/posts/${localStorage.getItem('username')}`;
    const token = getAccessToken();

    return await performFetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    });
}

// Funksjon for å slette post
export async function deletePost(postId) {
    if (!checkAuth()) return;

    const url = `${API_URL}/blog/posts/emilyadmin/${postId}`;
    const token = getAccessToken();

    return await performFetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
}

// Funksjon for å oppdatere post
export async function updatePost(postId, updatedPost) {
    if (!checkAuth()) return;

    const url = `${API_URL}/blog/posts/${localStorage.getItem('username')}/${postId}`;
    const token = getAccessToken();

    return await performFetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPost)
    });
}
