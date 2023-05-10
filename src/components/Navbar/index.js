import React from 'react';
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink
} from './NavbarElements';

const Navbar = ({ setView, view }) => {
  return (
    <>
      <Nav>
        <NavLink to='/'>
          {/* <img src={require('../../images/logo.svg')} alt='logo' /> */}
        </NavLink>
        <Bars />
        <NavMenu>
          {/* Second Nav */}
          {/* <NavBtnLink to='/sign-in'>Sign In</NavBtnLink> */}

           <NavLink onClick={() => setView('add')} view={view} expectedView='add'>
            Add Book
            </NavLink>
           <NavLink onClick={() => setView('delete')} view={view} expectedView='delete'>
            Delete Book
            </NavLink>
           <NavLink onClick={() => setView('search')} view={view} expectedView='search'>
            Search Book
            </NavLink>
           <NavLink onClick={() => setView('edit')} view={view} expectedView='edit'>
            Edit Book
            </NavLink>
        </NavMenu>
        <NavBtn>
          <NavBtnLink to='/signin'>Sign In</NavBtnLink>
        </NavBtn>
      </Nav>
    </>
  );
};

export default Navbar;
