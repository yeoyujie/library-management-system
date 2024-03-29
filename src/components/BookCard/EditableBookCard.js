import { useState, useEffect } from "react";
import { fetchBookCoverUrl } from '../../api/openLibrary.js';


function EditableBookCard({
  book,
  fields,
  isEditing,
  setIsEditing,
  setFocusedField,
  handleToggleIsBorrowed,
  handleEditSubmit,
}) {
  const [coverUrl, setCoverUrl] = useState(null);

  useEffect(() => {
    async function fetchCover() {
      const url = await fetchBookCoverUrl(book.title);
      setCoverUrl(url);
    }
    fetchCover();
  }, [book.title]);

  return (
    <div className="book-card" key={book.id}>
      <div className="book-info">
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
                style={{
                  cursor: "pointer",
                  borderRadius: "4px",
                  padding: "12px",
                  margin: "2px",
                }}
              />
            ) : (
              <p
                onClick={() => {
                  setIsEditing(true);
                  setFocusedField(field.ref);
                }}
                style={{
                  cursor: "pointer",
                  border: "0.1px solid",
                  borderRadius: "6px",
                  padding: "3px",
                }}
              >
                {/* Use a non-breaking space character to prevent the element from collapsing when empty */}
                {field.value || "\u00A0"}
              </p>
            )}
          </>
        ))}
        <h3>Book ID: {book.id}</h3>
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
              <button className="save-button" onClick={handleEditSubmit}>
                Save
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="book-cover">
        {coverUrl ? (
          <img src={coverUrl} alt={book.title} />
        ) : (
          <div className="loading-circle"></div>
        )}
      </div>
    </div>
  );
}

export default EditableBookCard;
