import React from 'react';
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink
} from './NavbarElements';
import LoginButton from '../auth/LoginButton';

const Navbar = ({ setView, view, isAdmin, setIsAdmin }) => {

  const handleLogout = () => {
    setIsAdmin(false);
    alert('Logout Successful');
  };

  return (
    <>
      <Nav>
        <NavLink to='/'>
          {/* <img src={require('../../images/logo.svg')} alt='logo' /> */}
        </NavLink>
        <Bars />
        <NavMenu>
          <NavLink onClick={() => setView('search')} view={view} expectedview='search'>
            Search Book
          </NavLink>
          <NavLink onClick={() => setView('borrow')} view={view} expectedview='borrow'>
            Borrow Book
          </NavLink>
          {isAdmin && (
            <>
              <NavLink onClick={() => setView('add')} view={view} expectedview='add'>
                Add Book
              </NavLink>
              <NavLink onClick={() => setView('edit')} view={view} expectedview='edit'>
                Edit Book
              </NavLink>
            </>
          )}
        </NavMenu>
        <NavBtn>
          {isAdmin ? (
            <NavBtnLink onClick={handleLogout}>Log out</NavBtnLink>
          ) : (
            <LoginButton Button={NavBtnLink} setIsAdmin={setIsAdmin} />
          )}
        </NavBtn>
      </Nav>
    </>
  );
};
export default Navbar;
