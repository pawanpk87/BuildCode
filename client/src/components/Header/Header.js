import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../../context/UserAuthContextProvider";
import { ReactComponent as CloseMenu } from "../../assets/x.svg";
import { ReactComponent as MenuIcon } from "../../assets/menu.svg";
import AddIcon from "@mui/icons-material/Add";
import CreateIcon from "@mui/icons-material/Create";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import SubjectIcon from "@mui/icons-material/Subject";
import ArticleIcon from "@mui/icons-material/Article";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import FilterListIcon from "@mui/icons-material/FilterList";
import BuildCodeLogo from "../../assets/Images/build-code-logo.svg";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import SignUpModal from "../Modal/SignUpModal";
import "./Header.css";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [queryString, setQueryString] = useState("");
  const { user, userData } = useUserAuth();
  const navigate = useNavigate();
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width:768px)");
    mediaQuery.addListener(handleMediaQueryChange);
    handleMediaQueryChange(mediaQuery);

    return () => {
      mediaQuery.removeListener(handleMediaQueryChange);
    };
  }, []);

  const handleMediaQueryChange = (mediaQuery) => {
    if (mediaQuery.matches) {
      setIsSmallScreen(true);
    } else {
      setIsSmallScreen(false);
    }
  };

  const [matches, setMatches] = useState(
    window.matchMedia("(min-width:768px)").matches
  );

  useEffect(() => {
    window
      .matchMedia("(min-width: 768px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);

  const handleChange = (e) => {
    setQueryString(e.target.value);
  };

  const handleSubmit = (queryString) => {
    if (queryString.length > 0) {
      setQueryString("");
      navigate(`/search/keywords/${queryString}`);
      handleClick();
    }
  };

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="header">
        {!matches ? (
          <div className="logo-nav">
            <div className="logo-container">
              <Link to="/">
                <img src={BuildCodeLogo} className="logo" alt="BuildCode" />
              </Link>
            </div>
            <ul className={click ? "nav-options active" : "nav-options"}>
              <li className="option">
                <div className="page-serach-grid">
                  <input
                    type="search"
                    placeholder="Search"
                    value={queryString}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSubmit(queryString);
                      }
                    }}
                  />
                  <button onClick={(e) => handleSubmit(queryString)}>
                    <i className="las la-search"></i>
                  </button>
                </div>
              </li>
              <li className="option" onClick={closeMobileMenu}>
                <Link to="/">HOME</Link>
              </li>
              <li className="option" onClick={closeMobileMenu}>
                <Link to="/requested-projects">Requested Projects</Link>
              </li>
              <li className="option" onClick={closeMobileMenu}>
                <Link to="/project-request">Project Request</Link>
              </li>
              <li className="option" onClick={closeMobileMenu}>
                <Link to="/write">Write an Article</Link>
              </li>
              <li className="option" onClick={closeMobileMenu}>
                <Link to="/write/interview-experience">
                  Write an Interview Experience
                </Link>
              </li>
              <li className="option" onClick={closeMobileMenu}>
                <Link to="/ongoing-projects">Ongoing Projects</Link>
              </li>
              <li className="option" onClick={closeMobileMenu}>
                <Link to="/completed-projects">Completed Projects</Link>
              </li>
              <li className="option" onClick={closeMobileMenu}>
                <Link to="/articles">ARTICLES</Link>
              </li>
              <li className="option" onClick={closeMobileMenu}>
                <Link to="/interview-experiences/recent-interview-experience">
                  Interview Experience
                </Link>
              </li>

              {/* {user === null || userData == null ? (
                <li
                  style={{ cursor: "pointer" }}
                  className="option"
                  onClick={() => setOpen(true)}
                >
                  Profile
                </li>
              ) : (
                <>
                  <li className="option" onClick={closeMobileMenu}>
                    <Link
                      to={`/users/${userData.urlName}`}
                      className="signup-btn"
                    >
                      <img
                        id="user-img"
                        alt={userData.userName}
                        src={userData.profilePic}
                      />
                      <br />
                      <span>{userData.userName}</span>
                    </Link>
                  </li>
                </>
              )} */}
            </ul>
          </div>
        ) : (
          <div className="logo-nav">
            <div className="logo-container">
              <Link to="/">
                <img src={BuildCodeLogo} className="logo" alt="BuildCode" />
              </Link>
            </div>
            <ul className={click ? "nav-options active" : "nav-options"}>
              <li className="option" onClick={closeMobileMenu}>
                <div className="dropdown">
                  <button className="dropbtn">
                    <AddIcon
                      style={{ color: "black", width: "2rem", height: "2rem" }}
                    ></AddIcon>
                  </button>
                  <div className="dropdown-content">
                    <Link to="/project-request">
                      <NoteAddIcon></NoteAddIcon> Project Request
                    </Link>
                    <Link to="/write" target="_blank">
                      <CreateIcon></CreateIcon> Write an Article
                    </Link>
                    <Link to="/write/interview-experience" target="_blank">
                      <CreateIcon></CreateIcon> Write an Interview Experience
                    </Link>
                  </div>
                </div>
              </li>
              <li className="option" onClick={closeMobileMenu}>
                <div className="dropdown">
                  <button className="dropbtn">
                    <span className="header-topics">
                      <Link to="/">HOME</Link>
                    </span>
                  </button>
                </div>
              </li>
              <li className="option" onClick={closeMobileMenu}>
                <div className="dropdown">
                  <button className="dropbtn">
                    <span className="header-topics">PROJECTS</span>
                  </button>
                  <div className="dropdown-content">
                    <Link to="/requested-projects">
                      <SubjectIcon></SubjectIcon> Requested Projects
                    </Link>

                    <Link to="/ongoing-projects">
                      <FilterListIcon></FilterListIcon> Ongoing Projects
                    </Link>

                    <Link to="/completed-projects">
                      <PlaylistAddCheckIcon></PlaylistAddCheckIcon> Completed
                      Projects
                    </Link>
                  </div>
                </div>
              </li>
              <li className="option" onClick={closeMobileMenu}>
                <div className="dropdown">
                  <button className="dropbtn">
                    <span className="header-topics">
                      <span className="header-topics">ARTICLES</span>
                    </span>
                  </button>
                  <div className="dropdown-content">
                    <Link to="/articles">
                      <ArticleIcon></ArticleIcon> ARTICLES
                    </Link>
                    <Link to="/interview-experiences/recent-interview-experience">
                      <NewspaperIcon></NewspaperIcon> Interview Experiences
                    </Link>
                  </div>
                </div>
              </li>
              <li className="option" onClick={closeMobileMenu}>
                <div className="page-serach-grid">
                  <input
                    type="search"
                    placeholder="Search"
                    value={queryString}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSubmit(queryString);
                      }
                    }}
                  />
                  <button onClick={(e) => handleSubmit(queryString)}>
                    <i className="las la-search"></i>
                  </button>
                </div>
              </li>
            </ul>
          </div>
        )}
        <div className="mobile-menu" onClick={handleClick}>
          {click ? (
            <CloseMenu className="menu-icon" />
          ) : (
            <MenuIcon className="menu-icon" />
          )}
        </div>
      </div>
      <SignUpModal
        open={open}
        closeDialog={closeDialog}
        closeOnOverlayClick={true}
        showCloseIcon={true}
      />
    </>
  );
}
