import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import bug from "../../assets/Images/error.png";
import "./BuildCodeWarning.css";

function BuildCodeBug({ setPageSidebar }) {
  useEffect(() => {
    setPageSidebar(false);
  }, [setPageSidebar]);

  const { error } = useParams();

  return (
    <div className="build-code-warnings">
      <img src={bug} alt="Warning" />
      <h3 className="center-error">{error}</h3>
    </div>
  );
}

export default BuildCodeBug;
