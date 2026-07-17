import "./Sidebar.css";

import ActivityBar from "../ActivityBar/ActivityBar";
import UserList from "../UserList/UserList";
import Chat from "../Chat/Chat";
import FileTabs from "../FileTabs/FileTabs";
import Settings from "../Settings/Settings";
import Explorer from "../Explorer/Explorer";

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
    setMessages,
    activeFileId,
setActiveFileId
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
        <Explorer
            files={files}
            activeFileId={activeFileId}
            setActiveFileId={setActiveFileId}
        />
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