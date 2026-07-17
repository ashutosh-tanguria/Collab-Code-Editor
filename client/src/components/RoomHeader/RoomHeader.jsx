import React, { useState } from "react";
import "./RoomHeader.css";

const RoomHeader = ({ roomId }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    const inviteLink = `${window.location.origin}/room/${roomId}`;
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);

  };

  return (
    <header className="room-header">
      <div className="logo">Collab-Code</div>
      <div className="room-info">Room: {roomId}</div>
      <button
        className="copy-btn"
        onClick={handleCopy}
      >
        {copied ? "Copied!" : "Copy Invite"}
      </button>
      <button
    className="copy-btn"
    onClick={() => {
        window.dispatchEvent(
            new Event("download-file")
        );
    }}
>
    Download
</button>
    </header>
  );
};

export default RoomHeader;