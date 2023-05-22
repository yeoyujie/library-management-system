import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddBookForm from './components/AddBookForm';
import BorrowBookForm from './components/BorrowBookForm';
import DeleteBook from './components/DeleteBook';
import EditBookForm from './components/EditBookForm';
import SearchBookForm from './components/SearchBookForm';
import Navbar from './components/Navbar';

function App() {
  const [view, setView] = useState('search');

  //set to true for testing in dev mode
  const [isAdmin, setIsAdmin] = useState(true);

  return (
    <Router>
      <Navbar setView={setView} view={view} isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
      {view === 'search' && <SearchBookForm />}
      {view === 'borrow' && <BorrowBookForm />}
      {view === 'add' && isAdmin && <AddBookForm />}
      {view === 'delete' && isAdmin && <DeleteBook />}
      {view === 'edit' && isAdmin && <EditBookForm />}
    </Router>
  );
}


export default App;
