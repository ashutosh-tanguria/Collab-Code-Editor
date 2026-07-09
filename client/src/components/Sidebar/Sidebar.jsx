import "./Sidebar.css";

import ActivityBar from "../ActivityBar/ActivityBar";
import UserList from "../UserList/UserList";
import Chat from "../Chat/Chat";
import FileTabs from "../FileTabs/FileTabs";
import Settings from "../Settings/Settings";

const Sidebar = ({
    activePanel,
    setActivePanel,
    users,
    files,
    roomId,
    username,
    setUsername,
    socket,
    messages,
    setMessages
}) => {

    return (
        <aside className="sidebar">
            <ActivityBar
                activePanel={activePanel}
                setActivePanel={setActivePanel}
            />
            <div className="sidebar-content">
                {
                    activePanel === "explorer" && (
                        <div className="explorer-panel">
                            <h3>Explorer</h3>
                            <div className="explorer-item">
                                📁 Project Files
                            </div>
                        </div>
                    )
                }
                {
                    activePanel === "users" &&
                    <UserList users={users} />
                }
                {
                    activePanel === "chat" &&
                    <Chat
                        username={username}
                        roomId={roomId}
                        socket={socket}
                        messages={messages}
                        setMessages={setMessages}
                    />
                }
                {
                    activePanel === "settings" &&
                    (
                        <Settings
                            username={username}
                            setUsername={setUsername}
                            roomId={roomId}
                            socket={socket}
                        />
                    )
                }
            </div>
        </aside>
    );
};

export default Sidebar;