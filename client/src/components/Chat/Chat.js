import {
  doc,
  onSnapshot,
  collection,
  query,
  orderBy,
  getDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import db from "../../firebase/firebase-config";
import FullPageLoader from "../Loader/FullPageLoader/FullPageLoader";
import ChatMessages from "./ChatMessages";
import "./Chat.css";

function Chat({ userData, userUniqueId }) {
  const [loading, setLoading] = useState(true);
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [roomDetails, setRoomDetails] = useState(null);
  const navigate = useNavigate();
  const [roomPic, setRoomPic] = useState("");

  useEffect(() => {
    let start = new Date();
    let end = new Date();
    end.setDate(start.getDate() - 30);
    const q = query(
      collection(db, "rooms", roomId, "messages"),
      where("timestamp", ">", end),
      orderBy("timestamp", "asc")
    );
    onSnapshot(q, (snapshot) => {
      const tempMessages = [];
      snapshot.forEach((doc) => {
        tempMessages.push(doc.data());
      });
      setMessages(tempMessages);
    });
  }, [roomId]);

  useEffect(() => {
    const getData = async () => {
      let roomsRef = doc(db, "rooms", roomId);
      await getDoc(roomsRef)
        .then((docSnap) => {
          setRoomPic(docSnap.data().roomPic);
          setRoomDetails(docSnap.data());
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        })
        .catch((error) => {
          setTimeout(() => {
            if (error.message === "Quota exceeded.") {
              navigate("/server/server-down");
            } else {
              navigate("/error/Something Went Wrong ⚠️");
            }
          }, 1000);
        });
    };
    getData();
  }, [roomId, navigate]);

  return loading === true ? (
    <div className="room-chat">
      <FullPageLoader color={"blue"} height={"50px"} width={"50px"} />
    </div>
  ) : (
    <div className="room-chat">
      <div className="chat_header">
        <img src={roomPic} alt="Room Icon" />
        <div className="chat_headerInfo">
          <h5>
            <Link to={`/projects/${roomDetails.project}`}>
              {roomDetails.name}
            </Link>
          </h5>
          <p>
            Project started on{" "}
            <span style={{ color: "blue" }}>
              {new Date(roomDetails.createdOn.toDate()).toDateString()}
            </span>
          </p>
        </div>
      </div>
      <ChatMessages
        roomId={roomId}
        roomDetails={roomDetails}
        messages={messages}
        userData={userData}
        userUniqueId={userUniqueId}
      />
    </div>
  );
}

export default Chat;
