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
          <NavLink onClick={() => setView('search')} view={view} expectedView='search'>
            Search Book
          </NavLink>
          <NavLink onClick={() => setView('borrow')} view={view} expectedView='borrow'>
            Borrow Book
          </NavLink>
          {isAdmin && (
            <>
              <NavLink onClick={() => setView('add')} view={view} expectedView='add'>
                Add Book
              </NavLink>
              <NavLink onClick={() => setView('edit')} view={view} expectedView='edit'>
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
