const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { WebSocketServer } = require("ws");
const rooms = require("./rooms");
const app = express();
app.use(cors());
app.use(express.json());
const server = app.listen(8000, () => {
    console.log("Server Started on 8000");
});
const wss = new WebSocketServer({
    server
});
console.log("WebSocket + Express Started");

wss.on("connection", (socket) => {
    console.log("Client Connected");
    socket.on("message", (message) => {
        const data = JSON.parse(message.toString());
        console.log("Message from Client:", data);

        if (data.type === "JOIN_ROOM") {

            if (!rooms[data.roomId]) {
                rooms[data.roomId] = {
                    users: [],
                    files: data.files
                };
            }

            rooms[data.roomId].users.push(socket);
            socket.roomId = data.roomId;
            socket.username = data.username;
            for (const client of rooms[data.roomId].users) {
                client.send(
                    JSON.stringify({
                        type: "SYSTEM_MESSAGE",
                        message: `${data.username} joined the room`
                    })
                );
            }

            socket.send(
                JSON.stringify({
                    type: "INITIAL_FILES",
                    files: rooms[data.roomId].files
                })
            );
            const users = rooms[data.roomId].users.map((user) => ({
                username: user.username
            }));
            for (const client of rooms[data.roomId].users) {
                client.send(
                    JSON.stringify({
                        type: "USERS_UPDATE",
                        users
                    })
                );
            }
            console.log(rooms);
            console.log(rooms[data.roomId].users.length);
        }

        if (data.type === "CODE_CHANGE") {
            rooms[data.roomId].files =
                rooms[data.roomId].files.map((file) => {
                    if (file.id === data.fileId) {
                        return {
                            ...file,
                            code: data.code
                        };
                    }
                    return file;
                });
            for (const client of rooms[data.roomId].users) {
                if (client !== socket) {
                    client.send(
                        JSON.stringify({
                            type: "CODE_CHANGE",
                            fileId: data.fileId,
                            code: data.code
                        })
                    );
                }
            }
        }
        if (data.type === "CURSOR_MOVE") {
            console.log("Broadcasting Cursor", data);
            const room = rooms[data.roomId];
            if (!room) return;
            for (const client of room.users) {
                if (client !== socket) {
                    client.send(
                        JSON.stringify({
                            type: "CURSOR_MOVE",
                           username: socket.username,
                            fileId: data.fileId,
                            line: data.line,
                            column: data.column
                        })
                    );
                }
            }
        }
        if (data.type === "ADD_FILE") {
            rooms[data.roomId].files.push(data.file);
            for (const client of rooms[data.roomId].users) {
                if (client !== socket) {
                    client.send(
                        JSON.stringify({
                            type: "ADD_FILE",
                            file: data.file
                        })
                    );
                }
            }
        }
        if (data.type === "RENAME_FILE") {
            rooms[data.roomId].files =
                rooms[data.roomId].files.map((file) => {
                    if (file.id === data.fileId) {
                        return {
                            ...file,
                            name: data.newName
                        };
                    }
                    return file;
                });
            for (const client of rooms[data.roomId].users) {
                if (client !== socket) {
                    client.send(
                        JSON.stringify({
                            type: "RENAME_FILE",
                            fileId: data.fileId,
                            newName: data.newName
                        })
                    );
                }
            }
        }
        if (data.type === "UPDATE_FILE_LANGUAGE") {
            rooms[data.roomId].files =
                rooms[data.roomId].files.map((file) => {
                    if (file.id === data.file.id) {
                        return data.file;
                    }
                    return file;
                });
            for (const client of rooms[data.roomId].users) {

                if (client !== socket) {

                    client.send(
                        JSON.stringify({
                            type: "UPDATE_FILE_LANGUAGE",
                            file: data.file
                        })
                    );
                }
            }
        }
        if (data.type === "USERNAME_CHANGE") {
            socket.username = data.username;
            const users = rooms[data.roomId].users.map((user) => ({
                username: user.username
            }));
            for (const client of rooms[data.roomId].users) {
                client.send(
                    JSON.stringify({
                        type: "USERS_UPDATE",
                        users
                    })
                );
            }
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
        
        if (data.type === "DELETE_FILE") {
            rooms[data.roomId].files =
                rooms[data.roomId].files.filter(
                    (file) => file.id !== data.fileId
                );
            for (const client of rooms[data.roomId].users) {
                if (client !== socket) {
                    client.send(
                        JSON.stringify({
                            type: "DELETE_FILE",
                            fileId: data.fileId
                        })
                    );
                }
            }
        }
    });
    socket.on("close", () => {
        const roomId = socket.roomId;
        const username = socket.username;
        if (!roomId) return;
        const room = rooms[roomId];
        if (!room) return;
        const index = room.users.indexOf(socket);
        if (index !== -1) {
            room.users.splice(index, 1);
        }
        for (const client of room.users) {

            client.send(
                JSON.stringify({
                    type: "CURSOR_REMOVE",
                    username
                })
            );
        }
        const users = room.users.map((user) => ({
            username: user.username
        }));
        for (const client of room.users) {
            client.send(
                JSON.stringify({
                    type: "USERS_UPDATE",
                    users
                })
            );
            client.send(
                JSON.stringify({
                    type: "SYSTEM_MESSAGE",
                    message: `${username} left the room`
                })
            );
            console.log(`${username} left the room`);
        }
        if (room.users.length === 0) {
            delete rooms[roomId];
        }
        console.log("Client Disconnected");
    });
});