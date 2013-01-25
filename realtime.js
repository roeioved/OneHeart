var io = require('socket.io').listen(8000);
var MongoClient = require('mongodb').MongoClient;

io.sockets.on('connection', function(socket) {
    socket.on('join', function(heart) {
        console.log('user connected to heart ' + heart);
        socket.set('heart', heart, function(){});
        socket.join(heart);
        var numOfUsers = io.sockets.clients(heart).length;
        socket.to(heart).emit('stats', numOfUsers);
        socket.broadcast.to(heart).emit('stats', numOfUsers);

        // connect to the db
        MongoClient.connect("mongodb://localhost:27017/oneheart", function(err, db) {
            if(err) { return console.dir("Could not connect to db! " + err); }

            // get hearts collection
            var collection = db.collection('hearts');

            var now = new Date().getTime();

            // update heart stats
            collection.update({_id:heart}, {$set:{num_of_users:numOfUsers,timestamp:now}}, {upsert:true,w:1}, function(err, result) {
                if(err) { return console.dir(err); }
            });
        });
    });

    socket.on('disconnect', function() {
        socket.get('heart', function(err, heart) {
            console.log('user disconnected from heart ' + heart + '!');
            var numOfUsers = io.sockets.clients(heart).length - 1;
            socket.broadcast.to(heart).emit('stats', numOfUsers);

            // connect to the db
            MongoClient.connect("mongodb://localhost:27017/oneheart", function(err, db) {
                if(err) { return console.dir("Could not connect to db! " + err); }

                // get hearts collection
                var collection = db.collection('hearts');

                var now = new Date().getTime();

                // update heart stats
                collection.update({_id:heart}, {$set:{num_of_users:numOfUsers,timestamp:now}}, {upsert:true,w:1}, function(err, result) {
                    if(err) { return console.dir(err); }
                });
            });
        });
    });

    socket.on('tap', function(ms, taps) {
        socket.get('heart', function(err, heart) {
            console.log('user tapped ' + taps + ' times in the last ' + ms + 'ms');
        });
    });
});