import { useState } from "react";
import { useTransition, animated } from "react-spring";
import { app } from "../firebase_setup/firebase.js";
import { getDatabase, ref, push } from "firebase/database";
import Form from "./Form";
import LayoutForm from "./LayoutForm";
import "./FormStyles.css";

function AddBookForm({ isAdmin }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [recentlyAddedBooks, setRecentlyAddedBooks] = useState([]);

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

  const handleSubmit = (event) => {
    event.preventDefault();
    const db = getDatabase(app);

    setSuccessMessage("");

    if (!title) {
      setErrorMessage("Please enter the title.");
      return;
    } else if (!author && !firstName && !lastName) {
      setErrorMessage(
        "Please enter either the author or the first name and last name."
      );
      return;
    } else if (!author && (!firstName || !lastName)) {
      setErrorMessage("Please enter both the first name and last name.");
      return;
    }

    // Set the isBorrowed status to false by default
    const isBorrowed = false;

    // Set the isBorrowed status to false by default
    const borrowerEmail = "";

    const authorName = author || (firstName + " " + lastName);

    // Create a new field that combines the title and author values
    const title_author = `${title}_${authorName}`;

    // Update the realtime database in Firebase
    const newBookRef = push(ref(db, "books"), {
      title,
      author,
      firstName,
      lastName,
      title_author,
      isBorrowed,
      borrowerEmail,
    });

    console.log(`New book added with ID: ${newBookRef.key}`);

    // Add the new book to the list of recently added books
    setRecentlyAddedBooks((prevBooks) => [
      { id: newBookRef.key, title, author },
      ...prevBooks,
    ]);
    setErrorMessage("");

    setSuccessMessage(
      <>
        Book added successfully!
        <br />
        Title: <strong style={{ fontSize: "18px" }}>{title}</strong>
        <br />
        Author:{" "}
        <strong style={{ fontSize: "18px" }}>
          {author || firstName + " " + lastName}
        </strong>
        <br />
        ID: {newBookRef.key}
      </>
    );

    // Clears the input fields
    setTitle("");
    setAuthor("");
    setFirstName("");
    setLastName("");
  };

  // useTransition hook to animate the mounting and unmounting of book cards
  const transitions = useTransition(recentlyAddedBooks, {
    from: { opacity: 0, transform: "translate3d(-25%,0,0)" },
    enter: { opacity: 1, transform: "translate3d(0%,0,0)" },
    leave: { opacity: 0 },
  });

  return (
    isAdmin && (
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
              value: title,
              onChange: handleTitleChange,
              id: "title",
            },
            {
              label: "Author",
              value: author,
              onChange: handleAuthorChange,
              id: "author",
            },
            {
              label: "First Name",
              value: firstName,
              onChange: handleFirstNameChange,
              id: "firstName",
            },
            {
              label: "Last Name",
              value: lastName,
              onChange: handleLastNameChange,
              id: "lastName",
            },
          ]}
          submitValue="Add"
        />
      </LayoutForm>
    )
  )
}

export default AddBookForm;
