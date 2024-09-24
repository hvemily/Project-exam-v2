import { updatePost } from './postActions.mjs';
import { handleFetchPostById } from './fetch.mjs';
import { deletePost } from './postActions.mjs';

// Handle populate form with post data for editing
export async function populateEditForm(postId) {
    const post = await handleFetchPostById(postId);
    const username = localStorage.getItem('username');

    if (!post) {
        console.error('Post not found');
        return;
    }

    // checking if logged in user is the author
    if (post.author.name !== username) {
        alert('You do not have permission to edit this post.');
        window.location.href = 'index.html'; 
        return;
    }

    // fill out field if user is the author
    document.getElementById('title').value = post.title || '';
    document.getElementById('body').value = post.body || '';
    document.getElementById('tags').value = Array.isArray(post.tags) ? post.tags.join(', ') : '';
    document.getElementById('media-url').value = post.media?.url || '';
    document.getElementById('media-alt').value = post.media?.alt || '';
}

// handle edit post form submission
export function handleEditPostForm(postId) {
    document.getElementById('edit-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        // Hent verdiene fra skjemaet
        const title = document.getElementById('title').value;
        const body = document.getElementById('body').value;
        const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim());
        const mediaUrl = document.getElementById('media-url').value;
        const mediaAlt = document.getElementById('media-alt').value;

        // Opprett et objekt med de oppdaterte verdiene
        const updatedPost = { 
            title, 
            body, 
            tags, 
            media: { url: mediaUrl, alt: mediaAlt }
        };

        // update the post
        try {
            await updatePost(postId, updatedPost);
            alert('Post updated successfully!');
            window.location.href = 'index.html';
        } catch (error) {
            alert('Failed to update post');
        }
    });
}

// handle delete post
export function handleDeletePost(postId) {
    const deleteButton = document.getElementById('delete-button');

    if (!deleteButton) {
        console.error('Delete button not found');
        return;
    }

    deleteButton.addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            try {
                await deletePost(postId);
                alert('Post deleted successfully');
                window.location.href = 'index.html';
            } catch (error) {
                alert('Failed to delete post');
            }
        }
    });
}

// handle cancel edit
export function handleCancelEdit() {
    const cancelButton = document.getElementById('cancel-button');
    cancelButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to cancel? Changes will not be saved.')) {
            window.location.href = 'index.html';
        }
    });
}
