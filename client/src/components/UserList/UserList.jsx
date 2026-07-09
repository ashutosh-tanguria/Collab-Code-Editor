import "./UserList.css";

const UserList = ({ users }) => {
    return (
        <div className="user-list">
            <h3>Active Users ({users.length})</h3>
            {users.map((user) => (
                <div
                    key={user.username}
                    className="user"
                >
                    🟢 {user.username}
                </div>
            ))}
        </div>
    );
};

export default UserList;