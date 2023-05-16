exports.handler = async function(event, context) {
  // Parse the data from Formsg
  const data = JSON.parse(event.body);

  // Log the data to the console
  console.log(data);

  // Your code here to handle the book request
};