import React from "react";
import './Error.css'
import { Link } from "react-router-dom";

const Error404 = () => {
  return (
    <div className="error-container">
      <div className="img-error-container">
        <img src={require("../../assets/space404.png")} alt="" />
      </div>
      <Link to="/">click here to go to the home page</Link>
    </div>
  );
};

export default Error404;
