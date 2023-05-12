import React, { useState } from "react";
import { getDatabase, ref, push } from "firebase/database";
import { app } from "../firebase_setup/firebase.js";
import Form from "./Form";

function AddBookForm() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

    // Display a success message
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
    <div>
      {successMessage && (
        <div className="success-message">
          {successMessage}{" "}
          <button onClick={() => setSuccessMessage("")}>x</button>
        </div>
      )}
      {errorMessage && (
        <div className="error-message">
          {errorMessage} <button onClick={() => setErrorMessage("")}>x</button>
        </div>
      )}
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
    </div>
  );
}

export default AddBookForm;
