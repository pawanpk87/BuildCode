import React from "react";
import SidebarChat from "../SidebarChat/SidebarChat";
import "./Sidebar.css";

function Sidebar({ userData }) {
  return (
    <div className="chat-sidebar">
      <div className="sidebar_header">
        <h4>Rooms</h4>
      </div>
      <div className="sidebar_chats">
        {userData.currentRooms.map(({ name, id }) => (
          <SidebarChat key={id} id={id} name={name} />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
