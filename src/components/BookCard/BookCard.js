import { useState, useEffect } from 'react';
import { fetchBookCoverUrl } from '../../api/openLibrary.js';
import "./BookCards.css"

function BookCard({ book }) {
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
        <h2>{book.title}</h2>
        <h3>by {book.author}</h3>
        <p>Book ID: {book.id}</p>
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

export default BookCard;