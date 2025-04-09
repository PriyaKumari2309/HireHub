import { io } from "socket.io-client";

const URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const socket = io(URL, {
  withCredentials: true,
});

export default socket;
