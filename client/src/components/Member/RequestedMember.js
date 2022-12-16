import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import db from "../../firebase/firebase-config";
import { useNavigate } from "react-router-dom";
import GroupAddSharpIcon from "@mui/icons-material/GroupAddSharp";
import GroupRemoveSharpIcon from "@mui/icons-material/GroupRemoveSharp";
import { Link } from "react-router-dom";
import { timeSince } from "../../Util/Utils";
import "./RequestedMember.css";

function RequestedMember({
  id,
  date,
  isTeamLeader,
  acceptRequest,
  rejectRequest,
}) {
  const [userData, setUserData] = useState(null);
  const [isPresentUserData, setIsPresentUserData] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      const userRef = doc(db, "users", id);
      await getDoc(userRef)
        .then((docSnap) => {
          setUserData(docSnap.data());
          setIsPresentUserData(true);
        })
        .catch((error) => {
          navigate("/error/Something Went Wrong ⚠️");
        });
    };
    getUserData();
  }, [id, navigate]);

  const handleAccept = () => {
    acceptRequest(userData.urlName, userData);
  };

  const handleReject = () => {
    rejectRequest(id, userData);
  };

  return userData === null || userData === undefined ? (
    <></>
  ) : (
    <div className="request-memberuser-wrapper">
      <div className="request-member-img">
        <Link to={"/users/" + id}>
          <img
            src={isPresentUserData ? userData.profilePic : "#"}
            alt={userData.userName}
            className="requested-member-img"
          />
        </Link>
      </div>
      <div className="requested-user-name">
        <Link to={"/users/" + id}>
          <span style={{ cursor: "pointer" }}>
            {isPresentUserData ? userData.userName : null}
          </span>
        </Link>
      </div>
      <div className="requested-use-posted-date">
        <span id="date">
          {date !== null && date !== undefined
            ? timeSince(new Date(date.seconds * 1000))
            : null}{" "}
          {" ago"}
        </span>
      </div>
      {isTeamLeader ? (
        <>
          <div className="accept-reject-btn-grid">
            <div className="requested-user-btn-accept">
              <GroupAddSharpIcon onClick={handleAccept}></GroupAddSharpIcon>
            </div>
            <div className="requested-user-btn-reject">
              <GroupRemoveSharpIcon
                onClick={handleReject}
              ></GroupRemoveSharpIcon>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default RequestedMember;
