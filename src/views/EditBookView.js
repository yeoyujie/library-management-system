import { useState, useEffect, useRef } from "react";
import { app } from "../firebase/firebase.js";
import { getDatabase, ref, get, update } from "firebase/database";
import Form from "../components/Form.js";
import LayoutForm from "../components/LayoutForm.js";
import EditableBookCard from "../components/BookCard/EditableBookCard.js";

function EditBookForm({ isAdmin, selectedBook }) {
  const [book, setBook] = useState("");
  const [bookId, setBookId] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [borrowCount, setBorrowCount] = useState(0);
  const [borrowerEmail, setBorrowerEmail] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const titleRef = useRef(null);
  const authorRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const borrowCountRef = useRef(null);
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

  const handleBorrowCountChange = (event) => {
    setBorrowCount(event.target.value);
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
        borrowCount: snapshot.val().borrowCount,
      });
      setTitle(snapshot.val().title);
      setAuthor(snapshot.val().author);
      setBorrowerEmail(snapshot.val().borrowerEmail);
      setFirstName(snapshot.val().firstName);
      setLastName(snapshot.val().lastName);
      setBorrowCount(snapshot.val().borrowCount);
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
    if (!title) {
      setErrorMessage("Title cannot be empty!");
      setSuccessMessage("");
      return;
    }

    // Check if both firstName and lastName are empty
    if (!((firstName && lastName) || author)) {
      setErrorMessage(
        "Either first name and last name OR author must be entered!"
      );
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
      if (borrowCount !== book.borrowCount) updatedFields.push("borrowCount");

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
        borrowCount: borrowCount,
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
        borrowCount: borrowCount,
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
      setSuccessMessage(
        `Book updated successfully! The book is now ${
          !isBorrowed ? "borrowed" : "available"
        }.`
      );
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
      label: "Borrow Count",
      value: borrowCount,
      onChange: handleBorrowCountChange,
      ref: borrowCountRef,
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
            <EditableBookCard
              book={book}
              fields={fields}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              setFocusedField={setFocusedField}
              handleToggleIsBorrowed={handleToggleIsBorrowed}
              handleEditSubmit={handleEditSubmit}
            />
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
