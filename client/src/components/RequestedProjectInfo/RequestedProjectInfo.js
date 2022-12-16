import {
  collection,
  doc,
  getDocs,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  where,
  updateDoc,
  writeBatch,
  orderBy,
  limit,
} from "firebase/firestore";
import swal from "sweetalert";
import db, { storage } from "../../firebase/firebase-config";
import React, { createContext, useEffect, useRef, useState } from "react";
import GroupsIcon from "@mui/icons-material/Groups";
import { Link, useNavigate, useParams } from "react-router-dom";
import Member from "../Member/Member";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import AddTaskIcon from "@mui/icons-material/AddTask";
import CodeIcon from "@mui/icons-material/Code";
import { useUserAuth } from "../../context/UserAuthContextProvider";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import axios from "axios";
import FullPageLoader from "../Loader/FullPageLoader/FullPageLoader";
import ChatIcon from "@mui/icons-material/Chat";
import RequestedMember from "../Member/RequestedMember";
import AddCommentForm from "./AddCommentForm";
import AllComments from "./AllComments";
import Loading from "../Loader/Loading/Loading";
import { uuidv4 } from "@firebase/util";
import { useQuill } from "react-quilljs";
import "react-quill/dist/quill.snow.css";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import FeaturedPlayListIcon from "@mui/icons-material/FeaturedPlayList";
import RequestedProjectUpdateForm from "../../pages/ProjectRequestForm/RequestedProjectUpdateForm";
import RecommendedProjectRequestCard from "../Rrecommended/RecommendedProjectRequestCard";
import CreateIcon from "@mui/icons-material/Create";
import SignUpModal from "../Modal/SignUpModal";
import { Helmet } from "react-helmet";
import "./RequestedProjectInfo.css";
import { getBuildCodePic } from "../../Util/Utils";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import BookmarkAddedOutlinedIcon from "@mui/icons-material/BookmarkAddedOutlined";
export let AllCommentsContext = createContext();

let domainName = "https://buildcode.org";

const buildCodeMailDomain = "https://buildcode-apis.herokuapp.com";
//const buildCodeMailDomain = "http://localhost:3030";

