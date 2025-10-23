import React, { useEffect, useState, useRef, useContext, useCallback } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useParams } from "react-router-dom";
import UserContext from "../../../userContext";

const socket = io(`${import.meta.env.VITE_API_BASE_URL}`, {
  withCredentials: true,
});

function InstructorChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [currentChatRoomId, setCurrentChatRoomId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { courseId } = useParams();
  const { user } = useContext(UserContext);
  const currentUserId = user?._id;

  const fetchStudents = useCallback(async () => {
    try {
      setLoadingStudents(true);
      setError(null);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/message/course/${courseId}/${currentChatRoomId}`,
        { withCredentials: true }
      );
      const fetchedStudents = response.data?.data || [];
      setStudents(fetchedStudents);
      if (fetchedStudents.length > 0 && !selectedStudent) {
        handleStudentSelect(fetchedStudents[0]);
      }
    } catch (error) {
      setError("Failed to load students. Please try again.");
    } finally {
      setLoadingStudents(false);
    }
  }, [courseId, selectedStudent]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    if (selectedStudent && currentUserId) {
      let chatRoomId = selectedStudent.chatRoomId;
      if (!chatRoomId) {
        axios
          .post(`${import.meta.env.VITE_API_BASE_URL}/api/message/chat-room`, {
            userId: selectedStudent._id,
            instructorId: currentUserId,
          })
          .then((res) => {
            chatRoomId = res.data?._id;
            setCurrentChatRoomId(chatRoomId);
            setStudents((prev) =>
              prev.map((s) =>
                s._id === selectedStudent._id ? { ...s, chatRoomId } : s
              )
            );
          })
          .catch((err) => {
            setError("Failed to create chat room.");
          });
      } else {
        setCurrentChatRoomId(chatRoomId);
      }
    }
  }, [selectedStudent, currentUserId]);

  const fetchPreviousMessages = useCallback(async () => {
    if (!currentChatRoomId) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/message/chat-room/${currentChatRoomId}/messages`,
        { withCredentials: true }
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
      setMessages([]);
      setError("Failed to load messages. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [currentChatRoomId]);

  useEffect(() => {
    if (currentChatRoomId) {
      fetchPreviousMessages();
    }
  }, [currentChatRoomId, fetchPreviousMessages]);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", (reason) => {
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      setError(`Socket connection failed: ${error.message}`);
    });

    socket.on("reconnect", (attemptNumber) => {
      setIsConnected(true);
    });

    socket.on("reconnect_failed", () => {
      setError("Unable to reconnect to the server. Please check your connection.");
    });

    socket.on("receiveMessage", (msg) => {
      if (msg.chatRoomId === currentChatRoomId) {
        setMessages((prev) => [
          ...prev,
          {
            content: msg.content,
            senderId: msg.senderId,
            timestamp: new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
        setIsTyping(false);
        setIsConnected(true);
      }
      setStudents((prev) =>
        prev.map((student) => {
          if (student.chatRoomId === msg.chatRoomId) {
            return {
              ...student,
              lastMessage: msg.content,
              lastMessageTime: new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              unreadCount:
                student._id === selectedStudent?._id ? 0 : (student.unreadCount || 0) + 1,
            };
          }
          return student;
        })
      );
    });

    socket.on("typing", ({ userId, chatRoomId }) => {
      if (userId !== currentUserId && chatRoomId === currentChatRoomId) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("reconnect");
      socket.off("reconnect_failed");
      socket.off("receiveMessage");
      socket.off("typing");
    };
  }, [currentChatRoomId, selectedStudent, currentUserId]);

  useEffect(() => {
    if (currentChatRoomId) {
      socket.emit("joinRoom", currentChatRoomId);
    }
  }, [currentChatRoomId]);

  const sendMessage = useCallback(
    (e) => {
      e?.preventDefault();
      if (!input.trim() || !selectedStudent || !currentChatRoomId) return;

      const newMessage = {
        chatRoomId: currentChatRoomId,
        senderId: currentUserId,
        receiverId: selectedStudent._id,
        senderModel: "instructor",
        receiverModel: "users",
        content: input,
        senderImg: user.avatar,
        senderName: user.name,
      };

      socket.emit("sendMessage", newMessage);
      setInput("");
      inputRef.current?.focus();

      setStudents((prev) =>
        prev.map((student) => {
          if (student._id === selectedStudent._id) {
            return {
              ...student,
              lastMessage: input,
              lastMessageTime: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            };
          }
          return student;
        })
      );
    },
    [input, selectedStudent, currentChatRoomId, currentUserId, user]
  );

  const handleTyping = useCallback(() => {
    if (currentChatRoomId && currentUserId) {
      socket.emit("typing", { chatRoomId: currentChatRoomId, userId: currentUserId });
    }
  }, [currentChatRoomId, currentUserId]);

  const handleStudentSelect = useCallback((student) => {
    setSelectedStudent(student);
    setStudents((prev) =>
      prev.map((s) => (s._id === student._id ? { ...s, unreadCount: 0 } : s))
    );
    setMessages([]);
    setCurrentChatRoomId(student.chatRoomId);
  }, []);

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Modern Sidebar */}
      <div className="w-96 bg-white border-r border-emerald-100 flex flex-col shadow-xl">
        {/* Sidebar Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-600 to-teal-600">
          <h2 className="text-xl font-bold text-white mb-1">Messages</h2>
          <p className="text-emerald-100 text-sm">
            {students.length} student{students.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-4 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search students..."
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-emerald-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-400 transition-all placeholder-emerald-300"
            />
          </div>
        </div>

        {/* Students List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-300 scrollbar-track-transparent">
          {error && (
            <div className="mx-4 my-2 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          {loadingStudents ? (
            <div className="flex items-center justify-center h-32">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-teal-400 rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
              </div>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-emerald-600">
              <svg className="w-12 h-12 mb-2 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-sm font-medium">No students found</p>
            </div>
          ) : (
            <div className="py-2">
              {filteredStudents.map((student) => (
                <div
                  key={student._id}
                  onClick={() => handleStudentSelect(student)}
                  className={`mx-2 mb-2 flex items-center px-4 py-3 rounded-2xl cursor-pointer transition-all transform hover:scale-[1.02] ${
                    selectedStudent?._id === student._id
                      ? "bg-gradient-to-r from-emerald-100 to-teal-100 shadow-md border-l-4 border-emerald-600"
                      : "hover:bg-emerald-50"
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden ring-4 ring-white shadow-lg">
                      {student.avatar ? (
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
                          {student.name?.charAt(0)?.toUpperCase()}
                        </div>
                      )}
                    </div>
                    {student.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-3 border-white shadow-md animate-pulse" />
                    )}
                  </div>
                  <div className="ml-4 flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-bold text-gray-900 truncate">
                        {student.name}
                      </h3>
                      {student.lastMessageTime && (
                        <span className="text-xs text-emerald-600 font-medium ml-2">
                          {student.lastMessageTime}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {student.lastMessage || "No messages yet"}
                    </p>
                  </div>
                  {student.unreadCount > 0 && (
                    <div className="ml-2 bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xs font-bold rounded-full min-w-[24px] h-6 flex items-center justify-center px-2 shadow-lg animate-pulse">
                      {student.unreadCount}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedStudent ? (
          <>
            {/* Modern Chat Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden ring-4 ring-white/30 shadow-lg transform transition-transform hover:scale-105">
                      {selectedStudent.avatar ? (
                        <img
                          src={selectedStudent.avatar}
                          alt={selectedStudent.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <span className="text-white text-xl font-bold">
                            {selectedStudent.name?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-3 border-white shadow-md transition-all ${
                        selectedStudent.isOnline ? "bg-green-400 animate-pulse" : "bg-gray-400"
                      }`}
                    />
                  </div>
                  <div className="text-white">
                    <h1 className="text-lg font-bold tracking-wide">{selectedStudent.name}</h1>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          selectedStudent.isOnline ? "bg-green-300" : "bg-gray-300"
                        }`}
                      />
                      <p className="text-sm text-emerald-100 font-medium">
                        {selectedStudent.isOnline ? "Active now" : "Offline"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-white hover:bg-white/20 p-2.5 rounded-xl transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </button>
                  <button className="text-white hover:bg-white/20 p-2.5 rounded-xl transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 scrollbar-thin scrollbar-thumb-emerald-300 scrollbar-track-transparent">
              {error && (
                <div className="mx-auto max-w-md p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
                  <p className="text-red-600 text-center font-medium">{error}</p>
                </div>
              )}
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
                    <svg
                      className="w-20 h-20 mx-auto mb-4 text-emerald-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <p className="text-xl font-bold text-emerald-700 mb-2">No messages yet</p>
                    <p className="text-sm text-emerald-600">Start your conversation now!</p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.senderId === currentUserId ? "justify-end" : "justify-start"
                      } animate-fadeIn`}
                    >
                      <div className="group relative max-w-xs lg:max-w-md">
                        <div
                          className={`px-5 py-3 rounded-2xl shadow-md transition-all transform hover:scale-[1.02] ${
                            msg.senderId === currentUserId
                              ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-br-md"
                              : "bg-white text-gray-800 rounded-bl-md border border-emerald-100"
                          }`}
                        >
                          <p className="text-[15px] leading-relaxed break-words">{msg.content}</p>
                          <p
                            className={`text-[11px] mt-1.5 ${
                              msg.senderId === currentUserId ? "text-emerald-100" : "text-gray-400"
                            }`}
                          >
                            {msg.timestamp}
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
                          <div
                            className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
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
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage(e);
                      }
                    }}
                    placeholder="Type your message..."
                    className="w-full px-6 py-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-400 transition-all resize-none placeholder-emerald-400"
                    style={{ maxHeight: "120px", minHeight: "48px" }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!input.trim()}
                  className={`mb-1 p-3.5 rounded-2xl transition-all transform ${
                    input.trim()
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-emerald-300 hover:scale-110 active:scale-95"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </form>

              <p className="text-center text-xs text-emerald-400 mt-2">
                Press Enter to send • Shift + Enter for new line
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="bg-gradient-to-br from-emerald-100 to-teal-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">Select a conversation</h3>
              <p className="text-emerald-600">Choose a student from the list to start messaging</p>
            </div>
          </div>
        )}
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

export default React.memo(InstructorChatBox);