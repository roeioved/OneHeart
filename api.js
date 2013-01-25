var mongo = require('mongodb');

var Server = mongo.Server;
var Db = mongo.Db;
var BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('oneheart', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'oneheart' database");
        db.collection('hearts', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'hearts' collection doesn't exist");
            }
        });
    }
});

function findHeartById(req, res) {
    var id = req.params.id;
    console.log('Retrieving heart: ' + id);
    db.collection('hearts', function(err, collection) {
        collection.findOne({'_id':id}, function(err, item) {
            res.send(item);
        });
    });
};

function findAllHearts(req, res) {
    db.collection('hearts', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

function addHeart(req, res) {
    var heart = req.body;
    console.log('Adding heart: ' + JSON.stringify(heart));
    db.collection('hearts', function(err, collection) {
        collection.insert(heart, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

function updateHeart(req, res) {
    var id = req.params.id;
    var heart = req.body;
    console.log('Updating heart: ' + id);
    console.log(JSON.stringify(heart));
    db.collection('hearts', function(err, collection) {
        collection.update({'_id':id}, heart, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating heart: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(heart);
            }
        });
    });
}

function deleteHeart(req, res) {
    var id = req.params.id;
    console.log('Deleting heart: ' + id);
    db.collection('hearts', function(err, collection) {
        collection.remove({'_id':id}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

var express = require('express');
var app = express();

app.get('/hearts', findAllHearts);
app.get('/hearts/:id', findHeartById);
app.post('/hearts', addHeart);
app.put('/hearts/:id', updateHeart);
app.delete('/hearts/:id', deleteHeart);

app.listen(8001);