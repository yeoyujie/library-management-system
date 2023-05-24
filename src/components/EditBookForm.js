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
  const [slideDown, setSlideDown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handlebookIdChange = (event) => {
    setBookId(event.target.value);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value);
  };

  const handleEditClick = () => {
    setIsEditing(true);
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
      setTitle(snapshot.val().title);
      setAuthor(snapshot.val().author);
      setSuccessMessage("Books found");
      setErrorMessage("");
    } else {
      setErrorMessage("Book not found!");
      setSuccessMessage("");
    }
  };

  const handleEditSubmit = async () => {
    // Check if title or author are empty
    if (!title || !author) {
      setErrorMessage("Title and author cannot be empty!");
      setSuccessMessage("");
      return;
    }

    // Check if title or author have changed
    if (title === book.title && author === book.author) {
      setErrorMessage("No fields are changed!");
      setSuccessMessage("");
      return;
    }

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
      setSlideDown(true);
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
          <div
            className={`book-card ${slideDown ? "slide-down" : ""}`}
            key={book.id}
          >
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              disabled={!isEditing}
            />
            <p>by</p>
            <input
              type="text"
              value={author}
              onChange={handleAuthorChange}
              disabled={!isEditing}
            />
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
                {!isEditing ? (
                  <button onClick={handleEditClick}>Edit</button>
                ) : (
                  <button onClick={handleEditSubmit}>Save</button>
                )}
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
