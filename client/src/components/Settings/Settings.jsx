import { useState, useEffect } from "react";
import "./Settings.css";

const Settings = ({
    username,
    setUsername,
    roomId,
    socket
}) => {
    const [tempUsername, setTempUsername] = useState(username);
    useEffect(() => {
        setTempUsername(username);
    }, [username]);
    const handleSave = () => {
        if (!tempUsername.trim()) return;
        localStorage.setItem("username", tempUsername);
        socket.send(
            JSON.stringify({
                type: "USERNAME_CHANGE",
                roomId,
                username: tempUsername
            })
        );
        setUsername(tempUsername);
    };
    return (
        <div className="settings-panel">
            <h3>Settings</h3>
            <label>Username</label>
            <input
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
            />
            <label>Room ID</label>
            <input
                value={roomId}
                readOnly
                disabled
            />
            <button onClick={handleSave}>
                Save Username
            </button>
            <button
                onClick={() => navigator.clipboard.writeText(roomId)}
            >
                Copy Room ID
            </button>
        </div>
    );
};

export default Settings;