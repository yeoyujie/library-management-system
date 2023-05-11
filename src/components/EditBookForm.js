import React, { useState } from "react";
import Modal from "react-modal";
import { getDatabase, ref, get, update } from "firebase/database";
import { app } from "../firebase_setup/firebase.js";
import "./FormStyles.css";

Modal.setAppElement("#root");

function EditBookForm() {
  const [bookId, setBookId] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isBorrowed, setIsBorrowed] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleLookup = async () => {
    // Lookup book in the database
    const db = getDatabase(app);
    const bookRef = ref(db, `books/${bookId}`);
    const snapshot = await get(bookRef);
    if (snapshot.exists()) {
      setTitle(snapshot.val().title);
      setAuthor(snapshot.val().author);
      setIsBorrowed(snapshot.val().isBorrowed);
      setModalIsOpen(true);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Update book in the database
    const db = getDatabase(app);
    const bookRef = ref(db, `books/${bookId}`);
    await update(bookRef, { title, author, isBorrowed });
    alert("Book updated successfully!");
    setModalIsOpen(false);
  };

  const handleToggleIsBorrowed = async () => {
    // Toggle isBorrowed status in the database
    setIsBorrowed(!isBorrowed);
  };

  return (
    <>
      <label>
        Book ID:
        <input
          type="text"
          value={bookId}
          onChange={(event) => setBookId(event.target.value)}
        />
      </label>
      <div style={{ textAlign: "center" }}>
        <button onClick={handleLookup} type="submit">Find</button>
      </div>
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        <form onSubmit={handleSubmit}>
          <label>
            Title:
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>
          <br />
          <label>
            Author:
            <input
              type="text"
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
            />
          </label>
          <br />
          <span
            style={{ fontWeight: "bold", color: isBorrowed ? "red" : "green" }}
          >
            {isBorrowed ? " On Loan" : " Available"}
          </span>
          <label className="switch">
            <input
              type="checkbox"
              checked={isBorrowed}
              onChange={handleToggleIsBorrowed}
            />
            <span className="slider round"></span>
          </label>
          <br />
          <input type="submit" value="Submit" />
        </form>
        <button onClick={() => setModalIsOpen(false)}>Close</button>
      </Modal>
    </>
  );
}

export default EditBookForm;
