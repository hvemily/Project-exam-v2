import { createPost } from './postActions.mjs'; 
import { showModal } from './modal.mjs';

// Sjekk om brukeren er 'emilyadmin' og omdiriger hvis ikke
export function checkAdminAccess() {
    const username = localStorage.getItem('username');

    if (username !== 'emilyadmin') {
        showModal('You do not have permission to create posts.');
        window.location.href = '/post/index.html'; 
    }
}

// Function to handle submission of form, to create post
export function handleCreatePostForm() {
    document.getElementById('create-post-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = localStorage.getItem('username');

        if (username !== 'emilyadmin') {
            console.error('Only emilyadmin can create new posts.');
            showModal('You do not have permission to create posts.');
            return;
        }
        
        const title = document.getElementById('title').value;
        const body = document.getElementById('body').value;
        const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim());
        const mediaUrl = document.getElementById('media-url').value;
        const mediaAlt = document.getElementById('media-alt').value;

        const postData = { 
            title, 
            body, 
            tags, 
            media: { url: mediaUrl, alt: mediaAlt } 
        };

        try {
            const createdPost = await createPost(postData);

            if (createdPost) {
                console.log('Post created successfully!', createdPost);
                showModal('New post created!', createdPost, {
                    onClose: () => {
                        console.log('Modal closed, redirecting...');
                        window.location.href = 'post/index.html'; // Rediriger til post/index.html når modalen lukkes
                    }
                });
            }
        } catch (error) {
            console.error('Error creating post:', error);
            showModal('Failed to create post.');
        }
    });
}

