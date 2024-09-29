import { createPost } from './postActions.mjs';
import { showModal } from './modal.mjs';

//checking if admin to have access to create post
export function checkAdminAccess() {
    const username = localStorage.getItem('username');
    if (username !== 'emilyadmin') {
        showModal('You do not have permission to create posts.', {
            onClose: () => window.location.href = '/post/index.html'
        });
    }
}

//create post
export function handleCreatePostForm() {
    document.getElementById('create-post-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = localStorage.getItem('username');
        if (username !== 'emilyadmin') {
            showModal('You do not have permission to create posts.');
            return;
        }
        
        const title = document.getElementById('title').value;
        const body = document.getElementById('body').value;
        const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim());
        const mediaUrl = document.getElementById('media-url').value;
        const mediaAlt = document.getElementById('media-alt').value;

        const postData = { title, body, tags, media: { url: mediaUrl, alt: mediaAlt } };

        try {
            const createdPost = await createPost(postData);
            if (createdPost) {
                showModal('New post created!', {
                    onClose: () => window.location.href = 'index.html'
                });
            }
        } catch (error) {
            showModal('Failed to create post.');
        }
    });
}
