const { WebSocketServer } = require("ws");
const rooms = require("./rooms");

const wss = new WebSocketServer({ port: 8000 });

console.log("WebSocket Server Started");

wss.on("connection", (socket) => {
    console.log("Client Connected");

    socket.on("message", (message) => {

        // Parse incoming message
        const data = JSON.parse(message.toString());

        console.log("Message from Client:", data);

        // =========================
        // JOIN ROOM
        // =========================
        if (data.type === "JOIN_ROOM") {

            if (!rooms[data.roomId]) {
                rooms[data.roomId] = {
                    users: [],
                    files: [
                        {
                            id: "main",
                            name: "main.js",
                            code: "// Start Coding..."
                        }
                    ]
                };
            }

            for (const client of rooms[data.roomId].users) {
                if (client !== socket) {
                    client.send(
                        JSON.stringify({
                            type: "USER_JOINED",
                            message: "A new user has joined the room."
                        })
                    );
                }
            }

            rooms[data.roomId].users.push(socket);

            socket.send(
                JSON.stringify({
                    type: "INITIAL_FILES",
                    files: rooms[data.roomId].files
                })
            );

            console.log(rooms);
            console.log(rooms[data.roomId].users.length);
        }

        // =========================
        // CODE CHANGE
        // =========================
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

        // =========================
        // ADD FILE
        // =========================
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

    });

    socket.on("close", () => {

        for (const roomId in rooms) {

            const room = rooms[roomId];

            const index = room.users.indexOf(socket);

            if (index !== -1) {

                room.users.splice(index, 1);

                if (room.users.length === 0) {
                    delete rooms[roomId];
                }

                console.log("Client Disconnected");

            }

        }

    });

});