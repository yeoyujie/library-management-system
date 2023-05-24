import React, { useState } from "react";
import { app } from "../firebase_setup/firebase.js";
import { getDatabase, ref, get, update } from "firebase/database";
import Form from "./Form";
import LayoutForm from "./LayoutForm";

function EditBookForm() {
  const [bookId, setBookId] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [book, setBook] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handlebookIdChange = (event) => {
    setBookId(event.target.value);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value);
  };

  const handleSubmit = async (event) => {
    // Lookup book in the database
    event.preventDefault();

    if (!bookId) {
      setErrorMessage("Please enter a book ID.");
      return;
    }
    const db = getDatabase(app);
    const bookRef = ref(db, `books/${bookId}`);
    const snapshot = await get(bookRef);
    if (snapshot.exists()) {
      setBook({
        id: bookId,
        title: snapshot.val().title,
        author: snapshot.val().author,
        isBorrowed: snapshot.val().isBorrowed,
      });
      setTitle(book.title);
      setAuthor(book.author);
      setSuccessMessage("Books found");
      setErrorMessage("");
    } else {
      setErrorMessage("Book not found!");
      setSuccessMessage("");
    }
  };

  const handleEditSubmit = async () => {
    // Update book data in the database
    try {
      const db = getDatabase();
      const bookRef = ref(db, `books/${book.id}`);
      await update(bookRef, {
        title: title,
        author: author,
      });
      setSuccessMessage("Book updated successfully!");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Failed to update book!");
      setSuccessMessage("");
    }
  };

  const handleToggleIsBorrowed = async (bookId) => {
    // Update the isBorrowed status of the book in the database
    const db = getDatabase();
    const bookRef = ref(db, `books/${bookId}`);
    const snapshot = await get(bookRef);
    if (snapshot.exists()) {
      const isBorrowed = snapshot.val().isBorrowed;
      update(bookRef, { isBorrowed: !isBorrowed });
      setBook((prevBook) => ({ ...prevBook, isBorrowed: !isBorrowed }));
    }
  };

  return (
    <LayoutForm
      successMessage={successMessage}
      errorMessage={errorMessage}
      bookListContent={
        book && (
          <div className="book-card" key={book.id}>
            <input type="text" value={title} onChange={handleTitleChange} />
            <p>by</p>
            <input type="text" value={author} onChange={handleAuthorChange} />
            <p>Book ID: {book.id}</p>
            <span
              style={{
                fontWeight: "bold",
                color: book.isBorrowed ? "red" : "green",
              }}
            >
              {book.isBorrowed ? " On Loan" : " Available"}
            </span>
            <div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={book.isBorrowed}
                  onChange={() => handleToggleIsBorrowed(book.id)}
                />
                <span className="slider round"></span>
              </label>
              <br />
              <div className="button-container">
                <button onClick={handleEditSubmit}>Edit</button>
              </div>
            </div>
          </div>
        )
      }
    >
      <Form
        handleSubmit={handleSubmit}
        inputs={[
          {
            label: "Book ID",
            value: bookId,
            onChange: handlebookIdChange,
          },
        ]}
        submitValue="Search"
      />
    </LayoutForm>
  );
}

export default EditBookForm;
