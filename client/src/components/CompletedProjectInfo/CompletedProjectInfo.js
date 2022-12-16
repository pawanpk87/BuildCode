import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import db from "../../firebase/firebase-config";
import swal from "sweetalert";
import React, { createContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Member from "../Member/Member";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import AddTaskIcon from "@mui/icons-material/AddTask";
import CodeIcon from "@mui/icons-material/Code";
import { useUserAuth } from "../../context/UserAuthContextProvider";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import FullPageLoader from "../Loader/FullPageLoader/FullPageLoader";
import ArticleIcon from "@mui/icons-material/Article";
import AddCommentForm from "./AddCommentForm";
import AllComments from "./AllComments";
import RecommendedProjectRequestCard from "../Rrecommended/RecommendedProjectRequestCard";
import Swiper, { Autoplay, Navigation } from "swiper";
import { SwiperSlide } from "swiper/react";
import FeaturedPlayListIcon from "@mui/icons-material/FeaturedPlayList";
import SignUpModal from "../Modal/SignUpModal";
import { uuidv4 } from "@firebase/util";
import { Helmet } from "react-helmet";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import BookmarkAddedOutlinedIcon from "@mui/icons-material/BookmarkAddedOutlined";
import ShareIcon from "@mui/icons-material/Share";
import "./CompletedProjectInfo.css";

export let AllCommentsContext = createContext();

function CompletedProjectInfo({ setPageSidebar }) {
  useEffect(() => {
    setPageSidebar(true);
  }, [setPageSidebar]);

  const [done, setDone] = useState(false);
  const { completedprojectUniqueID } = useParams();
  const [urlName, setUrlName] = useState(completedprojectUniqueID);
  const [projectDetails, setProjectDetails] = useState({});
  const { user, userData, userUniqueId } = useUserAuth();
  const navigate = useNavigate();
  const [allComments, setAllComments] = useState([]);
  const [requestedProjectsArray, setRequestedProjectsArray] = useState([]);
  const [open, setOpen] = useState(false);
  const [projectKeywords, setProjectKeywords] = useState("");

  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 992px)").matches
  );

  useEffect(() => {
    window
      .matchMedia("(min-width: 992px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);

  const incrementViews = (tempArticleObj) => {
    const increment = async () => {
      let tempAllViews = tempArticleObj.allViews;
      if (userUniqueId === null) tempAllViews.push(uuidv4());
      else tempAllViews.push(userUniqueId);
      const projectRef = doc(db, "projects", completedprojectUniqueID);
      await updateDoc(projectRef, {
        totalViews: tempAllViews.length,
        allViews: tempAllViews,
      });
    };
    increment();
  };

  const getRequestedProjects = async (newObj) => {
    const first = query(
      collection(db, "projects"),
      orderBy("completedOn", "desc"),
      orderBy("totalViews", "desc"),
      orderBy("totalComments", "desc"),
      where("status", "==", "completedOn"),
      where("skills", "array-contains", newObj.skills[0]),
      where("technology", "in", newObj.keywords.splice(0, 10)),
      limit(21)
    );
    await getDocs(first)
      .then((documentSnapshots) => {
        let tempProjects = [];
        documentSnapshots.forEach((doc) => {
          if (doc.data().urlName !== newObj.urlName) {
            tempProjects.push({ id: doc.id, data: doc.data() });
          }
        });
        setRequestedProjectsArray(tempProjects);
        setDone(true);
      })
      .catch((error) => {
        if (error.message === "Quota exceeded.") {
          navigate("/server/server-down");
        } else {
          navigate("/error/Something Went Wrong ⚠️");
        }
      });
  };

  useEffect(() => {
    const checkDataExists = async () => {
      const q = query(
        collection(db, "projects"),
        where("urlName", "==", completedprojectUniqueID)
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
            onSnapshot(doc(db, "projects", completedprojectUniqueID), (doc) => {
              /**
               * if someone comes on this route
               * then navigate to error page
               */
              if (
                doc.data().status === "pending" ||
                doc.data().status === "development"
              ) {
                navigate("/projects/" + completedprojectUniqueID);
              } else if (doc.data().isDeleted === true) {
                navigate(
                  "/error/This project has been deleted by Admin.\n Please mail us for any help at contact@buildcode.org."
                );
              } else {
                // make keywords string
                let tempKeywords = doc.data().keywords;
                let tempKeywordsStr = "";
                for (let index = 0; index < tempKeywords.length; index++) {
                  if (index !== tempKeywords.length - 1) {
                    tempKeywordsStr += tempKeywords[index] + ", ";
                  } else {
                    tempKeywordsStr += tempKeywords[index];
                  }
                }
                setProjectKeywords(tempKeywordsStr);
                setAllComments(doc.data().allComments);
                setProjectDetails(doc.data());
                getRequestedProjects(doc.data());
                setTimeout(() => {
                  setDone(true);
                }, 2000);
                if (
                  userUniqueId !== null &&
                  doc.data().allViews.indexOf(userUniqueId) === -1
                ) {
                  incrementViews(doc.data());
                }
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
  }, [navigate, userUniqueId, completedprojectUniqueID]);

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
      let tempLikedByArray = projectDetails.allLikes;
      tempLikedByArray.push(userUniqueId);
      const likeProject = async () => {
        const projectRef = doc(db, "projects", completedprojectUniqueID);
        await updateDoc(projectRef, {
          totalLikes: tempLikedByArray.length,
          allLikes: tempLikedByArray,
        });
      };
      likeProject();
    }
  };

  const closeDialog = () => {
    setOpen(false);
  };

  const saveToMyList = () => {
    // let temp = userData.myProjectList.find((obj) => obj.urlName === completedprojectUniqueID);
    // console.log("result is");
    // console.log(temp);
    const saveToUserMyList = async () => {
      let userMyList = userData.myProjectList;
      userMyList.push(completedprojectUniqueID);
      let userRef = doc(db, "users", userData.urlName);
      await updateDoc(userRef, {
        myProjectList: userMyList,
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

  return done === true ? (
    <>
      <Helmet>
        <title>{projectDetails.projectName}</title>

        <meta name="keywords" keywords={projectKeywords}></meta>

        <link href={projectDetails.projectPic} rel="canonical" />

        <meta content={projectDetails.projectName} itemprop="name" />

        <meta content={projectDetails.projectAIM} itemprop="description" />

        <meta content={projectDetails.projectPic} itemprop="image" />

        <meta content="en_US" property="og:locale" />

        <meta content="projects" property="og:type" />

        <meta
          content={`https://buildcode.org/projects/completed/${projectDetails.urlName}`}
          property="og:url"
        />

        <meta content="buildcode.org" property="og:site_name" />

        <meta content={projectDetails.projectName} property="og:title" />

        <meta content={projectDetails.projectAIM} property="og:description" />

        <meta content={projectDetails.projectPic} property="og:image" />

        <meta property="og:image:alt" />

        <meta content="summary_large_image" name="twitter:card" />

        <meta content={projectDetails.projectName} name="twitter:title" />

        <meta content={projectDetails.projectAIM} name="twitter:description" />

        <meta content={projectDetails.projectPic} name="twitter:image" />
      </Helmet>
      <div className="requested-project-info-page">
        <div className="requested-project-info-main-grid">
          <div
            className="d-flex flex-column justify-content-center mt-0 requested-project-info-main-grid align-items-center text-fw-style"
            id="project-heading"
          >
            <div>
              <p>{projectDetails.technology}</p>
            </div>
            <div className="h4">{projectDetails.projectName}</div>
          </div>
          <div className="wrapper bg-white p-20 mb-0  bg-white rounded">
            <div className="projects-update-delete-share-bts">
              {userData !== null ? (
                <>
                  {userData.myProjectList.indexOf(completedprojectUniqueID) ===
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
              <div
                className="requested-project-update-delete-btn"
                onClick={() => {
                  navigator.clipboard.writeText(
                    projectDetails.status === "pending" ||
                      projectDetails.status === "development"
                      ? `https://buildcode.org/projects/${completedprojectUniqueID}`
                      : `https://buildcode.org/projects/completed/${completedprojectUniqueID}`
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
            <div>
              {user === null ? (
                <ThumbUpOutlinedIcon
                  style={{
                    width: "30px",
                    height: "24px",
                    cursor: "pointer",
                  }}
                  onClick={() => setOpen(true)}
                ></ThumbUpOutlinedIcon>
              ) : projectDetails.allLikes.indexOf(userUniqueId) === -1 ? (
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
              {"  "}
              <strong>{projectDetails.totalLikes}</strong>
            </div>
            <br />
            {projectDetails.blog.length > 0 ? (
              <>
                <br />
                <div className="completed-project-project-blog-link">
                  <Link to={`/project-blog/${projectDetails.blog}`}>
                    <ArticleIcon
                      style={{
                        width: "30px",
                        height: "24px",
                        cursor: "pointer",
                        color: "blue",
                      }}
                    ></ArticleIcon>
                    <span>Project Blog</span>
                  </Link>
                </div>
              </>
            ) : null}
            <ul className="completed-project-info-time-duration">
              <li style={{ color: "blue" }}>
                Requested On:{" "}
                {new Date(
                  projectDetails.requestedOn.seconds * 1000
                ).toDateString()}
              </li>
              <li style={{ color: "blue" }}>
                Started On:{" "}
                {new Date(
                  projectDetails.startedOn.seconds * 1000
                ).toDateString()}
              </li>
              {new Date(projectDetails.completedOn.seconds * 1000).getTime() <=
              new Date(
                projectDetails.targetFinishDate.seconds * 1000
              ).getTime() ? (
                <li style={{ color: "green" }}>
                  Completed On:{" "}
                  {new Date(
                    projectDetails.completedOn.seconds * 1000
                  ).toDateString()}
                </li>
              ) : null}

              <li style={{ color: "grey" }}>
                Target Date:{" "}
                {new Date(
                  projectDetails.targetFinishDate.seconds * 1000
                ).toDateString()}
              </li>

              {new Date(projectDetails.completedOn.seconds * 1000).getTime() >
              new Date(
                projectDetails.targetFinishDate.seconds * 1000
              ).getTime() ? (
                <li style={{ color: "rgb(255, 148, 148)" }}>
                  Completed On:{" "}
                  {new Date(
                    projectDetails.completedOn.seconds * 1000
                  ).toDateString()}
                </li>
              ) : null}
            </ul>
            <br />
            <br />
            <div>
              <span>
                <strong>Posted on:</strong>{" "}
                {new Date(
                  projectDetails.requestedOn.seconds * 1000
                ).toDateString()}
              </span>
            </div>
            <br />
            <div>
              <strong>Team Members</strong>
            </div>
            <div className="team">
              {projectDetails.teamMembers.map(({ id }) => (
                <Member
                  key={id}
                  id={id}
                  requestedBy={projectDetails.requestedBy[0].id}
                />
              ))}
            </div>
            <br />
            <div className="pt-2 border-bottom mb-3"></div>
            <div className="d-flex justify-content-start align-items-center pl-3">
              <div className="bldTopic">
                <strong>Skills:</strong>
              </div>
            </div>
            <div className="d-flex justify-content-start align-items-center pb-4 pl-3 border-bottom">
              <div className="text-muted">
                {projectDetails.skills.map((skill, index) => (
                  <span key={index} className="request-project-info-skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <br />
            <div className="pl-3 font-weight-bold bldTopic">Project AIM</div>
            <div className="d-sm-flex justify-content-between rounded my-3 subscriptions">
              <div className="mng-content">{projectDetails.projectAIM}</div>
            </div>
            {projectDetails.note.length > 0 ? (
              <>
                <div className="pl-3 font-weight-bold bldTopic">Note</div>
                <div className="d-sm-flex justify-content-between rounded my-3 subscriptions">
                  <div className="mng-content">{projectDetails.note}</div>
                </div>
              </>
            ) : null}
            <div className="pl-3 font-weight-bold bldTopic">Team size</div>
            <div className="d-sm-flex justify-content-between rounded my-3 subscriptions">
              <div>Requirement: {projectDetails.teamSize}</div>
              <div>
                Need:{" "}
                {projectDetails.teamSize - projectDetails.teamMembers.length}
              </div>
            </div>
            <div className="pl-3 font-weight-bold bldTopic">
              Expected Completion Date
            </div>
            <div className="d-sm-flex justify-content-between rounded my-3 subscriptions">
              <div>
                {new Date(
                  projectDetails.targetFinishDate.seconds * 1000
                ).toDateString()}
              </div>
              <div>
                Status:
                {projectDetails.status === "pending" ? (
                  <>
                    &nbsp; Pending
                    <HourglassBottomIcon
                      style={{ color: "blue" }}
                    ></HourglassBottomIcon>
                  </>
                ) : projectDetails.status === "development" ? (
                  <>
                    &nbsp; Devlopment
                    <CodeIcon style={{ color: "blue" }}></CodeIcon>
                  </>
                ) : projectDetails.status === "completed" ? (
                  <>
                    &nbsp; Completed
                    <AddTaskIcon
                      style={{
                        width: "30px",
                        height: "24px",
                        color: "#00FF00",
                        cursor: "pointer",
                      }}
                    ></AddTaskIcon>
                  </>
                ) : null}
              </div>
            </div>
            <br />
            {projectDetails.liveLink.length === 0 ? (
              <> </>
            ) : (
              <>
                <div className="pl-3 font-weight-bold bldTopic">Live Link</div>
                <div className="d-sm-flex justify-content-between rounded my-3 subscriptions">
                  <div className="mng-content">
                    <a href={projectDetails.liveLink}>
                      {projectDetails.liveLink}
                    </a>
                  </div>
                </div>
                <br />
              </>
            )}
            <br />
            <div className="view-project-info-tags">
              <i className="las la-tags"></i>
              {projectDetails.tags.map((tag, index) => (
                <Link to={`/search/tags/${tag}`} key={index}>
                  {tag}
                </Link>
              ))}
            </div>
            <br />
            <div className="row border rounded p-1 my-3 p-4">
              <div className="download-project-file">
                <a href={projectDetails.projectFile} download>
                  <button type="button" id="download-project-file-btn">
                    Download Project Files &nbsp;&nbsp;&nbsp;
                    <CloudDownloadIcon></CloudDownloadIcon>
                  </button>
                </a>
              </div>
              {projectDetails.projectPic.length > 0 ? (
                <>
                  <br />
                  <br />
                  <br />
                  <br />
                  <img
                    src={projectDetails.projectPic}
                    alt={projectDetails.projectName}
                    width="100%"
                    height="100%"
                  />
                </>
              ) : null}
            </div>
            <br />
            <div>
              <div
                className="view-project-features-main-content"
                dangerouslySetInnerHTML={{
                  __html: projectDetails.projectFeatures,
                }}
              />
            </div>
            <hr />
            <h6>Comments</h6>
            <div className="all-comments-grid">
              <br />
              <AllCommentsContext.Provider
                value={{ urlName, allComments, setOpen }}
              >
                <AddCommentForm />
                <AllComments />
              </AllCommentsContext.Provider>
            </div>
            {requestedProjectsArray.length > 0 ? (
              <div className="post-project-rec-card">
                <hr />
                <div>
                  Recommended <FeaturedPlayListIcon></FeaturedPlayListIcon>
                </div>
                {!matches ? (
                  <>
                    {requestedProjectsArray.map((data) => (
                      <RecommendedProjectRequestCard
                        data={data.data}
                        key={data.id}
                      />
                    ))}
                  </>
                ) : (
                  <Swiper
                    slidesPerView={3}
                    slidesPerGroup={3}
                    autoplay={{ delay: 5000 }}
                    loop={true}
                    loopFillGroupWithBlank={true}
                    pagination={{
                      clickable: true,
                    }}
                    navigation={true}
                    showsPagination={false}
                    modules={[Navigation, Autoplay]}
                  >
                    {requestedProjectsArray.map((data) => (
                      <SwiperSlide key={data.id}>
                        <RecommendedProjectRequestCard
                          data={data.data}
                          key={data.id}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
              </div>
            ) : null}
            <br />
            <br />
            <br />
          </div>
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
  ) : (
    <>
      <FullPageLoader color={"blue"} height={"50px"} width={"50px"} />
    </>
  );
}

export default CompletedProjectInfo;
