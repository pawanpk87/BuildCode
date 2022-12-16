import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import db from "../../firebase/firebase-config";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import "./UserProjectCard.css";

function UserProjectCard({ uniqueProjectId, type }) {
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const [projectDetails, setProjectDetails] = useState(null);

  useEffect(() => {
    const getProjectDetails = async () => {
      const projectsRef = doc(db, "projects", uniqueProjectId);
      await getDoc(projectsRef)
        .then((docSnap) => {
          setProjectDetails(docSnap.data());
          setDone(true);
        })
        .catch((error) => {
          if (error.message === "Quota exceeded.") {
            navigate("/server/server-down");
          } else {
            navigate("/error/Something Went Wrong ⚠️");
          }
        });
    };
    getProjectDetails();
  }, [uniqueProjectId, navigate]);

  return done === false ||
    projectDetails === null ||
    projectDetails === undefined ? (
    <></>
  ) : (
    <div className="complete-pjt-card">
      <Link
        to={`/projects/${
          type === "completed" ? "completed/" : ""
        }${uniqueProjectId}`}
      >
        <div className="title">
          <span>
            {projectDetails.projectName}{" "}
            {type === "completed" ? (
              <i className="las la-check-circle"></i>
            ) : (
              <i className="las la-spinner"></i>
            )}
          </span>
        </div>
        <h6>{projectDetails.technology}</h6>
        <p>{projectDetails.projectAIM}</p>
        {type === "requested" || type === "current" ? (
          <>
            <small>
              <EventAvailableIcon
                style={{ width: "0.8rem" }}
              ></EventAvailableIcon>{" "}
              {new Date(
                projectDetails.requestedOn.seconds * 1000
              ).toDateString()}{" "}
              {new Date(
                projectDetails.completedOn.seconds * 1000
              ).toDateString()}
            </small>
          </>
        ) : (
          <>
            <small>
              <EventAvailableIcon
                style={{ width: "0.8rem" }}
              ></EventAvailableIcon>{" "}
              {new Date(
                projectDetails.completedOn.seconds * 1000
              ).toDateString()}
            </small>
          </>
        )}
      </Link>
    </div>
  );
}

export default UserProjectCard;
