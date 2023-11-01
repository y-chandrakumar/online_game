const express = require('express')
const app= express()
//socket.io setup
const path=require("path")
const http =require('http')
const {Server }= require('socket.io');
const server=http.createServer(app)
const io=new Server(server)
const port =3000


app.use(express.static(path.resolve("")))

let players=[];
let Game=[];

io.on('connection',(socket)=>{
    console.log('a user is connected')
    socket.on("store",(e)=>{
        console.log(e);
        const roomName = e.name; // This should be dynamically generated.
        console.log(roomName)
          socket.join(roomName);
        console.log(`${e.name} reached the server to set the game`);
        players.push(e.name);
    })
   
    socket.on("find",(e)=>{
        console.log(e);
        console.log(players)
        console.log(`${e.name} reached the server to find other player`);
        for(let i=0;i<players.length;i++){
            if(e.name==players[i]){
                console.log("came in to if condition");
                
                const roomName = e.name; 
                 const data="connected";
                const room = io.sockets.adapter.rooms.get(e.name);
                console.log("this is room",room);
                if (room && room.size < 2) {
                    console.log(roomName)
                    socket.join(roomName);
                    console.log("came in to if condition2");
                  socket.emit('joined-room', roomName);
                  io.to(roomName).emit('exclusive-event', data);
                  console.log("message sent");

                } else {
                  socket.emit('room-full', roomName);
                  console.log("not connectd");
                }
            }
        }
    })


    socket.on("numbersent", (data) => {
       console.log(data);
        io.to(data[0]).emit('numbergot', data);
      });
})




 


  


















app.get('/',(req,res)=>{
   return res.sendFile(__dirname+'/index.html')
})


server.listen(port,()=>{
    console.log(`example app listening on port ${port}`)
})