import React from "react";
import { timeSince } from "../../Util/Utils";
import { Link } from "react-router-dom";
import "./RecommendedProjectRequestCard.css";

function RecommendedProjectRequestCard({ data }) {
  return data === null || data === undefined ? (
    <></>
  ) : (
    <Link to={`/projects/${data.urlName}`} target="_blank">
      <div className="rec-project-request-card-main-grid">
        <h4>{data.projectName}</h4>
        <span className="technology">{data.technology}</span>
        <div className="title">
          <span className="project-aim">{data.projectAIM}</span>
        </div>
        <div className="skills">
          <span>
            <span className="heading-name">Skills:</span>
            <small style={{ wordBreak: "break-all" }}>
              {data.skills.map((skill, index) => (
                <span key={index} className="request-project-info-skill-tag">
                  {skill}
                </span>
              ))}
            </small>
          </span>
        </div>
        <div className="posted">
          <span>
            {timeSince(new Date(data.requestedOn.seconds * 1000))} {" ago"}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default RecommendedProjectRequestCard;
