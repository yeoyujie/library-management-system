import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AddBookForm from './components/AddBookForm';
import BorrowBookForm from './components/BorrowBookForm';
import EditBookForm from './components/EditBookForm';
import SearchBookForm from './components/SearchBookForm';
import Navbar from './components/Navbar';

function App() {
  const [view, setView] = useState('search');
  const [isAdmin, setIsAdmin] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === process.env.REACT_APP_AUTH_PASSWORD) {
      setAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  if (!authenticated) {
    return (
      <form onSubmit={handlePasswordSubmit}>
        <label htmlFor="password">Enter password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    );
  }

  return (
    <Router>
      <Navbar setView={setView} view={view} isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
      {view === 'search' && <SearchBookForm isAdmin={isAdmin} />}
      {view === 'borrow' && <BorrowBookForm isAdmin={isAdmin} />}
      {view === 'add' && isAdmin && <AddBookForm />}
      {view === 'edit' && isAdmin && <EditBookForm />}
    </Router>
  );
}


export default App;
