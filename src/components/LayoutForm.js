import React from "react";
import "./LayoutStyles.css";

function Layout({ children }) {
  return (
    <div className="container">
      <div className="search-form">{children[0]}</div>
      <div className="search-results">
        {children[1]}
        <div className="book-list-container">{children[2]}</div>
      </div>
    </div>
  );
}

export default Layout;