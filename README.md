#HotView Labs Blog Application

## Overview
This project is a front-end interface for a blog application, developed as part of the FED1 Project Exam. The goal is to demonstrate skills in planning, design, development, and deployment using HTML, CSS, and JavaScript while interacting with an existing API for managing blog posts.


* To access the owner/admin features, log in using the following credentials: Please use the word document provided in the delivery file on teams.




## Features
* Responsive Design: Responsive layout to ensure the application works on devices of different screen sizes.

* Blog Post Management: Owners can create, edit, and delete their blog posts. Users can view posts and navigate through the blog feed.

* Interactive Carousel: A carousel displaying the latest blog posts on the blog feed page.

* User Authentication: Owners can log in and manage their posts, while users can view the blog feed and individual posts.

* API Integration: The application interacts with a blogging API to fetch, create, update, and delete posts.


## Pages

* Blog Feed Page (/index.html)
Displays the latest blog posts in an interactive carousel and a responsive grid view.


* Blog Post Page (/post/index.html)
Displays the content of a specific blog post, including title, author, date, and media.

* Blog Post Edit Page (/post/edit.html)
Allows the logged-in owner to edit or delete a specific blog post.

* Login Page (/account/login.html)
A form that lets the blog owner log in using email and password.

* Register Page (/account/register.html)
A form for new users to register by providing their name, email, and password.

## API Integration
The project interacts with the following API endpoints:

* GET /blog/posts/<name>: Fetch all posts by a specific user.
* GET /blog/posts/<name>/<id>: Fetch a single post by its ID.
* PUT /blog/posts/<name>/<id>: Update a specific post.
* DELETE /blog/posts/<name>/<id>: Delete a specific post.
* POST /auth/register: Register a new user.
* POST /auth/login: Log in an existing user.
* The API expects a valid token for authenticated requests (i.e., for updating and deleting posts).

## User Stories
As a user:
- I can view a carousel with the latest blog posts and a list of the 12 most recent posts in a responsive grid.
- I can click on posts in the carousel or grid to read the full post.

## As the blog owner:
- I can log in and manage my blog posts.
- I can edit or delete my posts.
- I can register a new account.
- User Authentication

## Design and Wireframes
The wireframes and style guide for this project were created using Figma. You can view the design assets through the delivery in Teams.

## Project Management
The planning and task management for this project were handled using GitHub Projects. You can view the project board here: [GitHub Project Board](https://github.com/users/hvemily/projects/4)

## Known Issues
No Frameworks Used: The project does not use any CSS or JS frameworks due to project restrictions.
Error Handling: All error handling is done through modals instead of the console.

## License
This project is licensed under Noroff and is part of the curriculum for the Front-End Development program.

