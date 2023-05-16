/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.handleFormSGWebhook = functions.https.onRequest((req, res) => {
  // Get the form response data from the request body
  const formData = req.body;

  // TODO: Decrypt the form response data

  // TODO: Process the form response data and save it to your Firebase database

  // Send a response to acknowledge receipt of the webhook event
  res.status(200).send('Webhook event received');
});
