const express = require("express");
const app = express();
const http = require("http");
const PORT = process.env.PORT || 3001;
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://alapchatapp.web.app",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  socket.on('join_room',(data)=>{
      socket.join(data);
      console.log(`user id  :  ${socket.id} joined room : ${data}`)

  })
  socket.on("send_message",(data)=>{
      console.log(data)
      socket.to(data.room).emit('receive_message',data);

  });
  socket.on("disconnect", () => { 
    console.log("User Disconnected", socket.id);
  });
});

server.listen(PORT, () => {
  console.log("SERVER RUNNING");
});