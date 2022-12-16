import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import db from "../../../firebase/firebase-config";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import swal from "sweetalert";
import "./ProjectCard.css";

function ProjectCard({ userData, uniqueProjectId }) {
  const navigate = useNavigate();

  const [projectDetails, setProjectDetails] = useState({});

  useEffect(() => {
    const getProjectDetails = async () => {
      const projectsRef = doc(db, "projects", uniqueProjectId);
      await getDoc(projectsRef)
        .then((docSnap) => {
          setProjectDetails(docSnap.data());
        })
        .catch((error) => {
          navigate("/error/Something Went Wrong ⚠️");
        });
    };
    getProjectDetails();
  }, [uniqueProjectId, navigate]);

  const handleDelete = async () => {
    swal({
      title: "Are You Sure Want To Delete?",
      text: "",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const deleteRecord = async () => {
          // now delete this article from user profile
          let userProjects = userData.myProjectList;
          let indexOfProject = userProjects.indexOf(uniqueProjectId);
          if (indexOfProject !== -1) {
            userProjects.splice(indexOfProject, 1);
          }

          let userRef = doc(db, "users", userData.urlName);

          await updateDoc(userRef, {
            myProjectList: userProjects,
          })
            .then(() => {})
            .catch((err) => {
              navigate("/error/Something Went Wrong ⚠️");
            });
        };
        deleteRecord();
      } else {
      }
    });
  };

  return projectDetails === null || projectDetails === undefined ? (
    <></>
  ) : (
    <div className="user-saved-project-card ">
      <Link to={`/projects/${uniqueProjectId}`}>
        <div id="first">{projectDetails.projectName}</div>
      </Link>
      <div id="second">
        <HighlightOffIcon onClick={handleDelete}></HighlightOffIcon>
      </div>
    </div>
  );
}

export default ProjectCard;
