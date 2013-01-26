var db = require('./connectdb').db;
var heart = require('./heart').setDb(db);

var express = require('express');
var app = express();

app.configure(function () {
    app.use(express.logger('dev')); /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

app.get('/hearts', heart.findAll);
app.get('/hearts/:id', heart.findById);
app.post('/hearts', heart.add);
app.put('/hearts/:id', heart.update);
app.delete('/hearts/:id', heart.delete);

app.listen(8001);