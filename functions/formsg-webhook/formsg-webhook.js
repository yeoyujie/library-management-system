const admin = require("firebase-admin");
const { privateKey } = JSON.parse(process.env.FIREBASE_PRIVATE_KEY);

const config = {
  credential: admin.credential.cert({
    projectId: "library-management-syste-ae450",
    private_key: privateKey,
    client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
  }),
  databaseURL:
    "https://library-management-syste-ae450-default-rtdb.asia-southeast1.firebasedatabase.app", //replace with your own database URL
};

console.log(process.env.FIREBASE_ADMIN_CLIENT_ID)
console.log(process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID)

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

  if (!admin.apps.length) {
    firebaseAdminApp = admin.initializeApp(config);
  } else {
    firebaseAdminApp = admin.app();
  }

  const db = admin.database();

  // Parse the data from Formsg
  const data = JSON.parse(event.body);

  // Log the form data
  console.log(data);

  // Decrypt the data using the secret key
  const decryptedData = formsg.crypto.decrypt(formSecretKey, data.data);

  // Logg the decrypted form data
  // console.log("Decrypted data");
  // console.log(decryptedData);

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
      const booksRef = db.ref("boo");
      booksRef
        .once("value")
        .then((snapshot) => {
          // Log the data to the console
          console.log(snapshot.val());
        })
        .catch((error) => {
          // Log any errors that occur
          console.error(error);
        });
      console.log("Got here");

      // booksRef
      //   .orderByChild("title_author")
      //   .equalTo(`${bookTitle}_${bookAuthor}`)
      //   .once("value", (snapshot) => {
      //     console.log("Snapshot exists:", snapshot.exists()); // Log the result of the snapshot.exists() check
      //     if (snapshot.exists()) {
      //       const [bookId] = Object.keys(snapshot.val());
      //       db.ref(`books/${bookId}`)
      //         .update({ isBorrowed: true })
      //         .then(() => {
      //           console.log("Book status updated successfully");
      //         })
      //         .catch((error) => {
      //           console.error("Error updating book status:", error);
      //         });
      //     } else {
      //       console.log("The particular book cannot be found");
      //     }
      //   })
      //   .catch((error) => {
      //     console.error("Error listening for value event:", error);
      //   });
    } catch (error) {
      console.error(error);
    }
  } else {
    console.log("something not found");
  }

  console.log("reached the end");
};
