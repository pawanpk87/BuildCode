import { useContext } from "react";
import Comment from "./Comment";
import { AllCommentsContext } from "./CompletedProjectInfo";

export default function AllComments() {
  const allComments = useContext(AllCommentsContext).allComments.sort(
    (comment1, comment2) =>
      new Date(comment2.createdAt.seconds * 1000).getTime() -
      new Date(comment1.createdAt.seconds * 1000).getTime()
  );
  const commentList = allComments?.map((comment) => {
    return <Comment key={comment.commentId} comment={comment} />;
  });

  return <ul>{commentList}</ul>;
}
