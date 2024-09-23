import { updatePost } from './postActions.mjs';  // Importér updatePost én gang
import { handleFetchPostById } from './fetch.mjs';
import { deletePost } from './postActions.mjs'; // Importér deletePost-funksjonen

// Handle populate form with post data for editing
// Handle populate form with post data for editing
export async function populateEditForm(postId) {
    const post = await handleFetchPostById(postId);
    const username = localStorage.getItem('username'); // Brukernavnet til den innloggede brukeren

    if (!post) {
        console.error('Post not found');
        return;
    }

    // Sjekk om den innloggede brukeren er forfatteren
    if (post.author.name !== username) {
        alert('You do not have permission to edit this post.');
        window.location.href = 'index.html'; // Redirect til hovedsiden
        return;
    }

    // Fyll ut feltene hvis brukeren er forfatteren
    document.getElementById('title').value = post.title || '';
    document.getElementById('body').value = post.body || '';
    document.getElementById('tags').value = Array.isArray(post.tags) ? post.tags.join(', ') : '';
    document.getElementById('media-url').value = post.media?.url || '';
    document.getElementById('media-alt').value = post.media?.alt || '';

    console.log('Post successfully fetched and form populated:', post);
}


// Handle edit post form submission
export function handleEditPostForm(postId) {
    document.getElementById('edit-form').addEventListener('submit', async (event) => {
        event.preventDefault(); // Hindrer siden fra å oppdatere

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

        // Kall funksjonen for å oppdatere posten
        try {
            await updatePost(postId, updatedPost);
            alert('Post updated successfully!');
            window.location.href = 'index.html'; // Send brukeren tilbake til hovedsiden etter oppdatering
        } catch (error) {
            console.error('Failed to update post:', error);
            alert('Failed to update post');
        }
    });
}

// Handle delete post
export function handleDeletePost(postId) {
    const deleteButton = document.getElementById('delete-button'); // Finn knappen

    if (!deleteButton) {
        console.error('Delete button not found');
        return; // Avbryt hvis knappen ikke finnes
    }

    deleteButton.addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            try {
                await deletePost(postId);
                alert('Post deleted successfully');
                window.location.href = 'index.html'; // Tilbake til hovedsiden etter sletting
            } catch (error) {
                console.error('Failed to delete post:', error);
                alert('Failed to delete post');
            }
        }
    });
}


// Handle cancel edit
export function handleCancelEdit() {
    const cancelButton = document.getElementById('cancel-button'); // Bruk id for cancel-knappen
    cancelButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to cancel? Changes will not be saved.')) {
            window.location.href = 'index.html'; // Tilbake til hovedsiden
        }
    });
}


