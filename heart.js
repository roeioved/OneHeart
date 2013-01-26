var HEARTS_COLLECTION = 'hearts';
var _db;

exports.setDb = function(db) {
    _db = db;
    return exports;
}

exports.findById = function(req, res) {
    var id = req.params.id;
    _db.collection(HEARTS_COLLECTION, function(err, collection) {
        collection.findOne({'_id':id}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    _db.collection(HEARTS_COLLECTION, function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.add = function(req, res) {
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

exports.update = function(req, res) {
    var id = req.params.id;
    var heart = req.body;
    _db.collection(HEARTS_COLLECTION, function(err, collection) {
        collection.update({'_id':id}, heart, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send(heart);
            }
        });
    });
}

exports.delete = function(req, res) {
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