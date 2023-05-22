import React, { useState, useEffect } from "react";
import { getDatabase, ref, push, onValue } from "firebase/database";
import { app } from "../firebase_setup/firebase.js";
import Form from "./Form";
import LayoutForm from "./LayoutForm";
import { useTransition } from "react-spring";

function BorrowBookForm() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [titleOptions, setTitleOptions] = useState([]);
  const [availableBooks, setAvailableBooks] = useState([]);
  const [recentlyAddedBooks, setRecentlyAddedBooks] = useState([]);

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

      // Remove duplicate book titles from the title input field options
      const uniqueTitles = [
        ...new Set(availableBooks.map((book) => book.title)),
      ];
      setTitleOptions(uniqueTitles);
    });
  }, []);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);

    // Auto-complete author field if there is only one matching book
    const matchingBooks = availableBooks.filter(
      (book) => book.title === event.target.value
    );
    setAuthor(matchingBooks[0].author);
  };

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
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
    } else if (!email) {
      setErrorMessage("Please enter your email.");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
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
      email,
    });
    console.log(`Book borrowed. ID: ${newBookRef.key}`);

    // Add the new book to the list of recently added books
    setRecentlyAddedBooks((prevBooks) => [
      { id: newBookRef.key, title, author },
      ...prevBooks,
    ]);

    setSuccessMessage(
      <>
        Book borrowed successfully!
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

  // useTransition hook to animate the mounting and unmounting of book cards
  const transitions = useTransition(recentlyAddedBooks, {
    from: { opacity: 0, transform: "translate3d(-25%,0,0)" },
    enter: { opacity: 1, transform: "translate3d(0%,0,0)" },
    leave: { opacity: 0 },
  });

  return (
    <LayoutForm successMessage={successMessage} errorMessage={errorMessage}>
      <Form
        handleSubmit={handleSubmit}
        inputs={[
          {
            label: "Title",
            type: "select",
            options: titleOptions,
            value: title,
            onChange: handleTitleChange,
          },
          {
            label: "Author",
            type:
              availableBooks.filter((book) => book.title === title).length > 1
                ? "select"
                : "text",
            options: availableBooks
              .filter((book) => book.title === title)
              .map((book) => book.author),
            value: author,
            onChange: handleAuthorChange,
          },
          {
            label: "Email",
            type: "email",
            value: email,
            onChange: handleEmailChange,
          },
        ]}
        submitValue="Borrow"
      />
    </LayoutForm>
  );
}

export default BorrowBookForm;
