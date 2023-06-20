import { useState } from "react";

function LoginPage({ onAuthenticate }) {
  const [password, setPassword] = useState("");

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === process.env.REACT_APP_AUTH_PASSWORD) {
      onAuthenticate(true);
    } else {
      alert("Incorrect password");
    }
  };

  return (
    <form onSubmit={handlePasswordSubmit}>
      <label htmlFor="password">Enter password:</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="auth-button" type="submit">
        Submit
      </button>
    </form>
  );
}

export default LoginPage;
