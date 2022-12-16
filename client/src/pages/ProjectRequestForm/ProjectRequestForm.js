import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import React, { useState, useRef, useEffect } from "react";
import { uuidv4 } from "@firebase/util";
import { useUserAuth } from "../../context/UserAuthContextProvider";
import {
  generatedKeyWordsForWebSearch,
  generateKeyWords,
  generateKeyWordsForSkill,
  generateURLName,
  getBuildCodePic,
  reservedName,
} from "../../Util/Utils";
import swal from "sweetalert";
import db from "../../firebase/firebase-config";
import { useNavigate } from "react-router-dom";
import Typed from "react-typed";
import DatePicker from "react-datepicker";
import CreatableSelect from "react-select/creatable";
import "react-datepicker/dist/react-datepicker.css";
import Loading from "../../components/Loader/Loading/Loading";
import AddIcon from "@mui/icons-material/Add";
import projectRequestImg from "../../assets/Images/project-request.png";
import teamCollaboration from "../../assets/Images/team-collaboration.png";
import teamCommunication from "../../assets/Images/team-communication.png";
import blogImg from "../../assets/Images/blog.png";
import exportImg from "../../assets/Images/export-files.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import FullPageLoader from "../../components/Loader/FullPageLoader/FullPageLoader";
import FeaturedPlayListIcon from "@mui/icons-material/FeaturedPlayList";
import RecommendedProjectRequestCard from "../../components/Rrecommended/RecommendedProjectRequestCard";
import SignUpModal from "../../components/Modal/SignUpModal";
import { Helmet } from "react-helmet";
import "./ProjectRequestForm.css";

