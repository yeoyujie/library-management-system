const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.setCustomClaims = functions.https.onCall((data, context) => {
  // Get the user's email address from the request data
  const email = data.email;

  // Get the user by their email address
  return admin.auth().getUserByEmail(email)
    .then((user) => {
      // Set the custom 'admin' claim for the user
      return admin.auth().setCustomUserClaims(user.uid, { admin: true });
    })
    .then(() => {
      // The custom claim has been set successfully
      return { success: true };
    })
    .catch((error) => {
      // Handle any errors
      console.error(error);
      throw new functions.https.HttpsError('internal', error.message);
    });
});