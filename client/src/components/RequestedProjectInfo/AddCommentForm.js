import React, { useContext, useState } from "react";
import { useUserAuth } from "../../context/UserAuthContextProvider";
import { uuidv4 } from "@firebase/util";
import { doc, updateDoc } from "firebase/firestore";
import db from "../../firebase/firebase-config";
import { AllCommentsContext } from "./RequestedProjectInfo";
import { useNavigate } from "react-router-dom";
import "./AddCommentForm.css";

function AddCommentForm({
  parentCommentId,
  firstParentId,
  toggleReplyBox,
  showReplyBox,
}) {
  const [isSending, setIsSending] = useState(false);
  const [comment, setComment] = useState("");
  const { user, userUniqueId, userData } = useUserAuth();
  const navigate = useNavigate();

  let commentsData = useContext(AllCommentsContext);

  const getChildComment = (parentComment, childCommentId) => {
    let resultComment = null;
    parentComment?.childComments.forEach((comment) => {
      if (comment.commentId === childCommentId) {
        resultComment = comment;
      } else if (comment.childComments.length > 0) {
        resultComment = getChildComment(comment, childCommentId);
      }
      if (resultComment !== null) return resultComment;
    });
    return resultComment;
  };

  const appendChildComment = (firstParentId, parentCommentId, data) => {
    if (toggleReplyBox !== undefined) {
      toggleReplyBox(!showReplyBox);
    }

    let tempAllComments = commentsData.allComments;
    // top level Comment of child comment
    let parentComment = tempAllComments.find(
      (comment) => comment.commentId === firstParentId
    );

    if (parentComment.childComments.length === 0) {
      parentComment.childComments.push(data);
    } else if (parentComment.commentId === parentCommentId) {
      parentComment.childComments = [data, ...parentComment.childComments];
    } else {
      const childCommentToUpdate = getChildComment(
        parentComment,
        parentCommentId
      );

      if (childCommentToUpdate === null) {
        navigate("/error/Something Went Wrong ⚠️");
      }
      if (childCommentToUpdate.childComments.length === 0) {
        childCommentToUpdate.childComments.push(data);
      } else {
        childCommentToUpdate.childComments = [
          data,
          ...childCommentToUpdate.childComments,
        ];
      }
    }

    const appendComment = async () => {
      const allCommentsRef = doc(db, "projects", commentsData.urlName);
      try {
        await updateDoc(allCommentsRef, {
          allComments: tempAllComments,
        });
      } catch (error) {
        navigate("/bug/Can not add comment here!");
      }
    };
    appendComment();
  };

  const addComment = (parentCommentId, firstParentId, data) => {
    // first chekc is it top level comment
    if (parentCommentId) {
      appendChildComment(firstParentId, parentCommentId, data);
      setComment("");
    } else {
      const addTopLevelComment = async () => {
        const projectRef = doc(db, "projects", commentsData.urlName);
        let tempAllComments = commentsData.allComments;
        tempAllComments.push(data);
        await updateDoc(projectRef, {
          allComments: tempAllComments,
          totalComments: tempAllComments.length,
        });
      };
      addTopLevelComment();
      setComment("");
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (user === null) {
      commentsData.setOpen(true);
    } else if (user.emailVerified === false) {
      navigate("/verify-email");
    } else if (userData.isDeleted === true) {
      navigate(
        "/error/This account has been deleted if you are an account holder then mail us contact@buildcode to deactivate."
      );
    } else if (userData.redUser === true) {
      navigate(
        "/error/This account has been suspended due to a violation of the BuildCode account user agreement if you are an account holder then mail us contact@buildcode to deactivate."
      );
    } else {
      if (comment.trim() === "") return;
      else if (comment.trim().length > 2000) {
        alert("Message is too larg");
      } else {
        addComment(parentCommentId, firstParentId, {
          commentId: uuidv4(),
          commentContent: comment.trim(),
          userName: userData.userName,
          userUniqueId: userUniqueId,
          userIMG: userData.profilePic,
          createdAt: new Date(),
          childComments: [],
        });
      }
    }
  };

  return (
    <div className="add-comment-form">
      <form onSubmit={onSubmit}>
        <textarea
          name="comment"
          placeholder="Type Comment here"
          rows="4"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <input
          type="submit"
          disabled={isSending}
          value={isSending ? "Posting..." : "Post"}
        />
      </form>
    </div>
  );
}

export default AddCommentForm;
