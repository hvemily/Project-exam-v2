import { updatePost } from './postActions.mjs';
import { handleFetchPostById } from './fetch.mjs';
import { deletePost } from './postActions.mjs';
import { showModal } from './modal.mjs';

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
        showModal('You do not have permission to edit this post.', {
            onClose: () => {
                window.location.href = 'index.html';
            }
        });
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
                console.log('Post created successfully:', createdPost);
                
                // Merk at vi sender onClose som den andre parameteren her
                showModal('New post created:', () => {
                    console.log('Modal closed, redirecting...');
                    window.location.href = 'post/index.html'; // Rediriger til post/index.html når modalen lukkes
                });
            }
        } catch (error) {
            console.error('Error creating post:', error);
            showModal('Failed to create post.');
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
        console.log('Delete button clicked');
        showModal('Are you sure you want to delete this post? This action cannot be undone.', {
            confirmText: 'yes, delete',
            cancelText: 'cancel',
            onConfirm: async () => {
                console.log('delete confirmed');
                try {
                    await deletePost(postId);
                    showModal('post deleted successfully', {
                        onClose: () => {
                            window.location.href = 'index.html';
                        }
                    });
                } catch (error) {
                    console.error('Error deleting post:', error);
                    showModal('Failed to delete post');
                }
            },
            onCancel: () => {
                console.log('delete canceled');
            }
        });
    });
}
    

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
            showModal('post updated successfully!', {
                onClose: () => {
                    window.location.href = 'index.html'; // Rediriger til index.html når modalen lukkes
                }
            });
        } catch (error) {
            console.error('Error updating post:', error);
            showModal('Failed to update post.');
        }
    });
}

// handle cancel edit
export function handleCancelEdit() {
    const cancelButton = document.getElementById('cancel-button');
    cancelButton.addEventListener('click', () => {
        console.log('Cancel button clicked');
        showModal('Are you sure you want to cancel? Changes will not be saved.', {
            confirmText: 'yes, cancel',
            cancelText: 'keep editing',
            onConfirm: () => {
                console.log('cancel confirmed');
                window.location.href = 'index.html';
            },
            onCancel: () => {
                console.log('Cancel edit action was canceled');
            }
        });
    });
}
