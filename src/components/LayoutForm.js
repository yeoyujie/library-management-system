import React from "react";
import bgPhoto from "../assets/bgPhoto.jpg";
const LayoutForm = ({
  children,
  successMessage,
  errorMessage,
  bookListContent,
}) => {
  return (
    <div className="container">
      <div
        className="search-form"
        style={{
          backgroundImage: `url(${bgPhoto})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
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
