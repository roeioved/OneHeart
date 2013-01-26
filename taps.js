var TAPS_COLLECTION = 'taps';
var _db;

exports.setDb = function(db) {
    _db = db;
    return exports;
}

exports.findByHeart = function(heart, callback) {
    _db.collection(TAPS_COLLECTION, function(err, collection) {
        collection.find({'heart':heart}).toArray(function(err, items) {
            callback(items);
        });
    });
};

// returns all specific heart taps that thier to timestamp is within the last ms
exports.findByHeartAndTime = function(heart, ms, callback) {
    var min = new Date().getTime() - ms;
    _db.collection(TAPS_COLLECTION, function(err, collection) {
        collection.find({$and:[{'heart':heart},{'to':{$gte:min}}]}).toArray(function(err, items) {
            callback(items);
        });
    });
};

exports.findAll = function(callback) {
    _db.collection(TAPS_COLLECTION, function(err, collection) {
        collection.find().toArray(function(err, items) {
            callback(items);
        });
    });
};

exports.add = function(heart, ms, taps) {
    var item = {};
    item.heart = heart;
    item.to = new Date().getTime();
    item.from = item.to - ms;
    item.taps = taps;

    _db.collection(TAPS_COLLECTION, function(err, collection) {
        collection.insert(item, {safe:true}, function(err, result) {
            if (err) {
                return false;
            } else {
                return true;
            }
        });
    });
}

exports.delete = function(heart, timestamp) {
    // todo: delete all taps
}