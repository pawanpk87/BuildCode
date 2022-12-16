import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import React, { useState, useRef, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import swal from "sweetalert";
import db from "../../firebase/firebase-config";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import Loading from "../../components/Loader/Loading/Loading";
import FullPageLoader from "../../components/Loader/FullPageLoader/FullPageLoader";
import { generateKeyWordsForSkill } from "../../Util/Utils";
import "./RequestedProjectUpdateForm.css";

function RequestedProjectUpdateForm({ data, userUniqueId }) {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [userSelectedSkills, setUserSelectedSkills] = useState([]);
  const [userSelectedTags, setUserSelectedTags] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [text, setText] = useState("Updating...");
  const formTopRef = useRef(null);

  const scrollToTop = () => {
    formTopRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (data.requestedBy[0].id !== userUniqueId) {
      navigate("/error/Something Went Wrong ⚠️");
    } else {
      let tempPreviusSelectedSkills = [];
      data.skills.forEach((skl) => {
        tempPreviusSelectedSkills.push({ label: skl, value: skl });
      });

      let tempPreviusSelectedTags = [];
      data.tags.forEach((tag) => {
        tempPreviusSelectedTags.push({ label: tag, value: tag });
      });

      setUserSelectedSkills(tempPreviusSelectedSkills);
      setUserSelectedTags(tempPreviusSelectedTags);

      setDone(true);
    }
  }, [data.requestedBy]);

  const [input, setInput] = useState(data);

  const handleChange = (e) => {
    setError("");
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleSkills = (skillOptions) => {
    setUserSelectedSkills(skillOptions);
    let skillsValue = [];
    skillOptions.forEach((option) => {
      skillsValue.push(option.value);
    });
    if (skillOptions.length > 30) {
      skillOptions.pop();
      setUserSelectedSkills(skillOptions);
      skillsValue.pop();
    }
    setInput({ ...input, skills: skillsValue });
  };

  const handleTags = (tagOptions) => {
    setUserSelectedTags(tagOptions);
    let tagsValue = [];
    tagOptions.forEach((option) => {
      tagsValue.push(option.value);
    });
    if (tagOptions.length > 5) {
      tagOptions.pop();
      setUserSelectedTags(tagOptions);
      tagsValue.pop();
    }
    setInput({ ...input, tags: tagsValue });
  };

  const addNewSkillsAndTagsInDB = async (urlName) => {
    let tempSelectedSkills = userSelectedSkills;
    const batch = writeBatch(db);
    for (let index = 0; index < tempSelectedSkills.length; index++) {
      let tempSkill = tempSelectedSkills[index];
      if (tempSkill.value.length > 0) {
        const q = query(
          collection(db, "build-code-skills"),
          where("value", "==", tempSkill.value)
        );
        const querySnapshot = await getDocs(q);
        let flag = false;
        querySnapshot.forEach((doc) => {
          flag = true;
        });
        if (flag === false) {
          let keywords = generateKeyWordsForSkill(tempSkill.value);
          let skillObj = {
            label: tempSkill.value,
            value: tempSkill.value,
            keywords: keywords,
            addedOn: serverTimestamp(),
          };

          const buildCodeSkillsRef = doc(collection(db, "build-code-skills"));
          batch.set(buildCodeSkillsRef, skillObj);
        }
      }
    }

    let tempSelectedTags = userSelectedTags;
    for (let index = 0; index < tempSelectedTags.length; index++) {
      let tempTag = tempSelectedTags[index];
      if (tempTag.value.length > 0) {
        const q = query(
          collection(db, "build-code-project-tags"),
          where("value", "==", tempTag.value)
        );
        const querySnapshot = await getDocs(q);
        let flag = false;
        querySnapshot.forEach((doc) => {
          flag = true;
        });
        if (flag === false) {
          let keywords = generateKeyWordsForSkill(tempTag.value);
          let tagObj = {
            label: tempTag.value,
            value: tempTag.value,
            keywords: keywords,
            addedOn: serverTimestamp(),
          };
          const buildCodeSkillsRef = doc(
            collection(db, "build-code-project-tags")
          );
          batch.set(buildCodeSkillsRef, tagObj);
        }
      }
    }

    let tempSelectedBuildCodeTags = userSelectedTags;
    for (let index = 0; index < tempSelectedBuildCodeTags.length; index++) {
      let tempTag = tempSelectedBuildCodeTags[index];
      if (tempTag.value.length > 0) {
        const q = query(
          collection(db, "build-code-tags"),
          where("value", "==", tempTag.value)
        );
        const querySnapshot = await getDocs(q);
        let flag = false;
        querySnapshot.forEach((doc) => {
          flag = true;
        });
        if (flag === false) {
          let keywords = generateKeyWordsForSkill(tempTag.value);
          let tagObj = {
            label: tempTag.value,
            value: tempTag.value,
            keywords: keywords,
            addedOn: serverTimestamp(),
          };
          const buildCodeSkillsRef = doc(collection(db, "build-code-tags"));
          batch.set(buildCodeSkillsRef, tagObj);
        }
      }
    }

    await batch
      .commit()
      .then(() => {
        setLoading(false);
        swal("Project Updated successfully", "", "success").then(() => {
          window.location.reload();
        });
      })
      .catch((error) => {
        if (error.message === "Quota exceeded.") {
          navigate("/server/server-down");
        } else {
          navigate("/error/Something Went Wrong ⚠️");
        }
      });
  };

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    if (
      input.technology === "" ||
      input.teamSize === "" ||
      input.skills.length === 0 ||
      input.projectAIM === ""
    ) {
      setError("Please fill all fields");
      setTimeout(() => {
        setLoading(false);
        scrollToTop();
      }, 400);
    } else if (input.projectAIM.split(" ").length < 20) {
      setError("Write at least 20 words about Project AIM");
      setTimeout(() => {
        setLoading(false);
        scrollToTop();
      }, 400);
    } else if (isNaN(Number(input.teamSize))) {
      setError("Team size should be Number");
      setTimeout(() => {
        setLoading(false);
        scrollToTop();
      }, 400);
    } else if (Number(input.teamSize) <= 1 || Number(input.teamSize) > 15) {
      setError("Team size should be in the range of 2 - 15");
      setTimeout(() => {
        setLoading(false);
        scrollToTop();
      }, 400);
    } else if (input.tags.length === 0) {
      setError("Add atleast 1 tag");
      setTimeout(() => {
        setLoading(false);
        scrollToTop();
      }, 400);
    } else {
      /**
       * add this project request into Databse
       */
      const updateProjectRequest = async () => {
        const requestedProjectsRef = doc(db, "projects", data.urlName);
        await updateDoc(requestedProjectsRef, input)
          .then(() => {
            addNewSkillsAndTagsInDB(data.urlName);
          })
          .catch((error) => {
            if (error.message === "Quota exceeded.") {
              navigate("/server/server-down");
            } else {
              navigate("/error/Something Went Wrong ⚠️");
            }
          });
      };
      updateProjectRequest();
    }
  };

  const addSelectedSkills = (queryString) => {
    const setMatchingSkills = async () => {
      const q = query(
        collection(db, "build-code-skills"),
        where("keywords", "array-contains", queryString),
        limit(20)
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

  const addSelectedTags = (queryString) => {
    const setMatchingTags = async () => {
      const q = query(
        collection(db, "build-code-project-tags"),
        where("keywords", "array-contains", queryString),
        limit(30)
      );
      const documentSnapshots = await getDocs(q);
      let tempMatchingTags = [];
      documentSnapshots.forEach((doc) => {
        tempMatchingTags.push({
          label: doc.data().label,
          value: doc.data().value,
        });
      });
      setAllTags(tempMatchingTags);
    };
    setMatchingTags();
  };

  return done === false ? (
    <>
      <FullPageLoader color={"blue"} height={"50px"} width={"50px"} />
    </>
  ) : (
    <>
      <Loading loaded={!loading} text={text} />
      <div className="post-project-main">
        <div ref={formTopRef} />
        <br />
        <br />
        <div className="project-post-form">
          <form onSubmit={handleSubmit}>
            <div className="form-icon">
              Update your Request
              <br />
              <span id="error">{error}</span>
            </div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div className="form-group form-topic-text">
              <span style={{ color: "red" }}>&#9733;</span> Technology
              <input
                type="text"
                className="form-control shadow-none project-post-form-item"
                name="technology"
                value={input.technology}
                onChange={handleChange}
              />
            </div>
            <div className="fields-desc"></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div className="porject-request-all-skills form-group form-topic-text">
              <span style={{ color: "red" }}>&#9733;</span> Skills
              <CreatableSelect
                onChange={(value) => handleSkills(value)}
                onInputChange={addSelectedSkills}
                value={userSelectedSkills}
                isMulti
                isClearable
                options={allSkills}
                className="basic-multi-select "
                classNamePrefix="select"
                placeholder="Add up to 30 skills"
              />
            </div>
            <div className="fields-desc"></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div className="form-group form-topic-text">
              <span style={{ color: "red" }}>&#9733;</span> Team Size
              <input
                type="text"
                className="form-control project-post-form-item shadow-none"
                name="teamSize"
                value={input.teamSize}
                onChange={handleChange}
              />
            </div>
            <div className="fields-desc"></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div className="form-group form-topic-text">
              <span style={{ color: "red" }}>&#9733;</span> Project AIM
              <textarea
                type="text"
                className="form-control project-post-form-item shadow-none"
                name="projectAIM"
                rows={6}
                value={input.projectAIM}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="fields-desc"></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div className="form-group form-topic-text">
              <span style={{ color: "red" }}></span> Note
              <textarea
                type="text"
                className="form-control project-post-form-item shadow-none"
                name="note"
                rows={6}
                value={input.note}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="fields-desc "></div>
            <div></div>
            <div></div>
            <div className="porject-request-all-skills form-group form-topic-text">
              Tags
              <CreatableSelect
                onChange={(value) => handleTags(value)}
                onInputChange={addSelectedTags}
                value={userSelectedTags}
                isMulti
                isClearable
                options={allTags}
                className="basic-multi-select "
                classNamePrefix="select"
                placeholder="Add up to 5 tags"
              />
            </div>
            <div className="fields-desc"></div>
            <div></div>
            <div></div>
            <div className="form-group form-topic-text">
              <button type="submit" className="build-code-btn">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default RequestedProjectUpdateForm;
