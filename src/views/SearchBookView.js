import { useState, useEffect } from "react";
import { app } from "../firebase/firebase.js";
import {
  getDatabase,
  ref,
  query,
  orderByChild,
  onValue,
  get,
  update,
  child,
  increment,
  startAt,
  endAt,
  set,
} from "firebase/database";
import Form from "../components/Form.js";
import LayoutForm from "../components/LayoutForm.js";
import DetailedBookCard from "../components/BookCard/DetailedBookCard.js";

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

  const [showMore, setShowMore] = useState(false);

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

    setSuccessMessage("");
    setErrorMessage("");

    if (title) {
      // Use the title field only to query for books with a specific title
      booksQuery = query(
        booksRef,
        orderByChild("title"),
        startAt(title),
        // The \uf8ff character is a very high code point in the Unicode range.
        // By appending it to the end of the title, we are creating a range that includes all possible values that start with the title.
        endAt(title + "\uf8ff")
      );
    } else if (author || (firstName && lastName)) {
      const authorName = author || firstName + " " + lastName;

      booksQuery = query(
        booksRef,
        orderByChild("author"),
        startAt(authorName),
        endAt(authorName + "\uf8ff")
      );
    } else if (firstName) {
      booksQuery = query(
        booksRef,
        orderByChild("firstName"),
        startAt(firstName),
        endAt(firstName + "\uf8ff")
      );
    } else if (lastName) {
      booksQuery = query(
        booksRef,
        orderByChild("lastName"),
        startAt(lastName),
        endAt(lastName + "\uf8ff")
      );
    }

    if (booksQuery) {
      const snapshot = await get(booksQuery);
      let booksArray = [];
      snapshot.forEach((childSnapshot) => {
        booksArray.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });

      if (title) {
        if (author) {
          // filter client side based on author
          booksArray = booksArray.filter((book) =>
            book.author.includes(author)
          );
        } else if (firstName && lastName) {
          // filter client side based on first name and last name
          booksArray = booksArray.filter(
            (book) =>
              book.firstName.includes(firstName) &&
              book.lastName.includes(lastName)
          );
        } else if (firstName) {
          // filter client side based on first name
          booksArray = booksArray.filter((book) =>
            book.firstName.includes(firstName)
          );
        } else if (lastName) {
          // filter client side based on last name
          booksArray = booksArray.filter((book) =>
            book.lastName.includes(lastName)
          );
        }
      }

      setSearchResults(booksArray);

      //Success message for search showing type of search
      if (booksArray.length > 0) {
        const searchFields = [];
        if (title) searchFields.push(`title "${title}"`);
        if (author) searchFields.push(`author "${author}"`);
        if (firstName) searchFields.push(`first name "${firstName}"`);
        if (lastName) searchFields.push(`last name "${lastName}"`);

        const successMessage = `Books found by ${searchFields.join(" and ")}.`;
        setSuccessMessage(successMessage);
      } else {
        setErrorMessage("No books found.");
      }
    }
  };

  const handleBorrowBookAdmin = (book) => {
    const db = getDatabase(app);
    const booksRef = ref(db, "books");

    // Create a reference to the book entry using its id
    const bookRef = child(booksRef, book.id);

    // Update the isBorrowed status and borrowerEmail of the book in the database
    update(bookRef, {
      isBorrowed: true,
      borrowerEmail: "JTCA",
      borrowCount: increment(1),
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
    alert("Copied to clipboard");
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
          className={`tab ${isTabActive === "Available" ? "active" : ""} ${
            isInactive ? "inactive" : ""
          }`}
          onClick={() => onTabChange("Available")}
        >
          Available
        </div>
        <div
          className={`tab ${isTabActive === "Borrowed" ? "active" : ""} ${
            isInactive ? "inactive" : ""
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
            <DetailedBookCard
              isAdmin={isAdmin}
              book={book}
              showMore={showMore}
              setShowMore={setShowMore}
              handleCopyToClipboard={handleCopyToClipboard}
              onBorrowBookAdminClick={handleBorrowBookAdmin}
              onBorrowBookClick={onBorrowBook}
              onEditBookClick={onEditBook}
              setSuccessMessage={setSuccessMessage}
              setErrorMessage={setErrorMessage}
            />
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
