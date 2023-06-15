function BookCard({ book }) {
    return (
      <div className="book-card" key={book.id}>
        <h3>{book.title}</h3>
        <p>by {book.author}</p>
        <p>Book ID: {book.id}</p>
      </div>
    );
  }

export default BookCard;