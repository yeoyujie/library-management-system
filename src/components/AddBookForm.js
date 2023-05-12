import React, { useState } from "react";
import { getDatabase, ref, push } from "firebase/database";
import { app } from "../firebase_setup/firebase.js";

function AddBookForm() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
        Title:{" "}
        <strong style={{ fontSize: "18px" }}>
          {title}
        </strong>
        <br />
        Author:{" "}
        <strong style={{ fontSize: "18px" }}>
          {author}
        </strong>
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
    </div>
  );
}

export default AddBookForm;
