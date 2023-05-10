import React, { useState } from 'react';
import { getDatabase, ref, child, get, update } from 'firebase/database';
import { app } from '../firebase_setup/firebase.js';

function EditBookForm () {
  const [bookId, setBookId] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLookup = async () => {
    // Lookup book in the database
    const db = getDatabase(app);
    const bookRef = ref(db, `books/${bookId}`);
    const snapshot = await get(bookRef);
    if (snapshot.exists()) {
      setTitle(snapshot.val().title);
      setAuthor(snapshot.val().author);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Update book in the database
    const db = getDatabase(app);
    const bookRef = ref(db, `books/${bookId}`);
    const title_author = `${title}_${author}`;
    await update(bookRef, { title, author, title_author});
    setSuccessMessage('Book updated successfully!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Book ID:
        <input
          type="text"
          value={bookId}
          onChange={(event) => setBookId(event.target.value)}
        />
      </label>
      <button type="button" onClick={handleLookup}>
        Lookup
      </button>
      <br />
      <label>
        Title:
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </label>
      <br />
      <label>
        Author:
        <input
          type="text"
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
        />
      </label>
      <br />
      <input type="submit" value="Submit" />
      {successMessage && <p>{successMessage}</p>}
    </form>
  );
};

export default EditBookForm;