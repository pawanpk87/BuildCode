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
import search from "../../assets/Images/search.png";
import Solution from "../../assets/Images/Solution.png";
import Goals from "../../assets/Images/Goals.png";
import aboutUs from "../../assets/Images/about-us.png";
import { Helmet } from "react-helmet";
import "./About.css";

function About({ setPageSidebar }) {
  useEffect(() => {
    setPageSidebar(true);
  }, [setPageSidebar]);

  return (
    <>
      <Helmet>
        <meta charset="UTF-8" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <title>About Us - BuildCode</title>

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
      <div className="about-page-main-grid">
        <br />
        <br />
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
        <div className="about-main-content">
          <h1>About Us</h1>
          <br />
          <div className="about-us-intro-grid">
            <div id="first">
              <p>
                BuildCode is a platform, where you can solve your problem of
                finding peers to code along with, and work on either of your
                ideology on an impacting life-changing project or get ready for
                the corporate project experience by practicing with your peer.
              </p>
            </div>
            <div id="second">
              <img src={aboutUs} alt="about-us" />
            </div>
          </div>
          <br />
          <br />
          <div className="info-card-about-page">
            <div id="first">
              <h3>Problem</h3>
              <img src={search} alt="Search" />
            </div>
            <div id="second">
              <p>
                Nowadays, it’s hard to find a peer to work on the projects
                related to your domain, the same problem I was facing when I was
                finding a partner to work on projects, on my campus.
              </p>
            </div>
          </div>
          <br />
          <br />
          <div className="info-card-about-page">
            <div id="first">
              <h3>Solution</h3>
              <img src={Solution} alt="solution" />
            </div>
            <div id="second">
              <p>
                The solution to the above problem can be a platform where we can
                make a post about our project and make a team and start working
                on it.
              </p>
            </div>
          </div>
          <br />
          <br />
          <div className="info-card-about-page">
            <div id="first">
              <h3>Goals</h3>
              <img src={Goals} alt="goals" />
            </div>
            <div id="second">
              <p>
                The aim behind developing BuildCode is to help the students to
                gain more practical knowledge cause a project teaches you a lot
                more than the normal solving coding problems, and in addition
                when you get a chance to connect with a person with the same
                mindset or more experience than yours, then you will get to
                learn a lot from them. We wanted to make students aware of the
                corporate agile environment and their work culture so that they
                can be able to give their best.
              </p>
            </div>
          </div>
          <br />
          <br />
          <br />
        </div>
      </div>
    </>
  );
}

export default About;
