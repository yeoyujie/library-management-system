import React, { useState } from 'react';
import { getDatabase, ref, update, get } from 'firebase/database';
import { app } from '../firebase_setup/firebase.js';

function EditBookForm() {
  const [bookId, setBookId] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');

  const handleLoad = async (event) => {
    event.preventDefault();
    const db = getDatabase(app);
    const bookRef = ref(db, `books/${bookId}`);
    const snapshot = await get(bookRef);
    if (snapshot.exists()) {
      setTitle(snapshot.val().title);
      setAuthor(snapshot.val().author);
      setMessage('Book loaded successfully!');
    } else {
      setMessage('Book not found.');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const db = getDatabase(app);

    // Create a new field that combines the title and author values
    const title_author = `${title}_${author}`;

    // Update the book data in the Firebase Realtime Database
    update(ref(db, `books/${bookId}`), { title, author, title_author });

    // Clears the input fields
    setTitle('');
    setAuthor('');
    setMessage('Book updated successfully!');
  };

  return (
    <div>
      <form onSubmit={handleLoad}>
        <label>
          Book ID: 
          <input
            type="text"
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
          />
        </label>
        <br />
        <input type="submit" value="Load Book" />
      </form>
      <br />
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
        <input type="submit" value="Update Book" />
      </form>
      <p>{message}</p>
    </div>
  );
}

export default EditBookForm;