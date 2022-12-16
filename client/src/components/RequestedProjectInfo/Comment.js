import { useEffect, useState } from "react";
import AddCommentForm from "./AddCommentForm";
import { uuidv4 } from "@firebase/util";
import { doc, getDoc } from "firebase/firestore";
import db from "../../firebase/firebase-config";
import { Link, useNavigate } from "react-router-dom";
import "./Comment.css";

export default function Comment({ comment, firstParentId }) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const toggleReplyBox = () => setShowReplyBox(!showReplyBox);
  const [showMore, setShowMore] = useState(true);
  const toggleShowMore = () => setShowMore(!showMore);

  return (
    <>
      <div
        className="requested-project-info-comment-grid"
        id={comment.commentIdId}
      >
        <User comment={comment} userUniqueId={comment.userUniqueId} />
        <div className="requested-project-info-comment-grid-user-comment">
          <p>{comment.commentContent.trim()}</p>
        </div>
        <button
          onClick={toggleReplyBox}
          className="requested-project-info-comment-reply-btn"
        >
          {showReplyBox ? "Cancle" : "Reply"}
        </button>
        <br />
        {showReplyBox && (
          <AddCommentForm
            key={uuidv4()}
            parentCommentId={comment.commentId}
            firstParentId={firstParentId || comment.commentId}
            toggleReplyBox={toggleReplyBox}
            showReplyBox={showReplyBox}
          />
        )}
      </div>
      <div
        key={uuidv4()}
        className={
          !showMore
            ? "requested-project-info-child-comment-grid requested-project-info-child-comment-grid-toggle "
            : "requested-project-info-child-comment-grid"
        }
      >
        {comment.childComments.length > 0 && (
          <>
            {comment.childComments.map((childComment) => (
              <Comment
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
      console.log(userUniqueId);
      const userRef = doc(db, "users", userUniqueId);
      await getDoc(userRef)
        .then((docSnap) => {
          console.log(docSnap.data());
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
