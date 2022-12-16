import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Member from "../Member/Member";
import SendBoxForChat from "./SendBoxForChat/SendBoxForChat";

function ChatMessages({
  roomId,
  roomDetails,
  messages,
  userData,
  userUniqueId,
}) {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const topRef = useRef(null);

  useEffect(() => {
    let flag = false;

    roomDetails.teamMembers.map(({ id }) => {
      if (id === userUniqueId) {
        flag = true;
      }
    });

    if (process.env.REACT_APP_BUILDCODE_ADMIN_ID === userUniqueId) flag = true;

    if (roomId === "BuildCode-chat-room33d3311e-a5fd-4569-8ae9-e9a4503e3801")
      flag = true;

    if (flag === false) {
      navigate(
        "/error/You do not have sufficient access to this Room.\nPlease mail at contact@buildcode.org if you are a team member and can not access this Room."
      );
    }
  }, [userUniqueId]);

  useEffect(() => {
    setTimeout(() => {
      scrollToBottom();
    }, 500);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="chat_body">
        <div ref={topRef} />
        <div id="move-top-btn">
          <button onClick={scrollToBottom}>
            <i className="las la-arrow-down"></i>
          </button>
        </div>
        <br />
        <br />
        <div className="chat-body-team-details">
          <div className="chat-body-project-details">
            <h6>
              <Link to={`/projects/${roomDetails.project}`}>
                {roomDetails.projectName}
              </Link>
            </h6>
          </div>
          <h5>Team members</h5>
          <div className="team">
            {roomDetails.teamMembers.map(({ id, email, name }, index) => (
              <Member
                key={id}
                id={id}
                requestedBy={roomDetails.teamLeaderDetails[1]}
              />
            ))}
          </div>
        </div>
        <br />
        <br />
        <>
          {messages.map((message) => (
            <div className="chat_message_main_body">
              <div
                className={
                  roomId ===
                  "BuildCode-chat-room33d3311e-a5fd-4569-8ae9-e9a4503e3801"
                    ? "admin-message"
                    : message.messageNameId === userData.urlName
                    ? "chat_message"
                    : "chat_reciever"
                }
              >
                <span className="chat_name">{message.name}</span>
                <div
                  className="view-article-main-content"
                  dangerouslySetInnerHTML={{
                    __html: message.message,
                  }}
                />
                <span className="chat_timestamp">
                  {new Date(message.timestamp?.toDate()).toDateString()}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </>
        <div id="move-top-btn">
          <button onClick={scrollToTop}>
            <i className="las la-arrow-up"></i>
          </button>
        </div>
      </div>
      <SendBoxForChat
        roomId={roomId}
        roomDetails={roomDetails}
        userData={userData}
        scrollToBottom={scrollToBottom}
      />
    </>
  );
}

export default ChatMessages;
