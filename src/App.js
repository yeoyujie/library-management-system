import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AddBookView from './views/AddBookView';
import BorrowBookView from './views/BorrowBookView';
import EditBookView from './views/EditBookView';
import SearchBookView from './views/SearchBookView';
import Navbar from './components/Navbar';

function App() {
  const [view, setView] = useState('search');
  const [isAdmin, setIsAdmin] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === process.env.REACT_APP_AUTH_PASSWORD) {
      setAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  const handleBorrowBook = (book) => {
    setSelectedBook(book);
    setView('borrow');
  };

  const handleEditBook = (book) => {
    setSelectedBook(book);
    setView('edit');
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
        <button className="auth-button" type="submit">Submit</button>
      </form>
    );
  }

  return (
    <Router>
      <Navbar setView={setView} view={view} isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
      {view === 'search' && <SearchBookView isAdmin={isAdmin} onBorrowBook={handleBorrowBook} onEditBook={handleEditBook}/>}
      {view === 'borrow' && <BorrowBookView isAdmin={isAdmin} selectedBook={selectedBook} />}
      {view === 'add' && isAdmin && <AddBookView isAdmin={isAdmin}/>}
      {view === 'edit' && isAdmin && <EditBookView isAdmin={isAdmin} selectedBook={selectedBook}/>}
    </Router>
  );
}


export default App;
