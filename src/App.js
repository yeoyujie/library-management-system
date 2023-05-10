import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AddBookForm from './components/AddBookForm';
import DeleteBook from './components/DeleteBook';
import EditBookForm from './components/EditBookForm';
import SearchBookForm from './components/SearchBookForm';
import Navbar from './components/Navbar';



function App() {
  const [view, setView] = useState('add');

  return (

    <Router>
    <Navbar setView={setView} view={view}/>
    {view === 'add' && <AddBookForm />}
    {view === 'delete' && <DeleteBook />}
    {view === 'search' && <SearchBookForm />}
    {view === 'edit' && <EditBookForm />}
    </Router>
    );
  }


export default App;
