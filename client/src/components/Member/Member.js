import React, { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import StarIcon from "@mui/icons-material/Star";
import { Link } from "react-router-dom";
import db from "../../firebase/firebase-config";
import "./Member.css";

function Member({ id, requestedBy }) {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    onSnapshot(doc(db, "users", id), (doc) => {
      setUserData(doc.data());
    });
  }, [id]);

  useEffect(() => {
    if (userData !== null) {
      setLoading(false);
    }
  }, [userData]);

  return loading === true ? (
    <></>
  ) : (
    <Link to={"/users/" + id}>
      <div className="team-member">
        <div className="user-img">
          <img src={userData.profilePic} alt={userData.userName} />
        </div>
        <div className="user-name">
          <span>
            {requestedBy === id ? (
              <StarIcon
                style={{ width: "0.6rem", height: "0.6rem" }}
              ></StarIcon>
            ) : null}
            {userData.userName}
          </span>
        </div>
        <div className="user-joined-date">
          <span>Joined on: 22 May 2023</span>
        </div>
      </div>
    </Link>
  );
}

export default Member;
