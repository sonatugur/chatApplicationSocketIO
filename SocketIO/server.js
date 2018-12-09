var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var path = require('path');

// socket connections
var connections = [];
var users = [];

server.listen(process.env.PORT || 5000, ()=> {
    console.log('server started listening port 5000');
})

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname,'/index.html'));
})

io.sockets.on('connection',(socket) => {
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);


    socket.on('new user',(data,callback)=> {
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
        callback(true);
    })

    socket.on('send message', (data) => {
        io.sockets.emit('new message', {msg:data,user:socket.username});
    })

    //disconnect
    socket.on('disconnect', (data)=> {
        users.splice(users.indexOf(socket.username),1);
        updateUsernames();
        connections.splice(connections.indexOf(socket),1);
        console.log('Disconnect: %s sockets connected', connections.length);
    })

    function updateUsernames(){
        io.sockets.emit('get users', users);
    }
})