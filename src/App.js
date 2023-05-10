import logo from './logo.svg';
import './App.css';
import AddBookForm from './components/AddBookForm';
import DeleteBookFormIndex from './components/DeleteBookFormIndex';
import DeleteBookForm from './components/DeleteBookForm';
import EditBookForm from './components/EditBookForm';
import SearchBookForm from './components/SearchBookForm';



function App() {
  return (
    <div>
      <h1>My Book App</h1>
      <AddBookForm />
      <h1>Delete a Book by Index</h1>
      <DeleteBookFormIndex />
      <h1>Delete a Book</h1>
      <DeleteBookForm />
      <h1>Search a Book</h1>
      <SearchBookForm />
      <h1>Edit a Book</h1>
      <EditBookForm />
    </div>
  );
}


export default App;
