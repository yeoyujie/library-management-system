import { useState, useEffect } from "react";
import { app } from "../firebase_setup/firebase.js";
import {
  getDatabase,
  ref,
  query,
  orderByChild,
  onValue,
  get,
  update,
  child,
  startAt,
  endAt,
} from "firebase/database";
import Form from "./Form";
import LayoutForm from "./LayoutForm";
import { DeleteBookButton } from "./DeleteBookButton.js";

function SearchBookForm({ isAdmin, onBorrowBook, onEditBook }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const db = getDatabase(app);
    const booksRef = ref(db, "books");
    let booksQuery;
    let searchType;

    if ((title && author) || (firstName && lastName && title)) {
      // Use the title_author field to query for books with a specific title and author

      const authorName = author || (firstName + " " + lastName);

      booksQuery = query(
        booksRef,
        orderByChild("title_author"),
        startAt(`${title}_${authorName}`),
        endAt(`${title}_${authorName}\uf8ff`)
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
    } else if (author || (firstName && lastName)) {

      const authorName = author || (firstName + " " + lastName);

      booksQuery = query(
        booksRef,
        orderByChild("author"),
        startAt(authorName),
        endAt(authorName + "\uf8ff")
      );
      searchType = "author";
    } else if (firstName) {

      booksQuery = query(
        booksRef,
        orderByChild("firstName"),
        startAt(firstName),
        endAt(firstName + "\uf8ff")
      );
      searchType = "First Name";
    } else if (lastName) {
      // Use the lastName field only to query for books
      booksQuery = query(
        booksRef,
        orderByChild("lastName"),
        startAt(lastName),
        endAt(lastName + "\uf8ff")
      );
      searchType = "Last Name";
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


      //Success message for search showing type of search
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

  const handleBorrowBook = (book) => {
    const db = getDatabase(app);
    const booksRef = ref(db, "books");

    // Create a reference to the book entry using its id
    const bookRef = child(booksRef, book.id);

    // Update the isBorrowed status and borrowerEmail of the book in the database
    update(bookRef, {
      isBorrowed: true,
      borrowerEmail: "JTCA",
    });

    setSuccessMessage("Book borrowed by JTCA successfully!");
    setErrorMessage("");
  };

  const handleReturnBook = (book) => {
    const db = getDatabase(app);
    const booksRef = ref(db, "books");

    // Create a reference to the book entry using its id
    const bookRef = child(booksRef, book.id);

    // Update the isBorrowed status and borrowerEmail of the book in the database
    update(bookRef, {
      isBorrowed: false,
      borrowerEmail: "",
    });

    setSuccessMessage("Book returned successfully!");
    setErrorMessage("");
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
              <h2>{book.title}</h2>
              <h3>by {book.author}</h3>
              <p>First Name: {book.firstName}</p>
              <p>Last Name: {book.lastName}</p>
              <p>Number of times borrowed: {book.borrowCount}</p>
              {book.isBorrowed && <p>Borrowed by: {book.borrowerEmail}</p>}
              <p>
                Book ID: {book.id}
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
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {book.isBorrowed ? isAdmin && <button
                  className="borrow-button"
                  onClick={() => {
                    handleReturnBook(book);
                  }}
                >
                  Return Book
                </button> : (
                  <button
                    className="borrow-button"
                    onClick={() => {
                      isAdmin ? handleBorrowBook(book) : onBorrowBook(book);
                    }}
                  >
                    Borrow Book
                  </button>
                )}
                {isAdmin && <button
                  className="edit-button"
                  onClick={() => {
                    onEditBook(book);
                  }}
                >
                  Edit Book
                </button>}
                {isAdmin && (
                  <DeleteBookButton
                    book={book}
                    onSuccess={(message) => setSuccessMessage(message)}
                    onError={(message) => setErrorMessage(message)}
                  />
                )}
              </div>
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
            id: "title",
          },
          {
            label: "Author",
            value: author,
            onChange: handleAuthorChange,
            disabled: firstName || lastName,
            id: "author",
          },
          {
            label: "First Name",
            value: firstName,
            onChange: handleFirstNameChange,
            disabled: author,
            id: "firstName",
          },
          {
            label: "Last Name",
            value: lastName,
            onChange: handleLastNameChange,
            disabled: author,
            id: "lastName",
          },
        ]}
        submitValue="Search"
      />
    </LayoutForm>
  );
}
export default SearchBookForm;
