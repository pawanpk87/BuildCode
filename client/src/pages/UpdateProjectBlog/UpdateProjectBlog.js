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
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useUserAuth } from "../../context/UserAuthContextProvider";
import db, { storage } from "../../firebase/firebase-config";
import { useQuill } from "react-quilljs";
import Loading from "../../components/Loader/Loading/Loading";
import swal from "sweetalert";
import { timeSince } from "../../Util/Utils";

function UpdateProjectBlog({ setPageSidebar }) {
  useEffect(() => {
    setPageSidebar(true);
  }, [setPageSidebar]);

  const navigate = useNavigate();
  const { projectBlogID } = useParams();
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("Loading...");
  const { user, userData } = useUserAuth();
  const [projectBlogDetails, setProjectBlogDetails] = useState(null);

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

  const placeholder = "start writing...";

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
    storageRef = ref(storage, `project/blogs/images/${uuidv4() + file.name}`);
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
        alert("An error occurred during uploading the file");
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
            alert("An error occurred during uploading the file");
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
        collection(db, "project-blogs"),
        where("urlName", "==", projectBlogID)
      );
      const querySnapshot = await getDocs(q);
      let flag = true;
      querySnapshot.forEach((doc) => {
        flag = false;
        setProjectBlogDetails(doc.data());
        quillRef.current.firstChild.innerHTML = doc.data().mainContent;
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      });
      if (flag) {
        navigate("/error/Something Went Wrong ⚠️");
      }
    };
    getBlogData();
  }, [navigate, projectBlogID, quillRef]);

  const updateProjectBlogHandler = () => {
    setText("Updating...");
    if (quill.getText().replace(/\n/g, " ").length === 0) {
      alert("Please write something");
    } else {
      setLoading(true);
      const update = async () => {
        const projectBlogRef = doc(db, "project-blogs", projectBlogID);
        await updateDoc(projectBlogRef, {
          projectBlogDescription: quill
            .getText()
            .replace(/\n/g, " ")
            .substring(0, 1000),
          lastModifiedDate: serverTimestamp(),
          mainContent: quill.root.innerHTML,
        });

        swal("Updated successfully", "", "success");

        setTimeout(() => {
          setLoading(false);
          window.location.reload();
        }, 3000);
      };
      update();
    }
  };

  return (
    <>
      <div className="build-code-editor">
        <div className="build-code-editor-main-grid">
          <div className="blog-title-input-box">
            {projectBlogDetails === null ? null : (
              <>
                {projectBlogDetails.lastModifiedDate === "" ? (
                  <Link to={`/projects/${projectBlogDetails.projectUrlName}`}>
                    <span style={{ fontSize: "1.8rem", color: "blue" }}>
                      {projectBlogDetails.projectName}
                      {"  Project Blog"}
                    </span>{" "}
                  </Link>
                ) : (
                  <h1 className="project-name">
                    <Link to={`/projects/${projectBlogDetails.projectUrlName}`}>
                      <span style={{ fontSize: "1.8rem", color: "blue" }}>
                        {projectBlogDetails.projectName} {"  Project Blog"}
                      </span>{" "}
                    </Link>
                    <small style={{ fontSize: "0.8rem", color: "grey" }}>
                      Last Modified{" "}
                      {timeSince(
                        new Date(
                          projectBlogDetails.lastModifiedDate.seconds * 1000
                        )
                      )}{" "}
                      {" ago"}
                    </small>
                  </h1>
                )}
              </>
            )}
            <button onClick={updateProjectBlogHandler}>Update</button>
          </div>
          <div ref={quillRef} placeholder={placeholder} />
        </div>
      </div>
      <Loading loaded={!loading} text={text} />
    </>
  );
}

export default UpdateProjectBlog;
