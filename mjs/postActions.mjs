import { API_URL } from './constants.mjs';
import { getAccessToken } from './accessToken.mjs';

// function to create new post
export async function createPost(postData) {
    const token = localStorage.getItem('authToken');
    const username = localStorage.getItem('username');

    if (!token || !username) {
        alert('You are not logged in. Redirecting to login page.');
        window.location.href = '/account/login.html';
        return;
    }

    const url = `${API_URL}/blog/posts/${username}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        });

        if (response.ok) {
            const responseData = await response.json();
            alert('Post created successfully');
            window.location.href = 'index.html';
            return responseData;
        } else {
            const error = await response.json();
            alert(`Failed to create post: ${error.message}`);
        }
    } catch (error) {
        alert('Error creating post');
    }
}

// function to delete post
export async function deletePost(postId) {
    const token = getAccessToken();

    if (!token) {
        alert('You are not logged in. Redirecting to login page.');
        window.location.href = '/account/login.html';
        return;
    }

    const url = `${API_URL}/blog/posts/emilyadmin/${postId}`;

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert('Post deleted successfully');
        } else {
            const error = await response.json();
            alert(`Failed to delete post: ${error.message}`);
        }
    } catch (error) {
        alert('Error deleting post');
    }
}

// function to update post
export async function updatePost(postId, updatedPost) {
    const token = getAccessToken();
    const username = localStorage.getItem('username');

    if (!token || !username) {
        alert('You are not logged in. Redirecting to login page.');
        window.location.href = '/account/login.html';
        return;
    }

    const url = `${API_URL}/blog/posts/${username}/${postId}`;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedPost)
        });

        if (!response.ok) {
            const errorDetails = await response.text();
            throw new Error(`Failed to update post: ${response.status} - ${errorDetails}`);
        }

        return await response.json();
    } catch (error) {
        alert('Error updating post');
    }
}
