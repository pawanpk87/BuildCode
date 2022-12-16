import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import FullPageLoader from "../../components/Loader/FullPageLoader/FullPageLoader";
import UserBlogCard from "../../components/UserBlogCard/UserBlogCard";
import UserProjectCard from "../../components/UserProjectCard/UserProjectCard";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import db from "../../firebase/firebase-config";
import { Helmet } from "react-helmet";
import "./UserAchievementData.css";

function UserAchievementData({ setPageSidebar }) {
  const navigate = useNavigate();

  useEffect(() => {
    setPageSidebar(true);
  }, [setPageSidebar]);

  const [done, setDone] = useState(false);

  const { profileUserUniqueID, type } = useParams();
  const [profileUserData, setProfileUserData] = useState(null);

  const [totalComletedProjectsArray, setTotalComletedProjectsArray] = useState(
    []
  );
  const [totalArticlesArray, setTotalArticlesArray] = useState([]);
  const [totalCurrentProjects, setTotalCurrentProjects] = useState([]);

  const [currentCompletedProjectsArray, setCurrentCompletedProjectsArray] =
    useState([]);
  const [currentArticlesArray, setCurrentArticlesArray] = useState([]);
  const [currentCurrentProjectsArray, setCurrentCurrentProjectsArray] =
    useState([]);

  const [isEmptyCompletedProjectsArray, setIsEmptyCompletedProjectsArray] =
    useState(false);
  const [isEmptyArticlesArray, setIsEmptyArticlesArray] = useState(false);
  const [isEmptyCurrentProjectsArray, setIsEmptyCurrentProjectsArray] =
    useState(false);

  useEffect(() => {
    if (
      type === "current-projects" ||
      type === "completed-projects" ||
      type === "articles"
    ) {
      const getRequestedUserData = async () => {
        const userRef = doc(db, "users", profileUserUniqueID);
        await getDoc(userRef)
          .then((docSnap) => {
            if (docSnap.exists()) {
              setProfileUserData(docSnap.data());
              if (docSnap.data().isDeleted === true) {
                navigate(
                  "/error/This account has been deleted if you are an account holder then mail us contact@buildcode to deactivate."
                );
              } else if (docSnap.data().redUser === true) {
                navigate(
                  "/error/This account has been suspended due to a violation of the BuildCode account user agreement if you are an account holder then mail us contact@buildcode to deactivate."
                );
              } else {
                if (docSnap.data().currentProjects.length === 0) {
                  setIsEmptyCurrentProjectsArray(true);
                } else {
                  let tempCurrentProjectsArray = docSnap.data().currentProjects;
                  setCurrentCurrentProjectsArray(
                    tempCurrentProjectsArray.splice(0, 9)
                  );
                  setTotalCurrentProjects(tempCurrentProjectsArray);
                }

                if (docSnap.data().completedProjects.length === 0) {
                  setIsEmptyCompletedProjectsArray(true);
                } else {
                  let tempCompletedProjectsArray =
                    docSnap.data().completedProjects;
                  setCurrentCompletedProjectsArray(
                    tempCompletedProjectsArray.splice(0, 9)
                  );
                  setTotalComletedProjectsArray(tempCompletedProjectsArray);
                }

                if (docSnap.data().articles.length === 0) {
                  setIsEmptyArticlesArray(true);
                } else {
                  let tempAriclesArray = docSnap.data().articles;
                  setCurrentArticlesArray(tempAriclesArray.splice(0, 9));
                  setTotalArticlesArray(tempAriclesArray);
                }

                setDone(true);
              }
            } else {
              navigate("/error/Not Found");
            }
          })
          .catch((error) => {
            if (error.message === "Quota exceeded.") {
              navigate("/server/server-down");
            } else {
              navigate("/error/Something Went Wrong ⚠️");
            }
          });
      };
      getRequestedUserData();
    } else {
      navigate("/error/Something Went Wrong ⚠️");
    }
  }, [navigate, profileUserUniqueID, type]);

  const fetchMoreUserArticleCard = () => {
    let next = totalArticlesArray.splice(0, 3);
    let newArticlesArray = [...currentArticlesArray, ...next];
    setCurrentArticlesArray(newArticlesArray);
    setTotalArticlesArray(totalArticlesArray);
  };

  const fetchMoreCurrentProjectCard = () => {
    let next = totalCurrentProjects.splice(0, 3);
    let newCurrentProjectsArray = [...currentCurrentProjectsArray, ...next];
    setCurrentCurrentProjectsArray(newCurrentProjectsArray);
    setTotalCurrentProjects(totalCurrentProjects);
  };

  const fetchMoreCompletedProjectCard = () => {
    let next = totalComletedProjectsArray.splice(0, 3);
    let newCompletedProjectsArray = [...currentCompletedProjectsArray, ...next];
    setCurrentCompletedProjectsArray(newCompletedProjectsArray);
    setTotalComletedProjectsArray(totalComletedProjectsArray);
  };

  return done === false ? (
    <FullPageLoader color={"blue"} height={"50px"} width={"50px"} />
  ) : (
    <>
      <Helmet>
        <title>{profileUserData.userName + " - BuildCode"}</title>

        <meta data-rh="true" charset="utf-8" />

        <meta
          data-rh="true"
          name="viewport"
          content="width=device-width,minimum-scale=1,initial-scale=1,maximum-scale=1"
        />

        <meta data-rh="true" name="theme-color" content="#000000" />
        <meta
          data-rh="true"
          name="twitter:app:name:iphone"
          content="BuildCode"
        />

        <meta data-rh="true" property="og:site_name" content="BuildCode" />

        <link
          data-rh="true"
          rel="icon"
          href="https://firebasestorage.googleapis.com/v0/b/buildcode-db.appspot.com/o/BuildCode%2Fbuild-code-log-png.png?alt=media&token=89dee950-0ea9-4ce9-9c7c-3f6d036dd595"
        />

        <link
          data-rh="true"
          rel="apple-touch-icon"
          sizes="152x152"
          href="https://firebasestorage.googleapis.com/v0/b/buildcode-db.appspot.com/o/BuildCode%2Fbuild-code-log-png.png?alt=media&token=89dee950-0ea9-4ce9-9c7c-3f6d036dd595"
        />

        <link
          data-rh="true"
          rel="apple-touch-icon"
          sizes="120x120"
          href="https://firebasestorage.googleapis.com/v0/b/buildcode-db.appspot.com/o/BuildCode%2Fbuild-code-log-png.png?alt=media&token=89dee950-0ea9-4ce9-9c7c-3f6d036dd595"
        />

        <link
          data-rh="true"
          rel="apple-touch-icon"
          sizes="76x76"
          href="https://firebasestorage.googleapis.com/v0/b/buildcode-db.appspot.com/o/BuildCode%2Fbuild-code-icon-png.png?alt=media&token=eb100399-82b0-499b-8837-395e5e77d8b1"
        />

        <link
          data-rh="true"
          rel="apple-touch-icon"
          sizes="60x60"
          href="https://firebasestorage.googleapis.com/v0/b/buildcode-db.appspot.com/o/BuildCode%2Fbuild-code-icon-png.png?alt=media&token=eb100399-82b0-499b-8837-395e5e77d8b1"
        />

        <meta
          property="og:title"
          content={profileUserData.userName + " - BuildCode"}
          data-rh="true"
        />

        <meta
          name="description"
          content={profileUserData.aboutMe}
          data-rh="true"
        />

        <meta
          property="og:description"
          content={profileUserData.aboutMe}
          data-rh="true"
        />

        <meta
          name="twitter:description"
          content={profileUserData.aboutMe}
          data-rh="true"
        />

        <meta
          property="og:url"
          content={`https://buildcode.org/users/${profileUserData.urlName}`}
          data-rh="true"
        />

        <meta
          property="al:web:url"
          content={`https://buildcode.org/users/${profileUserData.urlName}`}
          data-rh="true"
        />

        <meta
          property="al:ios:url"
          content={`BuildCode://@${profileUserData.userName}`}
          data-rh="true"
        />

        <meta
          name="twitter:app:url:iphone"
          content={`BuildCode://@${profileUserData.userName}`}
          data-rh="true"
        />

        <meta
          property="al:android:url"
          content={`BuildCode://@${profileUserData.userName}`}
          data-rh="true"
        />

        <meta
          property="og:image"
          content={profileUserData.profilePic}
          data-rh="true"
        />

        <meta
          name="twitter:image:src"
          content={profileUserData.profilePic}
          data-rh="true"
        />

        <meta
          property="profile:username"
          content={profileUserData.userName}
          data-rh="true"
        />

        <meta property="og:type" content="profile" data-rh="true" />

        <meta name="twitter:card" content="summary" data-rh="true" />
      </Helmet>
      <div className="requested-user-data-main">
        <div className="requested-user-data-main-grid">
          <div className="user-details">
            <div className="img">
              <Link to={`/users/${profileUserData.urlName}`}>
                <img
                  src={profileUserData.profilePic}
                  alt={profileUserData.userName}
                />
              </Link>
            </div>
            <div className="name">
              <Link to={`/users/${profileUserData.urlName}`}>
                <span>{profileUserData.userName}</span>
              </Link>
            </div>
          </div>
          <div className="main-contant">
            {type === "current-projects" ? (
              <>
                <br />
                <div className="type">Current Projects</div>
                <br />
                {isEmptyCurrentProjectsArray ? (
                  <h4>No Current Projects</h4>
                ) : (
                  <div className="requested-user-current-ach-grid">
                    {currentCurrentProjectsArray.map(
                      (completedprojectUniqueID, index) => (
                        <UserProjectCard
                          key={index}
                          uniqueProjectId={completedprojectUniqueID}
                          type={"current"}
                        />
                      )
                    )}
                  </div>
                )}
              </>
            ) : type === "completed-projects" ? (
              <>
                <br />
                <div className="type">Completed Projects</div>
                <br />
                {isEmptyCompletedProjectsArray ? (
                  <h4>No Completed Projects</h4>
                ) : (
                  <div className="requested-user-current-ach-grid">
                    {currentCompletedProjectsArray.map(
                      (completedprojectUniqueID, index) => (
                        <UserProjectCard
                          key={index}
                          uniqueProjectId={completedprojectUniqueID}
                          type={"completed"}
                        />
                      )
                    )}
                  </div>
                )}
              </>
            ) : (
              <>
                <br />
                <div className="type">Articles</div>
                <br />
                {isEmptyArticlesArray ? (
                  <h4>No Articles</h4>
                ) : (
                  <div className="requested-user-current-ach-grid">
                    {currentArticlesArray.map((uniqueArticleId, index) => (
                      <UserBlogCard
                        key={index}
                        uniqueArticleId={uniqueArticleId}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
          {type === "current-projects" ? (
            <>
              {totalCurrentProjects.length > 0 ? (
                <div style={{ textAlign: "center" }}>
                  <ArrowDropDownIcon
                    style={{ cursor: "pointer" }}
                    onClick={fetchMoreCurrentProjectCard}
                  ></ArrowDropDownIcon>
                </div>
              ) : null}
            </>
          ) : type === "completed-projects" ? (
            <>
              {totalComletedProjectsArray.length > 0 ? (
                <div style={{ textAlign: "center" }}>
                  <ArrowDropDownIcon
                    style={{ cursor: "pointer" }}
                    onClick={fetchMoreCompletedProjectCard}
                  ></ArrowDropDownIcon>
                </div>
              ) : null}
            </>
          ) : (
            <>
              {totalArticlesArray.length > 0 ? (
                <div style={{ textAlign: "center" }}>
                  <ArrowDropDownIcon
                    style={{ cursor: "pointer" }}
                    onClick={fetchMoreUserArticleCard}
                  ></ArrowDropDownIcon>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default UserAchievementData;
