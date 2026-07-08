import React, { useEffect, useRef, useState } from "react";
import "./App.css";

import Editor from "./components/Editor/Editor";
import RoomHeader from "./components/RoomHeader/RoomHeader";
import Sidebar from "./components/Sidebar/Sidebar";
import FileTabs from "./components/FileTabs/FileTabs";

const App = () => {
    const isRemoteUpdate = useRef(false);

    const [files, setFiles] = useState([
        {
            id: crypto.randomUUID(),
            name: "main.js",
            code: "// Start Coding..."
        }
    ]);

    const [activeFileId, setActiveFileId] = useState(null);
    const [socket, setSocket] = useState(null);
    const [roomId] = useState(() => crypto.randomUUID().slice(0, 6).toUpperCase());

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8000");

        setSocket(ws);

        ws.addEventListener("open", () => {
            console.log("Connected to Server");

            ws.send(
                JSON.stringify({
                    type: "JOIN_ROOM",
                    roomId: roomId
                })
            );
        });

        ws.addEventListener("message", (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "ADD_FILE") {
                setFiles((prevFiles) => [...prevFiles, data.file]);
            }

            if (data.type === "CODE_CHANGE") {
                isRemoteUpdate.current = true;

                setFiles((prevFiles) =>
                    prevFiles.map((file) =>
                        file.id === data.fileId
                            ? { ...file, code: data.code }
                            : file
                    )
                );
            }

            if (data.type === "INITIAL_FILES") {
                setFiles(data.files);

                if (data.files.length > 0) {
                    setActiveFileId(data.files[0].id);
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
            <RoomHeader />

            <main className="app-layout">
                <Sidebar />

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

export default App;