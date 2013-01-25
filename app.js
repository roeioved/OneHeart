var io = require('socket.io').listen(8000);

io.sockets.on('connection', function(socket) {
    socket.on('join', function(heart) {
        console.log('user connected to heart ' + heart);
        socket.set('heart', heart, function(){});
        socket.join(heart);
        var numOfUsers = io.sockets.clients(heart).length;
        socket.to(heart).emit('stats', numOfUsers);
        socket.broadcast.to(heart).emit('stats', numOfUsers);
    });
    
    socket.on('disconnect', function() {
        socket.get('heart', function(err, heart) {
            console.log('user disconnected from heart ' + heart + '!');
            var numOfUsers = io.sockets.clients(heart).length - 1;
            socket.broadcast.to(heart).emit('stats', numOfUsers);
        });
    });

    socket.on('tap', function(ms, taps) {
        socket.get('heart', function(err, heart) {
            console.log('user taps ' + taps + ' in the last ' + ms + 'ms');
        });
    });
});