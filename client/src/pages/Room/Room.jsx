import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "./Room.css";

import Editor from "../../components/Editor/Editor";
import RoomHeader from "../../components/RoomHeader/RoomHeader";
import Sidebar from "../../components/Sidebar/Sidebar";
import FileTabs from "../../components/FileTabs/FileTabs";

const Room = () => {

    const { roomId } = useParams();

    const [activePanel, setActivePanel] = useState("explorer");

    const [username, setUsername] = useState(
        localStorage.getItem("username") || "Guest"
    );

    const isRemoteUpdate = useRef(false);

    const [files, setFiles] = useState([
        {
            id: crypto.randomUUID(),
            name: "main.js",
            language: "javascript",
            dirty: false,
            code: "// Start Coding..."
        }
    ]);

    const [users, setUsers] = useState([]);
    const [activeFileId, setActiveFileId] = useState(null);
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [remoteCursors, setRemoteCursors] = useState({});

    useEffect(() => {

        const ws = new WebSocket(import.meta.env.VITE_WS_URL);

        setSocket(ws);

        ws.addEventListener("open", () => {

            console.log("Connected to Server");

            ws.send(
                JSON.stringify({
                    type: "JOIN_ROOM",
                    roomId,
                    files,
                    username
                })
            );

        });

        ws.addEventListener("message", (event) => {

            const data = JSON.parse(event.data);

            switch (data.type) {

                case "CURSOR_MOVE":

                    console.log("REMOTE:", data);

                    setRemoteCursors((prev) => ({
                        ...prev,
                        [data.username]: data
                    }));

                    break;

                case "CURSOR_REMOVE":

                    setRemoteCursors((prev) => {
                        const updated = { ...prev };
                        delete updated[data.username];
                        return updated;
                    });
                    break;

                case "SYSTEM_MESSAGE":

                    setMessages((prev) => [
                        ...prev,
                        {
                            system: true,
                            message: data.message
                        }
                    ]);

                    break;

                case "CHAT_MESSAGE":

                    setMessages((prev) => [
                        ...prev,
                        data.chat
                    ]);

                    break;

                case "USERS_UPDATE":

                    setUsers(data.users);

                    break;

                case "INITIAL_FILES":

                    setFiles(data.files);

                    if (data.files.length > 0) {
                        setActiveFileId(data.files[0].id);
                    }

                    break;

                case "ADD_FILE":

                    setFiles((prevFiles) => [
                        ...prevFiles,
                        data.file
                    ]);

                    break;

                case "RENAME_FILE":

                    setFiles((prevFiles) =>
                        prevFiles.map((file) =>
                            file.id === data.fileId
                                ? {
                                    ...file,
                                    name: data.newName
                                }
                                : file
                        )
                    );

                    break;

                case "UPDATE_FILE_LANGUAGE":

                    setFiles((prevFiles) =>
                        prevFiles.map((file) =>
                            file.id === data.file.id
                                ? data.file
                                : file
                        )
                    );

                    break;

                case "DELETE_FILE":

                    setFiles((prevFiles) => {

                        const updatedFiles = prevFiles.filter(
                            (file) => file.id !== data.fileId
                        );

                        if (
                            activeFileId === data.fileId &&
                            updatedFiles.length > 0
                        ) {
                            setActiveFileId(updatedFiles[0].id);
                        }

                        return updatedFiles;

                    });

                    break;

                case "CODE_CHANGE":

                    if (data.fileId === activeFileId) {
                        isRemoteUpdate.current = true;
                    }

                    setFiles((prevFiles) =>
                        prevFiles.map((file) =>
                            file.id === data.fileId
                                ? {
                                    ...file,
                                    code: data.code
                                }
                                : file
                        )
                    );

                    break;

                default:
                    break;

            }

        });

        ws.addEventListener("error", (err) => {
            console.log("Socket Error:", err);
        });

        ws.addEventListener("close", () => {
            console.log("Socket Closed");
        });

        return () => {
            setRemoteCursors({});
            ws.close();
        };

    }, []);

    useEffect(() => {

        if (files.length > 0 && activeFileId === null) {

            setActiveFileId(files[0].id);

        }

    }, [files, activeFileId]);

    const activeFile = files.find(
        (file) => file.id === activeFileId
    );

    return (
        <>
            <RoomHeader roomId={roomId} />

            <main className="app-layout">

                <Sidebar
                    activePanel={activePanel}
                    setActivePanel={setActivePanel}
                    users={users}
                    files={files}
                    roomId={roomId}
                    username={username}
                    setUsername={setUsername}
                    socket={socket}
                    messages={messages}
                    setMessages={setMessages}
                    activeFileId={activeFileId}
                    setActiveFileId={setActiveFileId}
                />

                <div className="editor-section">

                    <FileTabs
                        roomId={roomId}
                        socket={socket}
                        files={files}
                        activeFileId={activeFileId}
                        setActiveFileId={setActiveFileId}
                        setFiles={setFiles}
                    />

                    <Editor
                        roomId={roomId}
                        socket={socket}
                        username={username}
                        activeFile={activeFile}
                        files={files}
                        setFiles={setFiles}
                        isRemoteUpdate={isRemoteUpdate}
                        remoteCursors={remoteCursors}
                    />

                </div>

            </main>
        </>
    );

};

export default Room;