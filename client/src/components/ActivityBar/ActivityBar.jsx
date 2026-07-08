import "./ActivityBar.css";
import { Files, Users, MessageCircle, Settings } from "lucide-react";

const ActivityBar = () => {
    return (
        <div className="activity-bar">
            <Files size={22} />
            <Users size={22} />
            <MessageCircle size={22} />
            <Settings size={22} />
        </div>
    );
};

export default ActivityBar;