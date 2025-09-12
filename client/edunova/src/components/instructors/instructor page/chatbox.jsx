import React, { useEffect, useState, useRef, useContext, useCallback } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useParams } from "react-router-dom";
import UserContext from "../../../userContext";

const socket = io("http://localhost:5000", {
  withCredentials: true,
});

export default function InstructorChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [error, setError] = useState(null);

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
      const response = await axios.get(`http://localhost:5000/api/message/course/${courseId}/${currentChatRoomId}`, {
        withCredentials: true,
      });
      const fetchedStudents = response.data?.data || [];
      setStudents(fetchedStudents);
      if (fetchedStudents.length > 0 && !selectedStudent) {
        handleStudentSelect(fetchedStudents[0]);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
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
          .post("http://localhost:5000/api/message/chat-room", {
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
            console.error("Error creating chat room:", err);
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
        `http://localhost:5000/api/message/chat-room/${currentChatRoomId}/messages`,
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
      console.error("Error fetching messages:", error);
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
    console.log("Attempting to connect to socket server...");

    socket.on("connect", () => {
      console.log("✅ Socket connected! Socket ID:", socket.id);
      setIsConnected(true);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected. Reason:", reason);
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
      setError(`Socket connection failed: ${error.message}`);
    });

    socket.on("reconnect", (attemptNumber) => {
      console.log("🔄 Socket reconnected after", attemptNumber, "attempts");
      setIsConnected(true);
    });

    socket.on("reconnect_attempt", (attemptNumber) => {
      console.log("🔄 Attempting reconnection (attempt:", attemptNumber, ")");
    });

    socket.on("reconnect_error", (error) => {
      console.error("❌ Reconnection error:", error.message);
    });

    socket.on("reconnect_failed", () => {
      console.error("❌ Reconnection failed after all attempts");
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
        setIsConnected(true)
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
      socket.off("reconnect_attempt");
      socket.off("reconnect_error");
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
        senderName: user.name
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
    [input, selectedStudent, currentChatRoomId, currentUserId]
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

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Students</h2>
        </div>
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
              placeholder="Search students..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {error && <p className="text-red-500 px-4 py-2">{error}</p>}
          {loadingStudents ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : students.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No students found.</p>
          ) : (
            students.map((student) => (
              <div
                key={student._id}
                onClick={() => handleStudentSelect(student)}
                className={`flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${selectedStudent?._id === student._id ? "bg-emerald-50 border-l-4 border-emerald-600" : ""
                  }`}
              >
                <div className="relative">
                  <img
                    src={student.avatar}
                    alt={`${student.name}'s avatar`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {student.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">{student.name}</h3>
                    <span className="text-xs text-gray-500">{student.lastMessageTime}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{student.lastMessage}</p>
                </div>
                {student.unreadCount > 0 && (
                  <div className="ml-2 bg-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {student.unreadCount}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedStudent ? (
          <>
            <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={selectedStudent.avatar}
                      alt={`${selectedStudent.name}'s avatar`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${selectedStudent.isOnline ? "bg-green-500" : "bg-gray-400"
                        }`}
                    />
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-gray-900">{selectedStudent.name}</h1>
                    <p className="text-sm text-gray-500">
                      {isConnected ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {error && <p className="text-red-500 text-center">{error}</p>}
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <p className="text-lg font-medium">No messages yet</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`px-4 py-2 rounded-lg max-w-xs break-words ${msg.senderId === currentUserId ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-900"
                        }`}
                    >
                      {msg.content}
                      <div className="text-xs mt-1 text-right opacity-75">{msg.timestamp}</div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            {isTyping && (
              <div className="px-6 py-2 text-sm text-gray-500 animate-pulse">
                {selectedStudent.name} is typing...
              </div>
            )}
            <form
              onSubmit={sendMessage}
              className="border-t border-gray-200 px-6 py-4 flex items-center space-x-3 bg-white"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleTyping}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
              <button
                type="submit"
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-lg">
            Select a student to start chatting
          </div>
        )}
      </div>
    </div>
  );
}