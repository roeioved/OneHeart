var db = require('./connectdb').db;
var heart = require('./heart').setDb(db);

var express = require('express');
var app = express();

app.configure(function () {
    app.use(express.logger('dev')); /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

app.get('/hearts', heart.apiFindAll);
app.get('/hearts/:id', heart.apiFindById);
app.post('/hearts', heart.apiAdd);
app.put('/hearts/:id', heart.apiUpdate);
app.delete('/hearts/:id', heart.apiDelete);

app.listen(8001);