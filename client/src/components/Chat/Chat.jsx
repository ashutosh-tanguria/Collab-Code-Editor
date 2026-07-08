import "./Chat.css";

const Chat = () => {
    return (
        <div className="chat">

            <h3>Chat</h3>

            <div className="messages">

            </div>

            <input
                type="text"
                placeholder="Type a message..."
            />

        </div>
    );
};

export default Chat;