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
  writeBatch,
} from "firebase/firestore";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import React, { createContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import FullPageLoader from "../../components/Loader/FullPageLoader/FullPageLoader";
import { useUserAuth } from "../../context/UserAuthContextProvider";
import db from "../../firebase/firebase-config";
import ArticleCommentForm from "./ArticleCommentForm";
import ArticleAllComments from "./ArticleAllComments";
import CommentIcon from "@mui/icons-material/Comment";
import { timeSince } from "../../Util/Utils";
import swal from "sweetalert";
import { uuidv4 } from "@firebase/util";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share";
import Loading from "../../components/Loader/Loading/Loading";
import SignUpModal from "../../components/Modal/SignUpModal";
import { Helmet } from "react-helmet";
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
import "./ViewArticle.css";

export let AllArticleCommentsContext = createContext();

let domainName = "https://www.buildcode.org";

function ViewArticle({ setPageSidebar }) {
  const [open, setOpen] = useState(false);
  const { articlUniqueID } = useParams();
  const [urlName, setUrlName] = useState(articlUniqueID);
  const [similarArticlesLoading, setSimilarArticlesLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [articleDetails, setArticlesDetails] = useState({});
  const [similarArticlesArray, setSimilarArticlesArray] = useState([]);
  const [allComments, setAllComments] = useState([]);
  const { user, userUniqueId, userData } = useUserAuth();
  const [articleImages, setArticleImages] = useState();
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();
  const articleEndRef = useRef(null);
  const articleTopRef = useRef(null);

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

  const scrollToTop = () => {
    articleTopRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getSimilarArticles = async (articleTags) => {
    /**
     * query for similar articles
     */
    let tempSimilarArticlesArray = [];
    for (
      let index = 0;
      index < articleTags.length && tempSimilarArticlesArray.length < 10;
      index++
    ) {
      const q = query(
        collection(db, "articles"),
        where("tags", "array-contains", articleTags[index]),
        where("urlName", "!=", articlUniqueID),
        limit(3)
      );
      const querySnapshot = await getDocs(q);
      let tempArticlesArray = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().ulrName !== articlUniqueID) {
          tempArticlesArray.push({ id: doc.id, data: doc.data() });
        }
      });
      tempSimilarArticlesArray = [
        ...tempSimilarArticlesArray,
        ...tempArticlesArray,
      ];
    }

    setSimilarArticlesArray(tempSimilarArticlesArray);

    if (tempSimilarArticlesArray.length > 0) {
      setSimilarArticlesLoading(false);
    }
  };

  const incrementViews = (tempArticleObj) => {
    const increment = async () => {
      let tempAllViews = tempArticleObj.allViews;
      tempAllViews.push(userUniqueId);
      const articleRef = doc(db, "articles", articlUniqueID);
      await updateDoc(articleRef, {
        totalViews: tempAllViews.length,
        allViews: tempAllViews,
      });
    };
    increment();
  };

  useEffect(() => {
    setPageSidebar(false);
    const checkDataExists = async () => {
      const q = query(
        collection(db, "articles"),
        where("urlName", "==", articlUniqueID)
      );
      await getDocs(q)
        .then((querySnapshot) => {
          let flag = false;
          querySnapshot.forEach((doc) => {
            flag = true;
          });
          if (flag === false) {
            navigate("/error/NOT FOUND 🚫");
          } else {
            onSnapshot(doc(db, "articles", articlUniqueID), (doc) => {
              let tempJXS = null;
              if (doc.data().articleMainIMG !== "") {
                tempJXS = (
                  <>
                    <meta
                      data-rh="true"
                      property="og:image"
                      content={doc.data().articleMainIMG}
                    />

                    <meta
                      data-rh="true"
                      name="twitter:image:src"
                      content={doc.data().articleMainIMG}
                    />
                  </>
                );
              }
              if (doc.data().isDeleted === true) {
                navigate(
                  "/error/This Article has been deleted by Admin.\n Please mail us for any help at contact@buildcode.org."
                );
              } else {
                setArticleImages(tempJXS);
                getSimilarArticles(doc.data().tags);
                setArticlesDetails(doc.data());
                if (doc.data().allViews.indexOf(userUniqueId) === -1) {
                  incrementViews(doc.data());
                }
                setAllComments(doc.data().allComments);
                setTimeout(() => {
                  setLoading(false);
                }, 2000);
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
  }, [articlUniqueID, navigate]);

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
      let tempLikedByArray = articleDetails.allLikes;
      tempLikedByArray.push(userUniqueId);
      const updateLikes = async () => {
        // update articles details
        const articleRef = doc(db, "articles", articlUniqueID);
        updateDoc(articleRef, {
          allLikes: tempLikedByArray,
          totalLikes: tempLikedByArray.length,
        });
      };
      updateLikes();
    }
  };

  const deleteArticleRequest = () => {
    swal({
      title: "Are You Sure Want To Delete?",
      text: "",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        setIsDeleting(true);
        const deleteRecord = async () => {
          const batch = writeBatch(db);

          batch.delete(doc(db, "articles", articlUniqueID));

          // now delete this article from user profile
          let userArticles = userData.articles;
          let indexOfArticle = userArticles.indexOf(articlUniqueID);
          if (indexOfArticle !== -1) {
            userArticles.splice(indexOfArticle, 1);
          }

          let userRef = doc(db, "users", userData.urlName);
          batch.update(userRef, {
            articles: userArticles,
          });

          await batch
            .commit()
            .then(() => {
              setTimeout(() => {
                swal("Deleted!", {
                  icon: "success",
                });
                navigate("/");
              }, 1500);
            })
            .catch((error) => {
              if (error.message === "Quota exceeded.") {
                navigate("/server/server-down");
              } else {
                navigate("/error/Something Went Wrong ⚠️");
              }
            });
        };
        deleteRecord();
      } else {
      }
    });
  };

  const saveToMyList = () => {
    // let temp = userData.myArticleList.find((obj) => obj.urlName === articlUniqueID);
    // console.log("result is");
    // console.log(temp);
    const saveToUserMyList = async () => {
      let userMyList = userData.myArticleList;
      userMyList.push(articlUniqueID);
      let userRef = doc(db, "users", userData.urlName);
      await updateDoc(userRef, {
        myArticleList: userMyList,
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

  const closeDialog = () => {
    setOpen(false);
  };

  return loading === true ? (
    <>
      <FullPageLoader color={"blue"} height={"50px"} width={"50px"} />
    </>
  ) : (
    <>
      <Helmet>
        <title>{articleDetails.title}</title>
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
          content={new Date(articleDetails.postedOn.seconds * 1000)}
        />

        <meta
          data-rh="true"
          name="title"
          content={`${articleDetails.title} | ${new Date(
            articleDetails.postedOn.seconds * 1000
          )} | BuildCode`}
        />

        <meta
          data-rh="true"
          property="og:title"
          content={articleDetails.title}
        />

        <meta
          data-rh="true"
          property="twitter:title"
          content={articleDetails.title}
        />

        <meta data-rh="true" name="twitter:site" content="BuildCode" />

        <meta
          data-rh="true"
          property="og:description"
          content={articleDetails.description}
        />

        <meta
          data-rh="true"
          property="twitter:description"
          content={articleDetails.description}
        />

        <meta
          data-rh="true"
          property="og:url"
          content={`https:buildcode.org/${articleDetails.urlName}`}
        />

        <meta
          data-rh="true"
          property="al:web:url"
          content={`https:buildcode.org/${articleDetails.urlName}`}
        />

        <meta
          data-rh="true"
          name="twitter:card"
          content="summary_large_image"
        />

        <meta
          data-rh="true"
          property="article:author"
          content={`https://buildcode.org/users/${articleDetails.postedBy[0].id}`}
        />

        <meta
          data-rh="true"
          name="twitter:creator"
          content={articleDetails.postedBy[0].urlName}
        />

        <meta
          data-rh="true"
          name="author"
          content={articleDetails.postedBy[0].name}
        />

        <meta
          data-rh="true"
          name="robots"
          content="index,follow,max-image-preview:large"
        />

        <link
          data-rh="true"
          rel="author"
          href={`https://buildcode.org/users/${articleDetails.postedBy[0].id}`}
        />

        <link
          data-rh="true"
          rel="canonical"
          href={`https:buildcode.org/${articleDetails.urlName}`}
        />

        <meta
          name="description"
          content={articleDetails.description}
          data-rh="true"
        />
      </Helmet>
      {matches === true ? (
        <div className="sidenav" id="user-article">
          <PostedUser
            id={articleDetails.postedBy[0].id}
            articleDetails={articleDetails}
          />
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
          <div style={{ textAlign: "justify" }}>
            <small style={{ color: "grey", fontSize: "0.8rem" }}>
              Last Updated: <br />
              {new Date(
                articleDetails.lastUpdatedOn.seconds * 1000
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
                {userData.myArticleList.indexOf(articlUniqueID) === -1 ? (
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
              articleDetails.postedBy[0].id === userUniqueId) ||
            (user !== null &&
              userUniqueId === process.env.REACT_APP_BUILDCODE_ADMIN_ID) ? (
              <>
                <div className="requested-project-update-delete-btn">
                  <a href={`/articles/update/${articlUniqueID}`}>
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
                <div
                  className="requested-project-update-delete-btn"
                  onClick={deleteArticleRequest}
                >
                  <DeleteIcon
                    style={{
                      width: "30px",
                      height: "24px",
                      cursor: "pointer",
                    }}
                  ></DeleteIcon>
                  <span>Delete</span>
                </div>
              </>
            ) : null}
            <div
              className="requested-project-update-delete-btn"
              onClick={() => {
                navigator.clipboard.writeText(
                  `${domainName}/${articlUniqueID}`
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
              <h3>{articleDetails.title}</h3>
            </div>
            <br />
            {articleDetails.articleMainIMG.length > 0 ? (
              <div className="view-article-cover-img">
                <img
                  src={articleDetails.articleMainIMG}
                  alt={articleDetails.title}
                />
              </div>
            ) : null}
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
            <div className="view-article-tags">
              <i className="las la-tags"></i>
              {articleDetails.tags.map((tag) => (
                <Link key={uuidv4()} to={`/search/tags/${tag}`}>
                  <small>
                    <span>#</span>
                    {tag}
                  </small>
                </Link>
              ))}
            </div>
            <div ref={articleEndRef} />
          </div>
          <br />
          {matches === true ? null : (
            <div className="sidenav">
              <PostedUser
                id={articleDetails.postedBy[0].id}
                articleDetails={articleDetails}
              />
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
              <div style={{ textAlign: "justify" }}>
                <small style={{ color: "grey", fontSize: "0.8rem" }}>
                  Last Updated: <br />
                  {new Date(
                    articleDetails.lastUpdatedOn.seconds * 1000
                  ).toDateString()}
                </small>
              </div>
            </div>
          )}
          {similarArticlesLoading === false ? (
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
                    {similarArticlesArray.map((data) => (
                      <SwiperSlide key={data.id}>
                        <RecommendedArticleCard data={data.data} />
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
          <div className="all-article-comments-grid">
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
      <Loading loaded={!isDeleting} text={"Deleting..."} />
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

function PostedUser({ id, articleDetails }) {
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
  }, [id, navigate]);

  return loading === true ? (
    <>
      <div className="view-article-user" style={{ cursor: "pointer" }}>
        <div className="user-img">
          <a href={`/users/${id}`}>
            <img src={userData.profilePic} alt={userData.userName} />
          </a>
        </div>
        <div className="user-info">
          <a href={`/users/${id}`}>
            <span>{userData.userName}</span>
          </a>
        </div>
        <div className="user-info">
          <span style={{ fontSize: "0.8rem", color: "gray" }}>
            {timeSince(new Date(articleDetails.postedOn.seconds * 1000))}{" "}
            {" ago"}
          </span>
        </div>
      </div>
      <br />
      <div className="user-social-media-link">
        {userData.linkedInLink.length > 0 ? (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={userData.linkedInLink}
            className="link"
          >
            <i className="lab la-linkedin"></i>
          </a>
        ) : (
          <Link
            to="/"
            onClick={(event) => event.preventDefault()}
            className="link disabledCursor"
          >
            <i className="lab la-linkedin"></i>
          </Link>
        )}
        {userData.githubLink.length > 0 ? (
          <a
            href={userData.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            <i className="lab la-github"></i>
          </a>
        ) : (
          <Link
            to="/"
            onClick={(event) => event.preventDefault()}
            className="link disabledCursor"
          >
            <i className="lab la-github"></i>
          </Link>
        )}

        {userData.twitterLink.length > 0 ? (
          <a
            href={userData.twitterLink}
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            <i className="lab la-twitter"></i>
          </a>
        ) : (
          <Link
            to="/"
            onClick={(event) => event.preventDefault()}
            className="link disabledCursor"
          >
            <i className="lab la-twitter"></i>
          </Link>
        )}

        {userData.codingProfileLink.length > 0 ? (
          <a
            href={userData.codingProfileLink}
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            <i className="las la-code"></i>
          </a>
        ) : (
          <Link
            to="/"
            onClick={(event) => event.preventDefault()}
            className="link disabledCursor"
          >
            <i className="las la-code"></i>
          </Link>
        )}
      </div>
    </>
  ) : null;
}

export default ViewArticle;
