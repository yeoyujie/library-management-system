import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { app } from "../firebase_setup/firebase.js";
import Form from "./Form";
import LayoutForm from "./LayoutForm";

function BorrowBookForm() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [availableBooks, setAvailableBooks] = useState([]);

  useEffect(() => {
    // Fetch available books from Firebase Realtime Database
    const db = getDatabase(app);
    const booksRef = ref(db, "books");
    onValue(booksRef, (snapshot) => {
      const books = snapshot.val();
      const availableBooks = [];
      for (let id in books) {
        if (!books[id].isBorrowed) {
          availableBooks.push({
            id,
            title: books[id].title,
            author: books[id].author,
          });
        }
      }
      setAvailableBooks(availableBooks);
    });
  }, []);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);

    // Auto-complete author field if there is only one matching book
    const matchingBooks = availableBooks.filter(
      (book) => book.title === event.target.value
    );
    if (matchingBooks.length === 1) {
      setAuthor(matchingBooks[0].author);
    } else {
      setAuthor("");
    }
  };

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // TODO: Implement borrowing logic here

    setSuccessMessage("Book borrowed successfully!");
    setErrorMessage("");
  };

  return (
    <LayoutForm successMessage={successMessage} errorMessage={errorMessage}>
      <Form
        handleSubmit={handleSubmit}
        inputs={[
          {
            label: "Title",
            type: "select",
            options: availableBooks.map((book) => book.title),
            value: title,
            onChange: handleTitleChange,
          },
          {
            label: "Author",
            type: availableBooks.filter((book) => book.title === title).length > 1 ? "select" : "text",
            options: availableBooks.filter((book) => book.title === title).map((book) => book.author),
            value: author,
            onChange: handleAuthorChange,
          },
        ]}
        submitValue="Borrow"
      />
    </LayoutForm>
  );
}

export default BorrowBookForm;
