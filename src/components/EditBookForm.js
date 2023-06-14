import { useState, useEffect, useRef } from "react";
import { app } from "../firebase_setup/firebase.js";
import { getDatabase, ref, get, update } from "firebase/database";
import Form from "./Form";
import LayoutForm from "./LayoutForm";

function EditBookForm({ isAdmin, selectedBook }) {
  const [book, setBook] = useState("");
  const [bookId, setBookId] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [borrowerEmail, setBorrowerEmail] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const titleRef = useRef(null);
  const authorRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const borrowerEmailRef = useRef(null);

  const handlebookIdChange = (event) => {
    setBookId(event.target.value);
  };

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

  const handleBorrowEmailChange = (event) => {
    setBorrowerEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    // Lookup book in the database
    event.preventDefault();

    if (!bookId) {
      setErrorMessage("Please enter a book ID.");
      return;
    }
    const db = getDatabase(app);
    const bookRef = ref(db, `books/${bookId}`);
    const snapshot = await get(bookRef);
    if (snapshot.exists()) {
      setBook({
        id: bookId,
        title: snapshot.val().title,
        author: snapshot.val().author,
        isBorrowed: snapshot.val().isBorrowed,
        borrowerEmail: snapshot.val().borrowerEmail,
        firstName: snapshot.val().firstName,
        lastName: snapshot.val().lastName,
      });
      setTitle(snapshot.val().title);
      setAuthor(snapshot.val().author);
      setBorrowerEmail(snapshot.val().borrowerEmail);
      setFirstName(snapshot.val().firstName);
      setLastName(snapshot.val().lastName);
      setSuccessMessage("Book found!");
      setErrorMessage("");
      setIsEditing(false);
    } else {
      setErrorMessage("Book not found!");
      setSuccessMessage("");
    }
  };

  const handleEditSubmit = async () => {
    // Check if title or author are empty
    if (!title || !author) {
      setErrorMessage("Title and author cannot be empty!");
      setSuccessMessage("");
      return;
    }

    // Update book data in the database
    try {
      const db = getDatabase();
      const bookRef = ref(db, `books/${book.id}`);

      const updatedFields = [];
      if (title !== book.title) updatedFields.push("title");
      if (author !== book.author) updatedFields.push("author");
      if (borrowerEmail !== book.borrowerEmail)
        updatedFields.push("borrowerEmail");
      if (firstName !== book.firstName) updatedFields.push("firstName");
      if (lastName !== book.lastName) updatedFields.push("lastName");

      if (!updatedFields.length) {
        setErrorMessage("No changes detected!");
        setSuccessMessage("");
        return;
      }

      await update(bookRef, {
        title: title,
        author: author,
        borrowerEmail: borrowerEmail,
        firstName: firstName,
        lastName: lastName,
      });

      setSuccessMessage(
        `Book updated successfully! Updated fields: ${updatedFields.join(", ")}`
      );
      setErrorMessage("");

      // Update book state variable with updated fields
      setBook((prevBook) => ({
        ...prevBook,
        title: title,
        author: author,
        borrowerEmail: borrowerEmail,
        firstName: firstName,
        lastName: lastName,
      }));
      setIsEditing(false);
    } catch (error) {
      setErrorMessage("Failed to update book!");
      setSuccessMessage("");
    }
  };

  const handleToggleIsBorrowed = async (bookId) => {
    // Update the isBorrowed status of the book in the database
    const db = getDatabase();
    const bookRef = ref(db, `books/${bookId}`);
    const snapshot = await get(bookRef);
    if (snapshot.exists()) {
      const isBorrowed = snapshot.val().isBorrowed;
      update(bookRef, { isBorrowed: !isBorrowed });
      setBook((prevBook) => ({ ...prevBook, isBorrowed: !isBorrowed }));
      setSuccessMessage(`Book updated successfully! The book is now ${!isBorrowed ? 'borrowed' : 'available'}.`);
    }
  };

  useEffect(() => {
    if (selectedBook) {
      setBookId(selectedBook.id);
    }
  }, [selectedBook]);

  const fields = [
    {
      label: "Title",
      value: title,
      onChange: handleTitleChange,
      ref: titleRef,
    },
    {
      label: "Author",
      value: author,
      onChange: handleAuthorChange,
      ref: authorRef,
    },
    {
      label: "First Name",
      value: firstName,
      onChange: handleFirstNameChange,
      ref: firstNameRef,
    },
    {
      label: "Last Name",
      value: lastName,
      onChange: handleLastNameChange,
      ref: lastNameRef,
    },
    {
      label: "Borrower Email",
      value: borrowerEmail,
      onChange: handleBorrowEmailChange,
      ref: borrowerEmailRef,
    },
  ];

  useEffect(() => {
    if (isEditing && focusedField && focusedField.current) {
      focusedField.current.focus();
    }
  }, [isEditing, focusedField]);


  return (
    isAdmin && (
      <LayoutForm
        successMessage={successMessage}
        errorMessage={errorMessage}
        bookListContent={
          book && (
            <div
              className="book-card"
              key={book.id}

            >
              {fields.map((field) => (
                <>
                  <label>{field.label}:</label>
                  {isEditing ? (
                    <input
                      type={field.label === "Borrower Email" ? "email" : "text"}
                      value={field.value}
                      onChange={field.onChange}
                      disabled={!isEditing}
                      placeholder={field.label}
                      ref={field.ref}
                    />
                  ) : (
                    <p
                      onClick={() => {
                        setIsEditing(true);
                        setFocusedField(field.ref);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {field.value}
                    </p>
                  )}
                </>
              ))}
              <p>Book ID: {book.id}</p>
              <span
                style={{
                  fontWeight: "bold",
                  color: book.isBorrowed ? "red" : "green",
                }}
              >
                {book.isBorrowed ? " On Loan" : " Available"}
              </span>
              <div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={book.isBorrowed}
                    onChange={() => handleToggleIsBorrowed(book.id)}
                  />
                  <span className="slider round"></span>
                </label>
                <br />
                <div className="button-container">
                  {isEditing && (
                    <button className="save-button" onClick={handleEditSubmit}>Save</button>
                  )}
                </div>
              </div>
            </div>
          )
        }
      >
        <Form
          handleSubmit={handleSubmit}
          inputs={[
            {
              label: "Book ID",
              value: bookId,
              onChange: handlebookIdChange,
              id: "bookId",
            },
          ]}
          submitValue="Search"
        />
      </LayoutForm>
    )
  );
}

export default EditBookForm;
