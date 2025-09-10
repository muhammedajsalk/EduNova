import { io } from "socket.io-client";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// Make sure this key matches the cookie you actually set on login
const token = getCookie("accesToken"); // was 'accesTokken' (typo)

export const socket = io("http://localhost:5000", {
  auth: { token },
  transports: ["websocket"],
  autoConnect: !!token,
  withCredentials: true
});

socket.on("connect_error", (err) => {
  console.error("Socket connect_error", err.message);
});