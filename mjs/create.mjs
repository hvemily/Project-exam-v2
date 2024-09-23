import { createPost } from './postActions.mjs'; // Importer createPost-funksjonen


// Valider URL direkte i denne filen
function isValidURL(url) {
    try {
        new URL(url); // Vil kaste en feil hvis URL-en er ugyldig
        return true;
    } catch (_) {
        return false;
    }
}

// Handle create post form submission
export function handleCreatePostForm() {

document.getElementById('create-post-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    // Retrieve form values
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

    // Call the createPost function to create the post
    const createdPost = await createPost(postData);

    // Check if the post was created successfully
    if (createdPost) {
        // Optional: Do something with the created post if needed
        console.log('New post created:', createdPost);
        
        // Since we handle the redirection in `createPost`, nothing else is needed here
    }
});
}