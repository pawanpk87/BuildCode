import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import db from "../../../firebase/firebase-config";
import swal from "sweetalert";
import "./ProjectBlogCard.css";

function ProjectBlogCard({ userData, uniqueProjectId }) {
  const navigate = useNavigate();
  const [projectBlogDetails, setProjectBlogDetails] = useState({});

  useEffect(() => {
    const getProjectBlogDetails = async () => {
      const articlesRef = doc(db, "project-blogs", uniqueProjectId);
      await getDoc(articlesRef)
        .then((docSnap) => {
          setProjectBlogDetails(docSnap.data());
        })
        .catch((error) => {
          navigate("/error/Something Went Wrong ⚠️");
        });
    };
    getProjectBlogDetails();
  }, [uniqueProjectId]);

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
          let userProjectBlogs = userData.myProjectBlogList;
          let indexOfProjectBlog = userProjectBlogs.indexOf(uniqueProjectId);
          if (indexOfProjectBlog !== -1) {
            userProjectBlogs.splice(indexOfProjectBlog, 1);
          }

          let userRef = doc(db, "users", userData.urlName);

          await updateDoc(userRef, {
            myProjectBlogList: userProjectBlogs,
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

  return projectBlogDetails === null || projectBlogDetails === undefined ? (
    <></>
  ) : (
    <div className="user-saved-project-blog-card">
      <Link to={`/project-blog/${uniqueProjectId}`}>
        <div id="first">{projectBlogDetails.projectName}</div>{" "}
      </Link>
      <div id="second">
        <HighlightOffIcon onClick={handleDelete}></HighlightOffIcon>
      </div>
    </div>
  );
}

export default ProjectBlogCard;
