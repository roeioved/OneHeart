var db = require('./connectdb').db;
var heart = require('./heart');

var express = require('express');
var app = express();

app.configure(function () {
    app.use(express.logger('dev')); /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

app.get('/hearts', heart.getHearts);
app.get('/hearts/:id', heart.getHeartById);
app.post('/hearts', heart.addHeart);
app.put('/hearts/:id', heart.updateHeart);
app.delete('/hearts/:id', heart.deleteHeart);

app.listen(8001);