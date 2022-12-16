import {
  FacebookShareButton,
  LinkedinShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import {
  FacebookIcon,
  LinkedinIcon,
  RedditIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import signup from "../../../assets/Images/signup.png";
import projectRequestIMG from "../../../assets/Images/project-request.png";
import acceptAndRejectRequest from "../../../assets/Images/accept-and-reject-request.png";
import makeTeam from "../../../assets/Images/make-team.png";
import teamCommunication from "../../../assets/Images/team-communication.png";
import IndividualDevelopment from "../../../assets/Images/Individual-development.png";
import writeTeamBlog from "../../../assets/Images/write-team-blog.png";
import requestForSubmit from "../../../assets/Images/request-for-submit.png";
import uploadProjectFile from "../../../assets/Images/upload-project-file.png";
import uploadProjectImg from "../../../assets/Images/upload-project-img.png";
import projectFeatures from "../../../assets/Images/project-features.png";
import share from "../../../assets/Images/share.png";
import { Link } from "react-router-dom";
import Footer from "../../../components/Footer/Footer";
import "./ProjectBuilding.css";

function ProjectBuilding({ setPageSidebar }) {
  useEffect(() => {
    setPageSidebar(true);
  }, [setPageSidebar]);

  return (
    <>
      <Helmet>
        <title>How to make Proje?</title>
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
          content="18/ 08/ 2022"
        />

        <meta
          data-rh="true"
          name="title"
          content={`$How to make Proje? | 18 / 08 2022 | BuildCode`}
        />

        <meta data-rh="true" property="og:title" content="How to make Proje?" />

        <meta
          data-rh="true"
          property="twitter:title"
          content="How to make Proje?"
        />

        <meta data-rh="true" name="twitter:site" content="BuildCode" />

        <meta
          data-rh="true"
          property="og:description"
          content="Getting Started With BuildCode"
        />

        <meta
          data-rh="true"
          property="twitter:description"
          content="Getting Started With BuildCode"
        />

        <meta
          data-rh="true"
          property="og:url"
          content={`https://buildcode.org/how-to-make-project`}
        />

        <meta
          data-rh="true"
          property="al:web:url"
          content={`https://buildcode.org/how-to-make-project`}
        />

        <meta
          data-rh="true"
          name="twitter:card"
          content="summary_large_image"
        />

        <meta
          data-rh="true"
          property="article:author"
          content={`https://firebasestorage.googleapis.com/v0/b/buildcode-db.appspot.com/o/BuildCode%2Fbuild-code-icon-png.png?alt=media&token=eb100399-82b0-499b-8837-395e5e77d8b1`}
        />

        <meta data-rh="true" name="twitter:creator" content="Admin" />

        <meta data-rh="true" name="author" content="Admin" />

        <meta
          data-rh="true"
          name="robots"
          content="index,follow,max-image-preview:large"
        />

        <link
          data-rh="true"
          rel="author"
          href={`https://firebasestorage.googleapis.com/v0/b/buildcode-db.appspot.com/o/BuildCode%2Fbuild-code-icon-png.png?alt=media&token=eb100399-82b0-499b-8837-395e5e77d8b1`}
        />

        <link
          data-rh="true"
          rel="canonical"
          href={`https://buildcode.org/how-to-make-project`}
        />

        <meta
          name="description"
          content="Getting Started With BuildCode"
          data-rh="true"
        />
      </Helmet>
      <div className="project-building-main-grid">
        <div>
          <FacebookShareButton
            url={"https://buildcode.org"}
            quote="Hi Everyone, 
            Found the best website for finding the peer for Project-building.             
            Visit https://buildcode.org"
            hashtag="#buildcode"
            className="socialMediaButton"
          >
            <FacebookIcon size={36} />
          </FacebookShareButton>{" "}
          <LinkedinShareButton
            url={"https://buildcode.org"}
            quote="Hi Everyone, 
            Found the best website for finding the peer for Project-building.             
            Visit https://buildcode.org"
            hashtag="#buildcode"
            className="socialMediaButton"
          >
            <LinkedinIcon size={36} />
          </LinkedinShareButton>{" "}
          <TwitterShareButton
            url={"https://buildcode.org"}
            quote="Hi Everyone, 
            Found the best website for finding the peer for Project-building.             
            Visit https://buildcode.org"
            hashtag="#buildcode"
            className="socialMediaButton"
          >
            <TwitterIcon size={36} />
          </TwitterShareButton>{" "}
          <WhatsappShareButton
            url={"https://buildcode.org"}
            quote="Hi Everyone, 
            Found the best website for finding the peer for Project-building.             
            Visit https://buildcode.org"
            hashtag="#buildcode"
            className="socialMediaButton"
          >
            <WhatsappIcon size={36} />
          </WhatsappShareButton>{" "}
          <TelegramShareButton
            url={"https://buildcode.org"}
            quote="Hi Everyone, 
            Found the best website for finding the peer for Project-building.             
            Visit https://buildcode.org"
            hashtag="#buildcode"
            className="socialMediaButton"
          >
            <TelegramIcon size={36} />
          </TelegramShareButton>{" "}
          <RedditShareButton
            url={"https://buildcode.org"}
            quote="Hi Everyone, 
            Found the best website for finding the peer for Project-building.             
            Visit https://buildcode.org"
            hashtag="#buildcode"
            className="socialMediaButton"
          >
            <RedditIcon size={36} />
          </RedditShareButton>
        </div>
        <br />
        <h2>
          <strong>How to make Project on BuildCode? [Project Request]</strong>
        </h2>
        <h4>Getting Started With BuildCode</h4>
        <ul className="project-building-steps">
          <li>
            <div className="steps-grid">
              <div className="img">
                <img src={signup} alt="signup on BuildCode" />
              </div>
              <div className="content">
                <h5>
                  <strong>1. Creating an Account</strong>
                </h5>
                <p>
                  Anyone can view BuildCode content (regardless of whether or
                  not they have a BuildCode account), to make{" "}
                  <strong>Project Requests</strong> and{" "}
                  <strong>Publish Articles</strong> on the platform, you need to
                  have an account and be logged in. Fortunately, you can create
                  an account in less than a minute by going to buildcode.org and
                  clicking the "sign in" button at the top right sidebar.
                </p>
              </div>
            </div>
          </li>
          <li>
            <div className="steps-grid">
              <div className="img">
                <img src={projectRequestIMG} alt="project-request" />
              </div>
              <div className="content">
                <h5>
                  <strong>2. Make a Project Request</strong>
                </h5>
                <small style={{ color: "grey", fontSize: "0.7rem" }}>
                  Please refer to this blog{" "}
                  <small style={{ textDecoration: "underline" }}>
                    <Link to="/what-is-project-request">
                      What is Project Request?
                    </Link>
                  </small>
                </small>
                <p>
                  After signup, for a project request go to the left side of the
                  header <strong>"Plus ( + )"</strong> icon and click the{" "}
                  <strong>"Project Request"</strong> option. Fill out all
                  essential fields of the form and click the post button.
                </p>
              </div>
            </div>
          </li>
          <li>
            <div className="steps-grid">
              <div className="img">
                <img src={acceptAndRejectRequest} alt="project-request" />
              </div>
              <div className="content">
                <h5>
                  <strong>3. Add/Remove from Project Request</strong>
                </h5>
                <p>
                  After making a Project Request if someone is interested in
                  your project you will get notified by mail. Then you can go to
                  the project details page and there you can either add or
                  remove that user from the project.
                </p>
              </div>
            </div>
          </li>
          <li>
            <div className="steps-grid">
              <div className="img">
                <img src={makeTeam} alt="project-request" />
              </div>
              <div className="content">
                <h5>
                  <strong>4. Beginning of Project</strong>
                </h5>
                <p>
                  When the team needs requirements will be fulfilled you are
                  ready to build your project with your team members. From here
                  you will get access to the <strong>Chat Room</strong> and{" "}
                  <strong>Poject Blog</strong>.
                  <br />
                  <ul className="chatroom-projectblog-steps">
                    <li>
                      <div className="steps-grid">
                        <div className="img">
                          <img src={teamCommunication} alt="project-request" />
                        </div>
                        <div className="content">
                          <h6>
                            <strong>Chat Room</strong>
                          </h6>
                          <p>
                            Here you can chat with your team members and discuss
                            your ideas and approaches to building projects, as
                            long as the project is in the development phase.
                            Once you upload your Project then the chat option
                            will be disabled and all chat room data will be
                            deleted from the server.
                          </p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="steps-grid">
                        <div className="img">
                          <img src={writeTeamBlog} alt="project-request" />
                        </div>
                        <div className="content">
                          <h6>
                            <strong>Project Blog</strong>
                          </h6>
                          <small style={{ color: "grey", fontSize: "0.7rem" }}>
                            Please refer to this blog{" "}
                            <small style={{ textDecoration: "underline" }}>
                              <Link to="/what-is-project-blog">
                                What is Project Blog?
                              </Link>
                            </small>
                          </small>
                          <p>
                            You have to write Project Blogs while developing
                            your Project, where you can write all
                            project-related data like technologies, APIs,
                            features, codes, and challenges that your team faced
                            and step-by-step processes.
                          </p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </p>
              </div>
            </div>
          </li>
          <li>
            <div className="steps-grid">
              <div className="img">
                <img src={IndividualDevelopment} alt="project-request" />
              </div>
              <div className="content">
                <h5>
                  <strong>5. Develop your Project</strong>
                </h5>
                <p>
                  Use your out-of-the-box creative ideas to develop something
                  life-changing, impactful Project.{" "}
                </p>
              </div>
            </div>
          </li>
          <li>
            <div className="steps-grid">
              <div className="img">
                <img
                  src={requestForSubmit}
                  alt="Request for submit the project"
                />
              </div>
              <div className="content">
                <h5>
                  <strong>6. Submission of the project</strong>
                </h5>
                <p>
                  In order to upload the project, you have to get approval
                  [Request for Submit The Project] from team members then only
                  the team leader will be able to upload the project.
                </p>
              </div>
            </div>
          </li>
          <li>
            <div className="steps-grid">
              <div className="img">
                <img src={uploadProjectFile} alt="Upload Project Files" />
              </div>
              <div className="content">
                <h5>
                  <strong>7. Upload Project Fiels</strong>
                </h5>
                <p>
                  Kindly upload all project files in compressed format (Not more
                  than 5MB).
                </p>
              </div>
            </div>
          </li>
          <li>
            <div className="steps-grid">
              <div className="img">
                <img src={uploadProjectImg} alt="Upload Project" />
              </div>
              <div className="content">
                <h5>
                  <strong>8. Uplad Project Cover Image</strong>
                </h5>
                <p>Upload project cover image(Not more than 1MB).</p>
              </div>
            </div>
          </li>
          <li>
            <div className="steps-grid">
              <div className="img">
                <img src={projectFeatures} alt="Write project features" />
              </div>
              <div className="content">
                <h5>
                  <strong>9. Write Project Features</strong>
                </h5>
                <p>Write down the features of your project and how it works.</p>
              </div>
            </div>
          </li>
          <li>
            <div className="steps-grid">
              <div className="img">
                <img src={share} alt="Share Project" />
              </div>
              <div className="content">
                <h5>
                  <strong>10. Share Your Project</strong>
                </h5>
                <p>
                  Now you can share your project with all your friends,
                  colleagues, and on social media.
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <Footer />
    </>
  );
}

export default ProjectBuilding;
