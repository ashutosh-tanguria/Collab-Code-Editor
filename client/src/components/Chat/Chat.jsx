import { useState } from "react";
import "./Chat.css";
import { SendHorizontal } from "lucide-react";

const Chat = ({
    username,
    roomId,
    socket,
    messages,
    setMessages
}) => {
    const [text, setText] = useState("");
    const handleSend = () => {
        if (!text.trim()) return;
        socket.send(
            JSON.stringify({
                type: "CHAT_MESSAGE",
                roomId,
                username,
                message: text
            })
        );
        setText("");
    };

    return (
        <div className="chat">
            <div className="chat-messages">
                {messages.map((msg, index) => {
                    if (msg.system) {
                        return (
                            <div
                                key={index}
                                className="system-message"
                            >
                                {msg.message}
                            </div>
                        );
                    }

                    return (
                        <div
                            key={index}
                            className={
                                msg.username === username
                                    ? "message mine"
                                    : "message"
                            }
                        >
                            <strong>{msg.username}</strong>
                            <p>{msg.message}</p>
                        </div>
                    );
                })}

            </div>
            <div className="chat-input">
                <input
                    value={text}
                    placeholder="Type message..."
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSend();
                        }
                    }}
                />
                <button onClick={handleSend}>
                    <SendHorizontal size={18} />
                </button>
            </div>
        </div>
    );
};

export default Chat;