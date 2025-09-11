💬 Student ↔ Instructor Realtime Chat Feature
This module implements a real-time chat system between students and instructors within the learning platform. It combines React (frontend), Express (backend), MongoDB (persistence), and Socket.IO (realtime communication).

✨ Features
Realtime Communication using Socket.IO
Students and instructors exchange messages instantly inside dedicated chat rooms.

Private Chat Rooms
A chat room is created on-demand between a student and an instructor. Chat rooms are re-used for the same participants (no duplicates).

Message Persistence
Chats are stored in MongoDB and retrieved when a user reloads the page.

Typing Indicator
Shows "..." bubbles when the other participant is typing.

Online/Offline Status
The UI displays if the instructor is currently connected.

Frontend UX

Scroll-to-bottom behavior.
Loading state while fetching previous messages.
Empty-state placeholder ("No messages yet").
Elegant UI with TailwindCSS styles.
🏗️ Architecture
The chat system spans multiple layers:

Frontend (React)

StudentChatTest.jsx:

Connects to Socket.IO server.
Joins a specific chatRoomId.
Fetches historical messages (axios GET /api/message/chat-room/:id/messages).
Listens for live events:
receiveMessage
typing
Sends new messages with socket.emit("sendMessage", {...}).
Handles typing indicator with socket.emit("typing", {...}).
newChatCreate() helper:

Creates or reuses a chat room, then navigates to /learningDashboard/studentChat/:instructorId/:chatRoomId.
Backend (Express / Node.js)

Routers
messageRouter.js: Provides REST endpoints for chat operations.
Controllers
chatRoomController – Creates or finds chat rooms (/api/message/chat-room).
messageRoomController – Fetches messages of a chat room.
sendMessageController – Persists messages to MongoDB.
getCourseStudents – Returns all students of a course along with the active chat room context.
WebSockets
Socket.IO initialized in server.js.
Listens for:
"joinRoom" – binds the socket to a room.
"sendMessage" – saves message to DB and then emits receiveMessage.
Broadcasts messages only inside relevant rooms.
Database (MongoDB via Mongoose)

chatRoomModel.js:
Schema for 1-to-1 chat between a student and an instructor.
Stores array of participant ObjectIds.
messageModel.js:
Supports polymorphic refs (refPath) for both sender & receiver (students or instructors).
Stores metadata like isRead, messageType, and timestamps.
📡 API Endpoints
Method	Endpoint	Description
POST	/api/message/chat-room	Create or retrieve chat room between student & instructor
GET	/api/message/chat-room/:id/messages	Fetch all messages from a chat room
POST	/api/message/message	Send a new message (alternative REST method aside from sockets)
GET	/api/message/course/:courseId/:currentChatRoomId	Get students of a course and their chat room context
🔌 Socket.IO Events
Events sent:

sendMessage → { chatRoomId, senderId, receiverId, senderModel, receiverModel, content }
typing → { chatRoomId, userId }
Events received:

receiveMessage → { chatRoomId, senderId, content, ... }
typing
🚀 Usage Flow
Student clicks "Start Chat" with Instructor
→ Frontend calls POST /api/message/chat-room to create/retrieve a room.
→ Redirects to /studentChat/:instructorId/:chatRoomId.

Student joins the chat page
→ Socket connects → emits joinRoom(chatRoomId).
→ Previous messages loaded via REST API.
→ Online/offline status updated.

Realtime Conversation

Student types: socket emits typing, instructor sees typing indicator.
Student sends: socket emits sendMessage, backend stores in DB, then emits to room.
Instructor’s client picks up receiveMessage and updates UI instantly.
🛠️ Tech Stack
Frontend: React + TailwindCSS + Axios + Socket.IO Client
Backend: Node.js + Express + Mongoose + Socket.IO
Database: MongoDB
Authentication: JWT (middleware already set up for sockets and REST)
📖 Example Developer Flow
mermaid

sequenceDiagram
    Student->>Backend: POST /api/message/chat-room
    Backend->>DB: Create/Retrieve ChatRoom
    Backend-->>Student: ChatRoomID

    Student->>Socket.IO: joinRoom(ChatRoomID)
    Instructor->>Socket.IO: joinRoom(ChatRoomID)

    Student->>Socket.IO: sendMessage
    Socket.IO->>DB: Save message
    Socket.IO->>Instructor: receiveMessage
    Instructor->>Socket.IO: sendMessage
    Socket.IO->>DB: Save message
    Socket.IO->>Student: receiveMessage
✅ Next Possible Enhancements
Add read receipts (flip isRead when the other party views).
Enable file uploads (images, docs, etc.).
Group chats (support >2 participants per room).
Push notifications when offline.
