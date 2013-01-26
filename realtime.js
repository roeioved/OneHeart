var db = require('./connectdb').db;
var heartManager = require('./heart').setDb(db);
var tapManager = require('./taps').setDb(db);

var io = require('socket.io').listen(8000);

var intervals = [];

io.sockets.on('connection', function(socket) {
    socket.on('join', function(heart) {
        console.log('user connected to heart ' + heart);
        socket.set('heart', heart, function(){});
        socket.join(heart);

        // get num. of users
        var numOfUsers = io.sockets.clients(heart).length;

        // update num. of users on db
        heartManager.updateNumOfUsers(heart, numOfUsers, function(err) {
            if(err) { return console.dir(err); }
        });

        // get stats and send to user
        getHeartStats(heart, function(stats) {
            socket.to(heart).emit('stats', stats.bpm, stats.numOfUsers, stats.averageTaps);
        });

        // check if heart doesn't already have stats broadcast interval
        if (!intervals[heart]) {
            // create stats broadcast interval
            intervals[heart] = setInterval(function() {
                broadcastStats(heart);
            }, 1000);
        }
    });

    socket.on('disconnect', function() {
        socket.get('heart', function(err, heart) {
            console.log('user disconnected from heart ' + heart + '!');

            // get num. of users
            var numOfUsers = io.sockets.clients(heart).length - 1;

            // update num. of users on db
            heartManager.updateNumOfUsers(heart, numOfUsers, function(err) {
                if(err) { return console.dir(err); }
            });

            // check if last user
            if (numOfUsers == 0) {
                // clear stats broadcast interval
                clearInterval(intervals[heart]);
                delete intervals[heart];
            }
        });
    });

    socket.on('tap', function(ms, taps) {
        if (taps > 0) {
            socket.get('heart', function(err, heart) {
                //console.log('user tapped on ' + heart + ' ' + taps + ' times in the last ' + ms + 'ms');
                tapManager.add(heart, ms, taps);
            });
        }
    });
});

function getHeartStats(heart, callback) {
    heartManager.findById(heart, function(item) {
        var bpm = 0;
        var numOfUsers = item.num_of_users ? item.num_of_users : 0;
        var averageTaps = item.average_taps ? item.average_taps : 0;
        var points = item.points ? item.points : 0;

        var stats = {bpm:bpm, numOfUsers:numOfUsers, averageTaps:averageTaps, points:points};
        callback(stats);
    });
}

function broadcastStats(heart) {
    getHeartStats(heart, function(stats) {
        io.sockets.in(heart).emit('stats', stats.bpm, stats.numOfUsers, stats.averageTaps, stats.points);
    });
}