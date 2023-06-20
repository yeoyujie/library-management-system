import { getDatabase, ref, update } from "firebase/database";
import { app } from "../../firebase/firebase.js";

export function ReturnBookButton({ book, onSuccess, onError }) {
  const handleReturn = async () => {
    try {
      const db = getDatabase(app);
      const bookRef = ref(db, `books/${book.id}`);

      // Update the isBorrowed status and borrowerEmail of the book in the database
      await update(bookRef, {
        isBorrowed: false,
        borrowerEmail: "",
      });

      // Call the onSuccess callback with a success message
      if (onSuccess) {
        onSuccess("Book returned successfully!");
      }
    } catch (error) {
      // Call the onError callback with an error message
      if (onError) {
        onError("An error occurred while returning the book.");
      }
    }
  };

  return (
    <button className="return-button" onClick={handleReturn}>
      Return Book
    </button>
  );
}

export default ReturnBookButton;
