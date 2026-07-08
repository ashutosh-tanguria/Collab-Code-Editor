import React from 'react'
import "./RoomHeader.css";

const RoomHeader = () => {
  return (
    <header className="room-header">
        <div className="logo">Collab-Code</div>
        <div className="room-info">Room: abc123</div>
        <div className="copy-btn">Copy Invite</div>
    </header>
  )
}

export default RoomHeader
