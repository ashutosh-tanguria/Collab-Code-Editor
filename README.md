# Collab Code Editor

A real-time collaborative code editor built using React, Monaco Editor, Express.js, and raw WebSockets. Users can join a room, edit code together, chat, and manage multiple files in real time.

---

## Features

- Real-time code collaboration
- Multi-user rooms
- Live chat
- Multiple file support
- File explorer
- Create, rename and delete files
- Monaco code editor
- Multiple programming languages
- Active users list
- Change username
- Copy room ID
- Download current file
- Ctrl + S download shortcut
- Automatic code synchronization

---

## Tech Stack

### Frontend

- React
- Vite
- Monaco Editor
- React Router
- CSS

### Backend

- Node.js
- Express.js
- ws (WebSocket)

---

## Project Structure

```
Collab-Code-Editor
│
├── client
│
├── server
│
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/ashutosh-tanguria/Collab-Code-Editor.git
```

### Backend

```bash
cd server
npm install
npm start
```

### Frontend

```bash
cd client
npm install
npm run dev
```

---

## Deployment

Frontend: Vercel

Backend: Render

---

## Problems Faced

- Managing multiple users in the same room
- Synchronizing code changes without conflicts
- Preventing update loops during live editing
- Managing multiple files across all users
- Synchronizing file operations
- Handling users joining and leaving
- Debugging WebSocket communication
- Working with Monaco Editor APIs
- Configuring secure WebSockets for deployment
- Deploying React and WebSocket backend separately
- Debugging remote cursor synchronization

---

## What I Learned

- WebSocket communication
- Real-time application development
- Event-driven programming
- Client-server architecture
- React state management
- Monaco Editor integration
- Multi-user synchronization
- Room management
- Production deployment
- Debugging real-time applications
- Git and GitHub workflow

---

## Future Improvements

- Live code execution
- Authentication
- Database support
- Project saving
- AI code assistant
- Voice chat
- Video calls
- Better remote cursors
- Version history
- Docker support
- GitHub integration
- Collaborative whiteboard

---

## Author

Ashutosh Tanguria

GitHub: https://github.com/ashutosh-tanguria