import { useState, useEffect } from 'react';
import "./BookCards.css"

async function searchBooksByTitle(title) {
  const response = await fetch(`http://openlibrary.org/search.json?title=${title}`);
  const data = await response.json();
  return data.docs;
}

function BookCard({ book }) {
  const [coverUrl, setCoverUrl] = useState(null);

  useEffect(() => {
    async function fetchCover() {
      const books = await searchBooksByTitle(book.title);
      if (books.length > 0) {
        const coverEditionKey = books[0].cover_edition_key;
        if (coverEditionKey) {
          setCoverUrl(`https://covers.openlibrary.org/b/olid/${coverEditionKey}-M.jpg`);
        }
      }
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
      {coverUrl && (
        <div className="book-cover">
          <img src={coverUrl} alt={book.title} />
        </div>
      )}
    </div>
  );
}

export default BookCard;
