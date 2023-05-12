import React from "react";
import Form from "./Form";

const LayoutForm = ({
  children,
  successMessage,
  errorMessage,
  books,
  bookListContent,
}) => {
  return (
    <div className="container">
      <div className="search-form">
        <div className="search-form-card">{children}</div>
      </div>
      <div className="search-results">
        {successMessage && (
          <div className="success-message">{successMessage} </div>
        )}
        {errorMessage && <div className="error-message">{errorMessage} </div>}
        <div className="book-list-container">
          <div className="book-list">{bookListContent}</div>
        </div>
      </div>
    </div>
  );
};

export default LayoutForm;
