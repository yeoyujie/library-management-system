import React, { useState } from 'react';
import { getDatabase, ref, query, orderByChild, equalTo, get, remove } from 'firebase/database';
import { app } from '../firebase_setup/firebase.js';

function DeleteBookForm() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const db = getDatabase(app);
    const booksRef = ref(db, 'books');
    const booksQuery = query(booksRef, orderByChild('title'), equalTo(title));

    let bookDeleted = false;
    const snapshot = await get(booksQuery);
    snapshot.forEach((childSnapshot) => {
      if (childSnapshot.val().author === author) {
        remove(childSnapshot.ref);
        bookDeleted = true;
      }
    });

    if (bookDeleted) {
        setMessage('Book deleted successfully!');
    } else {
        setMessage('No book found with the specified title and author.');
    }
    
    //Clear the input fields after deletion
    setTitle('');
    setAuthor('');
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
        <input type="submit" value="Delete Book" />
      </form>
      <p>{message}</p>
    </div>
  );
}

export default DeleteBookForm;