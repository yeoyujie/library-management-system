import React, { useState } from 'react';
import { getDatabase, ref, query, orderByChild, equalTo, get } from 'firebase/database';
import { app } from '../firebase_setup/firebase.js';

function SearchBookForm() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const db = getDatabase(app);
    const booksRef = ref(db, 'books');
    let booksQuery;
    
    if (title && author) {
      // Use the title_author field to query for books with a specific title and author
      booksQuery = query(booksRef,
        orderByChild('title_author'),
        equalTo(`${title}_${author}`)
      );
    } else if (title) {
        // Use the title field only to query for books with a specific title
      booksQuery = query(booksRef,
        orderByChild('title'),
        equalTo(title)
      );
    } else if (author) {
        // Use the author field only to query for books by a specific author
      booksQuery = query(booksRef,
        orderByChild('author'),
        equalTo(author)
      );
    }

    if (booksQuery) {
      const snapshot = await get(booksQuery);
      const booksArray = [];
      snapshot.forEach((childSnapshot) => {
        booksArray.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });

      setBooks(booksArray);
      if (booksArray.length > 0) {
        setMessage('Books found!');
      } else {
        setMessage('No books found.');
      }
    }
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
        <input type="submit" value="Search Books" />
      </form>
      <p>{message}</p>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.title} by {book.author} (ID: {book.id})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchBookForm;