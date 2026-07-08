import Editor from './components/Editor/Editor'
import React from 'react'

const socket = new WebSocket("ws://localhost:8000");

socket.addEventListener("open", ()=>{
  console.log("Connected to Server");
  socket.send(JSON.stringify({
  type: "JOIN_ROOM",
  roomId: "abc123"
}));
})
socket.addEventListener("message", (event)=>{
  const data = JSON.parse(event.data);
  console.log(data);
})
socket.addEventListener("error", (err) => {
  console.log("Socket Error:", err);
});

socket.addEventListener("close", () => {
  console.log("Socket Closed");
});

const App = () => {
  return (
    <>
    <Editor/>
    </>
  )
}

export default App
