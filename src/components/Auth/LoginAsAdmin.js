const LoginAsAdmin = ({ Button, setIsAdmin, isAdmin }) => {
  const handleButtonClick = () => {
    const password = window.prompt("Please enter the password:");

    if (password == null) {
      //User press esc or cancel
      return;
    } else if (!password) {
      //Empty input field
      alert("Please input a password");
      handleButtonClick();
    } else if (password === process.env.REACT_APP_SECRET_PASSWORD) {
      //Password matches
      setIsAdmin(true);
      alert("Login Successful");
    } else {
      alert("Incorrect password");
    }
  };

  return (
    <>
      {isAdmin ? (
        <p>You are already logged in as an admin</p>
      ) : (
        <Button onClick={handleButtonClick}>Log in as admin</Button>
      )}
    </>
  );
};

export default LoginAsAdmin;
