import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Chat from "../../components/Chat/Chat";
import { useUserAuth } from "../../context/UserAuthContextProvider";
import FullPageLoader from "../../components/Loader/FullPageLoader/FullPageLoader";
import { useNavigate } from "react-router-dom";
import SignUpModal from "../../components/Modal/SignUpModal";
import "./Rooms.css";

function Rooms({ setPageSidebar }) {
  useEffect(() => {
    setPageSidebar(true);
  }, [setPageSidebar]);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { user, userUniqueId, userData } = useUserAuth();
  const [open, setOpen] = useState(true);

  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 992px)").matches
  );

  useEffect(() => {
    window
      .matchMedia("(min-width: 992px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);

  useEffect(() => {
    if (userData !== undefined && userData !== null) {
      if (userData.isDeleted === true) {
        navigate(
          "/error/This account has been deleted if you are an account holder then mail us contact@buildcode to deactivate."
        );
      } else if (userData.redUser === true) {
        navigate(
          "/error/This account has been suspended due to a violation of the BuildCode account user agreement if you are an account holder then mail us contact@buildcode to deactivate."
        );
      }
      setLoading(false);
    }
  }, [userData, navigate]);

  const closeDialog = () => {
    setOpen(false);
  };

  return !matches === true ? (
    <h1>Chat is only available from desktop </h1>
  ) : loading === true ? (
    <>
      {user === null ? (
        <SignUpModal
          open={open}
          closeDialog={closeDialog}
          closeOnOverlayClick={false}
          showCloseIcon={false}
        />
      ) : null}
      <div className="rooms-main-grid">
        <div className="app_body">
          <FullPageLoader color={"blue"} height={"50px"} width={"50px"} />
        </div>
      </div>
    </>
  ) : (
    <>
      <div className="rooms-main-grid">
        <div className="app_body">
          {userData.currentRooms.length === 0 ? (
            <h1>No Active Rooms</h1>
          ) : (
            <>
              <Sidebar userData={userData} userUniqueId={userUniqueId} />
              <Chat userData={userData} userUniqueId={userUniqueId} />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Rooms;
