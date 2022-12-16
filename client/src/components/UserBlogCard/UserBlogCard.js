import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import db from "../../firebase/firebase-config";
import GradingIcon from "@mui/icons-material/Grading";
import "./UserBlogCard.css";

function UserBlogCard({ uniqueArticleId }) {
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const [articleDetails, setArticleDetails] = useState(null);

  useEffect(() => {
    const getArticleDetails = async () => {
      const articlesRef = doc(db, "articles", uniqueArticleId);
      await getDoc(articlesRef)
        .then((docSnap) => {
          setArticleDetails(docSnap.data());
          setTimeout(() => {
            setDone(true);
          }, 500);
        })
        .catch((error) => {
          if (error.message === "Quota exceeded.") {
            navigate("/server/server-down");
          } else {
            navigate("/error/Something Went Wrong ⚠️");
          }
        });
    };
    getArticleDetails();
  }, [uniqueArticleId, navigate]);

  return done === false ||
    articleDetails === null ||
    articleDetails === undefined ? (
    <></>
  ) : (
    <div className="user-profile-article-card">
      <Link to={`/${uniqueArticleId}`}>
        <div className="title">
          <span>{articleDetails.title}</span>
        </div>
        <div className="user-profile-article-main-content">
          <p>{articleDetails.description}</p>
        </div>
        <small>
          <GradingIcon style={{ width: "0.8rem" }}></GradingIcon>{" "}
          {new Date(articleDetails.postedOn.seconds * 1000).toDateString()}
        </small>
      </Link>
    </div>
  );
}

export default UserBlogCard;
