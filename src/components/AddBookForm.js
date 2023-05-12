import React, { useState } from "react";
import { getDatabase, ref, push } from "firebase/database";
import { app } from "../firebase_setup/firebase.js";
import Form from "./Form";
import LayoutForm from "./LayoutForm";

function AddBookForm() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [recentlyAddedBooks, setRecentlyAddedBooks] = useState([]);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const db = getDatabase(app);

    setSuccessMessage("");

    if (!title && !author) {
      setErrorMessage("Please enter both the title and the author.");
      return;
    } else if (!title) {
      setErrorMessage("Please enter the title.");
      return;
    } else if (!author) {
      setErrorMessage("Please enter the author.");
      return;
    }

    // Create a new field that combines the title and author values
    const title_author = `${title}_${author}`;

    // Set the isBorrowed status to false by default
    const isBorrowed = false;

    // Update the realtime database in Firebase
    const newBookRef = push(ref(db, "books"), {
      title,
      author,
      title_author,
      isBorrowed,
    });
    console.log(`New book added with ID: ${newBookRef.key}`);

    // Add the new book to the list of recently added books
    setRecentlyAddedBooks((prevBooks) => [
      ...prevBooks,
      { id: newBookRef.key, title, author },
    ]);
    setErrorMessage("");

    setSuccessMessage(
      <>
        Book added successfully!
        <br />
        Title: <strong style={{ fontSize: "18px" }}>{title}</strong>
        <br />
        Author: <strong style={{ fontSize: "18px" }}>{author}</strong>
        <br />
        ID: {newBookRef.key}
      </>
    );
    setErrorMessage("");

    // Clears the input field
    setTitle("");
    setAuthor("");
  };

  return (
    <LayoutForm
      successMessage={successMessage}
      errorMessage={errorMessage}
      bookListContent={
        <>
          {recentlyAddedBooks.map((book) => (
            <div className="book-card" key={book.id}>
              <h3>{book.title}</h3>
              <p>by {book.author}</p>
              <p>Book ID: {book.id}</p>
            </div>
          ))}
        </>
      }
    >
      <Form
        handleSubmit={handleSubmit}
        inputs={[
          {
            label: "Title",
            value: title,
            onChange: handleTitleChange,
          },
          {
            label: "Author",
            value: author,
            onChange: handleAuthorChange,
          },
        ]}
      />
    </LayoutForm>
  );
}

export default AddBookForm;
