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
            code: "// Start Coding..."
        }
    ]);

    const [users, setUsers] = useState([]);
    const [activeFileId, setActiveFileId] = useState(null);
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    useEffect(() => {

        const ws = new WebSocket("ws://localhost:8000");
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
            if (data.type === "SYSTEM_MESSAGE") {
                setMessages((prev) => [
                    ...prev,
                    {
                        system: true,
                        message: data.message
                    }
                ]);
            }
            if (data.type === "CHAT_MESSAGE") {
                setMessages((prev) => [
                    ...prev,
                    data.chat
                ]);
            }
         
            if (data.type === "CHAT_MESSAGE") {
                setMessages((prev) => [
                    ...prev,
                    data.chat
                ]);
            }
            if (data.type === "USERS_UPDATE") {
                setUsers(data.users);
            }

          
            if (data.type === "INITIAL_FILES") {
                setFiles(data.files);

                if (data.files.length > 0) {
                    setActiveFileId(data.files[0].id);
                }
            }

           
            if (data.type === "ADD_FILE") {
                setFiles((prevFiles) => [
                    ...prevFiles,
                    data.file
                ]);
            }

            if (data.type === "RENAME_FILE") {
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
            }

           

            if (data.type === "DELETE_FILE") {
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
            }

           

            if (data.type === "CODE_CHANGE") {
                isRemoteUpdate.current = true;
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
            }
           

            if (data.type === "CHAT_MESSAGE") {

                const chat = {
                    username: data.username,
                    message: data.message,
                    time: Date.now()
                };

                for (const client of rooms[data.roomId].users) {
                    client.send(
                        JSON.stringify({
                            type: "CHAT_MESSAGE",
                            chat
                        })
                    );
                }
            }
        });

        ws.addEventListener("error", (err) => {
            console.log("Socket Error:", err);
        });

        ws.addEventListener("close", () => {
            console.log("Socket Closed");
        });

        return () => {
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
                        activeFile={activeFile}
                        files={files}
                        setFiles={setFiles}
                        isRemoteUpdate={isRemoteUpdate}
                    />

                </div>

            </main>
        </>
    );
};

export default Room;