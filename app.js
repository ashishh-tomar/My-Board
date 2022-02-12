const express=require("express");
const socket=require("socket.io");
const { isObject } = require("util");

let app=express();

app.use(express.static("public"));

let port=5001;
let server=app.listen(port,()=>{
    console.log("Listening to Port "+port);
});



let io=socket(server);

io.on("connection",(socket)=>{
    console.log("Socket connection is established");

    //Recieved Data
    socket.on("beginPath",(data)=>{
        //transfer data to all connected computers
        io.sockets.emit("beginPath",data);
    });

    socket.on("drawStroke",(data)=>{
        //transfer data to all connected computers
        io.sockets.emit("drawStroke",data);
    });

    socket.on("redoUndo",(data)=>{
        //transfer data to all connected computers
        io.sockets.emit("redoUndo",data);
    });
})