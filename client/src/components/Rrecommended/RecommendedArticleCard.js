import React from "react";
import GradingIcon from "@mui/icons-material/Grading";
import { Link } from "react-router-dom";
import "./RecommendedArticleCard.css";

function RecommendedArticleCard({ data }) {
  return data === null || data === undefined ? (
    <></>
  ) : (
    <div className="rec-article-card">
      <Link to={`/${data.urlName}`} target="_blank">
        <div className="title">
          <span>
            {data.title === undefined ? data.projectName : data.title}
          </span>
        </div>
        <div className="rec-article-main-content">
          <p>
            {data.description === undefined
              ? data.projectBlogDescription
              : data.description}
          </p>
        </div>
        <small>
          <GradingIcon style={{ width: "0.8rem" }}></GradingIcon>{" "}
          {new Date(
            (data.postedOn === undefined ? data.completedOn : data.postedOn)
              .seconds * 1000
          ).toDateString()}
        </small>
      </Link>
    </div>
  );
}

export default RecommendedArticleCard;
