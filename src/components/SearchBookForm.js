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
import "./FormStyles.css";

function SearchBookForm() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [books, setBooks] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
    let searchType;

    if (title && author) {
      // Use the title_author field to query for books with a specific title and author
      booksQuery = query(
        booksRef,
        orderByChild("title_author"),
        equalTo(`${title}_${author}`)
      );
      searchType = "title and author";
    } else if (title) {
      // Use the title field only to query for books with a specific title
      booksQuery = query(booksRef, orderByChild("title"), equalTo(title));
      searchType = "title";
    } else if (author) {
      // Use the author field only to query for books by a specific author
      booksQuery = query(booksRef, orderByChild("author"), equalTo(author));
      searchType = "author";
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
        let successMessage;
        switch (searchType) {
          case "title and author":
            successMessage = (
              <>
                Books found by the title <em>{title}</em> and the author{" "}
                <em>{author}</em>.
              </>
            );
            break;
          case "title":
            successMessage = (
              <>
                Books found that match the title <em>{title}</em>.
              </>
            );
            break;
          case "author":
            successMessage = (
              <>
                Books found that are written by <em>{author}</em>.
              </>
            );
            break;
          default:
            successMessage = "Books found!";
        }
        setSuccessMessage(successMessage);
        setErrorMessage("");
      } else {
        setErrorMessage(`No books found by ${searchType}.`);
        setSuccessMessage("");
      }
    }
  };

  const handleBorrowBook = async (bookId) => {
    const db = getDatabase(app);
    const bookRef = ref(db, `books/${bookId}`);
    await update(bookRef, { isBorrowed: true });
    setSuccessMessage("Book borrowed successfully!");
  };

  return (
    <>
      <div className="container">
        <div className="search-form">
          <form onSubmit={handleSubmit}>
            <label>
              Title:
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                autoFocus
              />
            </label>
            <br />
            <label>
              Author:
              <input type="text" value={author} onChange={handleAuthorChange} />
            </label>
            <br />
            <input type="submit" value="Search" />
          </form>
        </div>
        <div className="search-results">
          {successMessage && (
            <div className="success-message">{successMessage} </div>
          )}
          {errorMessage && <div className="error-message">{errorMessage} </div>}
          <div className="book-list-container">
            <div className="book-list">
              {books.map((book) => (
                <div className="book-card" key={book.id}>
                  <h3>{book.title}</h3>
                  <p>by {book.author}</p>
                  <p>Book ID: {book.id}</p>
                  <p
                    style={{
                      fontWeight: "bold",
                      color: book.isBorrowed ? "red" : "green",
                    }}
                  >
                    {book.isBorrowed ? "Borrowed" : "Available"}
                  </p>
                  {!book.isBorrowed && (
                    <button onClick={() => handleBorrowBook(book.id)}>
                      Borrow Book
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default SearchBookForm;
