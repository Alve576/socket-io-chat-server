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
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
// audio call
  socket.emit('me',socket.id)

  socket.on('join_room',(data)=>{
      socket.join(data);
      console.log(`user id  :  ${socket.id} joined room : ${data}`)

  });
  socket.on("send_message",(data)=>{
      console.log(data)
      socket.to(data.room).emit('receive_message',data);

  });
// audio call

  socket.on("disconnect", () => { 
    socket.broadcast.emit('call ended');    
    console.log("User Disconnected", socket.id);
  });
  socket.on('calluser',({userToCall,signalData,from,name})=>{
    io.to(userToCall).emit('calluser',{signal:signalData,from,name})
  });

  socket.on('answercall',(data)=>{
    io.to(data.to).emit("callaccepted",data.signal)
  });
});

server.listen(PORT, () => {
  console.log("SERVER RUNNING");
});