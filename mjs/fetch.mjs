import { API_URL } from "./constants.mjs";
import { getAccessToken } from './accessToken.mjs';
import { deletePost } from "./postActions.mjs";

// Centralized fetch function with retry and error handling
export async function performFetch(url, options = {}, retries = 3) {
    const REQUEST_DELAY_MS = 1000;
    const now = Date.now();

    if (performFetch.lastFetchTime && now - performFetch.lastFetchTime < REQUEST_DELAY_MS) {
        const delay = REQUEST_DELAY_MS - (now - performFetch.lastFetchTime);
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    performFetch.lastFetchTime = now;

    try {
        const response = await fetch(url, options);
        if (response.status === 429 && retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            return performFetch(url, options, retries - 1);
        }

        const isResponseEmpty = response.status === 204 || response.headers.get('content-length') === '0';
        if (isResponseEmpty) return null;

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Error: ${response.status} - ${error.message}`);
        }

        return await response.json();
    } catch (error) {
        showModal('Failed to fetch data.');
        return null;
    }
}

// Fetch all posts and display them
export async function handleFetchPosts() {
    const token = getAccessToken();
    const username = localStorage.getItem('username');
    if (!token || !username) {
        window.location.href = '/account/login.html';
        return;
    }

    const url = `${API_URL}/blog/posts/emilyadmin`;
    const data = await performFetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const postsList = document.getElementById('posts-list');
    if (data && data.data && data.data.length > 0) {
        postsList.innerHTML = '';
        data.data.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post-item');
            postElement.innerHTML = `
                <h3 class="blog-title">${post.title}</h3>
                <img src="${post.media.url}" alt="${post.media.alt}" class="blog-img">
                <p class="author">By: ${post.author.name}</p>
            `;

            if (post.author.name === username) {
                postElement.innerHTML += `
                    <div class="buttons">
                        <button class="edit-button" data-post-id="${post.id}">edit</button>
                        <button class="delete-button" data-post-id="${post.id}">delete</button>
                    </div>
                `;
            }

            postsList.appendChild(postElement);
        });

        document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', () => {
                const postId = button.getAttribute('data-post-id');
                window.location.href = `edit.html?id=${postId}`;
            });
        });

        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', async () => {
                const postId = button.getAttribute('data-post-id');
                showModal('Are you sure you want to delete this post?', {
                    confirmText: 'Yes, delete',
                    cancelText: 'Cancel',
                    onConfirm: async () => {
                        try {
                            await deletePost(postId);
                            handleFetchPosts();
                        } catch (error) {
                            showModal('Failed to delete post.');
                        }
                    }
                });
            });
        });
    } else {
        showModal('Failed to fetch posts.');
    }
}


// Function to fetch and display posts on the landing page
export async function handleFetchPostsForLanding(targetDivId = 'landing-posts-list') {
    // Fetch all posts for the landing page
    const url = `${API_URL}/blog/posts/emilyadmin`;
    const data = await performFetch(url);

    const postsList = document.getElementById(targetDivId);
    if (!postsList) {
        console.warn(`Element with id "${targetDivId}" not found.`);
        return;
    }

    if (data && data.data && data.data.length > 0) {
        postsList.innerHTML = ''; // Clear existing posts

        data.data.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post-item');
        
            // Format the updated date
            const updatedDate = new Date(post.updated).toLocaleDateString();
        
            // Create the post HTML
            postElement.innerHTML = `
                <a href="post.html?id=${post.id}" class="post-link">
                    <img src="${post.media.url}" alt="${post.media.alt}" class="blog-img">
                    <h3 class="blog-title">${post.title}</h3>
                    <p class="author">By: ${post.author.name}</p>
                    <p class="updated-date">Last updated: ${updatedDate}</p>
                </a>
            `;
            postsList.appendChild(postElement);
        });        
    } else {
        alert('Failed to fetch posts');
    }
}

// Function to fetch a specific post by ID
export async function handleFetchPostById(postId) {
    const url = `${API_URL}/blog/posts/emilyadmin/${postId}`;
    const response = await performFetch(url);

    if (response && response.data) {
        const post = response.data;


        // Hvis post er en tom array, logg en advarsel
        if (Array.isArray(post) && post.length === 0) {
            console.warn("No post found for this ID.");
            alert('No post found for this ID.');
            return null;
        }

        // Sjekk om det er en enkelt post
        if (typeof post === 'object' && !Array.isArray(post)) {
            return post; // Returner posten
        } else {
            console.error('Unexpected response format:', response);
            alert('Failed to fetch post');
            return null;
        }
    } else {
        console.error('Response data is missing or malformed:', response);
        alert('Failed to fetch post');
        return null;  // Returner null hvis ingen post ble funnet
    }
}


