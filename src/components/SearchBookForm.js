import React, { useState, useEffect } from "react";
import { app } from "../firebase_setup/firebase.js";
import {
  getDatabase,
  ref,
  query,
  orderByChild,
  onValue,
  get,
  update,
  startAt,
  endAt,
} from "firebase/database";
import Form from "./Form";
import LayoutForm from "./LayoutForm";

function SearchBookForm({ isAdmin }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const [availableBooks, setAvailableBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [searchResults, setSearchResults] = useState(null);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const db = getDatabase(app);
    const booksRef = ref(db, "books");
    let booksQuery;
    let searchType;

    if (title && author) {
      // Use the title_author field to query for books with a specific title and author
      booksQuery = query(
        booksRef,
        orderByChild("title_author"),
        startAt(`${title}_${author}`),
        endAt(`${title}_${author}\uf8ff`)
      );
      searchType = "title and author";
    } else if (title) {
      // Use the title field only to query for books with a specific title
      booksQuery = query(
        booksRef,
        orderByChild("title"),
        startAt(title),
        endAt(title + "\uf8ff")
      );
      searchType = "title";
    } else if (author) {
      // Use the author field only to query for books by a specific author
      booksQuery = query(
        booksRef,
        orderByChild("author"),
        startAt(author),
        endAt(author + "\uf8ff")
      );
      searchType = "author";
    }

    if (booksQuery) {
      const snapshot = await get(booksQuery);
      const booksArray = [];
      snapshot.forEach((childSnapshot) => {
        booksArray.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });

      setSearchResults(booksArray);

      if (booksArray.length > 0) {
        let successMessage;
        switch (searchType) {
          case "title and author":
            successMessage = (
              <>
                Books found by the title <em>{title}</em> and the author{" "}
                <em>{author}</em>.
              </>
            );
            break;
          case "title":
            successMessage = (
              <>
                Books found that match the title <em>{title}</em>.
              </>
            );
            break;
          case "author":
            successMessage = (
              <>
                Books found that are written by <em>{author}</em>.
              </>
            );
            break;
          default:
            successMessage = "Books found!";
        }
        setSuccessMessage(successMessage);
        setErrorMessage("");
      } else {
        setErrorMessage(`No books found by ${searchType}.`);
        setSuccessMessage("");
      }
    }
  };

  const handleBorrowBook = async (bookId) => {
    const db = getDatabase(app);
    const bookRef = ref(db, `books/${bookId}`);
    await update(bookRef, { isBorrowed: true });
    setSuccessMessage("Book borrowed successfully!");
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard');
  };

  // reset searchResults when the active tab changes
  useEffect(() => {
    setSearchResults(null);
    setErrorMessage("");
    switch (activeTab) {
      case "Available":
        setSuccessMessage(
          <span>
            Showing all <b style={{ fontSize: "larger" }}>AVAILABLE</b> books
          </span>
        );
        break;
      case "Borrowed":
        setSuccessMessage(
          <span>
            Showing all books <b style={{ fontSize: "larger" }}>ON LOAN</b>
          </span>
        );
        break;
      default:
        setSuccessMessage("");
    }
  }, [activeTab]);

  useEffect(() => {
    const db = getDatabase(app);
    const booksRef = ref(db, "books");
    onValue(booksRef, (snapshot) => {
      const books = snapshot.val();
      setAvailableBooks(
        Object.entries(books)
          .filter(([id, book]) => !book.isBorrowed)
          .map(([id, book]) => ({ ...book, id }))
      );
      setBorrowedBooks(
        Object.entries(books)
          .filter(([id, book]) => book.isBorrowed)
          .map(([id, book]) => ({ ...book, id }))
      );
    });
  }, []);

  const filteredBooks = searchResults
    ? searchResults
    : activeTab === "Available"
      ? availableBooks
      : activeTab === "Borrowed"
        ? borrowedBooks
        : [];

  const Tabs = ({ activeTab, onTabChange }) => {
    const isTabActive = searchResults ? false : activeTab;
    const isInactive = !!searchResults;
    return (
      <div className="tabs">
        <div
          className={`tab ${isTabActive === "Available" ? "active" : ""} ${isInactive ? "inactive" : ""
            }`}
          onClick={() => onTabChange("Available")}
        >
          Available
        </div>
        <div
          className={`tab ${isTabActive === "Borrowed" ? "active" : ""} ${isInactive ? "inactive" : ""
            }`}
          onClick={() => onTabChange("Borrowed")}
        >
          Borrowed
        </div>
      </div>
    );
  };

  return (
    <LayoutForm
      successMessage={successMessage}
      errorMessage={errorMessage}
      bookListContent={
        <>
          {filteredBooks.map((book) => (
            <div className="book-card" key={book.id}>
              <h3>{book.title}</h3>
              <p>by {book.author}</p>
              <p>
                Book ID: {book.id}{' '}
                <button
                  className="copy-to-clipboard-button"
                  onClick={() => handleCopyToClipboard(book.id)}
                >
                  Copy to clipboard
                </button>
              </p>
              <p
                style={{
                  fontWeight: 'bold',
                  color: book.isBorrowed ? 'red' : 'green',
                }}
              >
                {book.isBorrowed ? 'Borrowed' : 'Available'}
              </p>
              {!book.isBorrowed && isAdmin && (
                <button className="borrow-button" onClick={() => handleBorrowBook(book.id)}>
                  Borrow Book
                </button>
              )}
            </div>
          ))}
        </>
      }
    >
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
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
        submitValue="Search"
      />
    </LayoutForm>
  );
}
export default SearchBookForm;