var ProjectRequestForm = ({ setPageSidebar }) => {
  const navigate = useNavigate();

  useEffect(() => {
    setPageSidebar(true);
  }, [setPageSidebar]);

  const [open, setOpen] = useState(true);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, userUniqueId, userData } = useUserAuth();

  const [userSelectedSkills, setUserSelectedSkills] = useState([]);
  const [userSelectedTags, setUserSelectedTags] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [text, setText] = useState("Posting Your Project...");
  const [requestedProjectsArray, setRequestedProjectsArray] = useState([]);
  const formTopRef = useRef(null);
  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 992px)").matches
  );

  useEffect(() => {
    window
      .matchMedia("(min-width: 992px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);

  useEffect(() => {
    const getRequestedProjects = async () => {
      const projectRef = query(
        collection(db, "projects"),
        orderBy("requestedOn", "desc"),
        orderBy("totalViews", "desc"),
        orderBy("totalComments", "desc"),
        where("status", "==", "pending"),
        limit(30)
      );
      await getDocs(projectRef)
        .then((documentSnapshots) => {
          let tempProjects = [];
          documentSnapshots.forEach((doc) => {
            tempProjects.push({ id: doc.id, data: doc.data() });
          });
          setRequestedProjectsArray(tempProjects);
        })
        .catch((error) => {
          if (error.message === "Quota exceeded.") {
            navigate("/server/server-down");
          } else {
            navigate("/error/Something Went Wrong ⚠️");
          }
        });
    };
    getRequestedProjects();
  }, [navigate]);

  useEffect(() => {
    if (requestedProjectsArray !== null) {
      if (userData !== null && user.emailVerified === false) {
        navigate("/verify-email");
      }
      if (userData !== undefined && userData !== null) {
        if (userData.isDeleted === true) {
          navigate(
            "/error/This account has been deleted if you are an account holder then mail us contact@buildcode to deactivate."
          );
        } else if (userData.redUser === true) {
          navigate(
            "/error/This account has been suspended due to a violation of the BuildCode account user agreement if you are an account holder then mail us contact@buildcode to deactivate."
          );
        }
      }
      setDone(true);
    }
  }, [requestedProjectsArray, userData, navigate]);

  const scrollToTop = () => {
    formTopRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const [input, setInput] = useState({
    icon: "",
    technology: "",
    projectName: "",
    teamSize: "",
    skills: [],
    projectAIM: "",
    targetFinishDate: new Date(),
    note: "",
    teamMembers: [],
    requestedBy: [],
    requestedOn: serverTimestamp(),
    startedOn: "",
    status: "pending",
    agreeToSubmitProject: [],
    projectFeaturesDescription: "",
    projectFeatures: "",
    liveLink: "",
    projectFile: "",
    projectPic: "",
    requestedForJoinTheProject: {},
    completedOn: "",
    totalLikes: 0,
    allLikes: [],
    roomID: "",
    keywords: [],
    blog: "No",
    allComments: [],
    totalComments: 0,
    allViews: [],
    totalViews: 0,
    tags: [],
    projectKeywords: "",
    isDeleted: false,
    violatedProject: false,
    copiedProject: false,
    level: 1,
    mostPopular: false,
  });

  const handleChange = (e) => {
    setError("");
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleSkills = (skillOptions) => {
    setUserSelectedSkills(skillOptions);
    let skillsValue = [];
    skillOptions.forEach((option) => {
      skillsValue.push(option.value);
    });
    if (skillOptions.length > 30) {
      skillOptions.pop();
      setUserSelectedSkills(skillOptions);
      skillsValue.pop();
    }
    setInput({ ...input, skills: skillsValue });
  };

  const handleTags = (tagOptions) => {
    setUserSelectedTags(tagOptions);
    let tagsValue = [];
    tagOptions.forEach((option) => {
      tagsValue.push(option.value);
    });
    if (tagOptions.length > 5) {
      tagOptions.pop();
      setUserSelectedTags(tagOptions);
      tagsValue.pop();
    }
    setInput({ ...input, tags: tagsValue });
  };

  const handleDate = (date) => {
    setInput({ ...input, targetFinishDate: date });
  };

  const addNewSkillsAndTagsInDB = async (urlName) => {
    let tempSelectedSkills = userSelectedSkills;

    const batch = writeBatch(db);

    for (let index = 0; index < tempSelectedSkills.length; index++) {
      let tempSkill = tempSelectedSkills[index];
      if (tempSkill.value.length > 0) {
        const q = query(
          collection(db, "build-code-skills"),
          where("value", "==", tempSkill.value)
        );
        await getDocs(q)
          .then((querySnapshot) => {
            let flag = false;
            querySnapshot.forEach((doc) => {
              flag = true;
            });
            if (flag === false) {
              let keywords = generateKeyWordsForSkill(tempSkill.value);
              let skillObj = {
                label: tempSkill.value,
                value: tempSkill.value,
                keywords: keywords,
                addedOn: serverTimestamp(),
              };
              const buildCodeSkillsRef = doc(
                collection(db, "build-code-skills")
              );
              batch.set(buildCodeSkillsRef, skillObj);
            }
          })
          .catch((error) => {
            if (error.message === "Quota exceeded.") {
              navigate("/server/server-down");
            } else {
              navigate("/error/Something Went Wrong ⚠️");
            }
          });
      }
    }

    let tempSelectedTags = userSelectedTags;
    for (let index = 0; index < tempSelectedTags.length; index++) {
      let tempTag = tempSelectedTags[index];
      if (tempTag.value.length > 0) {
        const q = query(
          collection(db, "build-code-project-tags"),
          where("value", "==", tempTag.value)
        );
        await getDocs(q)
          .then((querySnapshot) => {
            let flag = false;
            querySnapshot.forEach((doc) => {
              flag = true;
            });
            if (flag === false) {
              let keywords = generateKeyWordsForSkill(tempTag.value);
              let tagObj = {
                label: tempTag.value,
                value: tempTag.value,
                keywords: keywords,
                addedOn: serverTimestamp(),
              };
              const buildCodeSkillsRef = doc(
                collection(db, "build-code-project-tags")
              );
              batch.set(buildCodeSkillsRef, tagObj);
            }
          })
          .catch((error) => {
            if (error.message === "Quota exceeded.") {
              navigate("/server/server-down");
            } else {
              navigate("/error/Something Went Wrong ⚠️");
            }
          });
      }
    }

    let tempSelectedBuildCodeTags = userSelectedTags;
    for (let index = 0; index < tempSelectedBuildCodeTags.length; index++) {
      let tempTag = tempSelectedBuildCodeTags[index];
      if (tempTag.value.length > 0) {
        const q = query(
          collection(db, "build-code-tags"),
          where("value", "==", tempTag.value)
        );
        await getDocs(q)
          .then((querySnapshot) => {
            let flag = false;
            querySnapshot.forEach((doc) => {
              flag = true;
            });
            if (flag === false) {
              let keywords = generateKeyWordsForSkill(tempTag.value);
              let tagObj = {
                label: tempTag.value,
                value: tempTag.value,
                keywords: keywords,
                addedOn: serverTimestamp(),
              };
              const buildCodeSkillsRef = doc(collection(db, "build-code-tags"));
              batch.set(buildCodeSkillsRef, tagObj);
            }
          })
          .catch((error) => {
            if (error.message === "Quota exceeded.") {
              navigate("/server/server-down");
            } else {
              navigate("/error/Something Went Wrong ⚠️");
            }
          });
      }
    }

    await batch
      .commit()
      .then(() => {
        setLoading(false);
        swal("Project requested successfully", "", "success").then(() => {
          navigate("/projects/" + urlName);
        });
      })
      .catch((error) => {
        swal("Project requested successfully", "", "success").then(() => {
          navigate("/projects/" + urlName);
        });
      });
  };

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    if (
      input.technology === "" ||
      input.projectName === "" ||
      input.teamSize === "" ||
      input.skills.length === 0 ||
      input.projectAIM === ""
    ) {
      setError("Please fill all fields");
      setTimeout(() => {
        setLoading(false);
        scrollToTop();
      }, 400);
    } else if (
      input.targetFinishDate.toDateString() === new Date().toDateString()
    ) {
      setError("Can not select today's date");
      setTimeout(() => {
        setLoading(false);
        scrollToTop();
      }, 400);
    } else if (input.projectAIM.split(" ").length < 20) {
      setError("Write at least 20 words about Project AIM");
      setTimeout(() => {
        setLoading(false);
        scrollToTop();
      }, 400);
    } else if (input.note.split(" ").length > 300) {
      setError("You cannot put more than 300 words in Note");
      setTimeout(() => {
        setLoading(false);
        scrollToTop();
      }, 400);
    } else if (isNaN(Number(input.teamSize))) {
      setError("Team size should be Number");
      setTimeout(() => {
        setLoading(false);
        scrollToTop();
      }, 400);
    } else if (Number(input.teamSize) < 2 || Number(input.teamSize) > 30) {
      setError("Team size should be in the range of 2 - 30");
      setTimeout(() => {
        setLoading(false);
        scrollToTop();
      }, 400);
    } else if (input.tags.length === 0) {
      setError("Add atleast 1 tag");
      setTimeout(() => {
        setLoading(false);
        scrollToTop();
      }, 400);
    } else {
      /**
       * add this project request into Databse
       */
      const projectRequest = async () => {
        let urlName = generateURLName(input.projectName);
        let tempProjectKeywords = generatedKeyWordsForWebSearch(
          input.projectName + " " + input.technology
        );
        let generatedKeyWords = generateKeyWords(
          input.projectName,
          input.technology,
          input.tags
        );
        // check if this project name is already present
        const q = query(
          collection(db, "projects"),
          where("urlName", "==", urlName)
        );
        const querySnapshot = await getDocs(q);
        let flag = false;
        querySnapshot.forEach((doc) => {
          flag = true;
        });

        if (reservedName.indexOf(urlName) !== -1) flag = true;

        // if yes then make unique by adding random string
        if (flag) urlName += "-" + uuidv4();

        try {
          /**
           * also add some data
           */
          let newObj = {
            ...input,
            roomPic: getBuildCodePic(input.projectName[0].toLowerCase()),
            requestedBy: [
              {
                id: userUniqueId,
                email: userData.email,
                name: userData.userName,
                img: userData.profilePic,
              },
            ],
            teamMembers: [
              {
                id: userUniqueId,
                email: userData.email,
                name: userData.userName,
                img: userData.profilePic,
              },
            ],
            requestedOn: serverTimestamp(),
            keywords: generatedKeyWords,
            urlName: urlName,
            projectKeywords: tempProjectKeywords,
          };

          // make batch for multiple updation
          const batch = writeBatch(db);

          const requestedProjectsRef = doc(db, "projects", urlName);
          batch.set(requestedProjectsRef, newObj);

          /**
           * if this project is successfully added into Databse
           * then next  update the current user details
           * add this requested project as user new current project
           */

          let newCurrentProjects = userData.currentProjects;

          if (newCurrentProjects === null || newCurrentProjects === undefined)
            newCurrentProjects = [urlName];
          else newCurrentProjects.push(urlName);

          const usersRef = doc(db, "users", userUniqueId);

          batch.update(usersRef, {
            currentProjects: newCurrentProjects,
          });

          await batch
            .commit()
            .then(() => {
              //next add those skills which are not present in Databse
              addNewSkillsAndTagsInDB(urlName);
            })
            .catch((error) => {
              if (error.message === "Quota exceeded.") {
                navigate("/server/server-down");
              } else {
                navigate("/error/Something Went Wrong ⚠️");
              }
            });
        } catch (error) {
          if (error.message === "Quota exceeded.") {
            navigate("/server/server-down");
          } else {
            navigate("/error/Something Went Wrong ⚠️");
          }
        }
      };
      projectRequest();
    }
  };

  const addSelectedSkills = (queryString) => {
    const setMatchingSkills = async () => {
      const q = query(
        collection(db, "build-code-skills"),
        where("keywords", "array-contains", queryString),
        limit(20)
      );
      await getDocs(q)
        .then((documentSnapshots) => {
          let tempMatchingSkills = [];
          documentSnapshots.forEach((doc) => {
            tempMatchingSkills.push({
              label: doc.data().label,
              value: doc.data().value,
            });
          });
          setAllSkills(tempMatchingSkills);
        })
        .catch((error) => {
          if (error.message === "Quota exceeded.") {
            navigate("/server/server-down");
          } else {
            navigate("/error/Something Went Wrong ⚠️");
          }
        });
    };
    setMatchingSkills();
  };

  const addSelectedTags = (queryString) => {
    const setMatchingTags = async () => {
      const q = query(
        collection(db, "build-code-project-tags"),
        where("keywords", "array-contains", queryString),
        limit(30)
      );
      await getDocs(q)
        .then((documentSnapshots) => {
          let tempMatchingTags = [];
          documentSnapshots.forEach((doc) => {
            tempMatchingTags.push({
              label: doc.data().label,
              value: doc.data().value,
            });
          });
          setAllTags(tempMatchingTags);
        })
        .catch((error) => {
          if (error.message === "Quota exceeded.") {
            navigate("/server/server-down");
          } else {
            navigate("/error/Something Went Wrong ⚠️");
          }
        });
    };
    setMatchingTags();
  };

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <>
      <Helmet>
        <meta charset="UTF-8" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <title>Project Request</title>

        <meta
          name="description"
          content="Make Your Team and Write Your <Code/>"
        />

        <link rel="canonical" href="https://buildcode.org/project-request" />

        <link rel="next" href="https://buildcode.org/requested-projects" />

        <meta property="og:locale" content="en_US" />

        <meta property="og:site_name" content="Write Article - BuildCode" />

        <meta property="og:type" content="website" />

        <meta
          property="og:title"
          content="Make Your Team and Write Your<Code/"
        />

        <meta
          property="og:description"
          content="Make Your Team and Write Your<Code/"
        />

        <meta property="og:url" content="https://buildcode.org/write" />

        <meta
          property="og:image"
          content="https://firebasestorage.googleapis.com/v0/b/buildcode-db.appspot.com/o/BuildCode%2Fbuild-code-log-png.png?alt=media&token=89dee950-0ea9-4ce9-9c7c-3f6d036dd595"
        />

        <meta
          property="og:image:secure_url"
          content="https://firebasestorage.googleapis.com/v0/b/buildcode-db.appspot.com/o/BuildCode%2Fbuild-code-log-png.png?alt=media&token=89dee950-0ea9-4ce9-9c7c-3f6d036dd595"
        />

        <meta
          property="og:image:secure_url"
          content="https://firebasestorage.googleapis.com/v0/b/buildcode-db.appspot.com/o/BuildCode%2Fbuild-code-icon-png.png?alt=media&token=52f892c6-bbde-43bc-8a14-9c513dcefb66"
        />

        <meta name="twitter:card" content="summary" />

        <meta
          name="twitter:title"
          content="Make Your Team and Write Your<Code/>"
        />

        <meta
          name="twitter:description"
          content="Make Your Team and Write Your<Code/>"
        />

        <meta
          name="twitter:image"
          content="https://firebasestorage.googleapis.com/v0/b/buildcode-db.appspot.com/o/BuildCode%2Fbuild-code-log-png.png?alt=media&token=89dee950-0ea9-4ce9-9c7c-3f6d036dd595"
        />
      </Helmet>
      {done === false ? (
        <>
          <FullPageLoader color={"blue"} height={"50px"} width={"50px"} />
        </>
      ) : (
        <>
          {user === null ? (
            <SignUpModal
              open={open}
              closeDialog={closeDialog}
              closeOnOverlayClick={false}
              showCloseIcon={false}
            />
          ) : null}
          <Loading loaded={!loading} text={text} />
          <div className="post-project-main">
            <div className="post-project-intro">
              <div className="project-intro-content">
                <p className="first-title" onClick={scrollToTop}>
                  <AddIcon></AddIcon> Project Request
                </p>
                <span className="second-title">
                  <Typed
                    strings={["Build Your &lt;Team/&gt; Now"]}
                    typeSpeed={120}
                    backSpeed={30}
                    loop
                  />
                </span>
                <div></div>
              </div>
              <div className="project-intro-img">
                <img src={projectRequestImg} alt="Project Request" />
              </div>
            </div>
            <div className="post-project-instruction-main-grid">
              <ul>
                <li>
                  <div className="instruction-grid">
                    <div className="instruction-img">
                      <img src={teamCollaboration} alt="Create Team" />
                    </div>
                    <div className="instruction-text">
                      <span>Create Team</span>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="instruction-grid">
                    <div className="instruction-img">
                      <img src={teamCommunication} alt="Get Chat Room" />
                    </div>
                    <div className="instruction-text">
                      <span>Get Chat Room</span>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="instruction-grid">
                    <div className="instruction-img">
                      <img src={blogImg} alt="Write Project Blog" />
                    </div>
                    <div className="instruction-text">
                      <span>Write Project Blog</span>
                    </div>
                  </div>
                </li>

                <li>
                  <div className="instruction-grid">
                    <div className="instruction-img">
                      <img src={exportImg} alt="Upload and Share" />
                    </div>
                    <div className="instruction-text">
                      <span>Upload &#38; Share </span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div ref={formTopRef} />
            <br />
            <br />
            <div className="project-post-form">
              <form onSubmit={handleSubmit}>
                <div className="form-icon">
                  Post your Project
                  <br />
                  <span id="error">{error}</span>
                </div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div className="form-group form-topic-text">
                  <span style={{ color: "red" }}>&#9733;</span> Technology
                  <input
                    type="text"
                    className="form-control shadow-none project-post-form-item"
                    name="technology"
                    value={input.technology}
                    onChange={handleChange}
                  />
                </div>
                <div className="fields-desc"></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div className="porject-request-all-skills form-group form-topic-text">
                  <span style={{ color: "red" }}>&#9733;</span> Skills
                  <CreatableSelect
                    onChange={(value) => handleSkills(value)}
                    onInputChange={addSelectedSkills}
                    value={userSelectedSkills}
                    isMulti
                    isClearable
                    options={allSkills}
                    className="basic-multi-select "
                    classNamePrefix="select"
                    placeholder="Add up to 30 skills"
                  />
                </div>
                <div className="fields-desc"></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div className="form-group form-topic-text">
                  <span style={{ color: "red" }}>&#9733;</span> Project Name
                  <input
                    type="text"
                    className="form-control project-post-form-item shadow-none"
                    name="projectName"
                    value={input.projectName}
                    onChange={handleChange}
                  />
                </div>
                <div className="fields-desc"></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div className="form-group form-topic-text">
                  <span style={{ color: "red" }}>&#9733;</span> Team Size
                  <input
                    type="text"
                    className="form-control project-post-form-item shadow-none"
                    name="teamSize"
                    value={input.teamSize}
                    onChange={handleChange}
                  />
                </div>
                <div className="fields-desc"></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div id="target-date" className="form-group form-topic-text">
                  <span style={{ color: "red" }}>&#9733;</span> Expected
                  Completion Date{" "}
                  <DatePicker
                    selected={input.targetFinishDate}
                    onChange={handleDate}
                    minDate={new Date()}
                  />
                </div>
                <div className="fields-desc"></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div className="form-group form-topic-text">
                  <span style={{ color: "red" }}>&#9733;</span> Project AIM
                  <textarea
                    type="text"
                    className="form-control project-post-form-item shadow-none"
                    name="projectAIM"
                    rows={6}
                    value={input.projectAIM}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div className="fields-desc"></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div className="form-group form-topic-text">
                  <span style={{ color: "red" }}></span> Note
                  <textarea
                    type="text"
                    className="form-control project-post-form-item shadow-none"
                    name="note"
                    rows={6}
                    value={input.note}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div className="fields-desc "></div>
                <div></div>
                <div></div>
                <div className="porject-request-all-skills form-group form-topic-text">
                  Tags
                  <CreatableSelect
                    onChange={(value) => handleTags(value)}
                    onInputChange={addSelectedTags}
                    value={userSelectedTags}
                    isMulti
                    isClearable
                    options={allTags}
                    className="basic-multi-select "
                    classNamePrefix="select"
                    placeholder="Add up to 5 tags"
                  />
                </div>
                <div className="fields-desc"></div>
                <div></div>
                <div></div>
                <div className="form-group form-topic-text">
                  <button type="submit" className="build-code-btn">
                    Post
                  </button>
                </div>
              </form>
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            {requestedProjectsArray.length > 0 ? (
              <>
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
                      showpagination="false"
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
                <br />
                <br />
                <br />
              </>
            ) : null}
          </div>
        </>
      )}
    </>
  );
};

export default ProjectRequestForm;
