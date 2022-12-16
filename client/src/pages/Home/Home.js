import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../context/UserAuthContextProvider";
import HomeRequestedProjects from "./HomeRequestedProjects";
import HomeArticles from "./HomeArticles";
import Loading from "../../components/Loader/Loading/Loading";
import { Helmet } from "react-helmet";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import "./Home.css";

function Home({ setPageSidebar }) {
  useEffect(() => {
    setPageSidebar(true);
  }, [setPageSidebar]);

  const [loading, setLoading] = useState(false);
  const { user, verifyEmail } = useUserAuth();
  const [text, setText] = useState("Sending a verification link...");
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [isHide, setIsHide] = useState(true);

  const hadleResendVerificationLink = (e) => {
    setLoading(true);
    verifyEmail().then(() => {
      setTimeout(() => {
        setLoading(false);
        setIsVerificationSent(true);
      }, 1000);
    });
  };

  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 700px)").matches
  );

  useEffect(() => {
    window
      .matchMedia("(min-width: 700px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);

  return (
    <>
      <Helmet>
        <meta charset="UTF-8" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <title>BuildCode - Make Your Team and Write Your Code</title>

        <meta
          name="description"
          content="BuildCode is a free, online peer-finding platform for Project-building."
        />

        <link rel="canonical" href="https://buildcode.org/" />

        <link rel="next" href="https://buildcode.org/articles" />

        <meta property="og:locale" content="en_US" />

        <meta property="og:site_name" content="BuildCode" />

        <meta property="og:type" content="website" />

        <meta
          property="og:title"
          content="BuildCode - Make Your Team and Write Your Code"
        />

        <meta
          property="og:description"
          content="BuildCode is a free, online peer-finding platform for Project-building. It’s a community of coders who come together to build projects."
        />

        <meta property="og:url" content="https://buildcode.org/" />

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
          content="BuildCode - Make Your Team and Write Your Code"
        />

        <meta
          name="twitter:description"
          content="BuildCode is a free, online peer-finding platform for Project-building."
        />

        <meta
          name="twitter:image"
          content="https://firebasestorage.googleapis.com/v0/b/buildcode-db.appspot.com/o/BuildCode%2Fbuild-code-log-png.png?alt=media&token=89dee950-0ea9-4ce9-9c7c-3f6d036dd595"
        />
      </Helmet>
      <div className="home-main-grid">
        <div
          className={
            !matches === true && isHide === true
              ? "home-projects hide-sec"
              : "home-projects"
          }
        >
          <HomeRequestedProjects />
        </div>
        <div className="home-articles">
          {!matches === true ? (
            <div
              onClick={() => setIsHide(!isHide)}
              id="latest-requested-project-intro-btn"
            >
              <button>Show Latest Requested Projects</button>
              {isHide ? (
                <ArrowDropUpIcon></ArrowDropUpIcon>
              ) : (
                <ArrowDropDownIcon></ArrowDropDownIcon>
              )}
            </div>
          ) : (
            <></>
          )}
          {user !== null ? (
            isVerificationSent === false ? (
              <>
                {user.emailVerified === false ? (
                  <>
                    <div className="home-email-not-VERIFIED-error-main-grid">
                      <div className="alert alert--warning" role="alert">
                        YOU HAVE NOT VERIFIED YOUR ACCOUNT.
                        <br />
                        You cannot make a Project Request or Write Articles
                        until you verify your email.
                        <button
                          className="email-verification-link"
                          onClick={hadleResendVerificationLink}
                        >
                          Send Verification Link
                        </button>
                      </div>
                      <div></div>
                    </div>
                    <br />
                  </>
                ) : null}
              </>
            ) : (
              <>
                <div className="home-email-not-VERIFIED-error-main-grid">
                  <div className="alert alert--warning" role="alert">
                    Check your inbox We have sent a verification link to your
                    registered email address If you have not received the
                    verification link, please check your “Spam” or “Junk”
                    folder.
                  </div>
                </div>
                <br />
              </>
            )
          ) : null}
          <HomeArticles />
        </div>
      </div>
      <Loading loaded={!loading} text={text} />
    </>
  );
}

export default Home;
