import React, { useState } from 'react';

const LoginPage = ({ Button, setIsAdmin }) => {
  // const [isAdmin, setIsAdmin] = useState(false);

  const handleButtonClick = () => {
    const password = window.prompt('Please enter the password:');

    if (password == null) {
      //User press esc or cancel
      return;
    } else if (!password) {
      //Empty input field
      alert('Please input a password');
      handleButtonClick();
    } else if (password === process.env.REACT_APP_SECRET_PASSWORD) {
      //Password matches
      setIsAdmin(true);
    } else {
      alert('Incorrect password');
    }
  };

  return (
    <>
      <Button onClick={handleButtonClick}>Log in as admin</Button>
      {/* {isAdmin && <p>You are now logged in as an admin.</p>} */}
    </>
  );
};

export default LoginPage;