import { useState, useEffect } from "react";
import { animated, useTransition } from "react-spring";
import { app } from "../firebase/firebase.js";
import {
  getDatabase,
  ref,
  onValue,
  update,
  get,
  increment,
} from "firebase/database";
import Form from "../components/Form.js";
import LayoutForm from "../components/LayoutForm.js";
import BookCard from "../components/BookCard/BookCard.js";

function BorrowBookForm({ isAdmin, selectedBook }) {
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

      // Remove duplicate selectedBook titles from the title input field options
      const uniqueTitles = [
        ...new Set(availableBooks.map((selectedBook) => selectedBook.title)),
      ];

      // Sort uniqueTitles lexicographically
      uniqueTitles.sort();

      setTitleOptions(uniqueTitles);
    });
  }, []);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);

    const matchingBooks = availableBooks.filter(
      (selectedBook) => selectedBook.title === event.target.value
    );

    setAuthor(matchingBooks[0].author);
  };

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const borrowBook = (title, author, email) => {
    return new Promise((resolve, reject) => {
      // Find the selectedBook with the matching title and author
      let borrowedBookId = null;
      const db = getDatabase(app);
      const booksRef = ref(db, "books");

      get(booksRef, "value")
        .then((snapshot) => {
          const books = snapshot.val();
          for (let id in books) {
            if (
              books[id].title === title &&
              books[id].author === author &&
              !books[id].isBorrowed
            ) {
              // Update the isBorrowed property of the selectedBook in the Firebase Realtime Database
              const bookRef = ref(db, `books/${id}`);
              update(bookRef, {
                isBorrowed: true,
                borrowCount: increment(1),
                borrowerEmail: email,
              })
                .then(() => {
                  // Set the borrowedBookId variable to the ID of the borrowed selectedBook
                  borrowedBookId = id;

                  // Add the borrowed selectedBook to the list of recently borrowed books
                  setRecentlyBorrowedBooks((prevBooks) => [
                    { id: borrowedBookId, title, author },
                    ...prevBooks,
                  ]);

                  // Resolve the Promise with the ID of the borrowed book
                  resolve(borrowedBookId);
                })
                .catch((error) => {
                  // Reject the Promise with an error message if the update fails
                  reject(`Failed to update book: ${error.message}`);
                });
              break;
            }
          }

          // Wait for all update operations to complete before checking if a book was borrowed
          Promise.allSettled(
            Object.values(books).map((book) =>
              update(ref(db, `books/${book.id}`), {
                isBorrowed: book.isBorrowed,
              })
            )
          ).then(() => {
            // Reject the Promise with an error message if no matching book is found
            if (!borrowedBookId) {
              reject("No matching book found");
            }
          });
        })
        .catch((error) => {
          // Reject the Promise with an error message if the get operation fails
          reject(`Failed to get books: ${error.message}`);
        });
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

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

    // specify the domain you want the email to be from
    if (!email.endsWith(".sg")) {
      setErrorMessage("Please enter your xxx domain email.");
      return;
    }

    // Borrow the selected book based on its title and author
    borrowBook(title, author, email)
      .then((borrowedBookId) => {
        setSuccessMessage(
          <>
            Book borrowed successfully!
            <br />
            Title: <strong style={{ fontSize: "18px" }}>{title}</strong>
            <br />
            Author: <strong style={{ fontSize: "18px" }}>{author}</strong>
            <br />
            Borrowed by: <strong style={{ fontSize: "18px" }}>{email}</strong>
            <br />
            ID: {borrowedBookId}
          </>
        );
      })
      .catch((error) => {
        setErrorMessage(error);
      });

    // Clears the input field
    setTitle("");
    setAuthor("");
  };

  useEffect(() => {
    if (selectedBook) {
      setTitle(selectedBook.title);
      setAuthor(selectedBook.author);
    }
  }, [selectedBook]);

  // useTransition hook to animate the mounting and unmounting of selectedBook cards
  const transitions = useTransition(recentlyBorrowedBooks, {
    from: { opacity: 0, transform: "translate3d(-25%,0,0)" },
    enter: { opacity: 1, transform: "translate3d(0%,0,0)" },
  });

  return (
    <LayoutForm
      successMessage={successMessage}
      errorMessage={errorMessage}
      bookListContent={
        <>
          {transitions((style, book) => (
            <animated.div style={style}>
              <BookCard book={book} />
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
            id: "title",
          },
          {
            label: "Author",
            type:
              availableBooks.filter(
                (selectedBook) => selectedBook.title === title
              ).length > 1
                ? "select"
                : "text",
            options: availableBooks
              .filter((selectedBook) => selectedBook.title === title)
              .map((selectedBook) => selectedBook.author),
            value: author,
            onChange: handleAuthorChange,
            disabled:
              availableBooks.filter(
                (selectedBook) => selectedBook.title === title
              ).length === 1,
            id: "author",
          },
          {
            label: "Email",
            type: "email",
            value: email,
            onChange: handleEmailChange,
            id: "email",
          },
        ]}
        submitValue="Borrow"
      />
    </LayoutForm>
  );
}

export default BorrowBookForm;
