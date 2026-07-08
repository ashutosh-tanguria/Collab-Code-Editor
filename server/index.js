const { WebSocketServer } = require("ws");
const rooms = require("./rooms");

const wss = new WebSocketServer({ port: 8000 });

console.log("WebSocket Server Started");

wss.on("connection", (socket) => {
    console.log("Client Connected");

    socket.on("message", (message) => {

        // Convert JSON string into JS object
        const data = JSON.parse(message.toString());

        console.log("Message from Client:", data);

        // Handle JOIN_ROOM message
        if (data.type === "JOIN_ROOM") {

            // Create room if it doesn't exist
            if (!rooms[data.roomId]) {
                rooms[data.roomId] = {
                    users: []
                };
            }
            for (const client of rooms[data.roomId].users) {
                if (client !== socket) {
                    client.send(JSON.stringify({
                        type: "USER_JOINED",
                        message: "A new user has joined the room."
                    }));
                }
            }
            rooms[data.roomId].users.push(socket);
            console.log(rooms);
            console.log(rooms[data.roomId].users.length);
        }

        socket.send(JSON.stringify({
                type: "SERVER_MESSAGE",
                message: "Hello from Server"
            }));
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