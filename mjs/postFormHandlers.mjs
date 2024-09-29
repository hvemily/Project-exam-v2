import { updatePost } from './postActions.mjs';
import { handleFetchPostById } from './fetch.mjs';
import { deletePost } from './postActions.mjs';
import { showModal } from './modal.mjs';

// Handle populate form with post data for editing
export async function populateEditForm(postId) {
    const post = await handleFetchPostById(postId);
    const username = localStorage.getItem('username');

    if (!post) {
        showModal('Post not found', {
            onClose: () => window.location.href = 'index.html'
        });
        return;
    }

    if (post.author.name !== username) {
        showModal('You do not have permission to edit this post.', {
            onClose: () => window.location.href = 'index.html'
        });
        return;
    }

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
        const title = document.getElementById('title').value;
        const body = document.getElementById('body').value;
        const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim());
        const mediaUrl = document.getElementById('media-url').value;
        const mediaAlt = document.getElementById('media-alt').value;

        const updatedPost = { title, body, tags, media: { url: mediaUrl, alt: mediaAlt } };

        try {
            await updatePost(postId, updatedPost);
            showModal('Post updated successfully!', {
                onClose: () => window.location.href = 'index.html'
            });
        } catch (error) {
            showModal('Failed to update post.');
        }
    });
}

// handle delete post
export function handleDeletePost(postId) {
    const deleteButton = document.getElementById('delete-button');
    if (!deleteButton) return;

    deleteButton.addEventListener('click', () => {
        showModal('Are you sure you want to delete this post?', {
            confirmText: 'Yes, delete',
            cancelText: 'Cancel',
            onConfirm: async () => {
                try {
                    await deletePost(postId);
                    showModal('Post deleted successfully', {
                        onClose: () => window.location.href = 'index.html'
                    });
                } catch (error) {
                    showModal('Failed to delete post.');
                }
            }
        });
    });
}

// handle cancel edit
export function handleCancelEdit() {
    const cancelButton = document.getElementById('cancel-button');
    cancelButton.addEventListener('click', () => {
        showModal('Are you sure you want to cancel?', {
            confirmText: 'Yes, cancel',
            cancelText: 'Keep editing',
            onConfirm: () => window.location.href = 'index.html'
        });
    });
}
