import React from "react";
import { Link } from "react-router-dom";
import "./UserProfileCard.css";

function UserProfileCard({ data }) {
  return data === null || data === undefined ? (
    <></>
  ) : (
    <div className="user-profile-card-main">
      <Link to={`/users/${data.urlName}`}>
        <div className="img">
          <img src={data.profilePic} alt={data.userName} />
        </div>
        <div className="extar-info">
          <span id="name">{data.userName}</span>
        </div>
      </Link>
    </div>
  );
}

export default UserProfileCard;
