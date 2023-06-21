import { useState, useEffect } from "react";
import DeleteBookButton from "../Buttons/DeleteBookButton";
import ReturnBookButton from "../Buttons/ReturnBookButton";
import { fetchBookCoverUrl } from '../../api/openLibrary.js';

function DetailedBookCard({
  isAdmin,
  book,
  handleCopyToClipboard,
  onBorrowBookAdminClick,
  onBorrowBookClick,
  onEditBookClick,
  setSuccessMessage,
  setErrorMessage,
}) {
  const [showMore, setShowMore] = useState(false);
  const [coverUrl, setCoverUrl] = useState(null);


  const handleViewMore = () => {
    setShowMore(!showMore);
  };

  const ViewMoreButton = () => {
    if (!showMore) {
      return (
        <button className="view-more-button" onClick={handleViewMore}>
          View More Details
        </button>
      );
    }
  };

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
        <h2>{book.title}</h2>
        <h3>by {book.author}</h3>
        <ViewMoreButton book={book} />
        {showMore && (
          <div>
            {book.firstName && <p>First Name: {book.firstName}</p>}
            {book.lastName && <p>Last Name: {book.lastName}</p>}
            <p>
              Book ID: {book.id}
              <button
                className="copy-to-clipboard-button"
                onClick={() => handleCopyToClipboard(book.id)}
              >
                Copy to clipboard
              </button>
            </p>
          </div>
        )}
        <p>
          Number of times borrowed:{" "}
          <span style={{ fontWeight: "bold", fontSize: "larger" }}>
            {book.borrowCount}
          </span>
        </p>
        {book.isBorrowed && <p>Borrowed by: {book.borrowerEmail}</p>}
        <p
          style={{
            fontWeight: "bold",
            fontSize: "1.1rem",
            color: book.isBorrowed ? "red" : "green",
          }}
        >
          {book.isBorrowed ? "Borrowed" : "Available"}
        </p>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {book.isBorrowed ? (
            isAdmin && (
              <ReturnBookButton
                book={book}
                onSuccess={(message) => setSuccessMessage(message)}
                onError={(message) => setErrorMessage(message)}
              />
            )
          ) : (
            <button
              className="borrow-button"
              onClick={() => {
                isAdmin ? onBorrowBookAdminClick(book) : onBorrowBookClick(book);
              }}
            >
              Borrow Book
            </button>
          )}
          {isAdmin && (
            <button
              className="edit-button"
              onClick={() => {
                onEditBookClick(book);
              }}
            >
              Edit Book
            </button>
          )}
          {isAdmin && (
            <DeleteBookButton
              book={book}
              onSuccess={(message) => setSuccessMessage(message)}
              onError={(message) => setErrorMessage(message)}
            />
          )}
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

export default DetailedBookCard;
