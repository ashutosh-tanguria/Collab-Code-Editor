import MonacoEditor from "@monaco-editor/react";

const Editor = () => {

    const handleChange = (value) => {
        console.log(value);
    };

    return (
        <MonacoEditor
            height="100vh"
            defaultLanguage="javascript"
            defaultValue="// Start Coding..."
            onChange={handleChange}
        />
    );
};

export default Editor;