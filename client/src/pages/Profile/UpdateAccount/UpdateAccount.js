import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import db, { storage } from "../../../firebase/firebase-config";
import { uuidv4 } from "@firebase/util";
import swal from "sweetalert";
import Loading from "../../../components/Loader/Loading/Loading";
import { useUserAuth } from "../../../context/UserAuthContextProvider";
import { generateKeyWordsForUsers } from "../../../Util/Utils";
import "./UpdateAccount.css";

function UpdateAccount({
  profileUserData,
  profileUserUniqueID,
  updateFormRef,
}) {
  const { forgetPassword } = useUserAuth();
  const [text, setText] = useState("Uploading Image...");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [input, setInput] = useState(profileUserData);
  const [userSelectedSkills, setUserSelectedSkills] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const navigate = useNavigate();
  const formTopRef = useRef(null);

  useEffect(() => {
    if (profileUserData !== undefined && profileUserData !== null) {
      if (profileUserData.isDeleted === true) {
        navigate(
          "/error/This account has been deleted if you are an account holder then mail us contact@buildcode to deactivate."
        );
      } else if (profileUserData.redUser === true) {
        navigate(
          "/error/This account has been suspended due to a violation of the BuildCode account user agreement if you are an account holder then mail us contact@buildcode to deactivate."
        );
      } else {
        let tempAllUserPreviousSelectedSkills = [];
        profileUserData.skills.forEach((skl) => {
          tempAllUserPreviousSelectedSkills.push({ label: skl, value: skl });
        });
        setUserSelectedSkills(tempAllUserPreviousSelectedSkills);
      }
    }
  }, [navigate, profileUserData]);

  const scrollToTop = () => {
    formTopRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const UpdateProfile = (e) => {
    setText("Updating...");
    setTimeout(() => {
      setLoading(true);
    }, 500);
    e.preventDefault();
    if (input.userName === "") {
      setTimeout(() => {
        setError("Please enter username");
        scrollToTop();
        setLoading(false);
      }, 500);
    } else if (input.userName.length > 30) {
      setTimeout(() => {
        setError("Username can't be longer than 30 characters");
        scrollToTop();
        setLoading(false);
      }, 500);
    } else {
      const updateData = async () => {
        try {
          const q = query(
            collection(db, "users"),
            where("userName", "==", input.userName)
          );
          const querySnapshot = await getDocs(q);
          let flag = false;
          querySnapshot.forEach((doc) => {
            flag = true;
          });
          if (flag && input.userName !== profileUserData.userName) {
            /**
             * if user name has already been taken
             * then show message that can not take
             * this name
             */
            setTimeout(() => {
              setError(
                "Username cannot be used. Please choose another Username"
              );
              setInput({ ...input, userName: "" });
              setLoading(false);
              scrollToTop();
            }, 1500);
          } else {
            const usersRef = doc(db, "users", profileUserUniqueID);
            let newUserObj = {
              ...input,
              collegeOrCompany: input.collegeOrCompany.substring(0, 200),
              aboutMe: input.aboutMe.substring(0, 200),
              keywords: generateKeyWordsForUsers(input.userName),
            };

            await updateDoc(usersRef, newUserObj)
              .then(() => {
                setLoading(false);
                swal("Profile updated successfully", "", "success").then(() => {
                  window.location.reload();
                });
              })
              .catch((error) => {
                navigate("/error/Something Went Wrong ⚠️");
              });
          }
        } catch (error) {
          setLoading(false);
          swal("Failed to Update Your Profile", "", "error").then(() => {
            navigate("/error/Something Went Wrong ⚠️");
          });
        }
      };
      updateData();
    }
  };

  const handleChange = (e) => {
    setError("");
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const uploadFile = (file) => {
    const storageRef = ref(
      storage,
      `users/images/${input.email + file.name + uuidv4()}`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (err) => {
        setError("An error occurred during uploading the file");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setInput({ ...input, profilePic: url });
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        });
      }
    );
  };

  function isFileImage(file) {
    return file && file["type"].split("/")[0] === "image";
  }

  const handleFile = (e) => {
    setText("Uploading Image...");
    if (e.target && e.target.files) {
      const file = e.target.files[0];
      if (isFileImage(file) === false) {
        setError("Profile Image should be image");
      } else {
        if (file.size > 1000000) {
          setError("File size should be less than or equal to 1MB");
        } else {
          setLoading(true);
          uploadFile(file);
        }
      }
    }
  };

  const handleSkills = (skillOptions) => {
    setUserSelectedSkills(skillOptions);
    let skillsValue = [];

    skillOptions.forEach((option) => {
      skillsValue.push(option.value);
    });

    if (skillOptions.length >= 50) {
      skillOptions.pop();
      setUserSelectedSkills(skillOptions);
      skillsValue.pop();
    }

    setInput({ ...input, skills: skillsValue });
  };

  const addSelectedSkills = (queryString) => {
    const setMatchingSkills = async () => {
      const q = query(
        collection(db, "build-code-skills"),
        where("keywords", "array-contains", queryString),
        limit(10)
      );
      const documentSnapshots = await getDocs(q);
      let tempMatchingSkills = [];
      documentSnapshots.forEach((doc) => {
        tempMatchingSkills.push({
          label: doc.data().label,
          value: doc.data().value,
        });
      });
      setAllSkills(tempMatchingSkills);
    };
    setMatchingSkills();
  };

  const changePassword = () => {
    setText("Changing Password...");
    setTimeout(() => {
      setLoading(true);
    }, 400);
    const forget = async () => {
      try {
        await forgetPassword(profileUserData.email);
        setTimeout(() => {
          setLoading(false);
          alert(
            "Check your inbox We have sent a password reset link to your registered email address If you have not received the password reset link, please check your “Spam” or “Junk"
          );
        }, 1500);
      } catch (error) {
        if (error.message === "Quota exceeded.") {
          navigate("/server/server-down");
        } else {
          navigate("/error/Something Went Wrong ⚠️");
        }
      }
    };
    forget();
  };

  return (
    <>
      <Loading loaded={!loading} text={text} />
      <div className="update-profile-main">
        <div className="project-post-form">
          <div ref={updateFormRef} />
          <div ref={formTopRef} />
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-icon">Update Profile</div>
            <div></div>
            <div>
              <span id="error">{error}</span>
            </div>
            <div></div>
            <div className="d-flex align-items-start">
              <img
                src={input?.profilePic}
                className="rounded-circle avatar-lg img-thumbnail"
                alt={profileUserData.userName}
                style={{ width: "65px", height: "55px", objectFit: "cover" }}
              />
              <div className="w-100 ms-3">
                <label className="build-code-btn" htmlFor="inputGroupFile01">
                  Edit
                </label>
                <input
                  type="file"
                  style={{ display: "none" }}
                  id="inputGroupFile01"
                  name="profilePic"
                  onChange={handleFile}
                ></input>
                <button
                  className="change-password-btn"
                  onClick={changePassword}
                >
                  Change Password
                </button>
              </div>
            </div>
            <div className="fields-desc"></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div className="form-group form-topic-text">
              UserName
              <input
                type="text"
                className="form-control shadow-none project-post-form-item"
                name="userName"
                value={input.userName}
                onChange={handleChange}
              />
            </div>
            <div className="fields-desc"></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div className="form-group form-topic-text">
              <input
                type="radio"
                className="role-check"
                name="role"
                id="student"
                autoComplete="off"
                value="student"
                checked={input.role === "student"}
                onChange={handleChange}
              />
              <label className="role-btn" htmlFor="student">
                Student
              </label>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <input
                type="radio"
                className="role-check"
                name="role"
                id="professional"
                autoComplete="off"
                value="professional"
                checked={input.role === "professional"}
                onChange={handleChange}
              />
              <label className="role-btn" htmlFor="professional">
                Professional
              </label>
            </div>
            <div className="fields-desc"></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div className="form-group form-topic-text">
              College | Company
              <input
                type="text"
                className="form-control shadow-none project-post-form-item"
                name="collegeOrCompany"
                value={input.collegeOrCompany}
                onChange={handleChange}
              />
            </div>
            <div className="fields-desc"></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div className="porject-request-all-skills form-group form-topic-text">
              Skills
              <CreatableSelect
                onChange={(value) => handleSkills(value)}
                onInputChange={addSelectedSkills}
                value={userSelectedSkills}
                isMulti
                isClearable
                options={allSkills}
                className="basic-multi-select "
                classNamePrefix="select"
                placeholder="skills"
              />
            </div>
            <div className="fields-desc"></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div className="form-group form-topic-text">
              Github
              <input
                type="text"
                className="form-control project-post-form-item shadow-none"
                name="githubLink"
                value={input.githubLink}
                onChange={handleChange}
              />
            </div>
            <div className="fields-desc"></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div className="form-group form-topic-text">
              LinkedIn
              <input
                type="text"
                className="form-control project-post-form-item shadow-none"
                name="linkedInLink"
                value={input.linkedInLink}
                onChange={handleChange}
              />
            </div>
            <div className="fields-desc"></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div className="form-group form-topic-text">
              Twitter
              <input
                type="text"
                className="form-control project-post-form-item shadow-none"
                name="twitterLink"
                value={input.twitterLink}
                onChange={handleChange}
              />
            </div>
            <div className="fields-desc"></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div className="form-group form-topic-text">
              Coding Profile
              <input
                type="text"
                className="form-control project-post-form-item shadow-none"
                name="codingProfileLink"
                placeholder="(LeetCode | Codechef | Codeforces)"
                value={input.codingProfileLink}
                onChange={handleChange}
              />
            </div>
            <div className="fields-desc"></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div className="form-group form-topic-text">
              About Me
              <textarea
                type="text"
                className="form-control project-post-form-item shadow-none"
                name="aboutMe"
                rows={6}
                value={input.aboutMe}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="fields-desc"></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div className="form-group form-topic-text">
              <button
                type="submit"
                className="build-code-btn"
                onClick={UpdateProfile}
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default UpdateAccount;
