import { io } from "socket.io-client";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

const token = getCookie("accesToken");

export const socket = io("http://localhost:5000", {
  auth: { token },
  transports: ["websocket"],
  autoConnect: !!token,
  withCredentials: true
});

socket.on("connect_error", (err) => {
  console.error("Socket connect_error", err.message);
});