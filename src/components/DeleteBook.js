import React from 'react';
import DeleteBookFormIndex from './DeleteBookFormIndex';
import DeleteBookForm from './DeleteBookForm';

function DeleteBook() {
  return (
    <div>
      <h2>Delete a Book by ID</h2>
      <DeleteBookFormIndex />
      <h2>Delete a Book</h2>
      <DeleteBookForm />
    </div>
  );
}

export default DeleteBook;