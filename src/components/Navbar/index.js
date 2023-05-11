import React from 'react';
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink
} from './NavbarElements';
import LoginPage from '../auth/LoginPage';

const Navbar = ({ setView, view, isAdmin, setIsAdmin }) => {
  return (
    <>
      <Nav>
        <NavLink to='/'>
          {/* <img src={require('../../images/logo.svg')} alt='logo' /> */}
        </NavLink>
        <Bars />
        <NavMenu>
          <NavLink onClick={() => setView('search')} view={view} expectedView='search'>
            Search Book
          </NavLink>
          {isAdmin && (
            <>
              <NavLink onClick={() => setView('add')} view={view} expectedView='add'>
                Add Book
              </NavLink>
              <NavLink onClick={() => setView('delete')} view={view} expectedView='delete'>
                Delete Book
              </NavLink>
              <NavLink onClick={() => setView('edit')} view={view} expectedView='edit'>
                Edit Book
              </NavLink>
            </>
          )}
        </NavMenu>
        <NavBtn>
          <LoginPage Button={NavBtnLink} setIsAdmin={setIsAdmin} />
        </NavBtn>
      </Nav>
    </>
  );
};
export default Navbar;
