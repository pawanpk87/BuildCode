import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import FullPageLoader from "../../components/Loader/FullPageLoader/FullPageLoader";
import { useUserAuth } from "../../context/UserAuthContextProvider";
import db from "../../firebase/firebase-config";
import ProjectCard from "./ProjectCard/ProjectCard";
import ProjeBlogCard from "./ProjectBlogCard/ProjectBlogCard";
import ArticleCard from "./ArticleCard/ArticleCard";
import "./MyList.css";

function MyList({ setPageSidebar }) {
  const navigate = useNavigate();

  useEffect(() => {
    setPageSidebar(true);
  }, [setPageSidebar]);

  const { userUniqueId, userData } = useUserAuth();

  const [done, setDone] = useState(false);

  const [currentUserData, setCurrentUserData] = useState({});

  const [currentSavedArticleArray, setCurrentSavedArticleArray] = useState([]);
  const [currentSavedProjectBlogArray, setCurrentSavedProjectBlogArray] =
    useState([]);
  const [currentSavedProjectArray, setCurrentSavedProjectArray] = useState([]);

  const [totalSavedArticleArray, setTotalSavedArticleArray] = useState([]);
  const [totalSavedProjectBlogArray, setTotalSavedProjectBlogArray] = useState(
    []
  );
  const [totalSavedProjectArray, setTotalSavedProjectArray] = useState([]);

  const [isEmptySavedArticleArray, setIsEmptySavedArticleArray] =
    useState(false);
  const [isEmptySavedProjectBlogArray, setIsEmptySavedProjectBlogArray] =
    useState(false);
  const [isEmptySavedProjectArray, setIsEmptySavedProjectArray] =
    useState(false);

  useEffect(() => {
    if (userData !== null) {
      const getAllSavedData = async () => {
        const userRef = doc(db, "users", userData.urlName);
        await getDoc(userRef)
          .then((docSnap) => {
            setCurrentUserData(docSnap.data());
            if (docSnap.data().isDeleted === true) {
              navigate(
                "/error/This account has been deleted if you are an account holder then mail us contact@buildcode to deactivate."
              );
            } else if (docSnap.data().redUser === true) {
              navigate(
                "/error/This account has been suspended due to a violation of the BuildCode account user agreement if you are an account holder then mail us contact@buildcode to deactivate."
              );
            } else {
              // saved projects
              if (docSnap.data().myProjectList.length === 0) {
                setIsEmptySavedProjectArray(true);
              } else {
                let tempCurrentSavedProjectArray = docSnap.data().myProjectList;
                setCurrentSavedProjectArray(
                  tempCurrentSavedProjectArray.splice(0, 5)
                );
                setTotalSavedProjectArray(tempCurrentSavedProjectArray);
              }

              // saved project blogs
              if (docSnap.data().myProjectBlogList.length === 0) {
                setIsEmptySavedProjectBlogArray(true);
              } else {
                let tempCurrentProjectBlogArray =
                  docSnap.data().myProjectBlogList;
                setCurrentSavedProjectBlogArray(
                  tempCurrentProjectBlogArray.splice(0, 5)
                );
                setTotalSavedProjectBlogArray(tempCurrentProjectBlogArray);
              }

              // saved articles
              if (docSnap.data().myArticleList.length === 0) {
                setIsEmptySavedArticleArray(true);
              } else {
                let tempCurrentArticleArray = docSnap.data().myArticleList;
                setCurrentSavedArticleArray(
                  tempCurrentArticleArray.splice(0, 5)
                );
                setTotalSavedArticleArray(tempCurrentArticleArray);
              }
              setDone(true);
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
      getAllSavedData();
    }
  }, [userData]);

  const fetchMoreSavedArticleCard = () => {
    let next = totalSavedArticleArray.splice(0, 3);
    let newArticlesArray = [...currentSavedArticleArray, ...next];
    setCurrentSavedArticleArray(newArticlesArray);
    setTotalSavedArticleArray(totalSavedArticleArray);
  };

  const fetchMoreSavedProjectCard = () => {
    let next = totalSavedProjectArray.splice(0, 3);
    let newProjectsArray = [...currentSavedProjectArray, ...next];
    setCurrentSavedProjectArray(newProjectsArray);
    setTotalSavedProjectArray(totalSavedProjectArray);
  };

  const fetchMoreSaveddProjectBlogCard = () => {
    let next = totalSavedProjectBlogArray.splice(0, 3);
    let newSavedProjectsBlogArray = [...currentSavedProjectBlogArray, ...next];
    setCurrentSavedProjectBlogArray(newSavedProjectsBlogArray);
    setTotalSavedProjectBlogArray(totalSavedProjectBlogArray);
  };

  const [activeOption, setActiveOption] = useState("Articles");

  return done === false ? (
    <FullPageLoader color={"blue"} height={"50px"} width={"50px"} />
  ) : (
    <>
      <Helmet>
        <title>{"Your lists"}</title>

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
          content={userData.userName + " - BuildCode"}
          data-rh="true"
        />

        <meta name="description" content={userData.aboutMe} data-rh="true" />

        <meta
          property="og:description"
          content={userData.aboutMe}
          data-rh="true"
        />

        <meta
          name="twitter:description"
          content={userData.aboutMe}
          data-rh="true"
        />

        <meta
          property="og:url"
          content={`https://buildcode.org/users/${userData.urlName}`}
          data-rh="true"
        />

        <meta
          property="al:web:url"
          content={`https://buildcode.org/users/${userData.urlName}`}
          data-rh="true"
        />

        <meta
          property="al:ios:url"
          content={`BuildCode://@${userData.userName}`}
          data-rh="true"
        />

        <meta
          name="twitter:app:url:iphone"
          content={`BuildCode://@${userData.userName}`}
          data-rh="true"
        />

        <meta
          property="al:android:url"
          content={`BuildCode://@${userData.userName}`}
          data-rh="true"
        />

        <meta
          property="og:image"
          content={userData.profilePic}
          data-rh="true"
        />

        <meta
          name="twitter:image:src"
          content={userData.profilePic}
          data-rh="true"
        />

        <meta
          property="profile:username"
          content={userData.userName}
          data-rh="true"
        />

        <meta property="og:type" content="profile" data-rh="true" />

        <meta name="twitter:card" content="summary" data-rh="true" />
      </Helmet>
      <div className="userlist-main-grid">
        <h4>Your lists</h4>
        <div className="userlist-page-tag">
          <ul>
            <li>
              <button
                className={activeOption === "Articles" ? "active-option" : ""}
                onClick={() => setActiveOption("Articles")}
              >
                Articles
              </button>
            </li>
            <li>
              <button
                className={
                  activeOption === "Project Blogs" ? "active-option" : ""
                }
                onClick={() => setActiveOption("Project Blogs")}
              >
                Project Blogs
              </button>
            </li>
            <li>
              <button
                className={activeOption === "Projects" ? "active-option" : ""}
                onClick={() => setActiveOption("Projects")}
              >
                Projects
              </button>
            </li>
          </ul>
        </div>
        <div className="main-contant">
          {activeOption === "Projects" ? (
            <>
              {isEmptySavedProjectArray ? (
                <h4>No saved projects</h4>
              ) : (
                <div className="user-list-card-grid">
                  {currentSavedProjectArray.map((id, index) => (
                    <ProjectCard
                      key={index}
                      userData={currentUserData}
                      uniqueProjectId={id}
                    />
                  ))}
                </div>
              )}
            </>
          ) : activeOption === "Project Blogs" ? (
            <>
              {isEmptySavedProjectBlogArray ? (
                <h4>No saved project blogs</h4>
              ) : currentSavedProjectBlogArray.length > 0 ? (
                <div className="user-list-card-grid">
                  {currentSavedProjectBlogArray.map((id, index) => (
                    <ProjeBlogCard
                      userData={currentUserData}
                      key={index}
                      uniqueProjectId={id}
                    />
                  ))}
                </div>
              ) : null}
            </>
          ) : (
            <>
              {isEmptySavedArticleArray ? (
                <h4>No saved articles</h4>
              ) : (
                <div className="user-list-card-grid">
                  {currentSavedArticleArray.map((id, index) => (
                    <ArticleCard
                      userData={currentUserData}
                      key={index}
                      uniqueArticleId={id}
                    />
                  ))}
                </div>
              )}
            </>
          )}
          {activeOption === "Articles" ? (
            <>
              {totalSavedArticleArray.length > 0 ? (
                <div style={{ textAlign: "center" }}>
                  <ArrowDropDownIcon
                    style={{
                      cursor: "pointer",
                      width: "3.5rem",
                      height: "3.5rem",
                    }}
                    onClick={fetchMoreSavedArticleCard}
                  ></ArrowDropDownIcon>
                </div>
              ) : null}
            </>
          ) : activeOption === "Projects" ? (
            <>
              {totalSavedProjectArray.length > 0 ? (
                <div style={{ textAlign: "center" }}>
                  <ArrowDropDownIcon
                    style={{
                      cursor: "pointer",
                      width: "3.5rem",
                      height: "3.5rem",
                    }}
                    onClick={fetchMoreSavedProjectCard}
                  ></ArrowDropDownIcon>
                </div>
              ) : null}
            </>
          ) : (
            <>
              {totalSavedProjectBlogArray.length > 0 ? (
                <div style={{ textAlign: "center" }}>
                  <ArrowDropDownIcon
                    style={{
                      cursor: "pointer",
                      width: "3.5rem",
                      height: "3.5rem",
                    }}
                    onClick={fetchMoreSaveddProjectBlogCard}
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

export default MyList;
