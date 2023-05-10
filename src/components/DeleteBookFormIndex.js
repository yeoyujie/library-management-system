import React, { useState } from 'react';
import { getDatabase, ref, remove } from 'firebase/database';
import { app } from '../firebase_setup/firebase.js';

function DeleteBookForm() {
  const [bookId, setBookId] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const db = getDatabase(app);
    remove(ref(db, `books/${bookId}`));
    setBookId('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Book ID: 
        <input
          type="text"
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
        />
      </label>
      <br />
      <input type="submit" value="Delete Book" />
    </form>
  );
}

export default DeleteBookForm;