import React, { useState } from 'react';
import { getDatabase, ref, push, set } from 'firebase/database';
import { app } from '../firebase_setup/firebase.js';


function AddBookForm() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const db = getDatabase(app);
    console.log(title, author)
    push(ref(db, 'books'), { title, author });
    setTitle('');
    setAuthor('');
  };

  return (
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
  );
}

export default AddBookForm;