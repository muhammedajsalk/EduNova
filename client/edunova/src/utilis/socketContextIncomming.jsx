
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useUser } from '../userContext';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const { user } = useUser();
  const [incomingCall, setIncomingCall] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (user && user._id) {
      socketRef.current = io("http://localhost:5000", { withCredentials: true });
      const socket = socketRef.current;

      console.log(`[SocketContext] Socket connected for user: ${user.name}`);

      socket.on('incoming-call', (data) => {
        console.log('[SocketContext] Global incoming call received:', data);
        setIncomingCall(data);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [user]);

  const value = {
    socket: socketRef.current,
    incomingCall,
    setIncomingCall,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};