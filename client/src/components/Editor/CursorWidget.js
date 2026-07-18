import { useEffect, useRef } from "react";
import "./CursorWidget.css";

const COLORS = [
    "#ff4d4f",
    "#52c41a",
    "#1677ff",
    "#fa8c16",
    "#722ed1",
    "#13c2c2",
    "#eb2f96",
    "#fadb14",
    "#2f54eb",
    "#a0d911"
];

const injectedStyles = new Set();

function sanitizeClassName(name = "") {

    return name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-");

}

function ensureCursorStyle(username, color) {

    const id = sanitizeClassName(username);

    if (injectedStyles.has(id)) return id;

    const style = document.createElement("style");

    style.innerHTML = `
        .cursor-${id}-bar{
            border-left:2px solid ${color};
            margin-left:-1px;
            height:100%;
        }

        .cursor-${id}-label{
            background:${color};
            color:white;
            font-size:11px;
            padding:2px 6px;
            border-radius:4px;
            margin-left:2px;
            white-space:nowrap;
            font-weight:500;
        }
    `;

    document.head.appendChild(style);

    injectedStyles.add(id);

    return id;

}

function getColor(username = "") {

    let hash = 0;

    for (let i = 0; i < username.length; i++) {
        hash =
            username.charCodeAt(i) +
            ((hash << 5) - hash);
    }

    return COLORS[
        Math.abs(hash) % COLORS.length
    ];

}

export default function CursorWidget({

    editorRef,
    remoteCursors,
    activeFile,
    username

}) {

    const decorationsRef = useRef(null);

    useEffect(() => {

        const editor = editorRef.current;

        if (!editor) return;

        if (!window.monaco) return;

        if (!decorationsRef.current) {

            decorationsRef.current =
                editor.createDecorationsCollection();

        }
        const monaco = window.monaco;

        const decorations = [];

        Object.values(remoteCursors).forEach((cursor) => {
            console.log("Cursor:", cursor.username);
            if (!cursor) return;

            if (cursor.username === username) return;

            if (cursor.fileId !== activeFile?.id) return;

            if (
                !Number.isFinite(cursor.line) ||
                !Number.isFinite(cursor.column)
            ) {
                return;
            }

            const color = getColor(cursor.username);

            const classId = ensureCursorStyle(
                cursor.username,
                color
            );

            decorations.push({

                range: new monaco.Range(
                    cursor.line,
                    cursor.column,
                    cursor.line,
                    cursor.column
                ),

                options: {

                    className: "remote-cursor",

                    stickiness:
                        monaco.editor
                            .TrackedRangeStickiness
                            .NeverGrowsWhenTypingAtEdges,

                    before: {

                        content: "",

                        inlineClassName:
                            `cursor-${classId}-bar`

                    },

                    after: {

                        content: ` TEST-${cursor.username}`,

                        inlineClassName:
                            `cursor-${classId}-label`

                    }

                }

            });

        });

        decorationsRef.current.clear();
        decorationsRef.current.set(decorations);
    }, [
        remoteCursors,
        activeFile?.id,
        username
    ]);
    useEffect(() => {

        if (!decorationsRef.current) return;

        return () => {

            decorationsRef.current.clear();

        };

    }, []);

    return null;

}