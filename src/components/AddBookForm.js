import React, { useState } from 'react';
import { getDatabase, ref, push, set } from 'firebase/database';
import { app } from '../firebase_setup/firebase.js';


function AddBookForm() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');


  const handleSubmit = (event) => {
    event.preventDefault();
    const db = getDatabase(app);

    if (!title || !author) {
      setMessage('Please enter both a title and an author.');
      return;
    }

    // Create a new field that combines the title and author values
    const title_author = `${title}_${author}`;

    // Set the isBorrowed status to false by default
    const isBorrowed = false;

    // Update the realtime database in Firebase
    const newBookRef = push(ref(db, 'books'), { title, author, title_author, isBorrowed });
    console.log(`New book added with ID: ${newBookRef.key}`);

    // Clears the input field
    setTitle('');
    setAuthor('');
    setMessage('Book added successfully!');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Title: 
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <br />
        <label>
          Author:
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </label>
        <br />
        <input type="submit" value="Add Book" />
      </form>
      <p>{message}</p>
    </div>
  );
}

export default AddBookForm;