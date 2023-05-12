import React from 'react';

const LayoutForm = ({
  children,
  successMessage,
  errorMessage,
  books,
  handleBorrowBook,
}) => {
  return (
    <div className="container">
      <div className="search-form">
        <div className="search-form-card">{children}</div>
      </div>
      <div className="search-results">
        {successMessage && (
          <div className="success-message">{successMessage} </div>
        )}
        {errorMessage && <div className="error-message">{errorMessage} </div>}
        <div className="book-list-container">
          <div className="book-list">
            {books.map((book) => (
              <div className="book-card" key={book.id}>
                <h3>{book.title}</h3>
                <p>by {book.author}</p>
                <p>Book ID: {book.id}</p>
                <p
                  style={{
                    fontWeight: 'bold',
                    color: book.isBorrowed ? 'red' : 'green',
                  }}
                >
                  {book.isBorrowed ? 'Borrowed' : 'Available'}
                </p>
                {!book.isBorrowed && (
                  <button onClick={() => handleBorrowBook(book.id)}>
                    Borrow Book
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutForm;