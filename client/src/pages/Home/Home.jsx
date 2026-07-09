import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Home.css";

const Home = () => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState("");
    const [username, setUsername] = useState(
        localStorage.getItem("username") || ""
    );
    const handleCreateRoom = () => {
        const newRoomId = crypto.randomUUID().slice(0, 6).toUpperCase();
        if (!username.trim()) return;

        localStorage.setItem("username", username);
        navigate(`/room/${newRoomId}`);
    };
    const handleJoinRoom = () => {
        if (!roomId.trim()) return;
        if (!username.trim()) return;

        localStorage.setItem("username", username);
        navigate(`/room/${roomId.trim().toUpperCase()}`);
    };
    return (
        <div className="home-container">
            <h1>Collab Code Editor</h1>
            <input
                type="text"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="text"
                placeholder="Enter Room ID"
                value={roomId}
                onChange={(e) =>
                    setRoomId(e.target.value.toUpperCase())
                }
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleJoinRoom();
                    }
                }}
            />
            <button onClick={handleJoinRoom}>
                Join Room
            </button>
            <button onClick={handleCreateRoom}>
                Create Room
            </button>
        </div>
    );
};

export default Home;