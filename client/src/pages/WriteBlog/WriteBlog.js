import React, { useEffect, useState } from "react";
import { uuidv4 } from "@firebase/util";
import { storage } from "../../firebase/firebase-config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import PostArticleDialog from "../../components/Modal/PostArticleDialog";
import { useNavigate } from "react-router-dom";
import { useQuill } from "react-quilljs";
import "react-quill/dist/quill.snow.css";
import Loading from "../../components/Loader/Loading/Loading";
import { useUserAuth } from "../../context/UserAuthContextProvider";
import SignUpModal from "../../components/Modal/SignUpModal";
import { Helmet } from "react-helmet";
import "./WriteBlog.css";

function WriteBlog({ isInterviewExperience, setPageSidebar }) {
  useEffect(() => {
    setPageSidebar(true);
  }, [setPageSidebar]);

  const theme = "snow";
  const [title, setTitle] = useState("");
  const [titleForLocalStorage, setTitleForLocalStorage] = useState("");
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("Loading Previous Content...");
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();
  const { user, userData } = useUserAuth();

  useEffect(() => {
    if (user !== null) {
      if (user.emailVerified === false) {
        navigate("/verify-email");
      }
      if (userData !== undefined && userData !== null) {
        if (userData.isDeleted === true) {
          navigate(
            "/error/This account has been deleted, if you are an account holder then mail us contact@buildcode to deactivate."
          );
        } else if (userData.redUser === true) {
          navigate(
            "/error/This account has been suspended due to a violation of the BuildCode account user agreement if you are an account holder then mail us contact@buildcode to deactivate."
          );
        }
      }
    }
  }, [user, userData, navigate]);

  const modules = {
    toolbar: [
      [{ size: [] }],
      ["bold"],
      ["italic"],
      ["underline"],
      ["strike"],
      ["blockquote"],
      [{ list: "ordered" }],
      [{ list: "bullet" }],
      ["code-block"],
      ["link"],
      ["image"],
      ["video"],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  const placeholder = "Start writing here...";

  const formats = [
    "size",
    "bold",
    "italic",
    "underline",
    "list",
    "strike",
    "code-block",
    "link",
    "image",
    "video",
    "list",
    "blockquote",
  ];

  const { quillRef, quill } = useQuill({
    theme,
    modules,
    formats,
    placeholder,
  });

  // Upload Image to Image Server such as AWS S3, Cloudinary, Cloud Storage, etc..
  const saveToServer = async (file) => {
    setLoading(true);
    let storageRef;
    storageRef = ref(storage, `articles/images/${uuidv4() + file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // uploading...
      },
      (error) => {
        navigate("/error/An error occurred during uploading the file ⚠️");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((url) => {
            const range = quill.getSelection();
            quill.insertEmbed(range.index, "image", url);
            setTimeout(() => {
              setLoading(false);
            }, 500);
          })
          .catch((error) => {
            navigate("/error/An error occurred during uploading the file ⚠️");
          });
      }
    );
  };

  // Open Dialog to select Image File
  const selectLocalImage = () => {
    setText("Uploading File...");
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = () => {
      const file = input.files[0];
      saveToServer(file);
    };
  };

  const saveArticleDataToLocalStorage = () => {
    setInterval(() => {
      let tempTitle = title;
      let currentArticleData = {
        title: tempTitle,
        mainContent: quill.root.innerHTML,
      };
      localStorage.setItem(
        "BuildCodeArticleData",
        JSON.stringify(currentArticleData)
      );
    }, 1000);
  };

  React.useEffect(() => {
    if (quill) {
      quill.getModule("toolbar").addHandler("image", selectLocalImage);
      if (quill.root !== null) {
        saveArticleDataToLocalStorage();
        let userDataFromLocalStorage = JSON.parse(
          localStorage.getItem("BuildCodeArticleData")
        );
        if (
          userDataFromLocalStorage !== null &&
          userDataFromLocalStorage.mainContent !== null &&
          userDataFromLocalStorage.mainContent.length > 20
        ) {
          setText("Loading previous content from local storage");
          setLoading(true);
          quill.root.innerHTML = userDataFromLocalStorage.mainContent;
          setLoading(false);
          //prompt("Previous content has been restored from your local storage");
        }
      }
    }
  }, [quill]);

  const closeDialog = () => {
    setIsSending(false);
  };

  const postArticle = () => {
    if (title.trim().length === 0) {
      alert("Please add title");
      return;
    }
    if (quill.getText().replace(/\n/g, " ").length === 1) {
      alert("Please write something");
    } else {
      setIsSending(true);
    }
  };

  return (
    <>
      <Helmet>
        <meta charset="UTF-8" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <title>
          {isInterviewExperience === undefined
            ? "Write an Article"
            : "Write Interview Experience"}{" "}
          - BuildCode
        </title>

        <meta
          name="description"
          content="Write Articles and Interview Experience on BuildCode."
        />

        <link rel="canonical" href="https://buildcode.org/write" />

        <link rel="next" href="https://buildcode.org/articles" />

        <meta property="og:locale" content="en_US" />

        <meta
          property="og:site_name"
          content="Write Articles and Interview Experience on BuildCode."
        />

        <meta property="og:type" content="website" />

        <meta
          property="og:title"
          content="Write Articles and Interview Experience on BuildCode."
        />

        <meta
          property="og:description"
          content="Write Articles and Interview Experience on BuildCode."
        />

        <meta property="og:url" content="https://buildcode.org/write" />

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
          content="Write Articles and Interview Experience on BuildCode."
        />

        <meta
          name="twitter:description"
          content="Write Articles and Interview Experience on BuildCode."
        />

        <meta
          name="twitter:image"
          content="https://firebasestorage.googleapis.com/v0/b/buildcode-db.appspot.com/o/BuildCode%2Fbuild-code-log-png.png?alt=media&token=89dee950-0ea9-4ce9-9c7c-3f6d036dd595"
        />
      </Helmet>
      {user === null ? (
        <SignUpModal
          open={true}
          closeDialog={closeDialog}
          closeOnOverlayClick={false}
          showCloseIcon={false}
        />
      ) : null}
      <div className="build-code-editor">
        <div className="build-code-editor-main-grid">
          <div className="blog-title-input-box">
            <input
              type="text"
              placeholder="Title..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setTitleForLocalStorage(e.target.value);
              }}
            ></input>
            <button onClick={postArticle}>Publish</button>
          </div>
          <div ref={quillRef} placeholder={placeholder} />
        </div>
        {isSending ? (
          <PostArticleDialog
            open={isSending}
            isInterviewExperience={isInterviewExperience}
            closeDialog={closeDialog}
            articleMainContent={quill.root.innerHTML}
            articleMainTitle={title}
            articleDescription={quill
              .getText()
              .replace(/\n/g, " ")
              .substring(0, 1000)}
          />
        ) : null}
      </div>
      <Loading loaded={!loading} text={text} />
    </>
  );
}

export default WriteBlog;
