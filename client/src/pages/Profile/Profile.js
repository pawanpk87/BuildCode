import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import UserBlogCard from "../../components/UserBlogCard/UserBlogCard";
import UserProjectCard from "../../components/UserProjectCard/UserProjectCard";
import { useUserAuth } from "../../context/UserAuthContextProvider";
import db from "../../firebase/firebase-config";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import FullPageLoader from "../../components/Loader/FullPageLoader/FullPageLoader";
import EmailIcon from "@mui/icons-material/Email";
import emptyIcon from "../../assets/Images/empty.png";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import UpdateAccount from "./UpdateAccount/UpdateAccount";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import SchoolIcon from "@mui/icons-material/School";
import BusinessIcon from "@mui/icons-material/Business";
import { Helmet } from "react-helmet";
import "./Profile.css";

function Profile({ setPageSidebar }) {
  useEffect(() => {
    setPageSidebar(true);
  }, [setPageSidebar]);

  const { profileUserUniqueID } = useParams();
  const { user, userUniqueId, logOut } = useUserAuth();
  const [loading, setLoading] = useState(true);
  const [profileUserData, setUserData] = useState(null);

  const [totalComletedProjectsArray, setTotalComletedProjectsArray] = useState(
    []
  );
  const [totalArticlesArray, setTotalArticlesArray] = useState([]);
  const [currentCompletedProjectsArray, setCurrentCompletedProjectsArray] =
    useState([]);
  const [currentArticlesArray, setCurrentArticlesArray] = useState([]);

  const [isEmptyCompletedProjectsArray, setIsEmptyCompletedProjectsArray] =
    useState(false);
  const [isEmptyArticlesArray, setIsEmptyArticlesArray] = useState(false);

  const [toggle, setToggle] = useState(false);
  const navigate = useNavigate();
  const updateFormRef = useRef(null);

  const scrollToTop = () => {
    updateFormRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const checkDataExists = async () => {
      const q = query(
        collection(db, "users"),
        where("urlName", "==", profileUserUniqueID)
      );

      await getDocs(q)
        .then((querySnapshot) => {
          let flag = false;

          querySnapshot.forEach((doc) => {
            flag = true;
          });

          if (flag === false) {
            navigate("/error/NOT FOUND");
          } else {
            onSnapshot(
              doc(db, "users", profileUserUniqueID),
              { includeMetadataChanges: true },
              (docSnap) => {
                setUserData(docSnap.data());
                if (docSnap.data().isDeleted === true) {
                  navigate(
                    "/error/This account has been deleted if you are an account holder then mail us contact@buildcode to deactivate."
                  );
                } else if (docSnap.data().redUser === true) {
                  navigate(
                    "/error/This account has been suspended due to a violation of the BuildCode account user agreement if you are an account holder then mail us contact@buildcode to deactivate."
                  );
                } else {
                  if (docSnap.data().completedProjects.length === 0) {
                    setIsEmptyCompletedProjectsArray(true);
                  } else {
                    let tempCompletedProjectsArray =
                      docSnap.data().completedProjects;
                    setCurrentCompletedProjectsArray(
                      tempCompletedProjectsArray.splice(0, 10)
                    );
                    setTotalComletedProjectsArray(tempCompletedProjectsArray);
                  }
                  if (docSnap.data().articles.length === 0) {
                    setIsEmptyArticlesArray(true);
                  } else {
                    let tempAriclesArray = docSnap.data().articles;
                    setCurrentArticlesArray(tempAriclesArray.splice(0, 10));
                    setTotalArticlesArray(tempAriclesArray);
                  }
                  setLoading(false);
                }
              }
            );
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
    checkDataExists();
  }, [navigate, profileUserUniqueID]);

  const updateProfile = () => {
    setToggle(!toggle);
    setTimeout(() => {
      scrollToTop();
    }, 200);
  };

  const handleLogOut = async () => {
    try {
      await logOut();
      localStorage.removeItem("BuildCodeUserData");
      navigate("/");
      //window.location.reload();
    } catch {
      navigate("/error/Something went wrong");
    }
  };

  const fetchMoreUserArticlesCard = () => {
    let next = totalArticlesArray.splice(0, 10);
    let newArticlesArray = [...currentArticlesArray, ...next];
    setCurrentArticlesArray(newArticlesArray);
    setTotalArticlesArray(totalArticlesArray);
  };

  const fetchMoreUserProjectCard = () => {
    let next = totalComletedProjectsArray.splice(0, 10);
    let newCompletedProjectsArray = [...currentCompletedProjectsArray, ...next];
    setCurrentCompletedProjectsArray(newCompletedProjectsArray);
    setTotalComletedProjectsArray(totalComletedProjectsArray);
  };

  return loading === true ? (
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
      <div className="profile-grid">
        <div className="profile-card">
          <div className="profile-card-body">
            <div className="d-flex align-items-start">
              <img
                src={profileUserData.profilePic}
                className="rounded-circle avatar-lg img-thumbnail"
                alt={profileUserData.userName}
                style={{ width: "55px", height: "55px", objectFit: "cover" }}
              />
              <div className="w-100 ms-3">
                <h4 className="my-0">{profileUserData.userName}</h4>
                {profileUserData.role.length > 0 ? (
                  <p className="">@{profileUserData.role}</p>
                ) : (
                  "@---"
                )}
              </div>
            </div>
            <div className="mt-3">
              <span className=" font-18 mb-4">
                <AssignmentIndIcon></AssignmentIndIcon>
                {profileUserData.aboutMe.length === 0 ? (
                  <span
                    className="profile-skill"
                    style={{ fontSize: "0.8rem", color: "gray" }}
                  >
                    about me !
                  </span>
                ) : (
                  " " + profileUserData.aboutMe
                )}
              </span>
              <p className=" mt-4 mb-4 font-13">
                <span>
                  <FactCheckIcon
                    style={{
                      width: "1.2rem",
                      height: "1.2rem",
                      color: "black",
                    }}
                  ></FactCheckIcon>
                </span>
                {profileUserData.skills.map((skill, index) => (
                  <span key={index} className="profile-skill">
                    {skill}
                  </span>
                ))}
                {profileUserData.skills.length === 0 ? (
                  <span
                    className="profile-skill"
                    style={{ fontSize: "0.8rem", color: "gray" }}
                  >
                    skills !
                  </span>
                ) : null}
              </p>
              {user !== null && profileUserData.urlName === userUniqueId ? (
                <p className=" mb-4 font-13">
                  <span>
                    <EmailIcon
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        color: "black",
                      }}
                    ></EmailIcon>
                  </span>
                  <span className="ms-2">{profileUserData.email}</span>
                  <br />
                  <small
                    className="profile-skill"
                    style={{ fontSize: "0.6rem", color: "gray" }}
                  >
                    Your email address is not visible to other users.
                  </small>
                </p>
              ) : null}
              {profileUserData.collegeOrCompany.length > 0 ? (
                <p className=" mb-2 font-13">
                  <span>
                    {profileUserData.role === "student" ? (
                      <SchoolIcon
                        style={{
                          width: "1.2rem",
                          height: "1.2rem",
                          color: "black",
                        }}
                      ></SchoolIcon>
                    ) : profileUserData.role === "professional" ||
                      profileUserData.role === "admin" ? (
                      <BusinessIcon
                        style={{
                          width: "1.2rem",
                          height: "1.2rem",
                          color: "black",
                        }}
                      ></BusinessIcon>
                    ) : (
                      ""
                    )}
                  </span>
                  <span className="ms-2">
                    {profileUserData.collegeOrCompany}
                  </span>
                </p>
              ) : null}
            </div>
            <ul className="social-list list-inline mt-4 mb-0">
              {profileUserData.linkedInLink.length > 0 ? (
                <li className="list-inline-item">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={profileUserData.linkedInLink}
                    className="social-list-item text-center border-primary text-primary"
                  >
                    <i className="lab la-linkedin"></i>
                  </a>
                </li>
              ) : (
                <li className="list-inline-item">
                  <Link
                    to="/"
                    onClick={(event) => event.preventDefault()}
                    className="social-list-item text-center border-primary text-primary disabledCursor"
                  >
                    <i className="lab la-linkedin"></i>
                  </Link>
                </li>
              )}

              {profileUserData.githubLink.length > 0 ? (
                <li className="list-inline-item">
                  <a
                    href={profileUserData.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-list-item text-center border-secondary text-secondary"
                  >
                    <i className="lab la-github"></i>
                  </a>
                </li>
              ) : (
                <li className="list-inline-item">
                  <Link
                    to="/"
                    onClick={(event) => event.preventDefault()}
                    className="social-list-item text-center border-secondary text-secondary disabledCursor"
                  >
                    <i className="lab la-github"></i>
                  </Link>
                </li>
              )}

              {profileUserData.twitterLink.length > 0 ? (
                <li className="list-inline-item">
                  <a
                    href={profileUserData.twitterLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-list-item text-center border-info text-info"
                  >
                    <i className="lab la-twitter"></i>
                  </a>
                </li>
              ) : (
                <li className="list-inline-item">
                  <Link
                    to="/"
                    onClick={(event) => event.preventDefault()}
                    className="social-list-item text-center border-info text-info disabledCursor"
                  >
                    <i className="lab la-twitter"></i>
                  </Link>
                </li>
              )}

              {profileUserData.codingProfileLink.length > 0 ? (
                <li className="list-inline-item">
                  <a
                    href={profileUserData.codingProfileLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-list-item text-center border-info text-info"
                  >
                    <i className="las la-code"></i>
                  </a>
                </li>
              ) : (
                <li className="list-inline-item">
                  <Link
                    to="/"
                    onClick={(event) => event.preventDefault()}
                    className="social-list-item text-center border-info text-info disabledCursor"
                  >
                    <i className="las la-code"></i>
                  </Link>
                </li>
              )}
            </ul>
            <div className="row mt-4">
              <Link
                to={`/users/${profileUserUniqueID}/current-projects`}
                className="build-code-link "
              >
                Current Projects
              </Link>
              <Link
                to={`/users/${profileUserUniqueID}/completed-projects`}
                className="build-code-link "
              >
                Completed Projects
              </Link>
              <Link
                to={`/users/${profileUserUniqueID}/articles`}
                className="build-code-link "
              >
                Articles
              </Link>
            </div>
            {(user !== null && userUniqueId === profileUserUniqueID) ||
            (user !== null &&
              userUniqueId === process.env.REACT_APP_BUILDCODE_ADMIN_ID) ? (
              <>
                <br />
                <div className="build-code-btn" onClick={handleLogOut}>
                  <span>Log out</span>
                </div>
                <br />
                <div className="build-code-btn" onClick={updateProfile}>
                  <span>Edit Profile</span>
                </div>
              </>
            ) : null}
          </div>
        </div>
        <div className="profile-card">
          {isEmptyCompletedProjectsArray ? (
            <>
              <h5 className="user-profile-profile-card-title">
                Completed Projects
              </h5>
              <img src={emptyIcon} alt="No Completed Projects" />
            </>
          ) : (
            <>
              <h5 className="user-profile-profile-card-title">
                Completed Projects{" "}
              </h5>
              {currentCompletedProjectsArray.map(
                (completedprojectUniqueID, index) => (
                  <UserProjectCard
                    key={index}
                    uniqueProjectId={completedprojectUniqueID}
                    type={"completed"}
                  />
                )
              )}
              {totalComletedProjectsArray.length > 0 ? (
                <div style={{ textAlign: "center" }}>
                  <ArrowDropDownIcon
                    onClick={fetchMoreUserProjectCard}
                  ></ArrowDropDownIcon>
                </div>
              ) : null}
            </>
          )}
        </div>
        <div className="profile-card">
          {isEmptyArticlesArray ? (
            <>
              <h5 className="user-profile-profile-card-title">Articles</h5>
              <img src={emptyIcon} alt="No Articles" />
            </>
          ) : (
            <>
              <h5 className="user-profile-profile-card-title">Articles</h5>
              {currentArticlesArray.map((uniqueArticleId, index) => (
                <UserBlogCard key={index} uniqueArticleId={uniqueArticleId} />
              ))}
              {totalArticlesArray.length > 0 ? (
                <div style={{ textAlign: "center" }}>
                  <ArrowDropDownIcon
                    style={{ cursor: "pointer" }}
                    onClick={fetchMoreUserArticlesCard}
                  ></ArrowDropDownIcon>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
      {toggle === false ? null : (
        <UpdateAccount
          updateFormRef={updateFormRef}
          profileUserData={profileUserData}
          profileUserUniqueID={profileUserUniqueID}
        />
      )}
    </>
  );
}

export default Profile;
