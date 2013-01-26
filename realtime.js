var db = require('./connectdb').db;
var tap = require('./taps').setDb(db);

var io = require('socket.io').listen(8000);

io.sockets.on('connection', function(socket) {
    socket.on('join', function(heart) {
        console.log('user connected to heart ' + heart);
        socket.set('heart', heart, function(){});
        socket.join(heart);

        var bpm = Math.floor((Math.random()*80)+60);
        var numOfUsers = io.sockets.clients(heart).length;
        var averageTaps = Math.floor((Math.random()*8)+0);

        socket.to(heart).emit('stats', bpm, numOfUsers, averageTaps);
        socket.broadcast.to(heart).emit('stats', bpm, numOfUsers, averageTaps);

        // get hearts collection
        var collection = db.collection('hearts');

        var now = new Date().getTime();

        // update heart stats
        collection.update({_id:heart}, {$set:{num_of_users:numOfUsers,timestamp:now}}, {upsert:true,w:1}, function(err, result) {
            if(err) { return console.dir(err); }
        });
    });

    socket.on('disconnect', function() {
        socket.get('heart', function(err, heart) {
            console.log('user disconnected from heart ' + heart + '!');

            var bpm = Math.floor((Math.random()*80)+60);
            var numOfUsers = io.sockets.clients(heart).length;
            var averageTaps = Math.floor((Math.random()*8)+0);

            socket.broadcast.to(heart).emit('stats', bpm, numOfUsers, averageTaps);

            // get hearts collection
            var collection = db.collection('hearts');

            var now = new Date().getTime();

            // update heart stats
            collection.update({_id:heart}, {$set:{num_of_users:numOfUsers,timestamp:now}}, {upsert:true,w:1}, function(err, result) {
                if(err) { return console.dir(err); }
            });
        });
    });

    socket.on('tap', function(ms, taps) {
        socket.get('heart', function(err, heart) {
            console.log('user tapped on ' + heart + ' ' + taps + ' times in the last ' + ms + 'ms');
            tap.add(heart, ms, taps);
        });
    });
});

setInterval(function() {
    var heart = 'sandbox';

    var bpm = Math.floor((Math.random()*80)+60);
    var numOfUsers = io.sockets.clients(heart).length;
    var averageTaps = Math.floor((Math.random()*8)+0);

    io.sockets.in(heart).emit('stats', bpm, numOfUsers, averageTaps);
}, 1000);