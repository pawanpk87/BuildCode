import { uuidv4 } from "@firebase/util";
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import swal from "sweetalert";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserAuth } from "../../context/UserAuthContextProvider";
import db, { storage } from "../../firebase/firebase-config";
import { useQuill } from "react-quilljs";
import Loading from "../../components/Loader/Loading/Loading";

function UpdateBlog({ setPageSidebar }) {
  useEffect(() => {
    setPageSidebar(true);
  }, [setPageSidebar]);

  const { articlUniqueID } = useParams();
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("Loading...");
  const [author, setAuthor] = useState(null);
  const { user, userData, userUniqueId } = useUserAuth();
  const [lastUpdatedOn, setLastUpdatedOn] = useState(null);
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const theme = "snow";
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

  const placeholder = "Start writing  here...";

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
        // if (type === "ArticleMainIMG") {
        //   const prog = Math.round(
        //     (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        //   );
        //   setProgress(prog);
        // }
      },
      (err) => {
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
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    setText("Adding Image...");
    input.onchange = () => {
      const file = input.files[0];
      saveToServer(file);
    };
  };

  React.useEffect(() => {
    if (quill) {
      quill.getModule("toolbar").addHandler("image", selectLocalImage);
    }
  }, [quill]);

  useEffect(() => {
    if (user !== null) {
      if (user.emailVerified === false) {
        navigate("/verify-email");
      }
      if (userData !== undefined && userData !== null) {
        if (userData.isDeleted === true) {
          navigate(
            "/error/This account has been deleted if you are an account holder then mail us contact@buildcode to deactivate."
          );
        } else if (userData.redUser === true) {
          navigate(
            "/error/This account has been suspended due to a violation of the BuildCode account user agreement if you are an account holder then mail us contact@buildcode to deactivate."
          );
        }
      }
    }
  }, [user, userData, navigate]);

  useEffect(() => {
    const getBlogData = async () => {
      const q = query(
        collection(db, "articles"),
        where("urlName", "==", articlUniqueID)
      );
      const querySnapshot = await getDocs(q);
      let flag = true;
      querySnapshot.forEach((doc) => {
        flag = false;
        setAuthor(doc.data().postedBy[0].id);
        setLastUpdatedOn(doc.data().lastUpdatedOn);
        setTitle(doc.data().title);
        quillRef.current.firstChild.innerHTML = doc.data().mainContent;
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      });
      if (flag) {
        navigate("/error/NOT FOUND 🚫");
      }
    };
    getBlogData();
  }, [articlUniqueID, quillRef, navigate]);

  const updateArticleHandler = () => {
    setText("Updating...");
    if (author !== userUniqueId) {
      navigate("/error/You can not update ⚠️");
    } else {
      if (quill.getText().replace(/\n/g, " ").length === 0) {
        alert("Please write something");
      } else {
        setLoading(true);
        try {
          const update = async () => {
            const projectBlogRef = doc(db, "articles", articlUniqueID);
            await updateDoc(projectBlogRef, {
              description: quill
                .getText()
                .replace(/\n/g, " ")
                .substring(0, 1000),
              lastUpdatedOn: serverTimestamp(),
              mainContent: quill.root.innerHTML,
            });

            swal("Updated successfully", "", "success");

            setTimeout(() => {
              setLoading(false);
              window.location.href = `/${articlUniqueID}`;
            }, 1000);
          };
          update();
        } catch {
          navigate("/error/Something Went Wrong 🚫");
        }
      }
    }
  };

  return (
    <>
      <div className="build-code-editor">
        <div className="build-code-editor-main-grid">
          <div className="blog-title-input-box">
            {lastUpdatedOn === null ? null : (
              <>
                {lastUpdatedOn === "" ? (
                  <span></span>
                ) : (
                  <small style={{ color: "grey" }}>
                    Last Updated:{" "}
                    {new Date(lastUpdatedOn.seconds * 1000).toDateString()}
                  </small>
                )}
              </>
            )}
            <button onClick={updateArticleHandler}>Update</button>
          </div>
          <div ref={quillRef} placeholder={placeholder} />
        </div>
      </div>
      <Loading loaded={!loading} text={text} />
    </>
  );
}

export default UpdateBlog;
