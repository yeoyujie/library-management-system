# Library Management System

This is a simple library management system built with React and Firebase.

## Features

- Add books to the library database
- Edit book information
- Search for books by ID

## Installation

1. Clone this repository
2. Install dependencies with `npm install`
3. Create a Firebase project and add your Firebase configuration to the `firebase_setup/firebase.js` file
4. Run the app with `npm start`

## Usage

### Add a Book

1. Enter the book's title and author in the "Add Book" form
2. Click the "Submit" button to add the book to the database

### Edit a Book

1. Enter the book's ID in the "Edit Book" form
2. Click the "Lookup" button to search for the book in the database
3. If the book is found, a modal window will open with the book's title and author pre-filled in the form fields
4. Edit the book's title and/or author as needed
5. Click the "Submit" button to update the book's information in the database

## License

MIT