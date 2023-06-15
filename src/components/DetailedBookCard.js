import { useState } from 'react';
import DeleteBookButton from './DeleteBookButton';

function DetailedBookCard({ isAdmin, book, handleCopyToClipboard, handleReturnBook, handleBorrowBook,
    onBorrowBook, onEditBook, setSuccessMessage, setErrorMessage }) {

    const [showMore, setShowMore] = useState(false);

    const handleViewMore = () => {
        setShowMore(!showMore);
    };

    const ViewMoreButton = () => {
        if (!showMore) {
            return (
                <button
                    className="view-more-button"
                    onClick={handleViewMore}
                >
                    View More Details
                </button>
            );
        }
    };

    return (
        <div className="book-card" key={book.id}>
            <h3>{book.title}</h3>
            <p>by {book.author}</p>
            <ViewMoreButton book={book} />
            {showMore && (
                <div>
                    <p>First Name: {book.firstName}</p>
                    <p>Last Name: {book.lastName}</p>
                </div>
            )}
            <p>Number of times borrowed: {book.borrowCount}</p>
            {book.isBorrowed && <p>Borrowed by: {book.borrowerEmail}</p>}
            <p>
                Book ID: {book.id}
                <button
                    className="copy-to-clipboard-button"
                    onClick={() => handleCopyToClipboard(book.id)}
                >
                    Copy to clipboard
                </button>
            </p>
            <p
                style={{
                    fontWeight: 'bold',
                    color: book.isBorrowed ? 'red' : 'green',
                }}
            >
                {book.isBorrowed ? 'Borrowed' : 'Available'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {book.isBorrowed ? isAdmin && <button
                    className="borrow-button"
                    onClick={() => {
                        handleReturnBook(book);
                    }}
                >
                    Return Book
                </button> : (
                    <button
                        className="borrow-button"
                        onClick={() => {
                            isAdmin ? handleBorrowBook(book) : onBorrowBook(book);
                        }}
                    >
                        Borrow Book
                    </button>
                )}
                {isAdmin && <button
                    className="edit-button"
                    onClick={() => {
                        onEditBook(book);
                    }}
                >
                    Edit Book
                </button>}
                {isAdmin && (
                    <DeleteBookButton
                        book={book}
                        onSuccess={(message) => setSuccessMessage(message)}
                        onError={(message) => setErrorMessage(message)}
                    />
                )}
            </div>
        </div>
    );
}

export default DetailedBookCard;
