import React from "react";
import bgPhoto from "../assets/bgPhoto.jpg";
import Lottie from "react-lottie";
import animationData from "../assets/animation.json";

const LayoutForm = ({
  children,
  successMessage,
  errorMessage,
  bookListContent,
}) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className="container">
      <div className="search-form" style={{ position: "relative" }}>
        <Lottie
          options={defaultOptions}
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
