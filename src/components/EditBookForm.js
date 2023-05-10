import React, { useState } from 'react';
import Modal from 'react-modal';
import { getDatabase, ref, child, get, update } from 'firebase/database';
import { app } from '../firebase_setup/firebase.js';

Modal.setAppElement('#root');

function EditBookForm () {
  const [bookId, setBookId] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleLookup = async () => {
    // Lookup book in the database
    const db = getDatabase(app);
    const bookRef = ref(db, `books/${bookId}`);
    const snapshot = await get(bookRef);
    if (snapshot.exists()) {
      setTitle(snapshot.val().title);
      setAuthor(snapshot.val().author);
      setModalIsOpen(true);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Update book in the database
    const db = getDatabase(app);
    const bookRef = ref(db, `books/${bookId}`);
    await update(bookRef, { title, author });
    setSuccessMessage('Book updated successfully!');
    setModalIsOpen(false);
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
      <button onClick={handleLookup}>Lookup</button>
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
          <input type="submit" value="Submit" />
          {successMessage && <p>{successMessage}</p>}
        </form>
        <button onClick={() => setModalIsOpen(false)}>Close</button>
      </Modal>
    </>
  );
};

export default EditBookForm;