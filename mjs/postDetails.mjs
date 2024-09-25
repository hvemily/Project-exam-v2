import { API_URL } from './constants.mjs';
import { performFetch } from './fetch.mjs';
import { setupShareButton } from './share.mjs';

export function updatePostDOM(post) {
    document.getElementById('post-author').innerText = `By: ${post.author.name || 'Unknown author'}`;
    document.getElementById('post-date').innerText = `Last updated: ${new Date(post.updated).toLocaleDateString() || 'Unknown date'}`;
    document.getElementById('post-title').innerText = post.title || 'Untitled';
    document.getElementById('post-body').innerText = post.body || 'No content available';
    document.getElementById('post-image').src = post.media?.url || '/images/placeholder.png';
    document.getElementById('post-image').alt = post.media?.alt || 'No description available';
}

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (postId) {
        const postUrl = `${API_URL}/blog/posts/emilyadmin/${postId}`;
        const postData = await performFetch(postUrl);

        if (postData?.data) {
            updatePostDOM(postData.data);
        } else {
            alert('Failed to load the post');
        }
    } else {
        alert('No post ID provided in URL');
    }
});

setupShareButton();

