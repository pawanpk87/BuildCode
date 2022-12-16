import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { timeSince } from "../../Util/Utils";
import { uuidv4 } from "@firebase/util";
import { doc, getDoc } from "firebase/firestore";
import db from "../../firebase/firebase-config";
import "./BigArticleCard.css";

function BigArticleCard({ id, data }) {
  return data === null || data === undefined ? (
    <></>
  ) : (
    <>
      <div className="big-blog-card-main">
        <div className="big-blog-card">
          {data.articleMainIMG.length > 0 ? (
            <div className="blog-img">
              <Link to={`/${id}`}>
                <img
                  className="blog_image"
                  src={data.articleMainIMG}
                  alt={data.title}
                />
              </Link>
            </div>
          ) : null}
          <div className="blog-content">
            <div className="blog-details">
              <PostedUser id={data.postedBy[0].id} />
              <div className="icon-text" id="blog-user-day">
                <small className="text">
                  &middot; {timeSince(new Date(data.postedOn.seconds * 1000))}{" "}
                  {" ago "}
                </small>
              </div>
            </div>
            <Link to={`/${id}`}>
              <h2 className="blog-title">{data?.title}</h2>
            </Link>
            <Link to={`/${id}`}>
              <p className="description">{data?.description}</p>
            </Link>
            <div className="blog-cta">
              <small>
                <Link to={`/${id}`}>
                  <i className="las la-thumbs-up"></i>{" "}
                  <small>{data.totalLikes}</small>
                </Link>
              </small>
              <small>
                <Link to={`/${id}`}>
                  <i className="las la-comment-alt"></i>{" "}
                  <small>{data.totalComments}</small>
                </Link>
              </small>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div className="blog-card-tags">
                <i className="las la-tags"></i>
                {data.tags.map((tag) => (
                  <Link to={`/search/tags/${tag}`} key={uuidv4()}>
                    <small>
                      <span>#</span>
                      {tag}
                    </small>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function PostedUser({ id }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const getUserData = async () => {
      const userRef = doc(db, "users", id);
      await getDoc(userRef)
        .then((docSnap) => {
          setUserData(docSnap.data());
          setLoading(true);
        })
        .catch((error) => {
          if (error.message === "Quota exceeded.") {
            navigate("/server/server-down");
          } else {
            navigate("/error/Something Went Wrong ⚠️");
          }
        });
    };
    getUserData();
  }, [id]);

  return loading === true ? (
    <>
      <div className="blog-card-user">
        <Link to={`/users/${userData.urlName}`}>
          <img src={userData.profilePic} alt={userData.userName} />
        </Link>
      </div>
      <div className="icon-text" id="blog-user-name">
        <Link to={`/users/${userData.urlName}`}>
          <span className="text">{userData.userName}</span>
        </Link>
      </div>
    </>
  ) : null;
}

export default BigArticleCard;
