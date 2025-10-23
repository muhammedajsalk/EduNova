import React, { useEffect, useState, useRef, useContext } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import UserContext from "../../userContext";

const socket = io(`${import.meta.env.VITE_API_BASE_URL}`, {
  withCredentials: true,
});

function StudentChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [instructor, setInstructor] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const { instructorId, roomId } = useParams();
  const { user } = useContext(UserContext);

  const currentUserId = user._id;
  const chatRoomId = roomId;

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/instructorById/${instructorId}`, {
        withCredentials: true,
      })
      .then((res) => setInstructor(res.data?.data))
      .catch((err) => {});
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchPreviousMessages = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/message/chat-room/${roomId}/messages`,
        {
          withCredentials: true,
        }
      );

      const formattedMessages = response.data.map((msg) => ({
        content: msg.content,
        senderId: msg.senderId?._id || msg.senderId,
        timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

      setMessages(formattedMessages);
    } catch (error) {
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
  }, []);

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      if (msg.chatRoomId === chatRoomId) {
        setMessages((prev) => [
          ...prev,
          {
            content: msg.content,
            senderId: msg.senderId,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
        setIsConnected(true);
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
      senderImg: user.avatar,
      senderName: user.name,
    };

    socket.emit("sendMessage", newMessage);
    setInput("");
    inputRef.current?.focus();
  };

  const handleTyping = () => {
    socket.emit("typing", {
      chatRoomId: chatRoomId,
      userId: currentUserId,
    });
  };

  return (
    <div className="flex flex-col h-screen mx-auto bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Modern Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="lg:hidden text-white hover:bg-white/20 p-2 rounded-lg transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl overflow-hidden ring-4 ring-white/30 shadow-lg transform transition-transform hover:scale-105">
                {instructor?.avatar ? (
                  <img 
                    src={instructor.avatar} 
                    alt={instructor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white flex items-center justify-center text-emerald-600 font-bold text-lg">
                    {instructor?.name?.charAt(0)}
                  </div>
                )}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-3 border-white shadow-md transition-all ${
                isConnected ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
              }`} />
            </div>

            <div className="text-white">
              <h1 className="text-lg font-bold tracking-wide">{instructor?.name || 'Instructor'}</h1>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-300' : 'bg-gray-300'}`} />
                <p className="text-sm text-emerald-100 font-medium">
                  {isConnected ? 'Active now' : 'Offline'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="text-white hover:bg-white/20 p-2.5 rounded-xl transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
            <button className="text-white hover:bg-white/20 p-2.5 rounded-xl transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-thin scrollbar-thumb-emerald-300 scrollbar-track-transparent">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-teal-400 rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
              </div>
              <p className="text-emerald-600 font-medium animate-pulse">Loading conversation...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-emerald-600">
            <div className="bg-gradient-to-br from-emerald-100 to-teal-100 p-8 rounded-3xl shadow-lg">
              <svg className="w-20 h-20 mx-auto mb-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-xl font-bold text-emerald-700 mb-2">No messages yet</p>
              <p className="text-sm text-emerald-600">Start your conversation now!</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.senderId === currentUserId ? 'justify-end' : 'justify-start'
                } animate-fadeIn`}
              >
                <div className={`group relative max-w-xs lg:max-w-md`}>
                  <div
                    className={`px-5 py-3 rounded-2xl shadow-md transition-all transform hover:scale-[1.02] ${
                      message.senderId === currentUserId
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-br-md'
                        : 'bg-white text-gray-800 rounded-bl-md border border-emerald-100'
                    }`}
                  >
                    <p className="text-[15px] leading-relaxed break-words">{message.content}</p>
                    <p
                      className={`text-[11px] mt-1.5 ${
                        message.senderId === currentUserId
                          ? 'text-emerald-100'
                          : 'text-gray-400'
                      }`}
                    >
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start animate-fadeIn">
                <div className="bg-white px-5 py-4 rounded-2xl rounded-bl-md shadow-md border border-emerald-100">
                  <div className="flex space-x-1.5">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce"></div>
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Modern Input Area */}
      <div className="bg-white border-t border-emerald-100 px-4 py-4 shadow-2xl">
        <form onSubmit={sendMessage} className="flex items-end space-x-3 max-w-4xl mx-auto">
          <button
            type="button"
            className="mb-1 p-2.5 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all hover:scale-110"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>

          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              rows="1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                handleTyping();
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(e);
                }
              }}
              placeholder="Type your message..."
              className="w-full px-6 py-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-400 transition-all resize-none placeholder-emerald-400"
              style={{ maxHeight: '120px', minHeight: '48px' }}
            />
          </div>

          <button
            type="submit"
            disabled={!input.trim()}
            className={`mb-1 p-3.5 rounded-2xl transition-all transform ${
              input.trim()
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-emerald-300 hover:scale-110 active:scale-95'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>

        <p className="text-center text-xs text-emerald-400 mt-2">
          Press Enter to send • Shift + Enter for new line
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-thumb-emerald-300::-webkit-scrollbar-thumb {
          background-color: #6ee7b7;
          border-radius: 20px;
        }

        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}

export default React.memo(StudentChat);