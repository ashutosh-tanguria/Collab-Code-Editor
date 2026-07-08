import "./Sidebar.css";
import ActivityBar from "../ActivityBar/ActivityBar";
import UserList from "../UserList/UserList";
import Chat from "../Chat/Chat";

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <ActivityBar />
            <div className="sidebar-content">
                <UserList />
                <Chat />
            </div>
        </aside>
    );
};

export default Sidebar;