function RequestedProjectInfo({ setPageSidebar }) {
  useEffect(() => {
    setPageSidebar(true);
  }, [setPageSidebar]);

  const [open, setOpen] = useState(false);
  const [text, setText] = useState("Requesting...");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const { projectUniqueID } = useParams();
  const [projectDetails, setProjectDetails] = useState({});
  const [teamMembersEmailID, setTeamMembersEmailID] = useState([]);
  const [teamMembersName, setTeamMembersName] = useState([]);
  const [teamLeaderName, setTeamLeaderName] = useState("");
  const [teamLeaderEmailID, setTeamLeaderEmailID] = useState("");
  const [projectKeywords, setProjectKeywords] = useState("");
  const [isCurrentUserPresentInTeam, setIsCurrentUserPresentInTeam] =
    useState(false);
  const navigate = useNavigate();
  const { user, userUniqueId, userData } = useUserAuth();
  const [urlName, setUrlName] = useState(projectUniqueID);
  const [allComments, setAllComments] = useState([]);
  const [ProjectBlogDetails, setProjectBlogDetails] = useState(null);
  const [toggle, setToggle] = useState(false);
  const updateProjectFormRef = useRef(null);
  const [requestedProjectsArray, setRequestedProjectsArray] = useState([]);
  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 992px)").matches
  );

  useEffect(() => {
    window
      .matchMedia("(min-width: 992px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);

  useEffect(() => {
    const checkDataExists = async () => {
      const q = query(
        collection(db, "projects"),
        where("urlName", "==", projectUniqueID)
      );
      await getDocs(q)
        .then((querySnapshot) => {
          let flag = false;
          querySnapshot.forEach((doc) => {
            flag = true;
          });
          if (flag === false) {
            navigate("/error/Project Not Found 🚫");
          } else {
            onSnapshot(
              doc(db, "projects", projectUniqueID),
              { includeMetadataChanges: true },
              (doc) => {
                /**
                 * if someone comes on this page
                 * and project is in completed
                 * then navigate to completeproject info page
                 */
                if (doc.data().status === "completed") {
                  navigate("/projects/completed/" + projectUniqueID);
                } else if (doc.data().isDeleted === true) {
                  navigate(
                    "/error/This project has been deleted by Admin.\n Please mail us for any help at contact@buildcode.org."
                  );
                } else {
                  getRequestedProjects(doc.data());
                  setProjectDetails(doc.data());
                  setAllComments(doc.data().allComments);
                  getTeamDetails(doc.data());

                  if (doc.data().blog !== "No") {
                    getProjectBlogData(doc.data().blog);
                  } else {
                    setDone(true);
                  }
                }
              }
            );
          }
        })
        .catch((error) => {
          navigate("/error/Something Went Wrong ⚠️");
        });
    };
    checkDataExists();
  }, [projectUniqueID, navigate]);

  const getRequestedProjects = async (newObj) => {
    const projectsRef = query(
      collection(db, "projects"),
      orderBy("requestedOn", "desc"),
      orderBy("totalViews", "desc"),
      orderBy("totalComments", "desc"),
      where("status", "==", "pending"),
      where("skills", "array-contains", newObj.skills[0]),
      where("technology", "in", newObj.keywords.splice(0, 10)),
      limit(21)
    );
    await getDocs(projectsRef)
      .then((documentSnapshots) => {
        let tempProjects = [];
        documentSnapshots.forEach((doc) => {
          if (doc.data().urlName !== newObj.urlName) {
            tempProjects.push({ id: doc.id, data: doc.data() });
          }
        });
        setRequestedProjectsArray(tempProjects);
      })
      .catch((error) => {
        navigate("/error/Something Went Wrong ⚠️");
      });
  };

  const scrollToForm = () => {
    updateProjectFormRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getTeamDetails = (data) => {
    const tempTeamMembers = data.teamMembers;
    const tempEmails = [];
    const tempNames = [];
    for (let index = 0; index < tempTeamMembers.length; index++) {
      const id = tempTeamMembers[index].id;
      const email = tempTeamMembers[index].email;
      const name = tempTeamMembers[index].name;
      tempEmails.push(email);
      tempNames.push(name);
    }
    setTeamMembersEmailID(tempEmails);
    setTeamMembersName(tempNames);
    setTeamLeaderName(data.requestedBy[0].name);
    setTeamLeaderEmailID(data.requestedBy[0].email);
    data.teamMembers.map(({ id }) => {
      if (user !== null && id === userUniqueId) {
        setIsCurrentUserPresentInTeam(true);
      }
    });
    // make keywords string
    let tempKeywords = data.keywords;
    let tempKeywordsStr = "";
    for (let index = 0; index < tempKeywords.length; index++) {
      if (index !== tempKeywords.length - 1) {
        tempKeywordsStr += tempKeywords[index] + ", ";
      } else {
        tempKeywordsStr += tempKeywords[index];
      }
    }

    setProjectKeywords(tempKeywordsStr);
    // handle views
    if (userUniqueId !== null && data.allViews.indexOf(userUniqueId) === -1) {
      const incrementViews = async () => {
        let tempAllViews = data.allViews;
        tempAllViews.push(userUniqueId);
        const projectRef = doc(db, "projects", projectUniqueID);
        await updateDoc(projectRef, {
          totalViews: tempAllViews.length,
          allViews: tempAllViews,
        });
      };
      incrementViews();
    }
  };

  const getProjectBlogData = (projectBlogID) => {
    const getData = async () => {
      const q = query(
        collection(db, "project-blogs"),
        where("urlName", "==", projectBlogID)
      );
      await getDocs(q)
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            setProjectBlogDetails(doc.data());
            setDone(true);
          });
        })
        .catch((error) => {
          navigate("/error/Something Went Wrong ⚠️");
        });
    };
    getData();
  };

  const updateAllUsersRoomDetails = async (id, data, newObj, roomID) => {
    // make batch
    const batch = writeBatch(db);
    const tempTeamMembersOfCurrentProject = newObj.teamMembers;
    for (
      let index = 0;
      index < tempTeamMembersOfCurrentProject.length;
      index++
    ) {
      const currentUserId = tempTeamMembersOfCurrentProject[index].id;
      let userData = {};
      const userRef = doc(db, "users", currentUserId);
      await getDoc(userRef)
        .then((docSnap) => {
          userData = docSnap.data();
          let tempCurrentRooms = userData.currentRooms;
          if (tempCurrentRooms === null || tempCurrentRooms === undefined) {
            tempCurrentRooms = [{ id: roomID, name: newObj.projectName }];
          } else {
            tempCurrentRooms.push({ id: roomID, name: newObj.projectName });
          }
          // update user details
          const usersRef = doc(db, "users", currentUserId);
          batch.update(usersRef, {
            currentRooms: tempCurrentRooms,
          });
        })
        .catch((err) => {
          navigate("/error/Something Went Wrong ⚠️");
        });
    }
    await batch
      .commit()
      .then(() => {
        swal("Request is successfully sent", "", "success").then(() => {
          setLoading(false);
        });
      })
      .catch((err) => {
        navigate("/error/Something Went Wrong ⚠️");
      });
  };

  const sendMailToAllMember = async (id, data, newObj, roomID, blog) => {
    const mailList = teamMembersEmailID;
    const blogID = blog;
    mailList.push(data.email);
    const membersName = teamMembersName;
    membersName.push(data.userName);
    const rooomID = roomID;
    const subject = "Team completed";
    let requestedProjectName = newObj.projectName;
    let requestedProjectDate = new Date(
      newObj.requestedOn * 1000
    ).toDateString();
    const body = {
      mailList,
      membersName,
      teamLeaderName,
      blogID: blog,
      requestedProjectName,
      projectUniqueID,
      rooomID,
      requestedProjectDate,
      subject,
    };
    await axios
      .post(`${buildCodeMailDomain}/buildcode/send-mail-to`, body, {
        headers: {
          "Content-type": "application/json",
        },
      })
      .then((res) => {
        // add this room as all users new room
        updateAllUsersRoomDetails(id, data, newObj, roomID);
      })
      .catch((err) => {
        updateAllUsersRoomDetails(id, data, newObj, roomID);
      });
  };

  const makeChatRoomAndBlog = async (id, data, newObj) => {
    // make batch
    const batch = writeBatch(db);

    let urlName = projectDetails.urlName + "-chat-room" + uuidv4();
    let roomData = {
      roomPic: getBuildCodePic(projectDetails.projectName[0].toUpperCase()),
      urlName: urlName,
      createdOn: serverTimestamp(),
      name: newObj.projectName,
      teamMembers: newObj.teamMembers,
      teamLeaderEmail: newObj.requestedBy[0].email,
      project: projectUniqueID,
      projectName: newObj.projectName,
      teamLeaderDetails: [teamLeaderEmailID, newObj.requestedBy[0].id],
      isDeleted: false,
      violatedRoom: false,
      copiedRoom: false,
    };
    const roomsRef = doc(db, "rooms", urlName);
    batch.set(roomsRef, roomData);
    // set initial message in room
    const messageData = {
      description: "Get Ready",
      message:
        "<div>Here you can chat with your team members and discuss your ideas and approaches to building projects, as long as the project is in the development phase. Once you upload your Project then the chat option will be disabled and all chat room data will be deleted from the server.<br/><br/>No one can enter this room except your team members.<br/><br/>For any help please contact us at contact@buildcode.org.<br/><br/><br/><h5>Get Ready for development👍</h5></div>",
      messageNameId: "Admin",
      name: "Admin",
      timestamp: serverTimestamp(),
    };
    const roomMesageRef = collection(db, "rooms", urlName, "messages");
    batch.set(doc(roomMesageRef), messageData);

    // make blog
    let urlNameOfProjectBlog = projectDetails.urlName + "-blog-" + uuidv4();
    let blogData = {
      urlName: urlNameOfProjectBlog,
      createdOn: serverTimestamp(),
      completedOn: "",
      projectBlogDescription: "",
      mainContent: "",
      projectFile: "",
      projectPic: "",
      lastModifiedDate: "",
      status: "development",
      teamMembers: newObj.teamMembers,
      project: projectUniqueID,
      projectUrlName: newObj.urlName,
      projectName: newObj.projectName,
      teamLeaderDetails: newObj.requestedBy,
      allComments: [],
      totalComments: 0,
      allLikes: [],
      totalLikes: 0,
      allViews: [],
      totalViews: 0,
      tags: newObj.tags,
      isDeleted: false,
      violatedProjectBlog: false,
      copiedProjectBlog: false,
      level: 1,
      mostPopular: false,
    };

    const blogRef = doc(db, "project-blogs", urlNameOfProjectBlog);
    batch.set(blogRef, blogData);
    /**
     * also update project details
     */
    const projectRef = doc(db, "projects", projectUniqueID);
    batch.update(projectRef, {
      startedOn: serverTimestamp(),
      roomID: urlName,
      blog: urlNameOfProjectBlog,
    });
    await batch
      .commit()
      .then(() => {
        // send mail to all members
        sendMailToAllMember(id, data, newObj, urlName, urlNameOfProjectBlog);
      })
      .catch((err) => {
        navigate("/error/Something Went Wrong ⚠️");
      });
  };

  const updateProjectAndUserDetails = async (id, data, newObj) => {
    const batch = writeBatch(db);
    // update project details
    const projectRef = doc(db, "projects", projectUniqueID);
    batch.update(projectRef, {
      teamMembers: newObj.teamMembers,
      requestedForJoinTheProject: newObj.requestedForJoinTheProject,
      status: newObj.status,
    });
    // update user details
    const usersRef = doc(db, "users", id);
    batch.update(usersRef, {
      currentProjects: data.currentProjects,
    });
    await batch
      .commit()
      .then(() => {
        if (Number(newObj.teamMembers.length) === Number(newObj.teamSize)) {
          makeChatRoomAndBlog(id, data, newObj);
        } else {
          setLoading(false);
          swal("User Added", "", "success");
        }
      })
      .catch((err) => {
        setLoading(false);
        swal("User Added", "", "success");
        // navigate("/error/Something Went Wrong ⚠️");
      });
  };

  const sendMailToNewMember = async (id, data, newObj) => {
    let requestedProjectName = newObj.projectName;
    let newMemberName = data.userName;
    let newMemberEmailID = data.email;
    let requestedProjectDate = new Date(
      newObj.requestedOn * 1000
    ).toDateString();
    let subject = "Request Accepted!!!";
    let company = "Build-Code";
    const body = {
      newMemberName,
      newMemberEmailID,
      requestedProjectName,
      projectUniqueID,
      requestedProjectDate,
      subject,
      company,
    };

    await axios
      .post(`${buildCodeMailDomain}/buildcode/send-mail-to`, body, {
        headers: {
          "Content-type": "application/json",
        },
      })
      .then((res) => {
        updateProjectAndUserDetails(id, data, newObj);
      })
      .catch((err) => {
        updateProjectAndUserDetails(id, data, newObj);
      });
  };

  const isUserPresentInTeam = (userEmail) => {
    let tempTeamMembersArray = projectDetails.teamMembers;
    for (let index = 0; index < tempTeamMembersArray.length; index++) {
      let tempEmail = tempTeamMembersArray[index].email;
      if (tempEmail === userEmail) {
        return true;
      }
    }
    return false;
  };

  const acceptRequest = (id, data) => {
    setText("Accepting...");
    setTimeout(() => {
      setLoading(true);
    }, 500);
    /**
     * befor adding the current user check current user is in this Project or not
     */
    if (isUserPresentInTeam(data.email)) {
      setTimeout(() => {
        setLoading(false);
        swal("This user is already in this Project", "error");
      }, 1000);
    } else {
      /**
       * if current user is not in this project
       *
       * first update the project details
       * add current user as new team member
       * update status as development if require
       *
       * and also delete current user from
       * requestedForJoinTheProject array
       *
       * second update the user details
       * add current project as new ongoing project
       */
      let newTeamMembers = projectDetails.teamMembers;
      let teamMembersLenght = projectDetails.teamMembers.length;
      let tempStatus = projectDetails.status;

      if (teamMembersLenght === Number(projectDetails.teamSize) - 1) {
        tempStatus = "development";
      }
      if (newTeamMembers === null || newTeamMembers === undefined)
        newTeamMembers = [
          {
            id: id,
            email: data.email,
            name: data.userName,
            img: data.profilePic,
          },
        ];
      else
        newTeamMembers.push({
          id: id,
          email: data.email,
          name: data.userName,
          img: data.profilePic,
        });

      let newRequestedMemberForJoinTheProject =
        projectDetails.requestedForJoinTheProject;
      delete newRequestedMemberForJoinTheProject[id];

      let newObj = {
        ...projectDetails,
        teamMembers: newTeamMembers,
        requestedForJoinTheProject: newRequestedMemberForJoinTheProject,
        status: tempStatus,
        startedOn: serverTimestamp(),
      };

      // add this project as user new currentProjects
      let tempCurrentProjects = data.currentProjects;
      if (tempCurrentProjects === null || tempCurrentProjects === undefined)
        tempCurrentProjects = [projectUniqueID];
      else tempCurrentProjects.push(projectUniqueID);
      data = { ...data, currentProjects: tempCurrentProjects };

      sendMailToNewMember(id, data, newObj);
    }
  };

  const sendMailToRejectedUser = async (id, data, newObj) => {
    let requestedProjectName = projectDetails.projectName;
    let rejectedUserName = data.userName;
    let rejectedUserEmail = data.email;
    let requestedProjectDate = new Date(
      projectDetails.requestedOn * 1000
    ).toDateString();
    let subject = "Request rejected!!!";
    let company = "DevCoding";
    const body = {
      rejectedUserName,
      rejectedUserEmail,
      requestedProjectName,
      projectUniqueID,
      requestedProjectDate,
      subject,
      company,
    };
    await axios
      .post(`${buildCodeMailDomain}/buildcode/send-mail-to`, body, {
        headers: {
          "Content-type": "application/json",
        },
      })
      .then((res) => {
        setLoading(false);
        swal("User Removed", "", "success");
      })
      .catch((err) => {
        setLoading(false);
        swal("User Removed", "", "success");
        // setLoading(false);
        // navigate("/error/Something Went Wrong ⚠️");
      });
  };

  const rejectRequest = (id, data) => {
    setText("Removing...");
    /**
     * first update the project details
     * remove current user from  requestedForJoinTheProject
     *
     * and send email to rejected user
     */
    setLoading(true);
    const rejectUser = async () => {
      let newRequestedMemberForJoinTheProject =
        projectDetails.requestedForJoinTheProject;
      delete newRequestedMemberForJoinTheProject[id];
      let newObj = {
        ...projectDetails,
        requestedForJoinTheProject: newRequestedMemberForJoinTheProject,
      };
      const projectRef = doc(db, "projects", projectUniqueID);
      await updateDoc(projectRef, {
        requestedForJoinTheProject: newRequestedMemberForJoinTheProject,
      })
        .then(() => {
          sendMailToRejectedUser(id, data, newObj);
        })
        .catch(() => {
          setLoading(false);
          swal("User Removed", "", "success");
          // setLoading(false);
          // navigate("/error/Something Went Wrong ⚠️");
        });
    };
    rejectUser();
  };

  const checkUserSkills = () => {
    // /**
    //  * if user don't have all skills
    //  * mentioned in the project details
    //  * them show error message
    //  */

    // const userSkillsArray = userData.skills;
    // for (let index = 0; index < projectDetails.skills.length; index++) {
    //   if (userSkillsArray.indexOf(projectDetails.skills[index]) === -1) {
    //     setLoading(false);
    //     swal(
    //       "You do not have the skills that are specified in the project requirement.",
    //       "please update your profile",
    //       "error"
    //     );
    //     return false;
    //   }
    // }
    return true;
  };

  const sendMailToTeamLeader = async (newObj) => {
    let requestedProjectName = newObj.projectName;
    let requestedMemberName = userData.userName;
    let requestedProjectDate = new Date(
      newObj.requestedOn * 1000
    ).toDateString();
    let subject = "Requested for joining the project";
    let company = "Build-Code";

    const body = {
      teamLeaderName,
      teamLeaderEmailID,
      requestedProjectName,
      projectUniqueID,
      requestedMemberName,
      requestedProjectDate,
      subject,
      company,
    };

    await axios
      .post(`${buildCodeMailDomain}/buildcode/send-mail-to`, body, {
        headers: {
          "Content-type": "application/json",
        },
      })
      .then((res) => {
        setLoading(false);
        swal("Request sent successfully", "", "success");
      })
      .catch((err) => {
        setLoading(false);
        swal("Request sent successfully", "", "success");
        // setLoading(false);
        // navigate("/error/Something Went Wrong ⚠️");
      });
  };

  const requestForJoiningTheProject = () => {
    if (userData.isDeleted === true) {
      navigate(
        "/error/This account has been deleted if you are an account holder then mail us contact@buildcode to deactivate."
      );
    } else if (userData.redUser === true) {
      navigate(
        "/error/This account has been suspended due to a violation of the BuildCode account user agreement if you are an account holder then mail us contact@buildcode to deactivate."
      );
    } else {
      if (user.emailVerified === false) {
        navigate("/verify-email");
      } else {
        setLoading(true);
        /**
         * befor adding the current user,  is current user already in team or not
         */
        if (isUserPresentInTeam(userData.email)) {
          setLoading(false);
          swal("You are already in this project", "error");
        } else if (
          /**
           * befor adding the current user check current user is already requested or not
           */
          projectDetails.requestedForJoinTheProject.hasOwnProperty(userUniqueId)
        ) {
          setLoading(false);
          swal("You have already requested", "error");
        } else {
          // check skills of current user
          // a user should have all skills
          // mentined in the project details
          if (checkUserSkills()) {
            /**
             * first add this user as new requested member
             * for joining the project
             *
             * send mail to the team leader(requested by)
             *
             * update the project details and user details
             */
            const updateProjectRecord = async () => {
              let newRequestedMemberForJoinTheProject =
                projectDetails.requestedForJoinTheProject;
              newRequestedMemberForJoinTheProject[userUniqueId] =
                serverTimestamp();

              let newObj = {
                ...projectDetails,
                requestedForJoinTheProject: newRequestedMemberForJoinTheProject,
              };

              const projectRef = doc(db, "projects", projectUniqueID);
              await updateDoc(projectRef, {
                requestedForJoinTheProject: newRequestedMemberForJoinTheProject,
              })
                .then(() => {
                  sendMailToTeamLeader(newObj);
                })
                .catch(() => {
                  setLoading(false);
                  swal("Request sent successfully", "", "success");
                  //setLoading(false);
                  //navigate("/error/Something Went Wrong ⚠️");
                });
            };
            updateProjectRecord();
          }
        }
      }
    }
  };

  const updateProjectDetailsForAgreeToSubmitTheProject = async (newObj) => {
    const projectRef = doc(db, "projects", projectUniqueID);
    await updateDoc(projectRef, newObj).then(() => {
      setTimeout(() => {
        setLoading(false);
        swal("Request sent successfully", "", "success");
      });
    });
  };

  const sendMailToAllMememberForRequestForSubmitTheProject = async (newObj) => {
    const requestedPerson = userData.userName;
    const mailList = teamMembersEmailID;
    const membersName = teamMembersName;
    const subject = "Someone have requested for submit the project!!!";
    let requestedProjectName = newObj.projectName;
    let requestedProjectDate = new Date(
      newObj.requestedOn * 1000
    ).toDateString();

    const body = {
      requestedPerson,
      mailList,
      membersName,
      teamLeaderName,
      requestedProjectName,
      projectUniqueID,
      requestedProjectDate,
      subject,
    };

    await axios
      .post(`${buildCodeMailDomain}/buildcode/send-mail-to`, body, {
        headers: {
          "Content-type": "application/json",
        },
      })
      .then((res) => {
        updateProjectDetailsForAgreeToSubmitTheProject(newObj);
      })
      .catch((err) => {
        navigate("/error/Something Went Wrong ⚠️");
      });
  };

  const handleAgreeToSubmitProject = () => {
    setText("Requesting...");
    setTimeout(() => {
      setLoading(true);
    }, 500);
    // if user is already requested then show error message
    if (projectDetails.agreeToSubmitProject.hasOwnProperty(userUniqueId)) {
      setTimeout(() => {
        setLoading(false);
        swal("you have already requested", "error");
      }, 2000);
    } else {
      /**
       * first add current user into AgreeToSubmitProject array as new
       * user(member) who is agree to sbmit the project
       * projectDetails.agreeToSubmitProject
       */
      let newAgreeToSubmitProjectArray = projectDetails.agreeToSubmitProject;
      if (
        newAgreeToSubmitProjectArray === null ||
        newAgreeToSubmitProjectArray === undefined
      ) {
        newAgreeToSubmitProjectArray = [userUniqueId];
      } else {
        newAgreeToSubmitProjectArray.push(userUniqueId);
      }
      let newObj = {
        ...projectDetails,
        agreeToSubmitProject: newAgreeToSubmitProjectArray,
      };
      /**
       * update the project information into firbase     *
       */
      sendMailToAllMememberForRequestForSubmitTheProject(newObj);
    }
  };

  const updateProjectRequest = () => {
    if (
      projectDetails.status !== "pending" ||
      projectDetails.requestedBy[0].id !== userUniqueId
    ) {
      navigate("/error/Something Went Wrong ⚠️");
    } else {
      setToggle(!toggle);
      setTimeout(() => {
        scrollToForm();
      }, 500);
    }
  };

  const deleteProjectRequest = () => {
    if (projectDetails.teamMembers.length === 1) {
      setText("Deleting Your Project...");
      swal({
        title: "are you sure want to delete?",
        text: "",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          setLoading(true);
          const deleteRecord = async () => {
            let batch = writeBatch(db);
            batch.delete(doc(db, "projects", projectUniqueID));

            let userCurrentProjects = userData.currentProjects;
            let indexOfCurrentProject =
              userCurrentProjects.indexOf(projectUniqueID);
            if (indexOfCurrentProject !== -1) {
              userCurrentProjects.splice(indexOfCurrentProject, 1);
            }

            let userRef = doc(db, "users", userData.urlName);
            batch.update(userRef, {
              currentProjects: userCurrentProjects,
            });

            await batch
              .commit()
              .then(() => {
                swal("Deleted!", {
                  icon: "success",
                });
                navigate("/");
              })
              .catch((err) => {
                navigate("/error/Something Went Wrong ⚠️");
              });
          };
          deleteRecord();
        }
      });
    }
  };

  const closeDialog = () => {
    setOpen(false);
  };

  const saveToMyList = () => {
    // let temp = userData.myProjectList.find((obj) => obj.urlName === projectUniqueID);
    // console.log("result is");
    // console.log(temp);
    const saveToUserMyList = async () => {
      let userMyList = userData.myProjectList;
      userMyList.push(projectUniqueID);
      let userRef = doc(db, "users", userData.urlName);
      await updateDoc(userRef, {
        myProjectList: userMyList,
      })
        .then(() => {})
        .catch((err) => {
          navigate("/error/Something Went Wrong ⚠️");
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
        <title>{projectDetails.projectName}</title>

        <meta name="keywords" keywords={projectKeywords}></meta>

        <link href="https://buildcode.org/requested-projects" rel="canonical" />

        <meta content={projectDetails.projectName} itemprop="name" />

        <meta content={projectDetails.projectAIM} itemprop="description" />

        <meta
          content="https://firebasestorage.googleapis.com/v0/b/buildcode-db.appspot.com/o/BuildCode%2Fbuild-code-log-png.png?alt=media&token=89dee950-0ea9-4ce9-9c7c-3f6d036dd595"
          itemprop="image"
        />

        <meta content="en_US" property="og:locale" />

        <meta content="projects" property="og:type" />

        <meta
          content={`https://buildcode.org/projects/${projectDetails.urlName}`}
          property="og:url"
        />

        <meta content="buildcode.org" property="og:site_name" />

        <meta content={projectDetails.projectName} property="og:title" />

        <meta content={projectDetails.projectAIM} property="og:description" />

        <meta
          content="https://firebasestorage.googleapis.com/v0/b/buildcode-db.appspot.com/o/BuildCode%2Fbuild-code-log-png.png?alt=media&token=89dee950-0ea9-4ce9-9c7c-3f6d036dd595"
          property="og:image"
        />

        <meta property="og:image:alt" />

        <meta content="summary_large_image" name="twitter:card" />

        <meta content={projectDetails.projectName} name="twitter:title" />

        <meta content={projectDetails.projectAIM} name="twitter:description" />

        <meta
          content="https://firebasestorage.googleapis.com/v0/b/buildcode-db.appspot.com/o/BuildCode%2Fbuild-code-log-png.png?alt=media&token=89dee950-0ea9-4ce9-9c7c-3f6d036dd595"
          name="twitter:image"
        />
      </Helmet>
      <Loading loaded={!loading} text={text} />
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

          <div className="wrapper bg-white p-20 mt-0  bg-white rounded">
            <div className="projects-update-delete-share-bts">
              {userData !== null ? (
                <>
                  {userData.myProjectList.indexOf(projectUniqueID) === -1 ? (
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

              {user === null ? (
                <div
                  className="requested-project-update-delete-btn"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      projectDetails.status === "pending" ||
                        projectDetails.status === "development"
                        ? `${domainName}/projects/${projectUniqueID}`
                        : `${domainName}/projects/completed/${projectUniqueID}`
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
              ) : (
                <>
                  {(projectDetails.status === "pending" &&
                    projectDetails.teamMembers.length === 1 &&
                    projectDetails.requestedBy[0].id === userUniqueId) ||
                  userUniqueId === process.env.REACT_APP_BUILDCODE_ADMIN_ID ? (
                    <div
                      className="requested-project-update-delete-btn"
                      onClick={updateProjectRequest}
                    >
                      <UpgradeIcon
                        style={{
                          width: "30px",
                          height: "24px",
                          cursor: "pointer",
                        }}
                      ></UpgradeIcon>
                      <span>Update</span>
                    </div>
                  ) : null}
                  {projectDetails.status === "pending" &&
                  projectDetails.teamMembers.length === 1 &&
                  projectDetails.requestedBy[0].id === userUniqueId ? (
                    <div
                      className="requested-project-update-delete-btn"
                      onClick={deleteProjectRequest}
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
                  ) : null}
                  <div
                    className="requested-project-update-delete-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        projectDetails.status === "pending" ||
                          projectDetails.status === "development"
                          ? `${domainName}/projects/${projectUniqueID}`
                          : `${domainName}/projects/completed/${projectUniqueID}`
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
                </>
              )}
            </div>

            {(projectDetails.status === "development" &&
              user !== null &&
              isUserPresentInTeam(user.email) === true) ||
            (userUniqueId !== null &&
              userUniqueId === process.env.REACT_APP_BUILDCODE_ADMIN_ID) ? (
              <>
                {ProjectBlogDetails === null ? null : (
                  <>
                    {ProjectBlogDetails.lastModifiedDate !== "" ? (
                      <>
                        <div className="project-server">
                          <Link
                            to={`/projects/updateprojectblog/${projectDetails.blog}`}
                            className="d-n-h"
                          >
                            <div className="project-blog">
                              <div>
                                <span>Update</span> <CreateIcon> </CreateIcon>
                              </div>
                            </div>
                          </Link>

                          <Link
                            to={`/rooms/${projectDetails.roomID}`}
                            className="d-n-h"
                          >
                            <div className="project-chat">
                              <div>
                                <span>Chat</span>{" "}
                                <ChatIcon
                                  style={{ color: "black", cursor: "pointer" }}
                                ></ChatIcon>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </>
                    ) : (
                      <>
                        <br />
                        <div className="project-request-write-blog-main-grid">
                          <div className="alert alert--warning" role="alert">
                            Now your Project is in Development phase You can
                            write a blog while Developing your project.
                          </div>
                        </div>

                        <div className="project-server">
                          <Link
                            to={`/projects/updateprojectblog/${projectDetails.blog}`}
                            className="d-n-h"
                          >
                            <div className="project-blog">
                              <strong>Start Writing</strong>
                              <CreateIcon> </CreateIcon>
                            </div>
                          </Link>
                          <Link
                            to={`/rooms/${projectDetails.roomID}`}
                            className="d-n-h"
                          >
                            <div className="project-chat">
                              <div>
                                <span>Chat</span>{" "}
                                <ChatIcon
                                  style={{ color: "black", cursor: "pointer" }}
                                ></ChatIcon>
                              </div>
                            </div>
                          </Link>
                        </div>
                        <hr />
                      </>
                    )}
                  </>
                )}
              </>
            ) : null}
            <br />
            <div>
              <span>
                <strong>
                  <EventAvailableIcon></EventAvailableIcon>
                </strong>{" "}
                <small style={{ color: "grey", fontSize: "0.8rem" }}>
                  {new Date(
                    projectDetails.requestedOn.seconds * 1000
                  ).toDateString()}
                </small>
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
                <strong>Skills</strong>
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

            {projectDetails.status === "development" &&
            Number(projectDetails.teamSize) ===
              Number(projectDetails.teamMembers.length) &&
            user !== null &&
            isUserPresentInTeam(user.email) === true ? (
              <>
                {projectDetails.agreeToSubmitProject.indexOf(userUniqueId) ===
                -1 ? (
                  <>
                    <br />
                    <br />
                    <div className="request-for-joing-btn">
                      <button
                        type="button"
                        className="build-code-btn"
                        onClick={handleAgreeToSubmitProject}
                      >
                        Request to submit the Project
                      </button>
                    </div>
                  </>
                ) : null}
                <br />
                <br />
                <hr />
                <div className="table-responsive">
                  <table className="table table-borderless">
                    <thead>
                      <tr className="text-uppercase text-muted">
                        <th scope="col">
                          <GroupsIcon style={{ color: "blue" }}></GroupsIcon>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">
                          {/* {projectDetails.agreeToSubmitProject.length} &nbsp; */}
                          Member requested to submit the Project
                        </th>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="team">
                  {projectDetails.agreeToSubmitProject.map((id) => (
                    <Member
                      key={id}
                      id={id}
                      requestedBy={projectDetails.requestedBy[0].id}
                    />
                  ))}
                </div>
              </>
            ) : null}

            {user === null ? (
              <div className="request-for-joing-btn">
                <br />
                <button
                  className="build-code-btn"
                  onClick={() => setOpen(true)}
                >
                  Request for Join
                </button>
              </div>
            ) : projectDetails.status === "pending" &&
              projectDetails.requestedBy[0].id !== userUniqueId &&
              isCurrentUserPresentInTeam === false ? (
              <div className="request-for-joing-btn">
                <br />
                <button
                  className="build-code-btn"
                  onClick={requestForJoiningTheProject}
                >
                  Request for Join
                </button>
              </div>
            ) : null}

            {projectDetails.status + "" === "pending" &&
            Object.keys(projectDetails.requestedForJoinTheProject).length >
              0 ? (
              <>
                <br />
                <br />
                <hr />
                <h5>Requested for joining the Project</h5>
                <br />
                <div className="requested-users-main-grid">
                  {Object.keys(projectDetails.requestedForJoinTheProject).map(
                    (key) => (
                      <RequestedMember
                        id={key}
                        key={key}
                        date={projectDetails.requestedForJoinTheProject[key]}
                        isTeamLeader={
                          userUniqueId === projectDetails.requestedBy[0].id
                        }
                        acceptRequest={acceptRequest}
                        rejectRequest={rejectRequest}
                      />
                    )
                  )}
                </div>
              </>
            ) : null}
            <br />
            <div className="view-project-info-tags">
              <i className="las la-tags"></i>
              {projectDetails.tags.map((tag, index) => (
                <Link to={`/search/tags/${tag}`} key={index}>
                  {tag}
                </Link>
              ))}
            </div>

            <div ref={updateProjectFormRef} />

            {toggle === true ? (
              <>
                <br />
                <hr />
                <br />
                <div className="requested-project-update-form">
                  <RequestedProjectUpdateForm
                    data={projectDetails}
                    userUniqueId={userUniqueId}
                    userData={userData}
                  />
                </div>
              </>
            ) : null}

            {user !== null &&
            Number(projectDetails.agreeToSubmitProject.length) ===
              Number(projectDetails.teamSize) &&
            projectDetails.requestedBy[0].id === userUniqueId ? (
              <>
                <UploadRequestedProject
                  projectUniqueID={projectUniqueID}
                  userUniqueId={userUniqueId}
                  setProjectDetails={setProjectDetails}
                  projectDetails={projectDetails}
                  teamMembersEmailID={teamMembersEmailID}
                  teamMembersName={teamMembersName}
                  teamLeaderName={teamLeaderName}
                  setLoading={setLoading}
                  navigate={navigate}
                  setText={setText}
                />
              </>
            ) : null}

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
              <div className="requested-project-info-rec-card">
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
                    slidesPerView={2}
                    slidesPerGroup={2}
                    autoplay={{ delay: 5000 }}
                    loop={true}
                    loopFillGroupWithBlank={true}
                    pagination={{
                      clickable: true,
                    }}
                    navigation={true}
                    showspagination="false"
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
  );
}

const UploadRequestedProject = ({
  projectUniqueID,
  userUniqueId,
  projectDetails,
  teamMembersEmailID,
  teamMembersName,
  teamLeaderName,
  setLoading,
  navigate,
  setText,
}) => {
  const [error, setError] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const [projectFile, setProjectFile] = useState("");
  const [projectPic, setProjectPic] = useState("");
  const topRef = useRef(null);

  const scrollToBottom = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const updateRecord = async (newObj) => {
    let batch = writeBatch(db);

    const usersRef = doc(db, "projects", projectUniqueID);
    batch.set(usersRef, newObj);

    // delete chat room
    const roomRef = doc(db, "rooms", projectDetails.roomID);
    batch.delete(roomRef);

    // delete all messages
    const roomMesageRef = collection(
      db,
      "rooms",
      projectDetails.roomID,
      "messages"
    );
    const allMessagesDocs = await getDocs(roomMesageRef);

    allMessagesDocs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch
      .commit(() => {
        setTimeout(() => {
          setLoading(false);
          swal("Project completed successfully", "", "success").then(() => {
            navigate("/projects/completed/" + projectUniqueID);
          });
        }, 800);
      })
      .catch((error) => {
        navigate("/error/Something Went Wrong ⚠️");
      });
  };

  const uploadFile = (file, fileType) => {
    let storageRef;
    if (fileType === "project_file") {
      storageRef = ref(
        storage,
        `completedprojects/files/project_file${
          projectUniqueID + file.name + uuidv4()
        }`
      );
    } else {
      storageRef = ref(
        storage,
        `completedprojects/images/project_pic${projectUniqueID + file.name}`
      );
    }
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (err) => {
        setError("An error occurred during uploading the file");
      },
      () => {
        if (fileType === "project_file") {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((url) => {
              setProjectFile(url);
              setTimeout(() => {
                setLoading(false);
              }, 800);
            })
            .catch((error) => {
              setTimeout(() => {
                setLoading(false);
              }, 800);
              alert("An error occurred during uploading the file");
            });
        } else {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((url) => {
              setProjectPic(url);
              setTimeout(() => {
                setLoading(false);
              }, 800);
            })
            .catch((error) => {
              setTimeout(() => {
                setLoading(false);
              }, 800);
              alert("An error occurred during uploading the file");
            });
        }
      }
    );
  };

  function isFileImage(file) {
    return file && file["type"].split("/")[0] === "image";
  }

  const handleProjectFile = (e) => {
    setText("Uploading Project File...");
    setError("");
    if (e.target && e.target.files) {
      const file = e.target.files[0];
      if (file.size > 5000100) {
        setError("Project File size should be less than or equesl to 5MB");
      } else {
        setLoading(true);
        uploadFile(file, "project_file");
      }
    }
  };
  const handleProjectPic = (e) => {
    setText("Uploading Project Pic");
    setError("");
    if (e.target && e.target.files) {
      const file = e.target.files[0];
      if (isFileImage(file) === false) {
        setError("Project Pic should be Image");
      } else {
        if (file.size > 1000000) {
          setError("File size should be less than or equal to 1MB");
        } else {
          setLoading(true);
          uploadFile(file, "project_pic");
        }
      }
    }
  };

  const getUserNewCurrentRoomsArray = (userData) => {
    let tempCurrentRooms = userData.currentRooms;
    let result = [];
    for (let roomObj of tempCurrentRooms) {
      if (projectDetails.roomID !== roomObj.id) {
        result.push({
          id: roomObj.id,
          name: roomObj.name,
        });
      }
    }
    return result;
  };

  const updateAllMembersAccount = async (newObj) => {
    // get batch for updating
    const batch = writeBatch(db);
    const tempTeamMembersOfCurrentProject = projectDetails.teamMembers;
    for (let currentUsetData of tempTeamMembersOfCurrentProject) {
      const currentUserId = currentUsetData.id;
      let userData = null;
      const userRef = doc(db, "users", currentUserId);
      await getDoc(userRef)
        .then((docSnap) => {
          userData = docSnap.data();
          //update the record
          /**
           * find the index of current project id in user's onGoing array and delete that
           * also add this current project as completed projects
           * for that add this project id to user's Completed projects array
           */
          let currentUserCureentProjects = userData.currentProjects;
          let index = currentUserCureentProjects.indexOf(projectUniqueID);
          if (index !== -1) {
            currentUserCureentProjects.splice(index, 1);
          }
          let currentUserCompletedProjects = userData.completedProjects;
          if (
            currentUserCompletedProjects === null ||
            currentUserCompletedProjects === undefined
          ) {
            currentUserCompletedProjects = [projectUniqueID];
          } else {
            currentUserCompletedProjects.push(projectUniqueID);
          }
          let newCurrentRoomsArrayOfUser =
            getUserNewCurrentRoomsArray(userData);
          userData = {
            ...userData,
            currentProjects: currentUserCureentProjects,
            completedProjects: currentUserCompletedProjects,
            currentRooms: newCurrentRoomsArrayOfUser,
          };
          batch.update(userRef, {
            currentProjects: currentUserCureentProjects,
            completedProjects: currentUserCompletedProjects,
            currentRooms: newCurrentRoomsArrayOfUser,
          });
        })
        .catch((err) => {
          navigate("/error/Something Went Wrong ⚠️");
        });
    }
    await batch
      .commit()
      .then(() => {
        // post project blog if present
        updateProjectBlog(newObj);
      })
      .catch((err) => {
        navigate("/error/Something Went Wrong ⚠️");
      });
  };

  const sendMailForCompletingTheProject = async (newObj) => {
    const mailList = teamMembersEmailID;
    const membersName = teamMembersName;
    const subject = "Project Completed !!!";
    let requestedProjectName = newObj.projectName;
    let requestedProjectDate = new Date(
      newObj.requestedOn * 1000
    ).toDateString();

    const body = {
      mailList,
      membersName,
      teamLeaderName,
      requestedProjectName,
      projectUniqueID,
      requestedProjectDate,
      subject,
    };

    await axios
      .post(`${buildCodeMailDomain}/buildcode/send-mail-to`, body, {
        headers: {
          "Content-type": "application/json",
        },
      })
      .then((res) => {
        updateRecord(newObj);
      })
      .catch((err) => {
        //navigate("/error/Something Went Wrong ⚠️");
      });
  };

  const updateProjectBlog = async (newObj) => {
    if (newObj.blog !== "No") {
      const projectBlogRef = doc(db, "project-blogs", newObj.blog);
      await updateDoc(projectBlogRef, {
        projectPic: projectPic,
        projectFile: projectFile,
        status: "completed",
        completedOn: serverTimestamp(),
        lastModifiedDate: serverTimestamp(),
      })
        .then(() => {
          // send message to all team member's
          sendMailForCompletingTheProject(newObj);
        })
        .catch((err) => {
          navigate("/error/Something Went Wrong ⚠️");
        });
    }
  };

  const handleSubmit = () => {
    setText("Uploading Project...");
    setTimeout(() => {
      setLoading(true);
    }, 500);
    if (projectFile === "") {
      setTimeout(() => {
        setLoading(false);
        setError("Please upload Project File");
        scrollToBottom();
      }, 1000);
    } else if (projectPic === "") {
      setTimeout(() => {
        setLoading(false);
        setError("Please upload Project Pic");
        scrollToBottom();
      }, 1000);
    } else {
      let newObj = {
        ...projectDetails,
        projectFile: projectFile,
        projectPic: projectPic,
        status: "completed",
        completedOn: serverTimestamp(),
        roomID: projectDetails.roomID,
        projectFeaturesDescription: quill
          .getText()
          .replace(/\n/g, " ")
          .substring(0, 1000),
        projectFeatures: quill.root.innerHTML,
        liveLink: liveLink,
      };
      // set this project as completed project of all user's account
      updateAllMembersAccount(newObj);
    }
  };

  const theme = "snow";
  const modules = {
    toolbar: [
      [{ size: [] }],
      ["bold"],
      ["italic"],
      ["underline"],
      ["strike"],
      ["blockquote"],
      [{ list: "ordered" }],
      [{ list: "bullet" }],
      ["code-block"],
      ["link"],
      ["image"],
      ["video"],
    ],
    clipboard: {
      matchVisual: false,
    },
  };
  const placeholder =
    "Write details about your project [Project Features,Project Working....]";
  const formats = [
    "size",
    "bold",
    "italic",
    "underline",
    "list",
    "strike",
    "code-block",
    "link",
    "image",
    "video",
    "list",
    "blockquote",
  ];
  const { quillRef, quill } = useQuill({
    theme,
    modules,
    formats,
    placeholder,
  });
  // Upload Image to Image Server such as AWS S3, Cloudinary, Cloud Storage, etc..
  const saveToServer = async (file) => {
    setLoading(true);
    let storageRef;
    storageRef = ref(storage, `projects/images/${uuidv4() + file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (err) => {
        alert("An error occurred during uploading the file");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((url) => {
            const range = quill.getSelection();
            quill.insertEmbed(range.index, "image", url);

            setLoading(false);
          })
          .catch((error) => {
            alert("An error occurred during uploading the file");
          });
      }
    );
  };

  // Open Dialog to select Image File
  const selectLocalImage = () => {
    setText("Adding Image...");
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = () => {
      const file = input.files[0];
      saveToServer(file);
    };
  };

  React.useEffect(() => {
    if (quill) {
      quill.getModule("toolbar").addHandler("image", selectLocalImage);
    }
  }, [quill]);

  // React.useEffect(() => {
  //   if (quill) {
  //     quill.on("text-change", (delta, oldDelta, source) => {
  //       console.log("Text change!");
  //       console.log(quill.getText().replace(/\n/g, " "));
  //       console.log(quill.getContents());
  //       console.log(quill.root.innerHTML);
  //       console.log(quillRef.current.firstChild.innerHTML);
  //     });
  //   }
  // }, [quill]);

  return (
    <>
      <br />
      <br />
      <hr />
      <br />
      <div ref={topRef} />
      <div className="project-request-upload-info-main-grid">
        <div className="alert alert--warning" role="alert">
          Now you can upload your Project
        </div>
      </div>
      <p style={{ color: "red" }}>{error}</p>
      <label htmlFor="project-file" id="project-file-label">
        Project File
        <span>
          <i className="las la-folder-open"></i>
        </span>{" "}
      </label>
      {projectFile.length > 0 ? (
        <span>
          <i style={{ color: "green" }} className="las la-check-circle"></i>
        </span>
      ) : null}

      <input
        type="file"
        style={{ display: "none" }}
        id="project-file"
        name="projectFile"
        onChange={handleProjectFile}
      ></input>
      <br />
      <label htmlFor="project-pic" id="project-pic-label">
        Project overview Image
        <span>
          <i className="las la-image"></i>
        </span>{" "}
      </label>
      {projectPic.length > 0 ? (
        <span>
          <i style={{ color: "green" }} className="las la-check-circle"></i>
        </span>
      ) : null}
      <input
        type="file"
        style={{ display: "none" }}
        id="project-pic"
        name="projectFile"
        onChange={handleProjectPic}
      ></input>
      <br />
      <input
        type="text"
        id="project-live-link-field"
        placeholder="Live Link"
        name="live-link"
        value={liveLink}
        onChange={(e) => setLiveLink(e.target.value)}
      />
      <br />
      <br />
      <div className="requested-project-info-build-code-editor">
        <div ref={quillRef} placeholder={placeholder} />
      </div>
      <br />
      <br />
      <br />
      <button id="submit-requested-project-btn" onClick={handleSubmit}>
        Upload
      </button>
    </>
  );
};

export default RequestedProjectInfo;
