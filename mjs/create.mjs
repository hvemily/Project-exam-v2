import { createPost } from './postActions.mjs'; 

// Sjekk om brukeren er 'emilyadmin' og omdiriger hvis ikke
export function checkAdminAccess() {
    const username = localStorage.getItem('username');

    if (username !== 'emilyadmin') {
        alert('You do not have permission to create posts.');
        window.location.href = '/post/index.html'; 
    }
}

// Function to handle submission of form, to create post
export function handleCreatePostForm() {
    document.getElementById('create-post-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        // Hent det innloggede brukernavnet
        const username = localStorage.getItem('username');

        // Sjekk om brukeren er 'emilyadmin'
        if (username !== 'emilyadmin') {
            console.error('Only emilyadmin can create new posts.');
            alert('You do not have permission to create posts.'); // Optional: Vis en melding til brukeren
            return;
        }
        
        // values for form
        const title = document.getElementById('title').value;
        const body = document.getElementById('body').value;
        const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim());
        const mediaUrl = document.getElementById('media-url').value;
        const mediaAlt = document.getElementById('media-alt').value;

        // create post data object
        const postData = { 
            title, 
            body, 
            tags, 
            media: { url: mediaUrl, alt: mediaAlt } 
        };

        // create post by calling createPost-function
        const createdPost = await createPost(postData);

        // Hvis posten ble opprettet vellykket
        if (createdPost) {
            console.log('New post created:', createdPost);
        }
    });
}
