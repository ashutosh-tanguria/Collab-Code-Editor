import "./Explorer.css";
import { FileCode2 } from "lucide-react";

const Explorer = ({
    files,
    activeFileId,
    setActiveFileId
}) => {

    return (
        <div className="explorer">

            <h3>Explorer</h3>

            {files.map((file) => (

                <div
                    key={file.id}
                    className={
                        activeFileId === file.id
                            ? "explorer-item active"
                            : "explorer-item"
                    }
                    onClick={() => setActiveFileId(file.id)}
                >
                    <FileCode2 size={16}/>
                    <span>{file.name}</span>
                </div>

            ))}

        </div>
    );

};

export default Explorer;