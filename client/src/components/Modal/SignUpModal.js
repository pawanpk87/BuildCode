import {
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Modal } from "react-responsive-modal";
import { useUserAuth } from "../../context/UserAuthContextProvider";
import db from "../../firebase/firebase-config";
import { createUser } from "../../Util/DBUtil";
import { sendMailToNewUser } from "../../Util/MailUtill";
import BuildCodeLogo from "../../assets/Images/build-code-logo.svg";
import { useNavigate } from "react-router-dom";
import GoogleButton from "react-google-button";
import Loading from "../Loader/Loading/Loading";
import { reservedName } from "../../Util/Utils";
import "./SignUpModal.css";

function SignUpModal({
  open,
  closeDialog,
  closeOnOverlayClick,
  showCloseIcon,
}) {
  // sign Up
  const [inputForSignUp, setInputForSignUp] = useState({
    profilePic: "",
    userName: "",
    name: "",
    gender: "",
    birthday: "",
    email: "",
    role: "",
    experience: "",
    collegeOrCompany: "",
    skills: [],
    githubLink: "",
    linkedInLink: "",
    twitterLink: "",
    codingProfileLink: "",
    aboutMe: "",
    completedProjects: [],
    currentProjects: [],
    articles: [],
    totalLikes: 0,
    joined: serverTimestamp(),
    interestedDomain: [],
    currentRooms: [
      {
        id: "BuildCode-chat-room33d3311e-a5fd-4569-8ae9-e9a4503e3801",
        name: "BuildCode",
      },
    ],
    askedQuestions: [],
    answeredQuestions: [],
    allActions: [],
    signUpWith: "",
    keywords: [],
    isDeleted: false,
    lastUsedNumber: 0,
    myArticleList: [],
    myProjectList: [],
    myProjectBlogList: [],
  });
  const [passwordForSignUp, setPasswordForSignUp] = useState("");
  const [confPasswordForSignUp, setConfPasswordForSignUp] = useState("");
  const [errorForSignUp, setErrorForSignUp] = useState("");
  const { signUp, logIn, googleSignIn, verifyEmail } = useUserAuth();
  const navigate = useNavigate();
  const [textForSignUp, setTextForSignUp] = useState(
    "Signing Up to Build</code>"
  );
  const [loadingForSignUp, setLoadingForSignUp] = useState(false);
  const { user } = useUserAuth();
  const [option, setOption] = useState("Sign Up");

  // signIn
  const [textForSignIn, setTextForSignIn] = useState(
    "Signing In to Build</code>"
  );
  const [loadingForSignIn, setLoadingForSignIn] = useState(false);
  const [errorForSignIn, setErrorForSignIn] = useState("");
  const [inputForSignIn, setInputForSignIn] = useState({
    email: "",
    password: "",
  });

  // forget Passwrod
  const [emailForForgetPassword, setEmilForForgetPassword] = useState("");
  const [errorForForgetPassword, setErrorForForgetPassword] = useState("");
  const [isSentMailForForgetPassword, setIsSentMailForForgetPassword] =
    useState(false);
  const [loadingForForgetPassword, setLoadingForForgetPassword] =
    useState(false);
  const [textForForgetPassword, setTextForForgetPassword] = useState(
    "Resetting your password"
  );
  const { forgetPassword } = useUserAuth();

  useEffect(() => {
    try {
      let userDataFromLocalStorage = JSON.parse(
        localStorage.getItem("BuildCodeUserData")
      );
      /**
       * if user email and passwordForSignUp is present
       * then login
       *
       * else load the page and allow user
       * to signUp
       */
      if (userDataFromLocalStorage !== null) {
        const loginFromLocalStorageData = async () => {
          try {
            await logIn(
              userDataFromLocalStorage.email,
              userDataFromLocalStorage.passwordForSignUp
            );
          } catch (errorForSignUp) {
            /**
             * if email and passwordForSignUp is wrong
             * do nothing
             */
          }
        };
        loginFromLocalStorageData();
      } else {
      }
    } catch {
      //navigate("/error/Something Went Wrong ⚠️");
    }
  }, [logIn]);

  const handleChangeForSignUp = (e) => {
    /**
     * if there is errorForSignUp and user clicks to update
     * the inputForSignUp fields then remove errorForSignUp
     */
    setErrorForSignUp("");
    // update state
    setInputForSignUp({
      ...inputForSignUp,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignUp = async (tempInputUserData) => {
    try {
      // insert user into Databse
      createUser(tempInputUserData)
        .then(() => {
          signUp(inputForSignUp.email.trim(), passwordForSignUp.trim());
          // // if signUp then  send verification link
          // verifyEmail();
          /**
           * send welcome mail to new user
           */
          if (
            sendMailToNewUser(
              inputForSignUp.email.trim(),
              inputForSignUp.userName.trim()
            )
          ) {
            let newObj = {
              email: inputForSignUp.email,
              passwordForSignUp: passwordForSignUp,
            };
            // store user email & passwrod into local strage for signIn
            localStorage.setItem("BuildCodeUserData", JSON.stringify(newObj));
            // navigate to home page
            setTimeout(() => {
              setLoadingForSignUp(false);
              navigate("/");
              closeDialog();
              //window.location.reload();
            }, 2000);
          } else {
            //window.location.reload();
            navigate(
              "/error/Something Went Wrong ⚠️\n Failed to sign up, please try again \n [or report at contact@buildcode.org]"
            );
          }
        })
        .catch((error) => {
          navigate(
            "/error/Something Went Wrong ⚠️\n Failed to sign up, please try again \n [or report at contact@buildcode.org]"
          );
        });
    } catch (errorForSignUp) {
      alert(errorForSignUp.message);
      setInputForSignUp({ ...inputForSignUp, userName: "", email: "" });
      setConfPasswordForSignUp("");
      setPasswordForSignUp("");
      setLoadingForSignUp(false);
    }
  };

  const isUserNamePresentInDataBaseForSignUp = async (tempInputUserData) => {
    const q = query(
      collection(db, "users"),
      where("userName", "==", inputForSignUp.userName.trim())
    );
    await getDocs(q)
      .then((querySnapshot) => {
        let flag = false;
        querySnapshot.forEach((doc) => {
          flag = true;
        });
        if (
          inputForSignUp.userName.includes("Admin") ||
          inputForSignUp.userName.includes("admin")
        ) {
          flag = true;
        }

        if (reservedName.indexOf(inputForSignIn.userName) !== -1) {
          flag = true;
        }

        if (flag) {
          /**
           * if user name has already been taken
           * then show message that can not take
           * this name
           */
          setErrorForSignUp(
            "Username cannot be used. Please choose another username."
          );
          setInputForSignUp({ ...inputForSignUp, userName: "", email: "" });
          setConfPasswordForSignUp("");
          setPasswordForSignUp("");
          setLoadingForSignUp(false);
        } else {
          // if not then try to signUp
          handleSignUp(tempInputUserData);
        }
      })
      .catch((error) => {
        navigate(
          "/error/Something Went Wrong ⚠️\n Failed to sign up, please try again \n [or report at contact@buildcode.org]"
        );
      });
  };

  const isEmailPresentInDB = async () => {
    const q = query(
      collection(db, "users"),
      where("email", "==", inputForSignUp.email.trim())
    );
    await getDocs(q)
      .then((querySnapshot) => {
        let flag = false;
        let tempCurrentUserData = null;
        querySnapshot.forEach((doc) => {
          flag = true;
          tempCurrentUserData = doc.data();
        });

        if (
          tempCurrentUserData !== null &&
          tempCurrentUserData !== undefined &&
          flag === true &&
          tempCurrentUserData.isDeleted === true
        ) {
          // if account is again created for the same email
          let tempLastUsedNumber = tempCurrentUserData.lastUsedNumber + 1;

          let tempInputUserData = {
            ...inputForSignUp,
            lastUsedNumber: tempLastUsedNumber,
          };

          isUserNamePresentInDataBaseForSignUp(tempInputUserData);
        } else if (flag) {
          // if yes then show errorForSignUp message
          setErrorForSignUp(
            "An account with this email already exists please login"
          );
          setInputForSignUp({ ...inputForSignUp, userName: "", email: "" });
          setConfPasswordForSignUp("");
          setPasswordForSignUp("");
          setLoadingForSignUp(false);
        } else {
          // if email is not present in Databse then check userName
          isUserNamePresentInDataBaseForSignUp(inputForSignUp);
        }
      })
      .catch((error) => {
        navigate(
          "/error/Something Went Wrong ⚠️\n Failed to sign up, please try again \n [or report at contact@buildcode.org]"
        );
      });
  };

  const handleSubmitForSignUp = async (evt) => {
    setLoadingForSignUp(true);
    evt.preventDefault();
    if (
      inputForSignUp.userName.trim() === "" ||
      inputForSignUp.email.trim() === "" ||
      passwordForSignUp.trim() === "" ||
      confPasswordForSignUp.trim() === ""
    ) {
      setTimeout(() => {
        setErrorForSignUp("Please fill all fields");
        setLoadingForSignUp(false);
      }, 300);
    } else if (passwordForSignUp !== confPasswordForSignUp) {
      setTimeout(() => {
        setErrorForSignUp("passwordForSignUp doesn't match");
        setConfPasswordForSignUp("");
        setPasswordForSignUp("");
        setLoadingForSignUp(false);
      }, 300);
    } else if (passwordForSignUp.length < 6) {
      setTimeout(() => {
        setErrorForSignUp("Password should be at least 6 characters");
        setLoadingForSignUp(false);
      }, 300);
    } else if (inputForSignUp.userName.trim().toLowerCase().includes("admin")) {
      setTimeout(() => {
        setErrorForSignUp("You can not choes any name which contains Admin");
        setLoadingForSignUp(false);
      }, 300);
    } else {
      /**
       * check user email is already present in Databse or not
       */
      isEmailPresentInDB();
    }
  };

  const handleGoogleSignInForSignUp = async (e) => {
    e.preventDefault();
    try {
      await googleSignIn();
      setLoadingForSignUp(true);
      // navigate to home page
      setTimeout(() => {
        setLoadingForSignUp(false);
        //window.location.reload();
        navigate("/");
        closeDialog();
      }, 1000);
    } catch (errorForSignUp) {
      /**
       * if user closed the google signIn pop
       * then do nothing otherwise navigate to
       * errorForSignUp page
       */
      if (
        errorForSignUp.message ===
          "Firebase: Error (auth/popup-closed-by-user)." ||
        errorForSignUp.message ===
          "Firebase: Error (auth/cancelled-popup-request)."
      ) {
      } else {
        if (errorForSignUp !== null) alert(errorForSignUp.message);
        else {
          navigate("/error/Something Went Wrong ⚠️");
        }
      }
    }
  };

  const handleChange = (e) => {
    /**
     * if there is errorForSignIn and user clicks to update
     * the inputForSignIn fields then remove errorForSignIn
     */
    setErrorForSignIn("");
    // update state
    setInputForSignIn({ ...inputForSignIn, [e.target.name]: e.target.value });
  };

  const isEmailPresentInDBForSignIn = async () => {
    const q = query(
      collection(db, "users"),
      where("email", "==", inputForSignIn.email)
    );
    const querySnapshot = await getDocs(q);
    let flag = false;
    querySnapshot.forEach((doc) => {
      flag = true;
    });
    if (flag) {
      // email is present then login
      try {
        await logIn(inputForSignIn.email, inputForSignIn.password);
        let newObj = {
          email: inputForSignIn.email,
          password: inputForSignIn.password,
        };
        // store user email & passwrod into local strage for signIn
        localStorage.setItem("BuildCodeUserData", JSON.stringify(newObj));
        // navigate to home page
        navigate("/");
        closeDialog();
        //window.location.reload();
      } catch {
        setErrorForSignIn("Wrong password!!!");
        setInputForSignIn({ ...inputForSignIn, password: "" });
        setLoadingForSignIn(false);
      }
    } else {
      setErrorForSignIn(
        "An account with this email does not exists please Sign Up"
      );
      setLoadingForSignIn(false);
    }
  };

  const handleSubmitForSignIn = async (evt) => {
    setLoadingForSignIn(true);
    evt.preventDefault();
    if (inputForSignIn.email === "" || inputForSignIn.password === "") {
      setTimeout(() => {
        setErrorForSignIn("Please fill all fields");
        setLoadingForSignIn(false);
      }, 300);
    } else {
      /**
       * check user email is already present in Databse or not
       */
      isEmailPresentInDBForSignIn();
    }
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      await googleSignIn();
      setLoadingForSignIn(true);
      // navigate to home page

      setLoadingForSignIn(false);
      //window.location.reload();
      navigate("/");
      closeDialog();
    } catch (errorForSignIn) {
      /**
       * if user closed the google signIn pop
       * then do nothing otherwise navigate to
       * errorForSignIn page
       */
      if (
        errorForSignIn.message ===
          "Firebase: Error (auth/popup-closed-by-user)." ||
        errorForSignIn.message ===
          "Firebase: Error (auth/cancelled-popup-request)."
      ) {
      } else {
        if (errorForSignIn !== null) alert(errorForSignIn.message);
        else navigate("/errorForSignIn");
      }
    }
  };

  const handleChangeForForgetPassword = (e) => {
    setErrorForForgetPassword("");
    setIsSentMailForForgetPassword(false);
    setEmilForForgetPassword(e.target.value);
  };

  const handleSubmit = async (evt) => {
    setLoadingForForgetPassword(true);
    evt.preventDefault();
    if (emailForForgetPassword === "") {
      setTimeout(() => {
        setErrorForForgetPassword("Please fill fields");
        setLoadingForForgetPassword(false);
      }, 300);
      return;
    }
    const isUserPresentInDB = async () => {
      const q = query(
        collection(db, "users"),
        where("email", "==", emailForForgetPassword)
      );
      const querySnapshot = await getDocs(q);
      let flag = false;
      querySnapshot.forEach((doc) => {
        flag = true;
      });
      if (flag) {
        try {
          await forgetPassword(emailForForgetPassword);
          setIsSentMailForForgetPassword(true);
          setLoadingForForgetPassword(false);
        } catch (errorForForgetPassword) {
          navigate("/error/Something Went Wrong ⚠️");
        }
      } else {
        setTimeout(() => {
          setErrorForForgetPassword(
            "An account with this email does not exists please Sign Up"
          );
          setLoadingForForgetPassword(false);
        }, 100);
      }
    };
    isUserPresentInDB();
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        closeDialog();
      }}
      closeOnOverlayClick={closeOnOverlayClick}
      showCloseIcon={showCloseIcon}
    >
      <Loading loaded={!loadingForSignUp} text={textForSignUp} />
      <Loading loaded={!loadingForSignIn} text={textForSignIn} />
      <Loading
        loaded={!loadingForForgetPassword}
        textForForgetPassword={textForForgetPassword}
      />
      {option === "Sign Up" ? (
        <div className="registration-form">
          <form onSubmit={handleSubmitForSignUp}>
            <div className="form-icon">
              <a href="/">
                <img src={BuildCodeLogo} alt="BuildCode" />
              </a>
            </div>
            <br />
            <span style={{ color: "red", fontStyle: "italic" }}>
              {errorForSignUp}
            </span>
            <div className="form-group">
              <input
                type="textForSignUp"
                className="form-control shadow-none registration-form-item"
                name="userName"
                placeholder="Username"
                value={inputForSignUp.userName}
                onChange={handleChangeForSignUp}
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                className="form-control shadow-none registration-form-item"
                name="email"
                placeholder="Email"
                value={inputForSignUp.email}
                onChange={handleChangeForSignUp}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control shadow-none registration-form-item"
                name="passwordForSignUp"
                placeholder="Password"
                value={passwordForSignUp}
                onChange={(e) => {
                  setErrorForSignUp("");
                  setPasswordForSignUp(e.target.value);
                }}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control shadow-none registration-form-item"
                name="confPasswordForSignUp"
                placeholder="Confirm Password"
                value={confPasswordForSignUp}
                onChange={(e) => {
                  setErrorForSignUp("");
                  setConfPasswordForSignUp(e.target.value);
                }}
              />
            </div>
            <div className="form-group">
              <div className="create-account">
                <button type="submit" className="btn btn-block ">
                  Sign Up
                </button>
              </div>
            </div>
            <br />
            <div id="google-signin-btn">
              <div>
                <GoogleButton
                  type="dark"
                  onClick={handleGoogleSignInForSignUp}
                  label="Sign up with Google"
                />
              </div>
            </div>
            <br />
            <div style={{ textForSignUpAlign: "center", color: "gray" }}>
              <span>Already have an account?</span>{" "}
              <span id="signInlink" onClick={() => setOption("Sign In")}>
                Sign In
              </span>{" "}
              <br />
              <div id="termandconditons">
                By creating this account, you agree to our Privacy Policy{" "}
                <a href="/terms-and-conditions" target="_blank">
                  <span>Terms and conditions</span>
                </a>
              </div>
            </div>
          </form>
        </div>
      ) : option === "Sign In" ? (
        <div className="registration-form">
          <form onSubmit={handleSubmitForSignIn}>
            <div className="form-icon">
              <a href="/">
                <img src={BuildCodeLogo} alt="BuildCode" />
              </a>
            </div>
            <br />
            <span style={{ color: "red", fontStyle: "italic" }}>
              {errorForSignIn}
            </span>
            <br />
            <div className="form-group">
              <input
                type="email"
                className="form-control shadow-none registration-form-item"
                name="email"
                placeholder="Email"
                value={inputForSignIn.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control shadow-none registration-form-item"
                name="password"
                placeholder="Password"
                value={inputForSignIn.password}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <div className="create-account">
                <button type="submit" className="btn btn-block ">
                  Sign In
                </button>
              </div>
            </div>
            <br />
            <div id="google-signin-btn">
              <div>
                <GoogleButton type="dark" onClick={handleGoogleSignIn} />
              </div>
            </div>
            <br />
            <div style={{ textAlign: "center", color: "gray" }}>
              <span>Don't have an account? </span>
              <span id="signInlink" onClick={() => setOption("Sign Up")}>
                Sign Up
              </span>
              <br />
              <span>Forget Password ? </span>
              <span
                id="signInlink"
                onClick={() => setOption("Forget Password")}
              >
                Reset
              </span>
            </div>
          </form>
        </div>
      ) : (
        <div className="registration-form">
          <form onSubmit={handleSubmit}>
            <div className="form-icon">
              <h3> Password Reset</h3>
            </div>
            <span style={{ color: "red", fontStyle: "italic" }}>
              {errorForForgetPassword}
            </span>
            <br />
            <br />
            <div>
              <span>
                Forgotten your password? Enter your e-mail address below, and
                we'll send you an e-mail allowing you to reset it.
              </span>
            </div>
            <div className="form-group">
              <input
                type="emailForForgetPassword"
                className="form-control shadow-none registration-form-item"
                name="emailForForgetPassword"
                placeholder="Email"
                value={emailForForgetPassword}
                onChange={handleChangeForForgetPassword}
              />
            </div>
            <div className="form-group">
              <div className="create-account">
                <button type="submit" className="btn btn-block ">
                  Reset Password
                </button>
              </div>
            </div>
            <br />
            <div style={{ textAlign: "center", color: "gray" }}>
              <span id="signInlink" onClick={() => setOption("Sign In")}>
                Back to Sign In
              </span>
            </div>
          </form>
          <br />
          <br />
          <br />
          {isSentMailForForgetPassword === true ? (
            <div className="password-resent-status">
              <div className="alert alert--warning" role="alert">
                A reset link has been sent to your email. Please use it to reset
                your password. If you have not received the verification link,
                please check your “Spam” or “Junk” folder.
              </div>
            </div>
          ) : null}
        </div>
      )}
    </Modal>
  );
}

export default SignUpModal;
