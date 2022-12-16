import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  verifyPasswordResetCode,
  applyActionCode,
  confirmPasswordReset,
} from "firebase/auth";
import swal from "sweetalert";
import { auth } from "../../firebase/firebase-config";
import Loading from "../../components/Loader/Loading/Loading";
import Footer from "../../components/Footer/Footer";
import "./UserAuthAction.css";

function UserAuthAction({ setPageSidebar }) {
  const navigate = useNavigate();

  useEffect(() => {
    setPageSidebar(false);
  }, []);

  const [urlQury] = useSearchParams();
  const mode = urlQury.get("mode");
  const actionCode = urlQury.get("oobCode");
  const apiKey = urlQury.get("apiKey");
  const lang = urlQury.get("lang");
  const [error, setError] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirstPassword] = useState("");
  const [inputError, setInputError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "resetPassword") {
      verifyPasswordResetCode(auth, actionCode)
        .then((email) => {})
        .catch((error) => {
          setError(
            "Invalid or expired action code. Please reset the password again."
          );
        });
    }
  }, []);

  const handleForgetPassword = () => {
    setLoading(true);
    if (password !== confirmPassword) {
      setInputError("Password and confirm password does not match");
      setLoading(false);
    } else if (password.length < 6) {
      setTimeout(() => {
        setInputError("Password should be at least 6 characters");
        setLoading(false);
      }, 300);
    } else {
      confirmPasswordReset(auth, actionCode, password)
        .then((resp) => {
          setLoading(true);
          swal(
            "Password reset has been confirmed and new password updated",
            "",
            "success"
          ).then(() => {
            window.location.href = `https://buildcode.org`;
          });
        })
        .catch((error) => {
          setLoading(false);

          if (error.message === "Quota exceeded.") {
            navigate("/server/server-down");
          }
          setError(
            "Error occurred during confirmation. The code might have expired or the password is too weak."
          );
        });
    }
  };

  const handleVerifyEmail = () => {
    setLoading(true);
    applyActionCode(auth, actionCode)
      .then((resp) => {
        setTimeout(() => {
          swal("Email address has been verified", "", "success").then(() => {
            window.location.href = `https://buildcode.org`;
          });
        }, 1000);
      })
      .catch((error) => {
        setLoading(false);

        if (error.message === "Quota exceeded.") {
          navigate("/server/server-down");
        }

        setError(
          "Code is invalid or expired.Please verify your email address again."
        );
      });
  };

  return error.length !== 0 ? (
    <>
      <div className="registration-form">
        <br />
        <br />
        <div className="password-resent-status">
          <div className="alert alert--warning" role="alert">
            <span style={{ color: "red" }}>{error}</span>
          </div>
        </div>
      </div>
      <Footer />
    </>
  ) : mode === "resetPassword" ? (
    <>
      <div className="registration-form">
        <br />
        <br />
        <form>
          <div className="form-icon">
            <h3>Password Reset</h3>
          </div>
          <br />
          <br />
          <span style={{ fontStyle: "italic", color: "red" }}>
            {inputError}
          </span>
          <br />
          <div className="form-group">
            <input
              type="password"
              className="form-control shadow-none registration-form-item"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="new password"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control shadow-none registration-form-item"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirstPassword(e.target.value)}
              placeholder="confirm password"
            />
          </div>
          <div className="form-group">
            <div className="create-account">
              <button
                type="button"
                className="btn btn-block"
                onClick={handleForgetPassword}
              >
                Reset Password
              </button>
            </div>
          </div>
        </form>
      </div>
      <Loading loaded={!loading} text={"resetting password"} />
    </>
  ) : mode === "verifyEmail" ? (
    <>
      <div className="registration-form">
        <br />
        <br />
        <form>
          <div className="form-icon">
            <h3>Verify Email</h3>
          </div>
          <span style={{ fontStyle: "italic", color: "red" }}>
            {inputError}
          </span>
          <br />
          <div className="form-group">
            <div className="create-account">
              <button
                type="button"
                onClick={handleVerifyEmail}
                className="btn btn-block "
              >
                Verify
              </button>
            </div>
          </div>
        </form>
      </div>
      <Loading loaded={!loading} text={"verifying your email address"} />
    </>
  ) : (
    <div className="registration-form">
      <br />
      <br />
      <div className="password-resent-status">
        <div className="alert alert--warning" role="alert">
          <span style={{ color: "red" }}>Invalid or expired action code</span>
        </div>
      </div>
    </div>
  );
}

export default UserAuthAction;
