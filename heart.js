var HEARTS_COLLECTION = 'hearts';
var _db;

exports.setDb = function(db) {
    _db = db;
    return exports;
}

exports.findById = function(id, callback) {
    _db.collection(HEARTS_COLLECTION, function(err, collection) {
        collection.findOne({'_id':id}, function(err, item) {
            callback(item);
        });
    });
};

exports.apiFindById = function(req, res) {
    var id = req.params.id;
    exports.findById(id, function(item) {
        res.send(item);
    });
};

exports.findAll = function(callback) {
    _db.collection(HEARTS_COLLECTION, function(err, collection) {
        collection.find().toArray(function(err, items) {
            callback(items);
        });
    });
};

exports.apiFindAll = function(req, res) {
    exports.findAll(function(items) {
        res.send(items);
    });
};

exports.apiAdd = function(req, res) {
    var heart = req.body;
    _db.collection(HEARTS_COLLECTION, function(err, collection) {
        collection.insert(heart, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send(result[0]);
            }
        });
    });
}

exports.updateNumOfUsers = function(id, numOfUsers, callback) {
    _db.collection(HEARTS_COLLECTION, function(err, collection) {
        collection.update({'_id':id}, {$set:{'num_of_users':numOfUsers}}, {upsert:true, safe:true}, function(err, result) {
            callback(err);
        });
    });
}

exports.updateAverageTapsAndPoints = function(id, averageTaps, points, callback) {
    _db.collection(HEARTS_COLLECTION, function(err, collection) {
        collection.update({'_id':id}, {$set:{'average_taps':averageTaps, 'points':points}}, {upsert:true, safe:true}, function(err, result) {
            callback(err);
        });
    });
}

exports.apiUpdate = function(req, res) {
    var id = req.params.id;
    var heart = req.body;

    _db.collection(HEARTS_COLLECTION, function(err, collection) {
        collection.update({'_id':id}, heart, {upsert:true, safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send(heart);
            }
        });
    });
}

exports.apiDelete = function(req, res) {
    var id = req.params.id;
    _db.collection(HEARTS_COLLECTION, function(err, collection) {
        collection.remove({'_id':id}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                res.send(req.body);
            }
        });
    });
}