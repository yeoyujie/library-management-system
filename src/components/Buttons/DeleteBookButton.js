import { getDatabase, ref, remove } from "firebase/database";
import { app } from "../../firebase/firebase.js";

export function DeleteBookButton({ book, onSuccess, onError }) {
  const handleDelete = async () => {
    // Show a confirmation prompt before deleting the book
    if (
      window.confirm(
        "Are you sure you want to delete this book? This action cannot be undone."
      )
    ) {
      try {
        const db = getDatabase(app);
        const bookRef = ref(db, `books/${book.id}`);

        // Delete the book entry from the database
        await remove(bookRef);

        // Call the onSuccess callback with a success message
        if (onSuccess) {
          onSuccess("Book deleted successfully!");
        }
      } catch (error) {
        // Call the onError callback with an error message
        if (onError) {
          onError("An error occurred while deleting the book.");
        }
      }
    }
  };

  return (
    <button className="delete-button" onClick={handleDelete}>
      Delete Book
    </button>
  );
}

export default DeleteBookButton;
