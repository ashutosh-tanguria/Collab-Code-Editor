import { useEffect, useRef } from "react";

export default function CursorManager({
    editorRef,
    remoteCursors,
    activeFile,
    username
}) {

    const widgetsRef = useRef({});

    useEffect(() => {

        const editor = editorRef.current;

        if (!editor) return;

        const existing = widgetsRef.current;

        Object.values(existing).forEach(widget => {
            editor.removeContentWidget(widget);
        });

        widgetsRef.current = {};

        Object.values(remoteCursors).forEach(cursor => {

            if (cursor.username === username) return;
            if (cursor.fileId !== activeFile?.id) return;

            const node = document.createElement("div");

            node.className = "remote-cursor-widget";

            node.innerHTML = `
                <div class="remote-label">
                    ${cursor.username}
                </div>
                <div class="remote-line"></div>
            `;

            const widget = {

                getId() {
                    return `cursor-${cursor.username}`;
                },

                getDomNode() {
                    return node;
                },

                getPosition() {
                    return {
                        position: {
                            lineNumber: cursor.line,
                            column: cursor.column
                        },
                        preference: [
                            window.monaco.editor.ContentWidgetPositionPreference.EXACT
                        ]
                    };
                }

            };

            widgetsRef.current[cursor.username] = widget;

            editor.addContentWidget(widget);

        });

    }, [remoteCursors, activeFile]);

    return null;

}