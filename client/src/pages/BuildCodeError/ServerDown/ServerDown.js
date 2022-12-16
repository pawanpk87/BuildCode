import React, { useEffect } from "react";
import serverDown from "../../../assets/Images/sever-down.png";
import "./ServerDown.css";

function ServerDown({ setPageSidebar }) {
  useEffect(() => {
    setPageSidebar(false);
  }, [setPageSidebar]);

  return (
    <div className="build-code-server-down-warnings">
      <img
        style={{ width: "80%", height: "80%" }}
        src={serverDown}
        alt="server down"
      />
      <h3 className="center-error">
        the BuildCode server is currently shut down. please try again later
      </h3>
    </div>
  );
}

export default ServerDown;
