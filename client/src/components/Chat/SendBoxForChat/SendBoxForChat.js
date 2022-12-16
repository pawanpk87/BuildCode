import React, { useState } from "react";
import { useQuill } from "react-quilljs";
import "react-quill/dist/quill.snow.css";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import db, { storage } from "../../../firebase/firebase-config";
import { uuidv4 } from "@firebase/util";
import Loading from "../../Loader/Loading/Loading";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import SendIcon from "@mui/icons-material/Send";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import axios from "axios";
import { Messaging } from "react-cssfx-loading";
import { useNavigate } from "react-router-dom";
import "./SendBoxForChat.css";

const buildCodeMailDomain = "https://buildcode-apis.herokuapp.com";
//const buildCodeMailDomain = "http://localhost:3030";

function SendBoxForChat({ roomId, roomDetails, userData, scrollToBottom }) {
  const theme = "snow";
  const [text, setText] = useState("Adding image...");
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toggle, setToggle] = useState(false);
  const navigate = useNavigate();
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
  const placeholder = "Message...";
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
        alert("Error occured during uploading file");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((url) => {
            const range = quill.getSelection();
            quill.insertEmbed(range.index, "image", url);

            setLoading(false);
          })
          .catch((error) => {
            alert("error during uploading!!!");
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

  const sendMailToAllTeamMembers = async (message) => {
    let senderMessage = message;
    const senderName = userData.userName;
    const senderEmail = userData.email;
    const teamMembers = roomDetails.teamMembers;
    const subject = "Someone have sent message in Room!!!";
    let requestedProjectName = roomDetails.projectName;
    let requestedprojectUniqueID = roomDetails.project;
    const body = {
      senderMessage,
      senderEmail,
      roomId,
      senderName,
      teamMembers,
      requestedProjectName,
      requestedprojectUniqueID,
      subject,
    };
    await axios
      .post(`${buildCodeMailDomain}/buildcode/send-mail-to`, body, {
        headers: {
          "Content-type": "application/json",
        },
      })
      .then((res) => {})
      .catch((error) => {
        if (error.message === "Quota exceeded.") {
          navigate("/server/server-down");
        } else {
          //navigate("/error/Something Went Wrong ⚠️");
        }

        //navigate("/error");
      });
  };

  const sendMessage = () => {
    if (roomId === "BuildCode-chat-room33d3311e-a5fd-4569-8ae9-e9a4503e3801") {
      if (userData.urlName !== "codebuildorg") {
        alert("only admins can send messages in this room");
        return;
      }
    }
    if (quill.getText().replace(/\n/g, " ").trim().length > 0) {
      if (quill.root.innerHTML.length > 100000) {
        alert("Message is too large!");
      } else {
        setText("Sending Message...");
        let tempMessage =
          quill.getText().replace(/\n/g, " ").substring(0, 100) + " ...";
        let userMessage = quill.root.innerHTML;
        quill.root.innerHTML = "";
        const sendMessageToDB = async () => {
          setIsSending(true);
          const messagesRef = collection(db, "rooms", roomId, "messages");
          await setDoc(doc(messagesRef), {
            description: quill.getText().replace(/\n/g, " ").substring(0, 20),
            message: userMessage,
            name: userData.userName,
            messageNameId: userData.urlName,
            timestamp: serverTimestamp(),
            type: "users",
          })
            .then(() => {
              setTimeout(() => {
                scrollToBottom();
              }, 200);
              setIsSending(false);
              sendMailToAllTeamMembers(tempMessage);
            })
            .catch((error) => {
              if (error.message === "Quota exceeded.") {
                navigate("/server/server-down");
              } else {
                navigate("/error/Something Went Wrong ⚠️");
              }
            });
        };
        sendMessageToDB();
      }
    }
  };

  return (
    <>
      {isSending === true ? (
        <Messaging color={"blue"} height={"15px"} width={"15px"} />
      ) : null}

      <div
        className={
          toggle === false ? "chat_footer" : "chat_footer expand-editor"
        }
      >
        <div className="send-box-chat-editor">
          <div
            className={
              toggle === false
                ? "send-box-chat-editor-main"
                : "send-box-chat-editor-main expand-main-editor"
            }
          >
            <div ref={quillRef} placeholder={placeholder} />
          </div>
          <div>
            <div>
              <SendIcon
                style={{
                  width: "38px",
                  height: "33px",
                  color: "blue",
                  cursor: "pointer",
                }}
                onClick={sendMessage}
              ></SendIcon>
            </div>
          </div>
          <div>
            {toggle === false ? (
              <ExpandLessIcon
                style={{
                  width: "38px",
                  height: "33px",
                  color: "grey",
                  cursor: "pointer",
                }}
                onClick={() => setToggle(!toggle)}
              ></ExpandLessIcon>
            ) : (
              <ExpandMoreIcon
                style={{
                  width: "38px",
                  height: "33px",
                  color: "grey",
                  cursor: "pointer",
                }}
                onClick={() => setToggle(!toggle)}
              ></ExpandMoreIcon>
            )}
          </div>
        </div>
      </div>

      <Loading loaded={!loading} text={text} />
    </>
  );
}

export default SendBoxForChat;
