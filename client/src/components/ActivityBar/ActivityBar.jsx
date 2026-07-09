import "./ActivityBar.css";
import { Files, Users, MessageCircle, Settings } from "lucide-react";

const ActivityBar = ({
    activePanel,
    setActivePanel
}) => {
    return (
        <div className="activity-bar">
            <div
                className={activePanel === "explorer" ? "icon active" : "icon"}
                onClick={() => setActivePanel("explorer")}
            >
                <Files size={22} />
            </div>
            <div
                className={activePanel === "users" ? "icon active" : "icon"}
                onClick={() => setActivePanel("users")}
            >
                <Users size={22} />
            </div>
            <div
                className={activePanel === "chat" ? "icon active" : "icon"}
                onClick={() => setActivePanel("chat")}
            >
                <MessageCircle size={22} />
            </div>
            <div
                className={activePanel === "settings" ? "icon active" : "icon"}
                onClick={() => setActivePanel("settings")}
            >
                <Settings size={22} />
            </div>
        </div>
    );
};

export default ActivityBar;