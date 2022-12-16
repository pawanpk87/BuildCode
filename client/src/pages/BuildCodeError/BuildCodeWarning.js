import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import warning from "../../assets/Images/warning.png";
import "./BuildCodeWarning.css";

function BuildCodeWarning({ setPageSidebar }) {
  useEffect(() => {
    setPageSidebar(false);
  }, [setPageSidebar]);

  const { error } = useParams();

  return (
    <div className="build-code-warnings">
      <img src={warning} alt="Warning" />
      <h3 className="center-error">{error}</h3>
    </div>
  );
}

export default BuildCodeWarning;
