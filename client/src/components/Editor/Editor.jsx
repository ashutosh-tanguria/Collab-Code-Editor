import MonacoEditor from "@monaco-editor/react";
import { useState } from "react";
import "./Editor.css";

const Editor = ({
    socket, roomId, activeFile, files, setFiles, isRemoteUpdate}) => {
    const handleChange = (value) => {
        if (isRemoteUpdate.current) {
        isRemoteUpdate.current = false;
        return;
    }
    setFiles(
    files.map((file) => {
        if (file.id === activeFile.id) {
            return {
                ...file,
                code: value
            };
        }
        return file;
    })
);
    socket.send(
    JSON.stringify({
        type: "CODE_CHANGE",
        roomId: roomId,
        fileId: activeFile.id,
        code: value
    })
);
};

    return (
        <div className="editor-container">
        <MonacoEditor
        theme="vs-dark"
        height="100%"
        defaultLanguage="javascript"
        value={activeFile?.code || ""}
        onChange={handleChange}
        />
        </div>
    );
};

export default Editor;