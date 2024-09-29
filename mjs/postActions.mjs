import { API_URL } from './constants.mjs';
import { getAccessToken } from './accessToken.mjs';
import { performFetch } from './fetch.mjs';
import { checkAuth } from './auth.mjs';

export async function createPost(postData) {
    if (!checkAuth()) return;

    const username = localStorage.getItem('username');
    const url = `${API_URL}/blog/posts/${username}`;
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

export async function updatePost(postId, updatedPost) {
    if (!checkAuth()) return;

    const url = `${API_URL}/blog/posts/${localStorage.getItem('username')}/${postId}`;
    const token = getAccessToken();

    return await performFetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedPost)
    });
}
