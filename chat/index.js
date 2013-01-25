var io = require('socket.io').listen(8000);

var users = [];  

io.sockets.on('connection', function(socket) {
    socket.on('join', function(room, user) {
        console.log(user + '@' + room + ' joined!');
        socket.set('room', room, function(){});
        socket.join(room);
        var numOfUsers = io.sockets.clients(room).length;
        socket.to(room).emit('join', user, numOfUsers);
        socket.broadcast.to(room).emit('join', user, numOfUsers);
        users[socket.id] = user;
    });
    
    socket.on('disconnect', function() {
        var user = users[socket.id];
        delete users[socket.id];
        socket.get('room', function(err, room) {
            console.log(user + '@' + room + ' disconnected!');
            var numOfUsers = io.sockets.clients(room).length - 1;
            socket.broadcast.to(room).emit('disconnect', user, numOfUsers);
        });
    });

    socket.on('message', function(user, message) {
        socket.get('room', function(err, room) {
            console.log(user + '@' + room + ': ' + message);
            socket.broadcast.to(room).emit('message', user, message);
        });
    });
});