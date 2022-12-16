import React from "react";
import ErrorIMG from "../../../assets/Images/page-not-found.png";
import "./Error.css";

function Error() {
  return (
    <div className="erro-page-main-grid">
      <img src={ErrorIMG} alt="Error!!!"></img>
    </div>
  );
}

export default Error;
