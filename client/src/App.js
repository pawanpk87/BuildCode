import React, { useEffect, useState } from "react";
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import PageSidebar from "./components/PageSidebar/PageSidebar";
import { useUserAuth } from "./context/UserAuthContextProvider";
import { useNavigate } from "react-router-dom";
import "./App.css";

function App() {
  const navigate = useNavigate();
  const { userData } = useUserAuth();
  const [pageSidebar, setPageSidebar] = useState(true);

  useEffect(() => {
    if (userData !== undefined && userData !== null) {
      if (userData.isDeleted === true) {
        navigate(
          "/error/This account has been deleted, if you are an account holder then mail us contact@buildcode to deactivate."
        );
      } else if (userData.redUser === true) {
        navigate(
          "/error/This account has been suspended due to a violation of the BuildCode account user agreement if you are an account holder then mail us contact@buildcode to deactivate."
        );
      }
    }
  }, [userData, navigate]);

  return (
    <>
      <Header />
      {pageSidebar === true ? <PageSidebar /> : null}
      <div className="main-content">
        <main>
          <Main setPageSidebar={setPageSidebar} />
        </main>
      </div>
    </>
  );
}

export default App;
