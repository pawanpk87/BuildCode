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
import "./ProjectRequestDetails.css";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Footer from "../../../components/Footer/Footer";

function ProjectRequestDetails({ setPageSidebar }) {
  useEffect(() => {
    setPageSidebar(true);
  }, [setPageSidebar]);

  return (
    <>
      <Helmet>
        <title>What is Project Request?</title>
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
          content={`$What is Project Request? | 18 / 08 2022 | BuildCode`}
        />

        <meta
          data-rh="true"
          property="og:title"
          content="What is Project Request?"
        />

        <meta
          data-rh="true"
          property="twitter:title"
          content="What is Project Request?"
        />

        <meta data-rh="true" name="twitter:site" content="BuildCode" />

        <meta
          data-rh="true"
          property="og:description"
          content="Project Request is a type of post similar to any other social media
post where you describe the project requirement that you want to build."
        />

        <meta
          data-rh="true"
          property="twitter:description"
          content="Project Request is a type of post similar to any other social media
post where you describe the project requirement that you want to build."
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
          content="Project Request is a type of post similar to any other social media
post where you describe the project requirement that you want to build."
          data-rh="true"
        />
      </Helmet>
      <div className="project-request-details-blog">
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
        <h1>What is Project Request?</h1>
        <div className="desc-project-req">
          <h4>
            Project Request is a type of post similar to any other social media
            post where you describe the project requirement that you want to
            build.
          </h4>
          <br />
          <div>
            <h6>
              <strong>1. When it is needed?</strong>
            </h6>
            <p>
              Let's suppose, there is a person called A, and A has an idea and
              wants to build the project on 'x' technology and there is no one
              in his friend circle with whom he can build the project then he
              can make the Project Request if there is anyone is interested in
              his project he/she will request for join his project and then they
              can start working on his project.
            </p>
          </div>

          <div>
            <h6>
              <strong>2. How to make Project Request?</strong>
            </h6>
            <p>
              Please refer to this blog{" "}
              <small style={{ textDecoration: "underline" }}>
                <Link to="/how-to-make-project">How to make Project?</Link>
              </small>
            </p>
          </div>

          <div>
            <h6>
              <strong>3. Who can make Project Request?</strong>
            </h6>
            <p>
              Anyone can make a project Request who has a Project idea, they can
              post the request with the project description and the team size
              needed to build the project.
            </p>
          </div>

          <div>
            <h6>
              <strong>4. What kind of Project can be built?</strong>
            </h6>
            <p>Any kind of project whether technical or non-technical.</p>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default ProjectRequestDetails;
