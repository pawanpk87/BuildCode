import React from "react";
import { collection } from "firebase/firestore";
import db from "../../firebase/firebase-config";
import { Link } from "react-router-dom";
import { onSnapshot, query, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import FullPageLoader from "../Loader/FullPageLoader/FullPageLoader";
import { getBuildCodePic } from "../../Util/Utils";
import "./SidebarChat.css";

function SidebarChat({ name, id }) {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [roomIcon, setRoomIcon] = useState();

  useEffect(() => {
    setRoomIcon(getBuildCodePic(name[0].toUpperCase()));
    const getAllData = async () => {
      const q = query(
        collection(db, "rooms", id, "messages"),
        orderBy("timestamp", "desc")
      );
      onSnapshot(q, (snapshot) => {
        const tempMessages = [];
        snapshot.forEach((doc) => {
          tempMessages.push(doc.data());
        });
        setMessages(tempMessages);
      });
    };
    getAllData();
  }, [id, name]);

  useEffect(() => {
    if (messages !== null) {
      setLoading(false);
    }
  }, [messages]);

  return loading === true ? (
    <FullPageLoader
      type={"bars"}
      color={"blue"}
      height={"200px"}
      width={"200px"}
    />
  ) : (
    <Link to={`/rooms/${id}`}>
      <div className="sidebarChat">
        <img
          src={
            name === "BuildCode"
              ? "https://firebasestorage.googleapis.com/v0/b/buildcode-db.appspot.com/o/BuildCode%2Fbuild-code-icon.svg?alt=media&token=fdabe2ee-70aa-4b49-ac1f-38ab714ccb30"
              : roomIcon
          }
          alt="Room Icon"
        />
        <div className="sidebarChat_info">
          <h2>{name}</h2>
          <p className="user-last-message">
            <span> {messages[0]?.description}</span>
          </p>
        </div>
      </div>
    </Link>
  );
}

export default SidebarChat;
