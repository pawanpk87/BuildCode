import React from "react";
import "./BuildCodeError.css";

function BuildCodeError({ text }) {
  return (
    <div className="build-code-offline-main-grid">
      <div className="alert alert--warning" role="alert">
        {text}
      </div>
    </div>
  );
}

export default BuildCodeError;
