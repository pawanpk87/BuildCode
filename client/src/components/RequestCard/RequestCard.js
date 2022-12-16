import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ModeStandbyIcon from "@mui/icons-material/ModeStandby";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import GroupsIcon from "@mui/icons-material/Groups";
import { uuidv4 } from "@firebase/util";
import { doc, getDoc } from "firebase/firestore";
import db from "../../firebase/firebase-config";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CodeIcon from "@mui/icons-material/Code";
import "./RequestCard.css";

function RequestCard({ data, id, isOnGoing }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const projectDetails = data;
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (data === null || data == undefined) {
      setLoading(false);
    } else {
      const getData = async () => {
        const userRef = doc(db, "users", data.requestedBy[0].id);
        await getDoc(userRef)
          .then((docSnap) => {
            setUserData(docSnap.data());
            setTimeout(() => {
              setLoading(false);
            }, 1000);
          })
          .catch((error) => {
            navigate("/error/Something Went Wrong ⚠️");
          });
      };
      getData();
    }
  }, []);

  const getProjectSkills = () => {
    let list = projectDetails.skills.map((skl) => {
      return (
        <small key={uuidv4()} className="request-card-skill-tag">
          {skl}
        </small>
      );
    });
    return list;
  };

  let ProjectSkills;

  if (data !== null || data !== undefined) {
    ProjectSkills = getProjectSkills();
  }

  return loading === true || data === null || data === undefined ? (
    <></>
  ) : (
    <div className="requested-project-card shadow p-3 mb-3 bg-white rounded">
      <div className="card-header">
        <span>{projectDetails.technology}</span>
      </div>
      <div className="card-title">
        <span>{projectDetails.projectName}</span>
      </div>
      <div className="requested-project-fields">
        <ModeStandbyIcon
          style={{
            width: "35px",
            height: "22px",
            color: "black",
          }}
        ></ModeStandbyIcon>
        <span>
          <span className="heading-name">Target: </span>
          <small style={{ wordBreak: "break-all" }}>
            {projectDetails.projectAIM}
          </small>
        </span>
      </div>
      <div className="requested-project-fields-skills">
        <FactCheckIcon
          style={{
            width: "35px",
            height: "22px",
            color: "black",
          }}
        ></FactCheckIcon>
        <span>
          <span className="heading-name">Skills:</span>
          <small style={{ wordBreak: "break-all" }}>{ProjectSkills}</small>
        </span>
      </div>
      <div className="requested-project-team-fields">
        <div>
          <GroupsIcon
            style={{
              width: "35px",
              height: "22px",
              color: "black",
            }}
          ></GroupsIcon>
        </div>
        <div></div>
        <div></div>
        <div>
          <PeopleAltIcon
            style={{
              width: "35px",
              height: "22px",
              color: "black",
            }}
          ></PeopleAltIcon>
        </div>
        <div>
          <small className="heading-name">Team Size </small>
        </div>
        <div></div>
        <div></div>
        <div>
          <small className="heading-name">Need </small>
        </div>
        <div>
          <small>{projectDetails.teamSize}</small>
        </div>
        <div></div>
        <div></div>
        <div>
          <small>
            {projectDetails.teamSize - projectDetails.teamMembers.length}
          </small>
        </div>
      </div>
      <div className="user">
        <div className="col1">
          <small id="posted-by">Posted by</small>
          <div style={{ cursor: "pointer" }}>
            <Link to={`/users/${userData.urlName}`}>
              <img src={userData.profilePic} alt={userData.userName} />
            </Link>
          </div>
        </div>
        <div className="col2">
          <div id="demo">
            <small>Requested On</small>
            <br />
            <small>
              {new Date(
                projectDetails.requestedOn.seconds * 1000
              ).toDateString()}
            </small>
          </div>
        </div>
      </div>
      <div className="project-card-tags">
        <strong>
          <i className="las la-eye"></i>
          &nbsp; {data.totalViews}
        </strong>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <strong>
          <i className="las la-comment-alt"></i>
          &nbsp;
          {data.totalComments}
        </strong>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <i className="las la-tags"></i>
        {data.tags.map((tag, index) => (
          <Link key={uuidv4()} to={`/search/tags/${tag}`}>
            <small key={index}>
              <span>#</span>
              {tag}
            </small>
          </Link>
        ))}
      </div>
      <Link className="view-details makeLink" to={`/projects/${id}`}>
        {isOnGoing !== undefined ? (
          <CodeIcon></CodeIcon>
        ) : (
          <PendingActionsIcon></PendingActionsIcon>
        )}
        {"  "}
        View Details
      </Link>
    </div>
  );
}

export default RequestCard;
