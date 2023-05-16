import {
  getDatabase,
  ref,
  query,
  orderByChild,
  equalTo,
  update,
} from "firebase/database";
import { app } from "../../src/firebase_setup/firebase.js";

// Instantiating formsg-sdk without parameters default to using the package's
// production public signing key.
const formsg = require("@opengovsg/formsg-sdk")();

// Your form's secret key downloaded from FormSG upon form creation
const formSecretKey = process.env.FORM_SECRET_KEY;

exports.handler = async function (event, context) {
  try {
    formsg.webhooks.authenticate(
      event.headers["x-formsg-signature"],
      process.env.URL + "/.netlify/functions/formsg-webhook"
    );
  } catch (e) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorized" }),
    };
  }

  // Parse the data from Formsg
  const data = JSON.parse(event.body);

  console.log("This is the data")
  console.log(data)

  // Decrypt the data using the secret key
  const decryptedData = formsg.crypto.decrypt(
    formSecretKey,
    data.encryptedContent
  );

  console.log("This is the decrypted data")
  console.log(decryptedData)

  // Access the responses array
  const responses = decryptedData.responses;

  // Find the response objects for the Book Title and Book Author questions
  const bookTitleResponse = responses.find(
    (response) => response.question === "Book Title"
  );
  const bookAuthorResponse = responses.find(
    (response) => response.question === "Book Author"
  );

  // Access the answer values for the Book Title and Book Author questions
  const bookTitle = bookTitleResponse.answer;
  const bookAuthor = bookAuthorResponse.answer;

  console.log(bookTitle, bookAuthor);

    // Query the Firebase database for a book with the specified title and author
    if (bookTitle && bookAuthor) {
      try {
        const db = getDatabase(app);
        const booksRef = ref(db, 'books');
        const booksQuery = query(
          booksRef,
          orderByChild('title_author'),
          equalTo(`${bookTitle}_${bookAuthor}`)
        );
    
        // Borrow the first book returned by the query
        const snapshot = await get(booksQuery);
        if (snapshot.exists()) {
          const [bookId] = Object.keys(snapshot.val());
          await update(ref(db, `books/${bookId}`), { isBorrowed: true });
          console.log({bookTitle}  + "by " + {bookAuthor} + "is borrowed!")
        }
      } catch (error) {
        console.error(error);
      }
    }
};
