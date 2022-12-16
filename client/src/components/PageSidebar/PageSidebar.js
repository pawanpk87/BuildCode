import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import React, { useEffect, useState, useRef } from "react";
import OutsideClick from "./outsideClick";
import { Link, useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import db from "../../firebase/firebase-config";
import { useUserAuth } from "../../context/UserAuthContextProvider";
import CategoryIcon from "@mui/icons-material/Category";
import InterpreterModeIcon from "@mui/icons-material/InterpreterMode";
import ArticleIcon from "@mui/icons-material/Article";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import InfoIcon from "@mui/icons-material/Info";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import MovingIcon from "@mui/icons-material/Moving";
import ChatIcon from "@mui/icons-material/Chat";
import { uuidv4 } from "@firebase/util";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import Typed from "react-typed";
import MailIcon from "@mui/icons-material/Mail";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SignUpModal from "../Modal/SignUpModal";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import CreatableSelect from "react-select/creatable";
import "./PageSidebar.css";

function PageSidebar() {
  const navigate = useNavigate();
  const [toggaleSidebar, setToggleSidebar] = useState(false);

  const [open, setOpen] = useState(false);

  const { user, userData, userUniqueId } = useUserAuth();

  const [buildCodeSkills, setBuildCodeSkills] = useState([]);
  const [noMoreSkills, setNoMoreSkills] = useState(false);
  const [lastStateOfBuildCodeSkills, setLastStateOfBuildCodeSkills] = useState(
    {}
  );

  const [buildCodeArticleTags, setBuildCodeArticleTags] = useState([]);
  const [noMoreArticleTags, setNoMoreArticleTags] = useState(false);
  const [lastStateOfBuildCodeArticleTags, setLastStateOfBuildCodeArticleTags] =
    useState({});

  const [buildCodeCompanyTags, setBuildCodeCompanyTags] = useState([]);
  const [noMoreCompanyTags, setNoMoreCompanyTags] = useState(false);
  const [lastStateOfBuildCodeCompanyTags, setLastStateOfBuildCodeCompanyTags] =
    useState({});

  const [trendingTags, setTrendingTags] = useState([]);

  const boxRef = useRef(null);
  const boxOutsideClick = OutsideClick(boxRef);

  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 992px)").matches
  );

  useEffect(() => {
    window
      .matchMedia("(min-width: 992px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);

  useEffect(() => {
    getSkillsArray();
    getArticalTagsArray();
    getCompanyTagsArray();
    fetchTrendingTagsFromDB();
  }, []);

  const getSkillsArray = () => {
    const getData = async () => {
      const q = query(
        collection(db, "build-code-skills"),
        orderBy("addedOn", "desc"),
        limit(20)
      );
      await getDocs(q)
        .then((documentSnapshots) => {
          let tempSkills = [];
          documentSnapshots.forEach((doc) => {
            tempSkills.push(doc.data().value);
          });
          setBuildCodeSkills(tempSkills);
          setLastStateOfBuildCodeSkills(
            documentSnapshots.docs[documentSnapshots.docs.length - 1]
          );
        })
        .catch((error) => {
          if (error.message === "Quota exceeded.") {
            navigate("/server/server-down");
          } else {
            navigate("/error/Something Went Wrong ⚠️");
          }
        });
    };
    getData();
  };

  const handleSkill = () => {
    getSkillsArray();
  };

  const fetchMoreSkills = () => {
    const getNextData = async () => {
      const next = query(
        collection(db, "build-code-skills"),
        orderBy("addedOn", "desc"),
        startAfter(lastStateOfBuildCodeSkills),
        limit(20)
      );
      await getDocs(next)
        .then((documentSnapshots) => {
          let tempSkills = [];
          documentSnapshots.forEach((doc) => {
            tempSkills.push(doc.data().value);
          });
          if (tempSkills.length !== 0) {
            setBuildCodeSkills([...buildCodeSkills, ...tempSkills]);
            setLastStateOfBuildCodeSkills(
              documentSnapshots.docs[documentSnapshots.docs.length - 1]
            );
          } else {
            setNoMoreSkills(true);
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
    getNextData();
  };

  const getArticalTagsArray = () => {
    const getData = async () => {
      const q = query(
        collection(db, "build-code-article-tags"),
        orderBy("addedOn", "desc"),
        limit(20)
      );
      await getDocs(q)
        .then((documentSnapshots) => {
          let tempArticalTags = [];
          documentSnapshots.forEach((doc) => {
            tempArticalTags.push(doc.data().value);
          });
          setBuildCodeArticleTags(tempArticalTags);
          setLastStateOfBuildCodeArticleTags(
            documentSnapshots.docs[documentSnapshots.docs.length - 1]
          );
        })
        .catch((error) => {
          if (error.message === "Quota exceeded.") {
            navigate("/server/server-down");
          } else {
            navigate("/error/Something Went Wrong ⚠️");
          }
        });
    };
    getData();
  };

  const handleArticleTags = () => {
    getArticalTagsArray();
  };

  const fetchMoreArticalTags = () => {
    const getNextData = async () => {
      const next = query(
        collection(db, "build-code-article-tags"),
        orderBy("addedOn", "desc"),
        startAfter(lastStateOfBuildCodeArticleTags),
        limit(20)
      );
      await getDocs(next)
        .then((documentSnapshots) => {
          let tempArticalTags = [];
          documentSnapshots.forEach((doc) => {
            tempArticalTags.push(doc.data().value);
          });
          if (tempArticalTags.length !== 0) {
            setBuildCodeArticleTags([
              ...buildCodeArticleTags,
              ...tempArticalTags,
            ]);
            setLastStateOfBuildCodeArticleTags(
              documentSnapshots.docs[documentSnapshots.docs.length - 1]
            );
          } else {
            setNoMoreArticleTags(true);
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
    getNextData();
  };

  const getCompanyTagsArray = () => {
    const getData = async () => {
      const q = query(
        collection(db, "build-code-company-tags"),
        orderBy("addedOn", "desc"),
        limit(20)
      );
      await getDocs(q)
        .then((documentSnapshots) => {
          let tempCompanyTags = [];
          documentSnapshots.forEach((doc) => {
            tempCompanyTags.push(doc.data().value);
          });
          setBuildCodeCompanyTags(tempCompanyTags);
          setLastStateOfBuildCodeCompanyTags(
            documentSnapshots.docs[documentSnapshots.docs.length - 1]
          );
        })
        .catch((error) => {
          if (error.message === "Quota exceeded.") {
            navigate("/server/server-down");
          } else {
            navigate("/error/Something Went Wrong ⚠️");
          }
        });
    };
    getData();
  };

  const handleCompanyTags = () => {
    getCompanyTagsArray();
  };

  const fetchMoreCompanyTags = () => {
    const getNextData = async () => {
      const next = query(
        collection(db, "build-code-company-tags"),
        orderBy("addedOn", "desc"),
        startAfter(lastStateOfBuildCodeCompanyTags),
        limit(20)
      );
      const documentSnapshots = await getDocs(next);
      let tempCompanyTags = [];
      documentSnapshots.forEach((doc) => {
        tempCompanyTags.push(doc.data().value);
      });
      if (tempCompanyTags.length !== 0) {
        setBuildCodeCompanyTags([...buildCodeCompanyTags, ...tempCompanyTags]);
        setLastStateOfBuildCodeCompanyTags(
          documentSnapshots.docs[documentSnapshots.docs.length - 1]
        );
      } else {
        setNoMoreCompanyTags(true);
      }
    };
    getNextData();
  };

  const fetchTrendingTagsFromDB = () => {
    const getProjectTags = async () => {
      const q = query(
        collection(db, "build-code-tags"),
        orderBy("addedOn", "desc"),
        limit(50)
      );
      await getDocs(q)
        .then((documentSnapshots) => {
          let tempProjectTags = [];
          documentSnapshots.forEach((doc) => {
            tempProjectTags.push(doc.data().value);
          });
          setTrendingTags(tempProjectTags);
        })
        .catch((error) => {
          if (error.message === "Quota exceeded.") {
            navigate("/server/server-down");
          } else {
            navigate("/error/Something Went Wrong ⚠️");
          }
        });
    };
    getProjectTags();
  };

  const closeDialog = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (boxOutsideClick === true) {
      setToggleSidebar(false);
    }
  }, [boxOutsideClick]);

  // for skills
  let skills = "";
  const [userSelectedSkills, setUserSelectedSkills] = useState([]);
  const [allSkillTags, setAllSkillTags] = useState([]);
  const [skillsName, setSkillName] = useState(skills);

  const handleSkills = (tagOptions) => {
    setUserSelectedSkills(tagOptions);
    tagOptions.forEach((option) => {
      setSkillName(option.value);
    });

    if (tagOptions.length > 1) {
      tagOptions.shift();
      setUserSelectedSkills(tagOptions);
      setToggleSidebar(!toggaleSidebar);
      navigate(`search/projects/${tagOptions[0].value}`);
    } else if (tagOptions.length === 1) {
      setToggleSidebar(!toggaleSidebar);
      navigate(`search/projects/${tagOptions[0].value}`);
    }

    if (tagOptions.length === 0) {
      setSkillName("");
      //navigate("/requested-projects");
    }
  };

  const addSelectedSearch = (queryString) => {
    const setMatchingTags = async () => {
      const q = query(
        collection(db, "build-code-skills"),
        where("keywords", "array-contains", queryString),
        limit(30)
      );
      const documentSnapshots = await getDocs(q);
      let tempMatchingTags = [];
      documentSnapshots.forEach((doc) => {
        tempMatchingTags.push({
          label: doc.data().label,
          value: doc.data().value,
        });
      });
      setAllSkillTags(tempMatchingTags);
    };
    setMatchingTags();
  };

  // for article
  let articleTags = "";
  const [userSelectedArticleTags, setUserSelectedArticleTags] = useState([]);
  const [allArticleTags, setAllArticleTags] = useState([]);
  const [companyArticleTagName, setArticleTagName] = useState(articleTags);

  const handleSearchArticleTags = (tagOptions) => {
    setUserSelectedArticleTags(tagOptions);
    tagOptions.forEach((option) => {
      setArticleTagName(option.value);
    });

    if (tagOptions.length > 1) {
      tagOptions.shift();
      setUserSelectedArticleTags(tagOptions);
      setToggleSidebar(!toggaleSidebar);
      navigate(`/search/tags/${tagOptions[0].value}`);
    } else if (tagOptions.length === 1) {
      setToggleSidebar(!toggaleSidebar);
      navigate(`/search/tags/${tagOptions[0].value}`);
    }

    if (tagOptions.length === 0) {
      setArticleTagName("");
      //navigate("/requested-projects");
    }
  };

  const addSelectedArticleTagsSearch = (queryString) => {
    const setMatchingTags = async () => {
      const q = query(
        collection(db, "build-code-article-tags"),
        where("keywords", "array-contains", queryString),
        limit(30)
      );
      const documentSnapshots = await getDocs(q);
      let tempMatchingTags = [];
      documentSnapshots.forEach((doc) => {
        tempMatchingTags.push({
          label: doc.data().label,
          value: doc.data().value,
        });
      });
      setAllArticleTags(tempMatchingTags);
    };
    setMatchingTags();
  };

  // for company
  let company = "";
  const [allCompanyTags, setAllCompanyTags] = useState([]);
  const [userSelectedCompanyName, setUserSelectedCompanyName] = useState([]);
  const [companyName, setCompanyName] = useState(company);

  const handleCompanyName = (tagOptions) => {
    setUserSelectedCompanyName(tagOptions);
    tagOptions.forEach((option) => {
      setCompanyName(option.value);
    });

    if (tagOptions.length > 1) {
      tagOptions.shift();
      setUserSelectedCompanyName(tagOptions);
      setToggleSidebar(!toggaleSidebar);
      navigate(`/interview-experiences/${tagOptions[0].value}`);
    } else if (tagOptions.length === 1) {
      setToggleSidebar(!toggaleSidebar);
      navigate(`/interview-experiences/${tagOptions[0].value}`);
    }

    if (tagOptions.length === 0) {
      setCompanyName("");
      setToggleSidebar(!toggaleSidebar);
      navigate("/interview-experiences/recent-interview-experience");
    }
  };

  const addSelectedCompanyName = (queryString) => {
    const setMatchingTags = async () => {
      const q = query(
        collection(db, "build-code-company-tags"),
        where("keywords", "array-contains", queryString),
        limit(30)
      );
      const documentSnapshots = await getDocs(q);
      let tempMatchingTags = [];
      documentSnapshots.forEach((doc) => {
        tempMatchingTags.push({
          label: doc.data().label,
          value: doc.data().value,
        });
      });
      setAllCompanyTags(tempMatchingTags);
    };
    setMatchingTags();
  };

  // for tags
  let tags = "";
  const [allTags, setAllTags] = useState([]);
  const [userSelectedTagName, setUserSelectedTagsName] = useState([]);
  const [tagName, setTagName] = useState(tags);

  const handleTagName = (tagOptions) => {
    setUserSelectedTagsName(tagOptions);
    tagOptions.forEach((option) => {
      setTagName(option.value);
    });

    if (tagOptions.length > 1) {
      tagOptions.shift();
      setUserSelectedTagsName(tagOptions);
      setToggleSidebar(!toggaleSidebar);
      navigate(`/search/tags/${tagOptions[0].value}`);
    } else if (tagOptions.length === 1) {
      setToggleSidebar(!toggaleSidebar);
      navigate(`/search/tags/${tagOptions[0].value}`);
    }

    if (tagOptions.length === 0) {
      setTagName("");
      //navigate("/interview-experiences/recent-interview-experience");
    }
  };

  const addSelectedTagName = (queryString) => {
    const setMatchingTags = async () => {
      const q = query(
        collection(db, "build-code-tags"),
        where("keywords", "array-contains", queryString),
        limit(30)
      );
      const documentSnapshots = await getDocs(q);
      let tempMatchingTags = [];
      documentSnapshots.forEach((doc) => {
        tempMatchingTags.push({
          label: doc.data().label,
          value: doc.data().value,
        });
      });
      setAllTags(tempMatchingTags);
    };
    setMatchingTags();
  };

  return matches ? (
    <>
      <div className="page-sidebar">
        <div className="page-sidebar-main">
          {user !== null && userData !== null ? (
            <div className="user-achievents-card-sidebar-page">
              <div className="user-details-page-sidebar">
                <div id="img">
                  <Link to={`/users/${userUniqueId}`}>
                    <img src={userData.profilePic} alt={userData.userName} />
                  </Link>
                </div>
                <div id="room">
                  {userData.currentRooms.length > 0 ? (
                    <Link to={`/rooms/${userData.currentRooms[0].id}`}>
                      <ChatIcon></ChatIcon>
                    </Link>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <div id="ach">
                <div id="first">
                  <MovingIcon></MovingIcon>
                  <span>Your Progress</span>
                </div>
                <div id="second">
                  <div id="project">
                    <span id="title">Projects</span>
                    <span id="no">{userData.completedProjects.length}</span>
                  </div>
                  <div id="articles">
                    <span id="title">Post</span>
                    <span id="no">{userData.articles.length}</span>
                  </div>
                </div>
              </div>
              <div id="saved-local-st">
                <div>
                  <BookmarkIcon
                    onClick={() => navigate("/me/articles/mylist")}
                  ></BookmarkIcon>
                </div>
                {JSON.parse(localStorage.getItem("BuildCodeArticleData")) !==
                  null &&
                JSON.parse(localStorage.getItem("BuildCodeArticleData"))
                  .mainContent !== null &&
                JSON.parse(localStorage.getItem("BuildCodeArticleData"))
                  .mainContent.length > 15 ? (
                  <div>
                    <NoteAltIcon
                      onClick={() => {
                        window.location.href = `/write`;
                      }}
                    ></NoteAltIcon>
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="page-sidebar-signup-btn">
              <button className="signup" onClick={() => setOpen(true)}>
                Sign In
              </button>
            </div>
          )}
          <Link to="/project-request">
            <div className="created-request-post-card-sidebar-page">
              <div id="first">
                <ArrowLeftIcon></ArrowLeftIcon>
              </div>
              <div id="second">
                <Typed
                  strings={["Project Request"]}
                  typeSpeed={250}
                  backSpeed={30}
                  loop
                />
              </div>
            </div>
          </Link>
          <Link to="/write" target="_blank" rel="noopener noreferrer">
            <div className="created-request-post-card-sidebar-page">
              <div id="first">
                <ArrowLeftIcon></ArrowLeftIcon>
              </div>
              <div id="second">
                <Typed
                  strings={["Write an Article"]}
                  typeSpeed={250}
                  backSpeed={30}
                  loop
                />
              </div>
            </div>
          </Link>
          <Link
            to="/write/interview-experience"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="created-request-post-card-sidebar-page">
              <div id="first">
                <ArrowLeftIcon></ArrowLeftIcon>
              </div>
              <div id="second">
                <Typed
                  strings={["Write Interview Experience"]}
                  typeSpeed={250}
                  backSpeed={30}
                  loop
                />
              </div>
            </div>
          </Link>
          <div className="cat-card-sidebar-page">
            <div id="first">
              <CategoryIcon></CategoryIcon>
              <span>Projects</span>
            </div>
            <div id="second">
              {buildCodeSkills.length === 0 ? (
                <ArrowDropDownIcon onClick={handleSkill}></ArrowDropDownIcon>
              ) : null}
            </div>
            <CreatableSelect
              onChange={(value) => handleSkills(value)}
              onInputChange={addSelectedSearch}
              value={userSelectedSkills}
              isMulti
              isClearable
              options={allSkillTags}
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder="Search skills"
            />
            <br />
            {buildCodeSkills.length > 0 ? (
              <div className="page-sidebar-project-skills">
                {buildCodeSkills.map((skill) => (
                  <Link key={uuidv4()} to={`/search/projects/${skill}`}>
                    <small>{skill}</small>
                  </Link>
                ))}
                <br />
                {noMoreSkills === false && buildCodeSkills.length <= 25 ? (
                  <ArrowDropDownIcon
                    onClick={fetchMoreSkills}
                  ></ArrowDropDownIcon>
                ) : null}
              </div>
            ) : null}
          </div>
          <div className="cat-card-sidebar-page">
            <div id="first">
              <ArticleIcon></ArticleIcon>
              <span>Articles</span>
            </div>
            <div id="second">
              {buildCodeArticleTags.length === 0 ? (
                <ArrowDropDownIcon
                  onClick={handleArticleTags}
                ></ArrowDropDownIcon>
              ) : null}
            </div>
            <CreatableSelect
              onChange={(value) => handleSearchArticleTags(value)}
              onInputChange={addSelectedArticleTagsSearch}
              value={userSelectedArticleTags}
              isMulti
              isClearable
              options={allArticleTags}
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder="Search article tags"
            />
            <br />
            {buildCodeArticleTags.length > 0 ? (
              <div className="page-sidebar-project-skills">
                {buildCodeArticleTags.map((tag) => (
                  <Link key={uuidv4()} to={`/search/tags/${tag}`}>
                    <small key={uuidv4()}>{tag}</small>
                  </Link>
                ))}
                <br />
                {noMoreArticleTags === false &&
                buildCodeArticleTags.length <= 25 ? (
                  <ArrowDropDownIcon
                    onClick={fetchMoreArticalTags}
                  ></ArrowDropDownIcon>
                ) : null}
              </div>
            ) : null}
          </div>
          <div className="cat-card-sidebar-page">
            <div id="first">
              <InterpreterModeIcon></InterpreterModeIcon>
              <span>Interview Experience</span>
            </div>
            <div id="second">
              {buildCodeCompanyTags.length === 0 ? (
                <ArrowDropDownIcon
                  onClick={handleCompanyTags}
                ></ArrowDropDownIcon>
              ) : null}
            </div>
            <CreatableSelect
              onChange={(value) => handleCompanyName(value)}
              onInputChange={addSelectedCompanyName}
              value={userSelectedCompanyName}
              isMulti
              isClearable
              options={allCompanyTags}
              className="basic-multi-select "
              classNamePrefix="select"
              placeholder="Search company name"
            />
            <br />
            {buildCodeCompanyTags.length > 0 ? (
              <div className="page-sidebar-project-skills">
                {buildCodeCompanyTags.map((company) => (
                  <Link key={uuidv4()} to={`/interview-experiences/${company}`}>
                    <small key={uuidv4()}>{company}</small>
                  </Link>
                ))}
                <br />
                {noMoreCompanyTags === false &&
                buildCodeCompanyTags.length <= 25 ? (
                  <ArrowDropDownIcon
                    onClick={fetchMoreCompanyTags}
                  ></ArrowDropDownIcon>
                ) : null}
              </div>
            ) : null}
          </div>
          <div className="cat-card-sidebar-page">
            <div id="first">
              <TrendingUpIcon></TrendingUpIcon>
              <span>Latest tags</span>
            </div>
            <div id="second">
              {trendingTags.length === 0 ? (
                <ArrowDropDownIcon
                  onClick={fetchTrendingTagsFromDB}
                ></ArrowDropDownIcon>
              ) : null}
            </div>
            <CreatableSelect
              onChange={(value) => handleTagName(value)}
              onInputChange={addSelectedTagName}
              value={userSelectedTagName}
              isMulti
              isClearable
              options={allTags}
              className="basic-multi-select "
              classNamePrefix="select"
              placeholder="Search tags"
            />
            <br />
            {trendingTags.length > 0 ? (
              <div className="page-sidebar-project-skills">
                {trendingTags.map((tag) => (
                  <Link key={uuidv4()} to={`/search/tags/${tag}`}>
                    <small key={uuidv4()}>{tag}</small>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          <br />
          <hr />
          <div className="social-media-links-build-code">
            <a
              href="https://www.linkedin.com/company/buildcode-org"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedInIcon></LinkedInIcon>
            </a>

            <a
              href="https://www.instagram.com/build_code_/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <InstagramIcon></InstagramIcon>
            </a>

            <a
              href="https://www.facebook.com/BuildCode-101451379350477"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FacebookIcon></FacebookIcon>
            </a>
            <a
              href="mailto:hello@buildcode.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MailIcon></MailIcon>
            </a>
          </div>
          <br />
          <div style={{ textAlign: "left" }}>
            <a
              href="mailto:feedback@buildcode.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              <EmailIcon></EmailIcon> <span>feedback@buildcode.org</span>
            </a>
            <br />
            <br />
            <Link to="/aboutUs">
              <InfoIcon></InfoIcon> About Us
            </Link>
            <br />
            <br />
            <Link to="/privacy-policy">Privacy Policy</Link>
            <br />
            <br />
            <Link to="/terms-and-conditions">Terms and Conditions</Link>
            <br />
            <br />
            <Link to="/disclaimer">Disclaimer</Link>
            <br />
            <br />
            <small>© 2022 BuildCode</small>
            <br />
            <br />
            <small style={{ fontSize: "0.8rem", color: "grey" }}>
              <QuestionMarkIcon></QuestionMarkIcon>
              HAVE QUESTIONS? Drop a mail at{" "}
              <strong>contact@buildcode.org</strong>
            </small>
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
      {toggaleSidebar === false ? (
        <span className="page-sidebar-expand-arrow">
          <ArrowBackIosNewIcon
            style={{
              color: "blue",
              width: "1.5rem",
              height: "1.5rem",
            }}
            onClick={() => setToggleSidebar(!toggaleSidebar)}
          ></ArrowBackIosNewIcon>
        </span>
      ) : (
        <>
          <div ref={boxRef} className="page-sidebar" id="dnz">
            <div className="page-sidebar-main">
              <span id="expand">
                <ArrowForwardIosIcon
                  style={{
                    color: "blue",
                    width: "1.5rem",
                    height: "1.5rem",
                  }}
                  onClick={() => setToggleSidebar(!toggaleSidebar)}
                ></ArrowForwardIosIcon>
              </span>
              <br />
              <br />

              {user !== null && userData !== null ? (
                <div className="user-achievents-card-sidebar-page">
                  <div className="user-details-page-sidebar">
                    <div
                      id="img"
                      onClick={() => setToggleSidebar(!toggaleSidebar)}
                    >
                      <Link to={`/users/${userUniqueId}`}>
                        <img
                          src={userData.profilePic}
                          alt={userData.userName}
                        />
                      </Link>
                    </div>
                    <div id="room">
                      {userData.currentRooms.length > 0 ? (
                        <Link to={`/rooms/${userData.currentRooms[0].id}`}>
                          <ChatIcon></ChatIcon>
                        </Link>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                  <div id="ach">
                    <div id="first">
                      <MovingIcon></MovingIcon>
                      <span>Your Progress</span>
                    </div>
                    <div id="second">
                      <div id="project">
                        <span id="title">Projects</span>
                        <span id="no">{userData.completedProjects.length}</span>
                      </div>
                      <div id="articles">
                        <span id="title">Post</span>
                        <span id="no">{userData.articles.length}</span>
                      </div>
                    </div>
                  </div>
                  <div id="saved-local-st">
                    <div>
                      <BookmarkIcon
                        onClick={() => {
                          navigate("/me/articles/mylist");
                          setToggleSidebar(!toggaleSidebar);
                        }}
                      ></BookmarkIcon>
                    </div>
                    {JSON.parse(
                      localStorage.getItem("BuildCodeArticleData")
                    ) !== null &&
                    JSON.parse(localStorage.getItem("BuildCodeArticleData"))
                      .mainContent !== null &&
                    JSON.parse(localStorage.getItem("BuildCodeArticleData"))
                      .mainContent.length > 15 ? (
                      <div>
                        <NoteAltIcon
                          onClick={() => {
                            window.location.href = `/write`;
                          }}
                        ></NoteAltIcon>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div className="page-sidebar-signup-btn">
                  <button className="signup" onClick={() => setOpen(true)}>
                    Sign In
                  </button>
                </div>
              )}
              <Link
                to="/project-request"
                onClick={() => setToggleSidebar(!toggaleSidebar)}
              >
                <div className="created-request-post-card-sidebar-page">
                  <div id="first">
                    <ArrowLeftIcon></ArrowLeftIcon>
                  </div>
                  <div id="second">
                    <Typed
                      strings={["Project Request"]}
                      typeSpeed={250}
                      backSpeed={30}
                      loop
                    />
                  </div>
                </div>
              </Link>
              <Link to="/write" target="_blank" rel="noopener noreferrer">
                <div className="created-request-post-card-sidebar-page">
                  <div id="first">
                    <ArrowLeftIcon></ArrowLeftIcon>
                  </div>
                  <div id="second">
                    <Typed
                      strings={["Write an Article"]}
                      typeSpeed={250}
                      backSpeed={30}
                      loop
                    />
                  </div>
                </div>
              </Link>
              <Link
                to="/write/interview-experience"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="created-request-post-card-sidebar-page">
                  <div id="first">
                    <ArrowLeftIcon></ArrowLeftIcon>
                  </div>
                  <div id="second">
                    <Typed
                      strings={["Write Interview Experience"]}
                      typeSpeed={250}
                      backSpeed={30}
                      loop
                    />
                  </div>
                </div>
              </Link>
              <div className="cat-card-sidebar-page">
                <div id="first">
                  <CategoryIcon></CategoryIcon>
                  <span>Projects</span>
                </div>
                <div id="second">
                  {buildCodeSkills.length === 0 ? (
                    <ArrowDropDownIcon
                      onClick={handleSkill}
                    ></ArrowDropDownIcon>
                  ) : null}
                </div>
                <CreatableSelect
                  onChange={(value) => handleSkills(value)}
                  onInputChange={addSelectedSearch}
                  value={userSelectedSkills}
                  isMulti
                  isClearable
                  options={allSkillTags}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Search skills"
                />
                <br />
                {buildCodeSkills.length > 0 ? (
                  <div className="page-sidebar-project-skills">
                    {buildCodeSkills.map((skill) => (
                      <Link
                        key={uuidv4()}
                        to={`/search/projects/${skill}`}
                        onClick={() => setToggleSidebar(!toggaleSidebar)}
                      >
                        <small>{skill}</small>
                      </Link>
                    ))}
                    <br />
                    {noMoreSkills === false && buildCodeSkills.length <= 25 ? (
                      <ArrowDropDownIcon
                        onClick={fetchMoreSkills}
                      ></ArrowDropDownIcon>
                    ) : null}
                  </div>
                ) : null}
              </div>
              <div className="cat-card-sidebar-page">
                <div id="first">
                  <ArticleIcon></ArticleIcon>
                  <span>Articles</span>
                </div>
                <div id="second">
                  {buildCodeArticleTags.length === 0 ? (
                    <ArrowDropDownIcon
                      onClick={handleArticleTags}
                    ></ArrowDropDownIcon>
                  ) : null}
                </div>
                <CreatableSelect
                  onChange={(value) => handleSearchArticleTags(value)}
                  onInputChange={addSelectedArticleTagsSearch}
                  value={userSelectedArticleTags}
                  isMulti
                  isClearable
                  options={allArticleTags}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Search article tags"
                />
                <br />
                {buildCodeArticleTags.length > 0 ? (
                  <div className="page-sidebar-project-skills">
                    {buildCodeArticleTags.map((tag) => (
                      <Link key={uuidv4()} to={`/search/tags/${tag}`}>
                        <small key={uuidv4()}>{tag}</small>
                      </Link>
                    ))}
                    <br />
                    {noMoreArticleTags === false &&
                    buildCodeArticleTags.length <= 25 ? (
                      <ArrowDropDownIcon
                        onClick={fetchMoreArticalTags}
                      ></ArrowDropDownIcon>
                    ) : null}
                  </div>
                ) : null}
              </div>
              <div className="cat-card-sidebar-page">
                <div id="first">
                  <InterpreterModeIcon></InterpreterModeIcon>
                  <span>Interview Experience</span>
                </div>
                <div id="second">
                  {buildCodeCompanyTags.length === 0 ? (
                    <ArrowDropDownIcon
                      onClick={handleCompanyTags}
                    ></ArrowDropDownIcon>
                  ) : null}
                </div>
                <CreatableSelect
                  onChange={(value) => handleCompanyName(value)}
                  onInputChange={addSelectedCompanyName}
                  value={userSelectedCompanyName}
                  isMulti
                  isClearable
                  options={allCompanyTags}
                  className="basic-multi-select "
                  classNamePrefix="select"
                  placeholder="Search company name"
                />
                <br />
                {buildCodeCompanyTags.length > 0 ? (
                  <div className="page-sidebar-project-skills">
                    {buildCodeCompanyTags.map((company) => (
                      <Link
                        key={uuidv4()}
                        to={`/interview-experiences/${company}`}
                      >
                        <small key={uuidv4()}>{company}</small>
                      </Link>
                    ))}
                    <br />
                    {noMoreCompanyTags === false &&
                    buildCodeCompanyTags.length <= 25 ? (
                      <ArrowDropDownIcon
                        onClick={fetchMoreCompanyTags}
                      ></ArrowDropDownIcon>
                    ) : null}
                  </div>
                ) : null}
              </div>
              <div className="cat-card-sidebar-page">
                <div id="first">
                  <TrendingUpIcon></TrendingUpIcon>
                  <span>Latest tags</span>
                </div>
                <div id="second">
                  {trendingTags.length === 0 ? (
                    <ArrowDropDownIcon
                      onClick={fetchTrendingTagsFromDB}
                    ></ArrowDropDownIcon>
                  ) : null}
                </div>
                <CreatableSelect
                  onChange={(value) => handleTagName(value)}
                  onInputChange={addSelectedTagName}
                  value={userSelectedTagName}
                  isMulti
                  isClearable
                  options={allTags}
                  className="basic-multi-select "
                  classNamePrefix="select"
                  placeholder="Search tags"
                />
                <br />
                {trendingTags.length > 0 ? (
                  <div className="page-sidebar-project-skills">
                    {trendingTags.map((tag) => (
                      <Link key={uuidv4()} to={`/search/tags/${tag}`}>
                        <small key={uuidv4()}>{tag}</small>
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
              <br />
              <hr />
              <div className="social-media-links-build-code">
                <a
                  href="https://www.linkedin.com/company/buildcode-org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkedInIcon></LinkedInIcon>
                </a>

                <a
                  href="https://www.instagram.com/build_code_/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <InstagramIcon></InstagramIcon>
                </a>

                <a
                  href="https://www.facebook.com/BuildCode-101451379350477"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FacebookIcon></FacebookIcon>
                </a>
                <a
                  href="mailto:hello@buildcode.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MailIcon></MailIcon>
                </a>
              </div>
              <br />
              <div style={{ textAlign: "left" }}>
                <a
                  href="mailto:feedback@buildcode.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <EmailIcon></EmailIcon> <span>feedback@buildcode.org</span>
                </a>
                <br />
                <br />
                <Link to="/aboutUs">
                  <InfoIcon></InfoIcon> About Us
                </Link>
                <br />
                <br />
                <Link to="/privacy-policy">Privacy Policy</Link>
                <br />
                <br />
                <Link to="/terms-and-conditions">Terms and Conditions</Link>
                <br />
                <br />
                <Link to="/disclaimer">Disclaimer</Link>
                <br />
                <br />
                <small>© 2022 BuildCode</small>
                <br />
                <br />
                <small style={{ fontSize: "0.8rem", color: "grey" }}>
                  <QuestionMarkIcon></QuestionMarkIcon>
                  HAVE QUESTIONS? Drop a mail at{" "}
                  <strong>contact@buildcode.org</strong>
                </small>
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
      )}
    </>
  );
}

export default PageSidebar;
