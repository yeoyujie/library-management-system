import React from "react";
import Lottie from "lottie-react";
import animationData from "../assets/animation.json";

const LayoutForm = ({
  children,
  successMessage,
  errorMessage,
  bookListContent,
}) => {
  return (
    <div className="container">
      <div className="search-form" style={{ position: "relative" }}>
        <Lottie
          animationData={animationData}
          loop={true}
          autoplay={true}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <div className="search-form-card" style={{ zIndex: 1 }}>
          {children}
        </div>
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
