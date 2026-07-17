import MonacoEditor from "@monaco-editor/react";
import "./Editor.css";
import CursorManager from "./CursorWidget";
import { useRef, useEffect } from "react";

const Editor = ({
    roomId,
    socket,
    username,
    activeFile,
    files,
    setFiles,
    isRemoteUpdate,
    remoteCursors
}) => {

    const editorRef = useRef(null);

    const downloadFile = () => {

        if (!activeFile) return;

        const blob = new Blob(
            [activeFile.code],
            {
                type: "text/plain"
            }
        );

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;
        a.download = activeFile.name;

        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);

        URL.revokeObjectURL(url);

    };

    // Download event from RoomHeader
    useEffect(() => {

        const handleDownload = () => {
            downloadFile();
        };

        window.addEventListener(
            "download-file",
            handleDownload
        );

        return () => {

            window.removeEventListener(
                "download-file",
                handleDownload
            );

        };

    }, [activeFile]);

    // Prevent browser Save Page
    useEffect(() => {

        const preventSave = (e) => {

            if (e.ctrlKey && e.key.toLowerCase() === "s") {

                e.preventDefault();
                downloadFile();

            }

        };

        window.addEventListener("keydown", preventSave);

        return () => {

            window.removeEventListener("keydown", preventSave);

        };

    }, [activeFile]);

    const handleChange = (value) => {

        if (!activeFile) return;

        if (isRemoteUpdate.current) {
            isRemoteUpdate.current = false;
            return;
        }

        setFiles(
            files.map(file =>
                file.id === activeFile.id
                    ? {
                        ...file,
                        code: value
                    }
                    : file
            )
        );

        socket?.send(
            JSON.stringify({
                type: "CODE_CHANGE",
                roomId,
                fileId: activeFile.id,
                code: value
            })
        );

    };

    const handleEditorDidMount = (editor, monaco) => {

        editorRef.current = editor;

        editor.onDidChangeCursorPosition((event) => {

            if (!socket || !activeFile) return;

            socket.send(
                JSON.stringify({
                    type: "CURSOR_MOVE",
                    roomId,
                    username,
                    fileId: activeFile.id,
                    line: event.position.lineNumber,
                    column: event.position.column
                })
            );

        });

        editor.addCommand(

            monaco.KeyMod.CtrlCmd |
            monaco.KeyCode.KeyS,

            () => {

                downloadFile();

            }

        );

    };

    return (
        <div className="editor-container">

            <CursorManager
                editorRef={editorRef}
                remoteCursors={remoteCursors}
                activeFile={activeFile}
                username={username}
            />

            <MonacoEditor
                theme="vs-dark"
                language={activeFile?.language || "javascript"}
                value={activeFile?.code || ""}
                onChange={handleChange}
                onMount={handleEditorDidMount}
                height="100%"
                options={{
                    minimap: {
                        enabled: false
                    },
                    fontSize: 15,
                    automaticLayout: true
                }}
            />

        </div>
    );

};

export default Editor;