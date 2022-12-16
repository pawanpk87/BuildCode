import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import Loading from "../Loader/Loading/Loading";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import db, { storage } from "../../firebase/firebase-config";
import { uuidv4 } from "@firebase/util";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import { useUserAuth } from "../../context/UserAuthContextProvider";
import {
  generateKeyWordsForArticles,
  generateKeyWordsForSkill,
  generateURLName,
  reservedName,
} from "../../Util/Utils";
import "./PostArticleDialog.css";

const PostArticleDialog = ({
  open,
  isInterviewExperience,
  closeDialog,
  articleMainContent,
  articleMainTitle,
  articleDescription,
}) => {
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("Loading...");
  const [progress, setProgress] = useState(0);
  const [articleMainIMG, setArticleMainIMG] = useState("");
  const [userSelectedTags, setUserSelectedTags] = useState("");
  const [articleTags, setArticleTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const { userUniqueId, userData } = useUserAuth();
  const [error, setError] = useState("");
  const [isTagsDropdownDisable, setIsTagsDropdownDisable] = useState(false);
  const [allCompanyTags, setAllCompanyTags] = useState([]);
  const [userSelectedCompanyName, setUserSelectedCompanyName] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (userData !== null) {
      setLoading(false);
      setText("Uploading Cover Image...");
    }
  }, [userData]);

  const uploadFile = (file) => {
    setLoading(true);
    let storageRef;
    storageRef = ref(storage, `articles/images/${uuidv4() + file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(prog);
      },
      (err) => {
        navigate("/error/An error occurred while uploading the file ⚠️");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((url) => {
            setArticleMainIMG(url);
            setLoading(false);
          })
          .catch((error) => {
            navigate("/error/An error occurred while uploading the file ⚠️");
          });
      }
    );
  };

  function isFileImage(file) {
    return file && file["type"].split("/")[0] === "image";
  }

  const handleArticleMainImg = (e) => {
    setText("Adding Cover Image...");
    if (e.target && e.target.files) {
      const file = e.target.files[0];
      if (isFileImage(file) === false) {
        alert("You can only add Image");
      } else {
        uploadFile(file);
      }
    }
  };

  const addAllNewTagsIntoDB = async (urlName) => {
    const batch = writeBatch(db);
    let tempSelectedTags = userSelectedTags;
    for (let index = 0; index < tempSelectedTags.length; index++) {
      let tempTag = tempSelectedTags[index];
      if (tempTag.value.length > 0) {
        const q = query(
          collection(db, "build-code-article-tags"),
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
            collection(db, "build-code-article-tags")
          );
          batch.set(buildCodeSkillsRef, tagObj);
        }
      }
    }

    let tempBuildCodeSelectedTags = userSelectedTags;
    for (let index = 0; index < tempBuildCodeSelectedTags.length; index++) {
      let tempTag = tempBuildCodeSelectedTags[index];
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

    if (companyName !== "") {
      // add new Company name into DB
      const q = query(
        collection(db, "build-code-company-tags"),
        where("value", "==", companyName)
      );
      const querySnapshot = await getDocs(q);
      let flag = false;
      querySnapshot.forEach((doc) => {
        flag = true;
      });
      if (flag === false) {
        let keywords = generateKeyWordsForSkill(companyName);
        let tagObj = {
          label: companyName,
          value: companyName,
          keywords: keywords,
          addedOn: serverTimestamp(),
        };
        const buildCodeSkillsRef = doc(
          collection(db, "build-code-company-tags")
        );
        batch.set(buildCodeSkillsRef, tagObj);
      }
    }

    // update user articles array
    let tempUserArticles = userData.articles;
    if (tempUserArticles === null || tempUserArticles === undefined) {
      tempUserArticles = [urlName];
    } else {
      tempUserArticles.push(urlName);
    }
    const usersRef = doc(db, "users", userUniqueId);
    batch.update(usersRef, {
      articles: tempUserArticles,
    });
    await batch
      .commit()
      .then(() => {
        setLoading(false);

        swal("Published successfully", "", "success").then(() => {
          let currentArticleData = {
            title: "",
            mainContent: "",
          };

          localStorage.setItem(
            "BuildCodeArticleData",
            JSON.stringify(currentArticleData)
          );

          navigate("/" + urlName);
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

  const handleTags = (tagOptions) => {
    setUserSelectedTags(tagOptions);
    let allArticleCurrentTags = [];
    tagOptions.forEach((option) => {
      allArticleCurrentTags.push(option.value);
    });

    if (tagOptions.length > 5) {
      allArticleCurrentTags.pop();
      tagOptions.pop();
      setUserSelectedTags(tagOptions);
      setArticleTags(allArticleCurrentTags);
    } else {
      setArticleTags(allArticleCurrentTags);
    }
  };

  const handlePublish = () => {
    setError("");
    setText("Uploading...");
    setLoading(true);

    if (
      isInterviewExperience !== undefined &&
      companyName.trim().length === 0
    ) {
      setTimeout(() => {
        setLoading(false);
        setError("Please Choese Company Name");
      }, 500);
      return;
    }
    if (userSelectedTags.length === 0) {
      setTimeout(() => {
        setLoading(false);
        setError("Please Add atleast one tag");
      }, 500);
      return;
    }
    try {
      const articlesPost = async () => {
        let urlName = generateURLName(articleMainTitle);
        let generatedKeyWords = [];

        if (
          isInterviewExperience !== undefined &&
          isInterviewExperience !== null
        ) {
          generatedKeyWords = generateKeyWordsForArticles(
            articleMainTitle,
            articleTags,
            [companyName]
          );
        } else {
          generatedKeyWords = generateKeyWordsForArticles(
            articleMainTitle,
            articleTags,
            []
          );
        }

        const q = query(
          collection(db, "articles"),
          where("urlName", "==", urlName)
        );
        const querySnapshot = await getDocs(q);
        let flag = false;
        querySnapshot.forEach((doc) => {
          flag = true;
        });

        if (reservedName.indexOf(urlName) !== -1) flag = true;

        if (flag) urlName += "-" + uuidv4();

        try {
          let tempIsInterviewExperience =
            isInterviewExperience !== undefined ? 1 : -1;

          let data = {
            urlName: urlName,
            keywords: generatedKeyWords,
            articleMainIMG: articleMainIMG,
            title: articleMainTitle,
            tags: articleTags,
            description: articleDescription,
            mainContent: articleMainContent,
            postedBy: [
              {
                id: userUniqueId,
                img: userData.profilePic,
                name: userData.userName,
                urlName: userData.urlName,
              },
            ],
            postedOn: serverTimestamp(),
            userName: userData.userName,
            allViews: [],
            totalViews: 0,
            allLikes: [],
            totalLikes: 0,
            allComments: [],
            totalComments: 0,
            companyName: companyName,
            isInterviewExperience: tempIsInterviewExperience,
            lastUpdatedOn: serverTimestamp(),
            isDeleted: false,
            violatedArticle: false,
            copiedArticle: false,
            level: 1,
            mostPopular: false,
          };

          const articlesRef = doc(db, "articles", urlName);
          await setDoc(articlesRef, data)
            .then(() => {
              addAllNewTagsIntoDB(urlName);
            })
            .catch((error) => {
              if (error.message === "Quota exceeded.") {
                navigate("/server/server-down");
              } else {
                navigate("/error/Something Went Wrong ⚠️");
              }
            });
        } catch (error) {
          if (error.message === "Quota exceeded.") {
            navigate("/server/server-down");
          } else {
            navigate("/error/Something Went Wrong ⚠️");
          }
        }
      };
      articlesPost();
    } catch (error) {
      if (error.message === "Quota exceeded.") {
        navigate("/server/server-down");
      } else {
        navigate("/error/Something Went Wrong ⚠️");
      }
    }
  };

  const addSelectedTags = (queryString) => {
    const setMatchingTags = async () => {
      try {
        const q = query(
          collection(db, "build-code-article-tags"),
          where("keywords", "array-contains", queryString),
          limit(20)
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
      } catch (error) {
        if (error.message === "Quota exceeded.") {
          navigate("/server/server-down");
        } else {
          navigate("/error/Something Went Wrong ⚠️");
        }
      }
    };
    setMatchingTags();
  };

  const handleCompanyName = (tagOptions) => {
    setUserSelectedCompanyName(tagOptions);
    tagOptions.forEach((option) => {
      setCompanyName(option.value);
    });

    if (tagOptions.length > 1) {
      tagOptions.pop();
      setUserSelectedCompanyName(tagOptions);
      setCompanyName(tagOptions[0].value);
    }
  };

  const addSelectedCompanyName = (queryString) => {
    const setMatchingTags = async () => {
      const q = query(
        collection(db, "build-code-company-tags"),
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
      setAllCompanyTags(tempMatchingTags);
    };
    setMatchingTags();
  };

  return (
    <>
      <div>
        <Modal
          open={open}
          onClose={() => {
            closeDialog();
          }}
        >
          <Loading loaded={!loading} text={text} />
          <div className="post-article-dialog">
            {error.length > 0 ? (
              <span style={{ color: "red" }}>{error}</span>
            ) : null}

            {isInterviewExperience !== undefined ? (
              <>
                <br />
                <CreatableSelect
                  onChange={(value) => handleCompanyName(value)}
                  onInputChange={addSelectedCompanyName}
                  value={userSelectedCompanyName}
                  isMulti
                  isClearable
                  options={allCompanyTags}
                  className="basic-multi-select "
                  classNamePrefix="select"
                  placeholder="Company name"
                />
                <br />
              </>
            ) : null}
            <CreatableSelect
              onChange={(value) => handleTags(value)}
              onInputChange={addSelectedTags}
              value={userSelectedTags}
              isMulti
              isDisabled={isTagsDropdownDisable}
              isClearable
              options={allTags}
              className="basic-multi-select "
              classNamePrefix="select"
              placeholder="Add up to 5 tags..."
            />
            <br />
            <label className="article-cover-img" htmlFor="articleCoverImg">
              Add a cover image
            </label>
            <br />
            <input
              type="file"
              style={{ display: "none" }}
              id="articleCoverImg"
              name="profilePic"
              onChange={handleArticleMainImg}
            ></input>
            <br />
            {progress === 100 ? (
              <>
                <br />
                <img
                  className="post-article-dialop-article-cover-img"
                  src={articleMainIMG}
                  alt={articleMainTitle}
                />
                <br />
              </>
            ) : null}
            <br />
            <button className="post-article-btn" onClick={handlePublish}>
              Publish
            </button>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default PostArticleDialog;
