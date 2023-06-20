import { useState, useRef, useEffect } from "react";
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink,
} from "./NavbarElements";
import LoginAsAdmin from "../Auth/LoginAsAdmin";

const Navbar = ({ setView, view, isAdmin, setIsAdmin }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navRef = useRef(null);

  const handleLogout = () => {
    setIsAdmin(false);
    alert("Logout Successful");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <Nav ref={navRef}>
        <NavLink to="/">
          {/* <img src={require('../../images/logo.svg')} alt='logo' /> */}
        </NavLink>
        <Bars onClick={() => setIsOpen(!isOpen)} />
        <NavMenu isOpen={isOpen}>
          <NavLink
            onClick={() => setView("search")}
            view={view}
            expectedview="search"
          >
            Search Book
          </NavLink>
          <NavLink
            onClick={() => setView("borrow")}
            view={view}
            expectedview="borrow"
          >
            Borrow Book
          </NavLink>
          {isAdmin && (
            <>
              <NavLink
                onClick={() => setView("add")}
                view={view}
                expectedview="add"
              >
                Add Book
              </NavLink>
              <NavLink
                onClick={() => setView("edit")}
                view={view}
                expectedview="edit"
              >
                Edit Book
              </NavLink>
            </>
          )}
        </NavMenu>
        <NavBtn>
          {isAdmin ? (
            <NavBtnLink onClick={handleLogout}>Log out</NavBtnLink>
          ) : (
            <LoginAsAdmin Button={NavBtnLink} setIsAdmin={setIsAdmin} />
          )}
        </NavBtn>
      </Nav>
    </>
  );
};
export default Navbar;
