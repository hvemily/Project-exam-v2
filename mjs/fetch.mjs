import { API_URL } from "./constants.mjs";
import { getAccessToken } from './accessToken.mjs';
import { deletePost } from "./postActions.mjs";
import { showModal } from "./modal.mjs";

// centralized fetch function with retry and error handling.
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

// fetch all posts and display 
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
        postsList.innerHTML = ''; // clear existing posts.

        data.data.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post-item');
        
            // format updated date.
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

// fetch specific post by id.
export async function handleFetchPostById(postId) {
    const url = `${API_URL}/blog/posts/emilyadmin/${postId}`;
    const response = await performFetch(url);

    if (response && response.data) {
        const post = response.data;

        // if post is empty array, show modal.
        if (Array.isArray(post) && post.length === 0) {
            showModal('No post found for this ID.', {
                onClose: () => window.location.href = '/post/index.html' 
            });
            return null;
        }

        // checking if it's a single post object.
        if (typeof post === 'object' && !Array.isArray(post)) {
            return post; // return post.
        } else {
            showModal('Failed to fetch post: Unexpected response format.', {
                onClose: () => window.location.href = '/post/index.html'
            });
            return null;
        }
    } else {
        showModal('Failed to fetch post: Data is missing or malformed.', {
            onClose: () => window.location.href = '/post/index.html'
        });
        return null;  // return if no post is found.
    }
}


