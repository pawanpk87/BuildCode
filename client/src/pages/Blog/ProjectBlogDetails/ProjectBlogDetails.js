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
import Footer from "../../../components/Footer/Footer";
import "./ProjectBlogDetails.css";

function ProjectBlogDetails({ setPageSidebar }) {
  useEffect(() => {
    setPageSidebar(true);
  }, [setPageSidebar]);

  return (
    <>
      <Helmet>
        <title>What is Project Blog?</title>
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
          content={`$What is Project Blog? | 18 / 08 2022 | BuildCode`}
        />

        <meta
          data-rh="true"
          property="og:title"
          content="What is Project Blog?"
        />

        <meta
          data-rh="true"
          property="twitter:title"
          content="What is Project Blog?"
        />

        <meta data-rh="true" name="twitter:site" content="BuildCode" />

        <meta
          data-rh="true"
          property="og:description"
          content="It is a type of article or blog in which you write down all steps
            that you took to build your project."
        />

        <meta
          data-rh="true"
          property="twitter:description"
          content="It is a type of article or blog in which you write down all steps
            that you took to build your project."
        />

        <meta
          data-rh="true"
          property="og:url"
          content={`https://buildcode.org/what-is-project-blog`}
        />

        <meta
          data-rh="true"
          property="al:web:url"
          content={`https://buildcode.org/what-is-project-blog`}
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
          href={`https://buildcode.org/what-is-project-blog`}
        />

        <meta
          name="description"
          content="It is a type of article or blog in which you write down all steps
            that you took to build your project."
          data-rh="true"
        />
      </Helmet>
      <div className="project-blog-details-main">
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
        <h1>What is Project Blog?</h1>
        <div className="dec-project-blog">
          <p>
            It is a type of article or blog in which you write down all steps
            that you took to build your project. The aim behind the "Project
            blog", the technologies you have used and why you have preferred it
            over the other one, what kind of tools you have used to build it,
            databases, and how you connect it, and how did you deploy it, what
            kind of tools you used to test your product, how you developed the
            algorithm for your project, how will you going to maintain it. That
            will attract the people to your project and you will be going to get
            the best out of it, moreover, beginners will going to get know your
            way to build the project and they will going to learn things from
            you.
          </p>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default ProjectBlogDetails;
