import React, { useState, useEffect } from "react";
import { animated, useTransition } from "react-spring";
import { app } from "../firebase_setup/firebase.js";
import { getDatabase, ref, onValue, update, get } from "firebase/database";
import Form from "./Form";
import LayoutForm from "./LayoutForm";

function BorrowBookForm({ isAdmin, book }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [titleOptions, setTitleOptions] = useState([]);
  const [availableBooks, setAvailableBooks] = useState([]);
  const [recentlyBorrowedBooks, setRecentlyBorrowedBooks] = useState([]);

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

      // Sort uniqueTitles lexicographically
      uniqueTitles.sort();

      setTitleOptions(uniqueTitles);
    });
  }, []);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);

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

  const borrowBook = (title, author) => {
    // Find the book with the matching title and author
    let borrowedBookId = null;
    const db = getDatabase(app);
    const booksRef = ref(db, "books");

    get(booksRef, "value").then((snapshot) => {
      const books = snapshot.val();
      for (let id in books) {
        if (
          books[id].title === title &&
          books[id].author === author &&
          !books[id].isBorrowed
        ) {
          // Update the isBorrowed property of the book in the Firebase Realtime Database
          const bookRef = ref(db, `books/${id}`);
          update(bookRef, { isBorrowed: true });

          // Set the borrowedBookId variable to the ID of the borrowed book
          borrowedBookId = id;

          // Add the borrowed book to the list of recently borrowed books
          setRecentlyBorrowedBooks((prevBooks) => [
            { id: borrowedBookId, title, author },
            ...prevBooks,
          ]);
          break;
        }
      }
    });
    return borrowedBookId;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

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

    const emailRegex =
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    // specify the doman you want the email to be from
    if (!email.endsWith('.sg')) {
      setErrorMessage("Please enter your xxx domain email.");
      return;
    }

    // Borrow the book based on its title and author
    const borrowedBookId = borrowBook(title, author);

    setSuccessMessage(
      <>
        Book borrowed successfully!
        <br />
        Title: <strong style={{ fontSize: "18px" }}>{title}</strong>
        <br />
        Author: <strong style={{ fontSize: "18px" }}>{author}</strong>
        <br />
        ID: {borrowedBookId}
      </>
    );
    setErrorMessage("");

    // Clears the input field
    setTitle("");
    setAuthor("");
  };

  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
    }
  }, [book]);

  // useTransition hook to animate the mounting and unmounting of book cards
  const transitions = useTransition(recentlyBorrowedBooks, {
    from: { opacity: 0, transform: "translate3d(-25%,0,0)" },
    enter: { opacity: 1, transform: "translate3d(0%,0,0)" },
    leave: { opacity: 0 },
  });

  return (
    <LayoutForm
      successMessage={successMessage}
      errorMessage={errorMessage}
      bookListContent={
        <>
          {transitions((style, book) => (
            <animated.div style={style} className="book-card" key={book.id}>
              <h3>{book.title}</h3>
              <p>by {book.author}</p>
              <p>Book ID: {book.id}</p>
            </animated.div>
          ))}
        </>
      }
    >
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
