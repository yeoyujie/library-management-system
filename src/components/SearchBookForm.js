import React, { useState } from "react";
import {
  getDatabase,
  ref,
  query,
  orderByChild,
  equalTo,
  get,
  update,
} from "firebase/database";
import { app } from "../firebase_setup/firebase.js";
import './FormStyles.css';

function SearchBookForm() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState("");

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const db = getDatabase(app);
    const booksRef = ref(db, "books");
    let booksQuery;

    if (title && author) {
      // Use the title_author field to query for books with a specific title and author
      booksQuery = query(
        booksRef,
        orderByChild("title_author"),
        equalTo(`${title}_${author}`)
      );
    } else if (title) {
      // Use the title field only to query for books with a specific title
      booksQuery = query(booksRef, orderByChild("title"), equalTo(title));
    } else if (author) {
      // Use the author field only to query for books by a specific author
      booksQuery = query(booksRef, orderByChild("author"), equalTo(author));
    }

    if (booksQuery) {
      const snapshot = await get(booksQuery);
      const booksArray = [];
      snapshot.forEach((childSnapshot) => {
        booksArray.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });

      setBooks(booksArray);
      if (booksArray.length > 0) {
        setMessage("Books found!");
      } else {
        setMessage("No books found.");
      }
    }
  };

  const handleBorrowBook = async (bookId) => {
    const db = getDatabase(app);
    const bookRef = ref(db, `books/${bookId}`);
    await update(bookRef, { isBorrowed: true });
    setMessage("Book borrowed successfully!");
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input type="text" value={title} onChange={handleTitleChange} />
        </label>
        <br />
        <label>
          Author:
          <input type="text" value={author} onChange={handleAuthorChange} />
        </label>
        <br />
        <input type="submit" value="Search" />
      </form>
      <p>{message}</p>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.title} by {book.author} (Book ID is:{" "}
            <span style={{ fontWeight: "bold", color: "#15cdfc" }}>
              {book.id}
            </span>
            )
            <span style={{ fontWeight: "bold", color: book.isBorrowed ? "red" : "green" }}>
              {book.isBorrowed ? " (Borrowed)" : " (Available)"}
            </span>
            {!book.isBorrowed && (
              <button onClick={() => handleBorrowBook(book.id)}>
                Borrow Book
              </button>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

export default SearchBookForm;
