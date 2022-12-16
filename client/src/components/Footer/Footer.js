import React from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import MailIcon from "@mui/icons-material/Email";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <>
      <br />
      <br />
      <br />
      <br />
      <hr style={{ width: "90%", margin: "auto" }} />
      <div className="footer-basic">
        <footer>
          <div className="social">
            <a
              href="https://www.linkedin.com/company/buildcode-org"
              rel="noopener noreferrer"
              target="_blank"
            >
              <LinkedInIcon></LinkedInIcon>
            </a>

            <a
              href="https://www.instagram.com/build_code_/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <InstagramIcon></InstagramIcon>
            </a>

            <a
              href="https://www.facebook.com/BuildCode-101451379350477"
              rel="noopener noreferrer"
              target="_blank"
            >
              <FacebookIcon></FacebookIcon>
            </a>
            <a
              href="mailto:hello@buildcode.org"
              rel="noopener noreferrer"
              target="_blank"
            >
              <MailIcon></MailIcon>
            </a>
          </div>
          <hr
            style={{
              height: 2,
              borderWidth: 0,
              color: "gray",
              backgroundColor: "white",
            }}
          />
          <ul className="list-inline">
            <li className="list-inline-item">
              <Link to="/">Home</Link>
            </li>
            <li className="list-inline-item">
              <Link to="/aboutUs">About Us</Link>
            </li>
            <li className="list-inline-item">
              <Link to="/privacy-policy">Privacy Policy</Link>
            </li>
            <li className="list-inline-item">
              <Link to="/terms-and-conditions">Terms and Conditions</Link>
            </li>
            <li className="list-inline-item">
              <Link to="/disclaimer">Disclosure</Link>
            </li>
          </ul>
          <p className="copyright">
            <strong>© 2022 BuildCode</strong>
          </p>
        </footer>
      </div>
    </>
  );
}

export default Footer;
