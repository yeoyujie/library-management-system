const admin = require('firebase-admin');
const serviceAccount = require('./git');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

exports.handler = async (event, context) => {
  // Get the form response data from the request body
  const formData = JSON.parse(event.body);

  // TODO: Decrypt the form response data

  // TODO: Process the form response data and save it to your Firebase database

  // Return a response to acknowledge receipt of the webhook event
  return {
    statusCode: 200,
    body: 'Webhook event received',
  };
};