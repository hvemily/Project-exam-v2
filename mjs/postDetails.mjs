import { API_URL } from './constants.mjs';
import { fetchWithRateLimit } from './fetch.mjs';
import { setupShareButton } from './share.mjs';

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    // adding place holders
    document.getElementById('post-author').textContent = 'Loading author...';
    document.getElementById('post-date').textContent = 'Loading date...';
    document.getElementById('post-title').textContent = 'Loading...';
    document.getElementById('post-body').textContent = 'Loading content...';
    document.getElementById('post-image').src = '/images/placeholder.png';
    document.getElementById('post-image').alt = 'Loading image...';

    if (postId) {
        const postUrl = `${API_URL}/blog/posts/emilyadmin/${postId}`;
        const postData = await fetchWithRateLimit(postUrl);

        if (postData && postData.data) {
            const post = postData.data;

            //collecting data and updating the DOM
            const postAuthor = post.author.name || 'Unknown author';
            const postUpdatedDate = post.updated ? new Date(post.updated).toLocaleDateString() : 'Unknown date';
            const postTitle = post.title || 'Untitled';
            const postBody = post.body || 'No content available';
            const postImage = post.media?.url || '/images/placeholder.png';
            const postImageAlt = post.media?.alt || 'No description available';

            // Oppdater DOM
            document.getElementById('post-author').innerText = `By: ${postAuthor}`;
            document.getElementById('post-date').innerText = `Last updated: ${postUpdatedDate}`;
            document.getElementById('post-title').innerText = postTitle;
            document.getElementById('post-body').innerText = postBody;
            document.getElementById('post-image').src = postImage;
            document.getElementById('post-image').alt = postImageAlt;
        } else {
            alert('Failed to load the post');
        }
    } else {
        alert('No post ID provided in URL');
    }
});

setupShareButton();
