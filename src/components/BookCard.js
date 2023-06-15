function BookCard({ book }) {
    return (
      <div className="book-card" key={book.id}>
        <h2>{book.title}</h2>
        <h3>by {book.author}</h3>
        <p>Book ID: {book.id}</p>
      </div>
    );
  }

export default BookCard;