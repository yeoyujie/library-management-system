const admin = require("firebase-admin");

const serviceAccount = JSON.parse(
  Buffer.from(process.env.SERVICE_ACCOUNT_KEY, "base64").toString()
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://library-management-syste-ae450-default-rtdb.asia-southeast1.firebasedatabase.app", //replace with your own database URL
});

const db = admin.database();

const testBooksRef = db.ref("books");

testBooksRef
  .once("value")
  .then((snapshot) => {
    console.log(snapshot.val());
  })
  .catch((error) => {
    console.error("Error reading data:", error);
  });

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
  console.log(data);

  // Decrypt the data using the secret key
  const decryptedData = formsg.crypto.decrypt(formSecretKey, data.data);

  console.log("Decrypted data");
  console.log(decryptedData);

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
      const booksRef = db.ref("books");
      booksRef
        .orderByChild("title_author")
        .equalTo(`${bookTitle}_${bookAuthor}`)
        .once("value", (snapshot) => {
          console.log("Snapshot exists:", snapshot.exists()); // Log the result of the snapshot.exists() check
          if (snapshot.exists()) {
            const [bookId] = Object.keys(snapshot.val());
            db.ref(`books/${bookId}`).update({ isBorrowed: true });
          } else {
            console.log("The particular cannot be found");
          }
        });
    } catch (error) {
      console.error(error);
    }
  } else {
    console.log("something not found");
  }
};
