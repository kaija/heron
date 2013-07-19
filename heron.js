var express = require('express');
var app = express();
var redis = require("redis"),
redis_cli = redis.createClient();
redis_cli.on("error", function (err) {
    console.log("error event - " + redis_cli.host + ":" + redis_cli.port + " - " + err);
});

redis_cli.on("connect", function(){
    console.log("Connected to local redis server!.");
});

app.get('/heron/v1/query', function(req, res){
    console.log(req.headers.id);
    console.log(req);
    res.send('hello world');
});

app.post('/heron/v1/insert', function(req, res){
    console.log(req);
    res.send(200);
});

app.listen(9999);
