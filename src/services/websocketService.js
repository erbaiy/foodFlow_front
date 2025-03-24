// services/websocketService.js
import { io } from 'socket.io-client';
import { addNotification } from '../store/notificationSlice';

let socket = null;

export const connectWebSocket = (dispatch, userId) => {
  socket = io("http://localhost:3005/socket");

  socket.on("connect", () => {
    console.log("WebSocket connected");
    socket.emit("joinRoom", userId);
    console.log(`Joined room with ID: ${userId}`); // Debugging

  });

  socket.on("disconnect", () => {
    console.log("WebSocket disconnected");
  });

  socket.on("newCommand", (data) => {

    console.log("newCommand", data);
    dispatch(addNotification({
      id: Date.now(),
      message: `New order: ${data.orderId} (Status: ${data.status})`,
      time: new Date().toLocaleTimeString(),
      profile: "user-profile.jpeg",
    }));
  });

  socket.on("orderUpdate", (data) => {
    console.log("orderUpdate", data);
    dispatch(addNotification({
      id: Date.now(),
      message: `Order updated: ${data.orderId} (Status: ${data.status})`,
      time: new Date().toLocaleTimeString(),
      profile: "user-profile.jpeg",
    }));
  });

  // Listen for order delivered notifications
  socket.on("change", (data) => {
    console.log("Received orderDelivred:", data); // Debugging
    if (data.restoManagerId == userId) {
      console.log("Notification for this user:", data); // Debugging
      dispatch(addNotification({
        id: Date.now(),
        message: `Order ${data.orderId} has been delivered successfully`,
        time: new Date().toLocaleTimeString(),
        profile: "user-profile.jpeg",
      }));
    } else {
      console.log("Notification for another user:", data); // Debugging
    }
  }
  );
}
export const disconnectWebSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};
