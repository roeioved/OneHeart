exports.getHeartById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving heart: ' + id);
    db.collection('hearts', function(err, collection) {
        collection.findOne({'_id':id}, function(err, item) {
            res.send(item);
        });
    });
};

exports.getHearts = function(req, res) {
    db.collection('hearts', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addHeart = function(req, res) {
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

exports.updateHeart = function(req, res) {
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

exports.deleteHeart = function(req, res) {
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