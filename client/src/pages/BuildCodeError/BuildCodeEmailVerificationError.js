import React, { useEffect, useState } from "react";
import Loading from "../../components/Loader/Loading/Loading";
import PageSidebar from "../../components/PageSidebar/PageSidebar";
import { useUserAuth } from "../../context/UserAuthContextProvider";

function BuildCodeEmailVerificationError({ setPageSidebar }) {
  useEffect(() => {
    setPageSidebar(false);
  }, [setPageSidebar]);

  const { user, verifyEmail } = useUserAuth();
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("Sending a verification link");

  const hadleResendVerificationLink = (e) => {
    setLoading(true);
    verifyEmail().then(() => {
      setTimeout(() => {
        setLoading(false);
        setIsVerificationSent(true);
      }, 1000);
    });
  };

  return (
    <>
      <Loading loaded={!loading} text={text} />
      {isVerificationSent === false ? (
        <>
          {user.emailVerified === false ? (
            <>
              <div className="home-email-not-VERIFIED-error-main-grid">
                <div className="alert alert--warning" role="alert">
                  YOU HAVE NOT VERIFIED YOUR ACCOUNT.
                  <br />
                  You cannot access BuildCode content until you verify your
                  email.
                  <button
                    className="email-verification-link"
                    onClick={hadleResendVerificationLink}
                  >
                    Resend Verification Link
                  </button>
                </div>
                <div></div>
              </div>
              <br />
            </>
          ) : (
            <div className="home-email-not-VERIFIED-error-main-grid">
              <div className="alert alert--warning" role="alert">
                Verification Link has been sent to your email address. Please
                click the link and then proceed to login.
                <br />
                <br />
                <small>
                  <button
                    className="email-verification-link"
                    onClick={hadleResendVerificationLink}
                  >
                    Resend Verification Link
                  </button>
                </small>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="home-email-not-VERIFIED-error-main-grid">
            <div className="alert alert--warning" role="alert">
              <span style={{ color: "green", fontSize: "1.2rem" }}>
                Verification Link has been sent to your email address. Please
                click the link and then proceed to login.
              </span>
              <br />
              <br />
              <small>
                <button
                  className="email-verification-link"
                  onClick={hadleResendVerificationLink}
                >
                  Resend Verification Link
                </button>
              </small>
            </div>
          </div>
          <br />
        </>
      )}
      <PageSidebar />
    </>
  );
}

export default BuildCodeEmailVerificationError;
