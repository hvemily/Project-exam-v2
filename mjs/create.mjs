import { createPost } from './postActions.mjs'; 

//function to handle submission of form, to create post
export function handleCreatePostForm() {
    document.getElementById('create-post-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        
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
