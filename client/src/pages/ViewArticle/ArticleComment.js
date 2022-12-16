import { useContext, useEffect, useState } from "react";
import ArticleCommentForm from "./ArticleCommentForm";
import { AllArticleCommentsContext } from "./ViewArticle";

import "./ArticleComment.css";
import { doc, getDoc } from "firebase/firestore";
import db from "../../firebase/firebase-config";
import { Link, useNavigate } from "react-router-dom";

export default function ArticleComment({ comment, firstParentId }) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const toggleReplyBox = () => setShowReplyBox(!showReplyBox);

  const [showMore, setShowMore] = useState(true);
  const toggleShowMore = () => setShowMore(!showMore);

  const commentsData = useContext(AllArticleCommentsContext);

  return (
    <>
      <div className="article-info-comment-grid" id={comment.commentIdId}>
        <User userUniqueId={comment.userUniqueId} comment={comment} />
        <div className="article-info-comment-grid-user-comment">
          <p>{comment.commentContent.trim()}</p>
        </div>

        <button
          onClick={toggleReplyBox}
          className="article-info-comment-reply-btn"
        >
          {showReplyBox ? "Cancel" : "Reply"}
        </button>
        <br />
        {showReplyBox && (
          <ArticleCommentForm
            parentCommentId={comment.commentId}
            firstParentId={firstParentId || comment.commentId}
            toggleReplyBox={toggleReplyBox}
            showReplyBox={showReplyBox}
          />
        )}
      </div>
      <div
        className={
          !showMore
            ? "article-info-child-comment-grid article-info-child-comment-grid-toggle "
            : "article-info-child-comment-grid"
        }
      >
        {comment.childComments.length > 0 && (
          <>
            {comment.childComments.map((childComment) => (
              <ArticleComment
                comment={childComment}
                key={childComment.commentId}
                firstParentId={firstParentId || comment.commentId}
              />
            ))}
          </>
        )}
      </div>
    </>
  );
}

function User({ comment, userUniqueId }) {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      const userRef = doc(db, "users", userUniqueId);
      await getDoc(userRef)
        .then((docSnap) => {
          setUserData(docSnap.data());
          setLoading(true);
        })
        .catch((error) => {
          navigate("/error/Something Went Wrong ⚠️");
        });
    };
    getUserData();
  }, []);

  return loading === true ? (
    <div className="requested-project-info-comment-grid-user-details">
      <Link to={`/users/${userUniqueId}`}>
        <div className="requested-project-info-comment-grid-user-img">
          <img src={userData.profilePic} />
        </div>
      </Link>
      <div className="requested-project-info-comment-grid-user-posted-date">
        <Link to={`/users/${userUniqueId}`}>
          <strong>{userData.userName}</strong>
        </Link>
        <small>
          {" "}
          {new Date(comment.createdAt.seconds * 1000).toDateString()}{" "}
        </small>
      </div>
    </div>
  ) : null;
}
