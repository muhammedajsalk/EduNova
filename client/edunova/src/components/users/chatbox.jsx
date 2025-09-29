import React, { useEffect, useState, useRef, useContext } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import UserContext from "../../userContext";

const socket = io("http://localhost:5000", {
  withCredentials: true,
});

function StudentChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [instructor, setInstructor] = useState(null)
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const { instructorId, roomId } = useParams()


  const { user } = useContext(UserContext);
  
  const currentUserId = user._id;
  const chatRoomId = roomId;

  useEffect(() => {
    axios.get(`http://localhost:5000/api/admin/instructorById/${instructorId}`, { withCredentials: true })
      .then((res) => setInstructor(res.data?.data))
      .catch((err) => {})
  }, [])

  

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  
  const fetchPreviousMessages = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:5000/api/message/chat-room/${roomId}/messages`, {
        withCredentials: true
      });

      const formattedMessages = response.data.map(msg => ({
        content: msg.content,
        senderId: msg.senderId?._id || msg.senderId,
        timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPreviousMessages();
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      
      setIsConnected(true);
      socket.emit("joinRoom", chatRoomId);
    });
  }, [])

  useEffect(() => {

    socket.on("receiveMessage", (msg) => {
      if (msg.chatRoomId === chatRoomId) {
        setMessages((prev) => [...prev, {
          content: msg.content,
          senderId: msg.senderId,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setIsConnected(true)
      }
    });

    socket.on("typing", ({ userId }) => {
      if (userId !== currentUserId) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    });

    socket.on("disconnect", () => {
      
      setIsConnected(false);
    });

    return () => {
      socket.off("connect");
      socket.off("receiveMessage");
      socket.off("typing");
      socket.off("disconnect");
    };
  }, []);

  const sendMessage = (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const newMessage = {
      chatRoomId: chatRoomId,
      senderId: currentUserId,
      receiverId: instructorId,
      senderModel: "users",
      receiverModel: "instructor",
      content: input,
      senderImg:user.avatar,
      senderName:user.name
    };

    socket.emit("sendMessage", newMessage);
    setInput("");
    inputRef.current?.focus();
  };


  const handleTyping = () => {
    socket.emit("typing", {
      chatRoomId: chatRoomId,
      userId: currentUserId
    });
  };

  return (
    <div className="flex flex-col h-screen  mx-auto bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                <img src={instructor?.avatar} alt="" className="rounded-full" />
              </div>
              <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${isConnected ? 'bg-green-500' : 'bg-gray-400'
                }`} />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{instructor?.name}</h1>
              <p className="text-sm text-gray-500">
                {isConnected ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              <p className="mt-4 text-gray-500">Loading messages...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm">Start a conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${message.senderId === currentUserId
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-gray-900 shadow-sm border border-gray-100'
                  }`}>
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.senderId === currentUserId ? 'text-emerald-100' : 'text-gray-400'
                    }`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-500 px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <form onSubmit={sendMessage} className="flex items-center space-x-3">
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleTyping}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className={`p-2 rounded-full transition-all ${input.trim()
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

export default React.memo(StudentChat)