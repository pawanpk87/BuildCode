import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import swal from "sweetalert";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import React, { createContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import FullPageLoader from "../../components/Loader/FullPageLoader/FullPageLoader";
import { useUserAuth } from "../../context/UserAuthContextProvider";
import db from "../../firebase/firebase-config";
import CommentIcon from "@mui/icons-material/Comment";
import { timeSince } from "../../Util/Utils";
import ArticleCommentForm from "./ArticleCommentForm";
import ArticleAllComments from "./ArticleAllComments";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { uuidv4 } from "@firebase/util";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import ShareIcon from "@mui/icons-material/Share";
import { Helmet } from "react-helmet";
import SignUpModal from "../../components/Modal/SignUpModal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import Footer from "../../components/Footer/Footer";
import RecommendedArticleCard from "../../components/Rrecommended/RecommendedArticleCard";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import BookmarkAddedOutlinedIcon from "@mui/icons-material/BookmarkAddedOutlined";
import "./ViewProjectBlog.css";

export let AllArticleCommentsContext = createContext();

function ViewProjectBlog({ setPageSidebar }) {
  useEffect(() => {
    setPageSidebar(false);
  }, [setPageSidebar]);

  const [open, setOpen] = useState(false);
  const { projectblogUniqueID } = useParams();
  const [urlName, setUrlName] = useState(projectblogUniqueID);
  const [done, setDone] = useState(false);
  const [similarProjectBlogLoading, setSimilarProjectBlog] = useState(true);
  const [similarProjectBlogArray, setSimilarProjectBlogArray] = useState([]);
  const [articleDetails, setArticlesDetails] = useState({});
  const [allComments, setAllComments] = useState([]);
  const { user, userUniqueId, userData } = useUserAuth();
  const [isUserDataPresent, setIsUserDataPresent] = useState(false);
  const navigate = useNavigate();
  const articleEndRef = useRef(null);

  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 1200px)").matches
  );

  useEffect(() => {
    window
      .matchMedia("(min-width: 1200px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);

  const scrollToBottom = () => {
    articleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getSimilarProjectBlog = async (projectBlogTags) => {
    /**
     * query for similar articles
     */
    let tempSimilarProjectBlogArray = [];
    for (
      let index = 0;
      index < projectBlogTags.length && tempSimilarProjectBlogArray.length < 10;
      index++
    ) {
      const q = query(
        collection(db, "project-blogs"),
        where("tags", "array-contains", projectBlogTags[index]),
        where("urlName", "!=", projectblogUniqueID),
        limit(3)
      );
      const querySnapshot = await getDocs(q);
      let tempProjectBlogArray = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().ulrName !== projectblogUniqueID) {
          tempProjectBlogArray.push({ id: doc.id, data: doc.data() });
        }
      });
      tempSimilarProjectBlogArray = [
        ...tempSimilarProjectBlogArray,
        ...tempProjectBlogArray,
      ];
    }
    setSimilarProjectBlogArray(tempSimilarProjectBlogArray);
    if (tempSimilarProjectBlogArray.length > 0) {
      setSimilarProjectBlog(false);
    }
  };

  const incrementViews = (tempArticleObj) => {
    const increment = async () => {
      let tempAllViews = tempArticleObj.allViews;
      tempAllViews.push(userUniqueId);
      const projectRef = doc(db, "project-blogs", projectblogUniqueID);
      await updateDoc(projectRef, {
        totalViews: tempAllViews.length,
        allViews: tempAllViews,
      });
    };
    increment();
  };

  useEffect(() => {
    const checkDataExists = async () => {
      const q = query(
        collection(db, "project-blogs"),
        where("urlName", "==", projectblogUniqueID)
      );
      await getDocs(q)
        .then((querySnapshot) => {
          let flag = false;
          querySnapshot.forEach((doc) => {
            flag = true;
          });
          if (flag === false) {
            navigate("/error/projects/NOT FOUND");
          } else {
            onSnapshot(doc(db, "project-blogs", projectblogUniqueID), (doc) => {
              if (doc.data().isDeleted === true) {
                navigate(
                  "/error/This project blog has been deleted by Admin.\n Please mail us for any help at contact@buildcode.org."
                );
              } else {
                setArticlesDetails(doc.data());
                setAllComments(doc.data().allComments);
                getSimilarProjectBlog(doc.data().tags);
                let tempArticleObj = doc.data();
                if (
                  userUniqueId !== null &&
                  doc.data().allViews.indexOf(userUniqueId) === -1
                ) {
                  incrementViews(tempArticleObj);
                }
                setDone(true);
              }
            });
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
  }, [navigate, projectblogUniqueID, userUniqueId]);

  const handleLike = () => {
    if (userData.isDeleted === true) {
      navigate(
        "/error/This account has been deleted if you are an account holder then mail us contact@buildcode to deactivate."
      );
    } else if (userData.redUser === true) {
      navigate(
        "/error/This account has been suspended due to a violation of the BuildCode account user agreement if you are an account holder then mail us contact@buildcode to deactivate."
      );
    } else {
      let tempAllLikes = articleDetails.allLikes;
      tempAllLikes.push(userUniqueId);

      const likeProjectBlog = async () => {
        const projectRef = doc(db, "project-blogs", projectblogUniqueID);
        await updateDoc(projectRef, {
          allLikes: tempAllLikes,
          totalLikes: tempAllLikes.length,
        });
      };
      likeProjectBlog();
    }
  };

  const isUserPresentInTeam = (userEmail) => {
    let tempTeamMembersArray = articleDetails.teamMembers;
    for (let index = 0; index < tempTeamMembersArray.length; index++) {
      let tempEmail = tempTeamMembersArray[index].email;
      if (tempEmail === userEmail) {
        return true;
      }
    }
    return false;
  };

  const closeDialog = () => {
    setOpen(false);
  };

  const saveToMyList = () => {
    // let temp = userData.myProjectBlogList.find((obj) => obj.urlName === projectblogUniqueID);
    // console.log("result is");
    // console.log(temp);
    const saveToUserMyList = async () => {
      let userMyList = userData.myProjectBlogList;
      userMyList.push(projectblogUniqueID);
      let userRef = doc(db, "users", userData.urlName);
      await updateDoc(userRef, {
        myProjectBlogList: userMyList,
      })
        .then(() => {})
        .catch((error) => {
          if (error.message === "Quota exceeded.") {
            navigate("/server/server-down");
          } else {
            navigate("/error/Something Went Wrong ⚠️");
          }
        });
    };
    saveToUserMyList();
  };

  return done === false ? (
    <>
      <FullPageLoader color={"blue"} height={"50px"} width={"50px"} />
    </>
  ) : (
    <>
      <Helmet>
        <title>{articleDetails.projectName + "- Blog"}</title>
        <meta data-rh="true" charset="utf-8" />

        <meta
          data-rh="true"
          name="viewport"
          content="width=device-width,minimum-scale=1,initial-scale=1,maximum-scale=1"
        />

        <meta data-rh="true" name="theme-color" content="#000000" />

        <meta data-rh="true" property="og:site_name" content="BuildCode" />

        <meta data-rh="true" property="og:type" content="article" />

        <meta
          data-rh="true"
          property="article:published_time"
          content={new Date(articleDetails.completedOn.seconds * 1000)}
        />

        <meta
          data-rh="true"
          name="title"
          content={`${articleDetails.projectName + "- Blog"} | ${new Date(
            articleDetails.completedOn.seconds * 1000
          )} | BuildCode`}
        />

        <meta
          data-rh="true"
          property="og:title"
          content={articleDetails.projectName + "- Blog"}
        />

        <meta
          data-rh="true"
          property="twitter:title"
          content={articleDetails.projectName + "- Blog"}
        />

        <meta data-rh="true" name="twitter:site" content="BuildCode" />

        <meta
          data-rh="true"
          property="og:description"
          content={articleDetails.projectBlogDescription}
        />

        <meta
          data-rh="true"
          property="twitter:description"
          content={articleDetails.projectBlogDescription}
        />

        <meta
          data-rh="true"
          property="og:url"
          content={`https:buildcode.org/project-blog/${articleDetails.urlName}`}
        />

        <meta
          data-rh="true"
          property="al:web:url"
          content={`https:buildcode.org/project-blog/${articleDetails.urlName}`}
        />

        <meta
          data-rh="true"
          property="og:image"
          content={articleDetails.projectPic}
        />

        <meta
          data-rh="true"
          name="twitter:image:src"
          content={articleDetails.projectPic}
        />

        <meta
          data-rh="true"
          name="twitter:card"
          content="summary_large_image"
        />

        <meta
          data-rh="true"
          name="twitter:creator"
          content={articleDetails.projectName + " Team"}
        />

        <meta
          data-rh="true"
          name="author"
          content={articleDetails.projectName + " Team"}
        />

        <meta
          data-rh="true"
          name="robots"
          content="index,follow,max-image-preview:large"
        />

        <link
          data-rh="true"
          rel="author"
          href={`https://buildcode.org/project/completed/${articleDetails.urlName}`}
        />

        <link
          data-rh="true"
          rel="canonical"
          href={`https:buildcode.org/project-blog/${articleDetails.urlName}`}
        />

        <meta
          name="description"
          content={articleDetails.projectBlogDescription}
          data-rh="true"
        />
      </Helmet>
      {matches === true ? (
        <div className="sidenav">
          <div className="view-article-user" style={{ cursor: "pointer" }}>
            <div className="user-img">
              <Link to={`/project/completed/${articleDetails.projectUrlName}`}>
                <img
                  src={articleDetails ? articleDetails.projectPic : "#"}
                  alt="user"
                />
              </Link>
            </div>
            <div className="user-info">
              <Link to={`/project/completed/${articleDetails.projectUrlName}`}>
                <h6>{articleDetails ? articleDetails.projectName : " "}</h6>
              </Link>
            </div>
            <div className="user-info">
              <span style={{ fontSize: "0.8rem", color: "gray" }}>
                {timeSince(new Date(articleDetails.completedOn.seconds * 1000))}
                {" ago"}
              </span>
            </div>
            <div className="completed-project-project-link">
              <Link to={`/projects/completed/${articleDetails.projectUrlName}`}>
                <AccountTreeIcon
                  style={{
                    width: "30px",
                    height: "24px",
                    cursor: "pointer",
                    color: "blue",
                  }}
                ></AccountTreeIcon>
                <span>Project</span>
              </Link>
            </div>
          </div>
          <br />
          <div className="view-article-like-comment-grid">
            {user === null ? (
              <ThumbUpOutlinedIcon
                style={{
                  width: "30px",
                  height: "24px",
                  cursor: "pointer",
                }}
                onClick={() => setOpen(true)}
              ></ThumbUpOutlinedIcon>
            ) : articleDetails.allLikes.indexOf(userUniqueId) === -1 ? (
              <ThumbUpOutlinedIcon
                style={{
                  width: "30px",
                  height: "24px",
                  cursor: "pointer",
                }}
                onClick={handleLike}
              ></ThumbUpOutlinedIcon>
            ) : (
              <ThumbUpIcon
                style={{
                  width: "30px",
                  height: "24px",
                  cursor: "pointer",
                }}
              ></ThumbUpIcon>
            )}
            <strong>{articleDetails.allLikes.length}</strong>
          </div>
          <div className="view-article-like-comment-grid">
            <CommentIcon
              style={{
                width: "30px",
                height: "24px",
                cursor: "pointer",
              }}
              onClick={() => scrollToBottom()}
            ></CommentIcon>
            <strong>{articleDetails.allComments.length}</strong>
          </div>
          <br />
          <div className="view-article-team-members">
            <span>Team</span>
            <br />
            {articleDetails.teamMembers.map(({ email, id, img, name }) => (
              <PostedUser key={id} id={id} />
            ))}
          </div>
          <div style={{ textAlign: "justify" }}>
            <small style={{ color: "grey", fontSize: "0.8rem" }}>
              Last Updated: <br />
              {new Date(
                articleDetails.lastModifiedDate.seconds * 1000
              ).toDateString()}
            </small>
          </div>
        </div>
      ) : null}
      <div className="view-article-card-main-page">
        <div className="view-article-card">
          <div className="projects-update-delete-share-bts">
            {userData !== null ? (
              <>
                {userData.myProjectBlogList.indexOf(projectblogUniqueID) ===
                -1 ? (
                  <div
                    className="requested-project-update-delete-btn"
                    onClick={saveToMyList}
                  >
                    <BookmarkAddedOutlinedIcon
                      style={{
                        width: "30px",
                        height: "24px",
                        cursor: "pointer",
                      }}
                    ></BookmarkAddedOutlinedIcon>
                    <span>Save</span>
                  </div>
                ) : (
                  <div className="requested-project-update-delete-btn">
                    <BookmarkAddedIcon
                      style={{
                        width: "30px",
                        height: "24px",
                        cursor: "pointer",
                      }}
                    ></BookmarkAddedIcon>
                    <span>Saved</span>
                  </div>
                )}
              </>
            ) : null}
            {(user !== null &&
              userData !== null &&
              isUserPresentInTeam(userData.email)) ||
            (user !== null &&
              userUniqueId === process.env.REACT_APP_BUILDCODE_ADMIN_ID) ? (
              <>
                <div className="requested-project-update-delete-btn">
                  <a
                    href={`/projects/updateprojectblog/${projectblogUniqueID}`}
                  >
                    <UpgradeIcon
                      style={{
                        width: "30px",
                        height: "24px",
                        cursor: "pointer",
                      }}
                    ></UpgradeIcon>
                    <span>Update</span>
                  </a>
                </div>
              </>
            ) : null}
            <div
              className="requested-project-update-delete-btn"
              onClick={() => {
                navigator.clipboard.writeText(
                  `https://buildcode.org/project-blog/${projectblogUniqueID}`
                );
                swal("Link copied to your clipboard", "", "success");
              }}
            >
              <ShareIcon
                style={{
                  width: "30px",
                  height: "24px",
                  cursor: "pointer",
                }}
              ></ShareIcon>
              <span>Share</span>
            </div>
          </div>
          <br />
          <div className="view-article-desc">
            <div className="view-article-topic">
              <h3>{articleDetails.projectName}</h3>
            </div>
            <br />
            <div className="view-article-cover-img">
              <img
                src={articleDetails.projectPic}
                alt={articleDetails.projectName}
              />
            </div>
          </div>
          <br />
          <div className="user-view-article-main-grid">
            <div className="view-article-content">
              <div
                className="view-article-main-content"
                dangerouslySetInnerHTML={{
                  __html: articleDetails.mainContent,
                }}
              />
            </div>
            {/* <div className="view-article-tags">
              <i className="las la-tags"></i>
              {articleDetails.tags.map((tag) => (
                <Link key={uuidv4()} to={`/search/tags/${tag}`}>
                  <small>{tag}</small>
                </Link>
              ))}
            </div> */}
            <div ref={articleEndRef} />
          </div>
          <br />

          {matches === true ? null : (
            <div className="sidenav">
              <div className="view-article-user" style={{ cursor: "pointer" }}>
                <div className="user-img">
                  <Link
                    to={`/project/completed/${articleDetails.projectUrlName}`}
                  >
                    <img
                      src={articleDetails ? articleDetails.projectPic : "#"}
                      alt="user"
                    />
                  </Link>
                </div>
                <div className="user-info">
                  <Link
                    to={`/project/completed/${articleDetails.projectUrlName}`}
                  >
                    <h6>{articleDetails ? articleDetails.projectName : " "}</h6>
                  </Link>
                </div>
                <div className="user-info">
                  <span style={{ fontSize: "0.8rem", color: "gray" }}>
                    {timeSince(
                      new Date(articleDetails.completedOn.seconds * 1000)
                    )}
                    {" ago"}
                  </span>
                </div>
                <div className="completed-project-project-link">
                  <Link
                    to={`/projects/completed/${articleDetails.projectUrlName}`}
                  >
                    <AccountTreeIcon
                      style={{
                        width: "30px",
                        height: "24px",
                        cursor: "pointer",
                        color: "blue",
                      }}
                    ></AccountTreeIcon>
                    <span>Project</span>
                  </Link>
                </div>
              </div>
              <br />
              <div className="view-article-like-comment-grid">
                {user === null ? (
                  <ThumbUpOutlinedIcon
                    style={{
                      width: "30px",
                      height: "24px",
                      cursor: "pointer",
                    }}
                    onClick={() => setOpen(true)}
                  ></ThumbUpOutlinedIcon>
                ) : articleDetails.allLikes.indexOf(userUniqueId) === -1 ? (
                  <ThumbUpOutlinedIcon
                    style={{
                      width: "30px",
                      height: "24px",
                      cursor: "pointer",
                    }}
                    onClick={handleLike}
                  ></ThumbUpOutlinedIcon>
                ) : (
                  <ThumbUpIcon
                    style={{
                      width: "30px",
                      height: "24px",
                      cursor: "pointer",
                    }}
                  ></ThumbUpIcon>
                )}
                <strong>{articleDetails.allLikes.length}</strong>
              </div>
              <div className="view-article-like-comment-grid">
                <CommentIcon
                  style={{
                    width: "30px",
                    height: "24px",
                    cursor: "pointer",
                  }}
                  onClick={() => scrollToBottom()}
                ></CommentIcon>
                <strong>{articleDetails.allComments.length}</strong>
              </div>
              <br />
              <div className="view-article-team-members">
                <span>Team</span>
                <br />
                {articleDetails.teamMembers.map(({ email, id, img, name }) => (
                  <PostedUser key={id} id={id} />
                ))}
              </div>
              <div style={{ textAlign: "justify" }}>
                <small style={{ color: "grey", fontSize: "0.8rem" }}>
                  Last Updated: <br />
                  {new Date(
                    articleDetails.lastModifiedDate.seconds * 1000
                  ).toDateString()}
                </small>
              </div>
            </div>
          )}
          <br />
          {similarProjectBlogLoading === false ? (
            <>
              <br />
              <div>
                <h4>
                  <strong>You might also like</strong>{" "}
                </h4>
                <div>
                  <Swiper
                    slidesPerView={2}
                    slidesPerGroup={2}
                    autoplay={{ delay: 5000 }}
                    loop={true}
                    loopFillGroupWithBlank={true}
                    pagination={{
                      clickable: true,
                    }}
                    navigation={true}
                    showpagination="false"
                    modules={[Navigation, Autoplay]}
                  >
                    {similarProjectBlogArray.map((data) => (
                      <SwiperSlide key={data.id}>
                        <RecommendedArticleCard
                          data={data.data}
                          key={data.id}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
              <br />
            </>
          ) : null}

          <hr />
          <h6>Comments</h6>
          <div className="project-blog-comments-grid">
            <br />
            <AllArticleCommentsContext.Provider
              value={{ urlName, allComments, setOpen }}
            >
              <ArticleCommentForm />
              <ArticleAllComments />
            </AllArticleCommentsContext.Provider>
          </div>
          <br />
          <br />
          <Footer />
        </div>
      </div>
      {open === true ? (
        <SignUpModal
          open={open}
          closeDialog={closeDialog}
          closeOnOverlayClick={true}
          showCloseIcon={true}
        />
      ) : null}
    </>
  );
}

function PostedUser({ id }) {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const getUserData = async () => {
      const userRef = doc(db, "users", id);
      const docSnap = await getDoc(userRef);
      setUserData(docSnap.data());
      setLoading(true);
    };
    getUserData();
  }, [id]);

  return loading === true ? (
    <>
      <Link to={`/users/${id}`}>
        <div className="team-members">
          <div className="img">
            <img src={userData.profilePic} alt={userData.userName} />
          </div>
          <div className="name">
            <span>{userData.userName}</span>
          </div>
        </div>
      </Link>
    </>
  ) : null;
}

export default ViewProjectBlog;
