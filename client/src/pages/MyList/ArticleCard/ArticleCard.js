import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import db from "../../../firebase/firebase-config";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import swal from "sweetalert";
import "./ArticleCard.css";

function ArticleCard({ userData, uniqueArticleId }) {
  const navigate = useNavigate();
  const [articleDetails, setArticleDetails] = useState({});

  useEffect(() => {
    const getArticleDetails = async () => {
      const articlesRef = doc(db, "articles", uniqueArticleId);

      await getDoc(articlesRef)
        .then((docSnap) => {
          setArticleDetails(docSnap.data());
        })
        .catch((error) => {
          navigate("/error/Something Went Wrong ⚠️");
        });
    };
    getArticleDetails();
  }, [uniqueArticleId]);

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
          let userArticles = userData.myArticleList;
          let indexOfArticle = userArticles.indexOf(uniqueArticleId);
          if (indexOfArticle !== -1) {
            userArticles.splice(indexOfArticle, 1);
          }

          let userRef = doc(db, "users", userData.urlName);

          await updateDoc(userRef, {
            myArticleList: userArticles,
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

  return articleDetails === null || articleDetails === undefined ? (
    <></>
  ) : (
    <div className="user-saved-article-card">
      <Link to={`/${uniqueArticleId}`}>
        <div id="first">
          <span>{articleDetails.title}</span>
        </div>
      </Link>
      <div id="second">
        <HighlightOffIcon onClick={handleDelete}></HighlightOffIcon>
      </div>
    </div>
  );
}

export default ArticleCard;
