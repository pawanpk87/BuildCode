import { useContext } from "react";
import ArticleComment from "./ArticleComment";
import { AllArticleCommentsContext } from "./ViewProjectBlog";

export default function AllComments() {
  const allComments = useContext(AllArticleCommentsContext).allComments.sort(
    (comment1, comment2) =>
      new Date(comment2.createdAt.seconds * 1000).getTime() -
      new Date(comment1.createdAt.seconds * 1000).getTime()
  );
  const commentList = allComments?.map((comment) => {
    return <ArticleComment key={comment.commentId} comment={comment} />;
  });

  return <ul>{commentList}</ul>;
}
