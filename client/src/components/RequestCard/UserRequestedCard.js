import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import db from "../../firebase/firebase-config";
import { timeSince } from "../../Util/Utils";
import "./UserRequestedCard.css";

function UserRequestedCard({ data, id }) {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const getData = async () => {
      const userRef = doc(db, "users", data.requestedBy[0].id);
      await getDoc(userRef).then((docSnap) => {
        setUserData(docSnap.data());
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      });
    };
    getData();
  }, []);

  return loading === true ? (
    <></>
  ) : (
    <div className="user-requested-card">
      <div className="user-details">
        <div className="img">
          <Link to={`/users/${userData.urlName}`}>
            <img src={userData.profilePic} alt={userData.userName} />
          </Link>
          <br />
          <Link to={`/users/${data.requestedBy[0].id}`}>
            <small>{userData.userName} </small>
          </Link>
        </div>
        <div className="name">
          <small>
            {timeSince(new Date(data.requestedOn.seconds * 1000))}
            {" ago"}
          </small>
        </div>
      </div>
      <div className="user-requested-card-project-details">
        <span>{data.projectName}</span>
        <br />
        <Link to={`/projects/${id}`}>Join Team</Link>
      </div>
    </div>
  );
}

export default UserRequestedCard;
