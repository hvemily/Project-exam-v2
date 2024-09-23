// postActions.mjs
import { API_URL } from './constants.mjs';
import { fetchWithRateLimit } from './fetch.mjs';
import { getAccessToken } from './accessToken.mjs';

// Create post
// Create post
export async function createPost(postData) {
    try {
        const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
        const username = localStorage.getItem('username'); // Retrieve the logged-in user's username

        if (!token || !username) {
            alert('You are not logged in. Redirecting to login page.');
            window.location.href = '/account/login.html';
            return;
        }

        // Log for confirmation
        console.log('AuthToken:', token);
        console.log('Username:', username);

        // Use the dynamic username in the URL
        const url = `${API_URL}/blog/posts/${username}`;

        console.log('Creating post with data:', postData);

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
            console.log('Post created successfully:', responseData);

            alert('Post created successfully');
            
            // Redirect back to the post/index.html page after successful creation
            window.location.href = 'index.html'; 
            
            return responseData;
        } else {
            const error = await response.json();
            console.error('Failed to create post:', error);
            alert(`Failed to create post: ${error.message}`);
        }
    } catch (error) {
        console.error('Error creating post:', error);
        alert('Error creating post');
    }
}




// Delete post
export async function deletePost(postId) {
    const token = getAccessToken();
    console.log('Sending token:', token); // Sjekk at tokenet ikke er null eller undefined

    if (!token) {
        alert('You are not logged in. Redirecting to login page.');
        window.location.href = '/account/login.html';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/blog/posts/emilyadmin/${postId}`, {
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
            console.error('Failed to delete post:', error);
            alert(`Failed to delete post: ${error.message}`);
        }
    } catch (error) {
        console.error('Error deleting post:', error);
        alert('Error deleting post');
    }
}

// Update post
export async function updatePost(postId, updatedPost) {
    const token = getAccessToken(); // Hent tokenen fra localStorage
    const username = localStorage.getItem('username'); // Hent brukernavnet fra localStorage

    // Logg brukernavnet og tokenet for feilsøking
    console.log('Logged in user:', username);
    console.log('Authorization token:', token);

    if (!token || !username) {
        alert('You are not logged in. Redirecting to login page.');
        window.location.href = '/account/login.html';
        return;
    }

    const url = `${API_URL}/blog/posts/${username}/${postId}`;
    console.log('Updating post with URL:', url);

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`, // Sjekk at tokenet er korrekt
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPost)
    });

    if (!response.ok) {
        const errorDetails = await response.text();
        console.error(`Failed to update post: ${response.status}`, errorDetails);
        throw new Error(`Failed to update post: ${response.status}`);
    }

    return await response.json();
}


