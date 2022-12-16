import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import db from "../../firebase/firebase-config";
import { Link, useNavigate } from "react-router-dom";
import "./DoneProjectCard.css";

function DoneProjectCard({ id, data }) {
  const [activeField, setActiveField] = useState("Target");

  return data === null || data === undefined ? (
    <></>
  ) : (
    <>
      <div className="plx-card gold">
        <div className="pxc-avatar">
          <Link to={`/projects/completed/${data.urlName}`}>
            <img src={data.projectPic} alt={data.projectName} />
          </Link>
        </div>
        <div className="pxc-subcard">
          <Link to={`/projects/completed/${data.urlName}`}>
            <div className="pxc-title">
              <Link to={`/projects/completed/${data.urlName}`}>
                {data.projectName}
                <span id="done">
                  <i className="las la-check-circle"></i>
                </span>
              </Link>
            </div>
            <div className="pxc-feats">
              {activeField === "Target" ? (
                <>
                  <Link to={`/projects/completed/${data.urlName}`}>
                    <p className="completed-project-card-target">
                      {data.projectAIM}
                    </p>
                  </Link>
                </>
              ) : activeField === "Skills" ? (
                <>
                  <div className="completed-project-card-features">
                    {data.skills.map((skill, index) => (
                      <span key={index} className="profile-skill">
                        {skill}
                      </span>
                    ))}
                  </div>
                </>
              ) : activeField === "TimeDuration" ? (
                <>
                  <ul class="completed-project-card-time-duration">
                    <li style={{ color: "blue" }}>
                      Requested On:{" "}
                      {new Date(data.requestedOn.seconds * 1000).toDateString()}
                    </li>
                    <li style={{ color: "blue" }}>
                      {new Date(data.startedOn.seconds * 1000).toDateString()}
                    </li>
                    {new Date(data.completedOn.seconds * 1000).getTime() <=
                    new Date(data.targetFinishDate.seconds * 1000).getTime() ? (
                      <li style={{ color: "green" }}>
                        Completed On:{" "}
                        {new Date(
                          data.completedOn.seconds * 1000
                        ).toDateString()}
                      </li>
                    ) : null}
                    <li style={{ color: "grey" }}>
                      Target Date:{" "}
                      {new Date(
                        data.targetFinishDate.seconds * 1000
                      ).toDateString()}
                    </li>
                    {new Date(data.completedOn.seconds * 1000).getTime() >
                    new Date(data.targetFinishDate.seconds * 1000).getTime() ? (
                      <li style={{ color: "red" }}>
                        Completed On:{" "}
                        {new Date(
                          data.completedOn.seconds * 1000
                        ).toDateString()}
                      </li>
                    ) : null}
                  </ul>
                </>
              ) : activeField === "Team" ? (
                <>
                  {data.teamMembers.map(({ id }) => (
                    <TeamMember key={id} id={id} />
                  ))}
                </>
              ) : (
                <>
                  <div className="completed-project-card-features">
                    {data.projectFeaturesDescription}
                  </div>
                </>
              )}
            </div>
            <div className="bottom-row">
              <div>
                <small>
                  <i className="las la-thumbs-up"></i>
                  &nbsp;
                  {data.totalLikes}
                </small>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <small>
                  <i className="las la-eye"></i>
                  &nbsp; {data.totalViews}
                </small>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <small>
                  <i className="las la-comment-alt"></i>
                  &nbsp;
                  {data.totalComments}
                </small>
              </div>
            </div>
            <div className="pxc-tags">
              <div
                className={
                  activeField === "Target"
                    ? "completed-project-active-field"
                    : ""
                }
                onMouseMove={() => setActiveField("Target")}
              >
                Target
              </div>

              <div
                className={
                  activeField === "Skills"
                    ? "completed-project-active-field"
                    : ""
                }
                onMouseMove={() => setActiveField("Skills")}
              >
                Skills
              </div>

              <div
                className={
                  activeField === "TimeDuration"
                    ? "completed-project-active-field"
                    : ""
                }
                onMouseMove={() => setActiveField("TimeDuration")}
              >
                {" "}
                Time duration
              </div>
              <div
                className={
                  activeField === "Team" ? "completed-project-active-field" : ""
                }
                onMouseMove={() => setActiveField("Team")}
              >
                Team
              </div>
              <div
                className={
                  activeField === "Features"
                    ? "completed-project-active-field"
                    : ""
                }
                onMouseMove={() => setActiveField("Features")}
              >
                Features
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}

function TeamMember({ id }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const getUserData = async () => {
      const userRef = doc(db, "users", id);
      await getDoc(userRef)
        .then((docSnap) => {
          setUserData(docSnap.data());
          setLoading(true);
        })
        .catch((error) => {
          if (error.message === "Quota exceeded.") {
            navigate("/server/server-down");
          } else {
            navigate("/error/Something Went Wrong ⚠️");
          }
        });
    };
    getUserData();
  }, [id]);

  return loading === true ? (
    <Link to={`/users/${userData.urlName}`}>
      <div className="completed-project-card-team">
        <div className="user-pic">
          <img src={userData.profilePic} alt={userData.userName} />
          <br />
          <span>{userData.userName}</span>
        </div>
      </div>
    </Link>
  ) : null;
}

export default DoneProjectCard;
