import "./FileTabs.css";
import { useState } from "react";

const FileTabs = ({
    roomId,
    socket,
    files,
    activeFileId,
    setActiveFileId,
    setFiles
}) => {
    const [editingFileId, setEditingFileId] = useState(null);
    const [tempName, setTempName] = useState("");
    const handleAddFile = () => {

        const newFile = {
            id: crypto.randomUUID(),
            name: `file${files.length + 1}.js`,
            code: ""
        };
        setFiles([
            ...files,
            newFile
        ]);
        socket.send(
            JSON.stringify({
                type: "ADD_FILE",
                roomId: roomId,
                file: newFile
            })
        );
        setActiveFileId(newFile.id);
    };
    const handleDeleteFile = (fileId) => {

        const updatedFiles = files.filter(
            (file) => file.id !== fileId
        );

        setFiles(updatedFiles);

        if (activeFileId === fileId && updatedFiles.length > 0) {
            setActiveFileId(updatedFiles[0].id);
        }

        socket.send(
            JSON.stringify({
                type: "DELETE_FILE",
                roomId,
                fileId
            })
        );

    };
    return (
        <div className="file-tabs">

            {files.map((file) => (
                <div
                    key={file.id}
                    className={`tab ${activeFileId === file.id ? "active" : ""}`}
                    onClick={() => setActiveFileId(file.id)}
                    onDoubleClick={() => {
                        setEditingFileId(file.id);
                        setTempName(file.name);
                    }}
                >
                    {
                        editingFileId === file.id ? (
                            <input
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        setFiles(
                                            files.map((f) => {
                                                if (f.id === file.id) {
                                                    return {
                                                        ...f,
                                                        name: tempName
                                                    };
                                                }
                                                return f;
                                            })
                                        );
                                        socket.send(
                                            JSON.stringify({
                                                type: "RENAME_FILE",
                                                roomId,
                                                fileId: file.id,
                                                newName: tempName
                                            })
                                        );
                                        setEditingFileId(null);
                                    }
                                }}
                                onBlur={() => {
                                    setEditingFileId(null);
                                }}
                            />
                        ) : (
                            <div className="tab-content">

                                <span>{file.name}</span>

                                {file.name !== "main.js" && (
                                    <button
                                        className="delete-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteFile(file.id);
                                        }}
                                    >
                                        ×
                                    </button>
                                )}

                            </div>
                        )
                    }
                </div>
            ))
            }
            {files.length < 3 && (
                <div
                    className="tab add-tab"
                    onClick={handleAddFile}
                >
                    +
                </div>
            )}
        </div>
    );
};

export default FileTabs;