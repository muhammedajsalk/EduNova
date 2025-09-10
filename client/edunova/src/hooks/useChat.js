import { useEffect, useState } from "react";
import { socket } from "./socket";
import axios from "axios";

export default function useChat(roomId) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!roomId) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/message/chat-room/${roomId}/messages`,
          { withCredentials: true }
        );
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchMessages();

    socket.emit("joinRoom", roomId);

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [roomId]);

  return { messages };
}
