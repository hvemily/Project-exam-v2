import { API_URL } from "./constants.mjs";
import { deletePost } from "./postActions.mjs";

// Function to get the auth token from localStorage
export function getAccessToken() {
    return localStorage.getItem('authToken');
}

// Fetch with rate limiting to avoid hitting API rate limits
export async function fetchWithRateLimit(url, options = {}, retries = 3) {
    const REQUEST_DELAY_MS = 1000; // 1 second delay
    const now = Date.now();

    if (fetchWithRateLimit.lastFetchTime && now - fetchWithRateLimit.lastFetchTime < REQUEST_DELAY_MS) {
        const delay = REQUEST_DELAY_MS - (now - fetchWithRateLimit.lastFetchTime);
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    fetchWithRateLimit.lastFetchTime = Date.now();

    try {
        const response = await fetch(url, options);
        if (response.status === 429) {
            if (retries > 0) {
                console.warn("Too many requests. Retrying...");
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
                return fetchWithRateLimit(url, options, retries - 1);
            } else {
                console.error("Too many requests. No more retries.");
                return null;
            }
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

// Function to fetch and display all posts
export async function handleFetchPosts() {
    const token = getAccessToken(); // Get auth token
    const username = localStorage.getItem('username'); // Get username

    if (!token || !username) {
        alert('You are not logged in. Redirecting to login page.');
        window.location.href = '/account/login.html';
        return;
    }

    // Fetch all posts from the API
    const url = `${API_URL}/blog/posts/emilyadmin`;
    console.log("Fetching posts with URL:", url);
    console.log("Using token:", token);

    // Include the token in the headers if required by the API
    const data = await fetchWithRateLimit(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    const postsList = document.getElementById('posts-list');

    if (!postsList) {
        console.warn('Element with id "posts-list" not found. Skipping post list rendering.');
        return;
    }

    if (data && data.data && data.data.length > 0) {
        postsList.innerHTML = '';
        data.data.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post-item');
            postElement.innerHTML = `
                <h3 class="blog-title">${post.title}</h3>
                <img src="${post.media.url}" alt="${post.media.alt}" class="blog-img">
                <p class="tags">Tags: ${post.tags.join(', ')}</p>
                <p class="author">By: ${post.author.name}</p>
            `;

            // Show edit and delete buttons only for the author's own posts
            if (post.author.name === username) {
                postElement.innerHTML += `
                    <button class="edit-button" data-post-id="${post.id}">Edit</button>
                    <button class="delete-button" data-post-id="${post.id}">Delete</button>
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
                await deletePost(postId);
                // Refresh posts after deletion
                handleFetchPosts();
            });
        });
    } else {
        console.error('Failed to fetch posts or no posts found.');
        alert('Failed to fetch posts');
    }
}

// Function to fetch and display posts on the landing page
export async function handleFetchPostsForLanding(targetDivId = 'landing-posts-list') {
    // Fetch all posts for the landing page
    const url = `${API_URL}/blog/posts/emilyadmin`;
    const data = await fetchWithRateLimit(url);

    const postsList = document.getElementById(targetDivId);
    if (!postsList) {
        console.warn(`Element with id "${targetDivId}" not found.`);
        return;
    }

    if (data && data.data && data.data.length > 0) {
        postsList.innerHTML = ''; // Clear existing posts

        data.data.forEach(post => {
            console.log("Post Media on Landing:", post.media);

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
    const url = `https://v2.api.noroff.dev/blog/posts/emilyadmin/${postId}`;
    console.log("Fetching post with URL:", url); // Logg URL-en for å sjekke om den er riktig
    const response = await fetchWithRateLimit(url);

    if (response && response.data) {
        const post = response.data;

        console.log("Post Data:", post); // Logg hele API-responsen for å se hva som blir returnert

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

