var mongo = require('mongodb');

var Server = mongo.Server;
var Db = mongo.Db;
var BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('oneheart', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'oneheart' database!");
    }
});

exports.db = db;