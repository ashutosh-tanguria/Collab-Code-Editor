import MonacoEditor from "@monaco-editor/react";
import "./Editor.css";
import CursorWidget from "./CursorWidget";
import { useRef, useEffect, useCallback } from "react";

const Editor = ({
    roomId,
    socket,
    username,
    activeFile,
    // files,
    setFiles,
    isRemoteUpdate,
    remoteCursors
}) => {

    const editorRef = useRef(null);
    const cursorListenerRef = useRef(null);

    // Latest values (avoids stale closures)
    const socketRef = useRef(socket);
    const roomIdRef = useRef(roomId);
    const usernameRef = useRef(username);
    const activeFileRef = useRef(activeFile);

    useEffect(() => {
        socketRef.current = socket;
    }, [socket]);

    useEffect(() => {
        roomIdRef.current = roomId;
    }, [roomId]);

    useEffect(() => {
        usernameRef.current = username;
    }, [username]);

    useEffect(() => {
        activeFileRef.current = activeFile;
    }, [activeFile]);

    useEffect(() => {
        return () => {
            if (cursorListenerRef.current) {
                cursorListenerRef.current.dispose();
            }
        };
    }, []);

    const downloadFile = useCallback(() => {

        if (!activeFileRef.current) return;

        const blob = new Blob(
            [activeFileRef.current.code],
            {
                type: "text/plain"
            }
        );

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;
        a.download = activeFileRef.current.name;

        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);

        URL.revokeObjectURL(url);

    }, []);

    // Download from RoomHeader
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

    }, [downloadFile]);

    // Ctrl + S
    useEffect(() => {

        const preventSave = (e) => {

            if (
                e.ctrlKey &&
                e.key.toLowerCase() === "s"
            ) {

                e.preventDefault();
                downloadFile();

            }

        };

        window.addEventListener(
            "keydown",
            preventSave
        );

        return () => {

            window.removeEventListener(
                "keydown",
                preventSave
            );

        };

    }, [downloadFile]);
    const handleChange = (value) => {

        const file = activeFileRef.current;

        if (!file) return;

        if (isRemoteUpdate.current) {
            isRemoteUpdate.current = false;
            return;
        }

        setFiles((prevFiles) =>
            prevFiles.map((f) =>
                f.id === file.id
                    ? {
                        ...f,
                        code: value
                    }
                    : f
            )
        );

        const ws = socketRef.current;

        if (!ws || ws.readyState !== WebSocket.OPEN) return;

        ws.send(
            JSON.stringify({
                type: "CODE_CHANGE",
                roomId: roomIdRef.current,
                fileId: file.id,
                code: value
            })
        );

    };

    const handleEditorDidMount = (editor, monaco) => {

        editorRef.current = editor;
        window.monaco = monaco;

        if (cursorListenerRef.current) {
            cursorListenerRef.current.dispose();
        }

        let lastLine = -1;
        let lastColumn = -1;

        cursorListenerRef.current =
            editor.onDidChangeCursorPosition(({ position }) => {

                const ws = socketRef.current;
                const file = activeFileRef.current;

                if (!ws) return;
                if (!file) return;
                if (ws.readyState !== WebSocket.OPEN) return;

                const line = position.lineNumber;
                const column = position.column;

                if (
                    line === lastLine &&
                    column === lastColumn
                ) {
                    return;
                }

                lastLine = line;
                lastColumn = column;

                ws.send(
                    JSON.stringify({
                        type: "CURSOR_MOVE",
                        roomId: roomIdRef.current,
                        username: usernameRef.current,
                        fileId: file.id,
                        line,
                        column
                    })
                );

            });

        editor.addCommand(
            monaco.KeyMod.CtrlCmd |
            monaco.KeyCode.KeyS,
            () => downloadFile()
        );

    };
    useEffect(() => {

        if (!editorRef.current || !activeFile) return;

        const position = editorRef.current.getPosition();

        if (position) {

            editorRef.current.setPosition(position);
            editorRef.current.revealPositionInCenter(position);

        }

    }, [activeFile]);

    useEffect(() => {

        if (!editorRef.current) return;

        editorRef.current.focus();

    }, [activeFile?.id]);

    return (

        <div className="editor-container">

            <CursorWidget
                editorRef={editorRef}
                remoteCursors={remoteCursors}
                activeFile={activeFile}
                username={username}
            />
            <MonacoEditor
                // key={activeFile?.id}
                path={activeFile?.id}
                theme="vs-dark"
                language={activeFile?.language || "javascript"}
                value={activeFile?.code || ""}
                onChange={handleChange}
                onMount={handleEditorDidMount}
                onValidate={() => {

                    if (!editorRef.current) return;

                    editorRef.current.focus();

                }}
                height="100%"
                options={{
                    minimap: {
                        enabled: false
                    },
                    fontSize: 15,
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    cursorBlinking: "smooth",
                    cursorSmoothCaretAnimation: "on",
                    smoothScrolling: true
                }}
            />

        </div>

    );

};

export default Editor;