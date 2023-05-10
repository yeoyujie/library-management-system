import './App.css';
import React, { useState } from 'react';
import AddBookForm from './components/AddBookForm';
import DeleteBook from './components/DeleteBook';
import EditBookForm from './components/EditBookForm';
import SearchBookForm from './components/SearchBookForm';


function App() {
  const [view, setView] = useState('add');

  return (
    <div>
      <h1>JTC Academy Library Management System</h1>
      <nav>
        <button onClick={() => setView('add')}>Add Book</button>
        <button onClick={() => setView('delete')}>Delete Book</button>
        <button onClick={() => setView('search')}>Search Book</button>
        <button onClick={() => setView('edit')}>Edit Book</button>
      </nav>
      {view === 'add' && <AddBookForm />}
      {view === 'delete' && <DeleteBook />}
      {view === 'search' && <SearchBookForm />}
      {view === 'edit' && <EditBookForm />}
    </div>
  );
}


export default App;
