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

app.get('/heron/v1/query_id', function(req, res){
    console.log(req.headers.id);
    console.log(req);
    res.send('hello world');
});

app.get('/heron/v1/query_id_key', function(req, res){
    console.log(req);
    res.send(200);
});


app.post('/heron/v1/insert', function(req, res){
    console.log(req);
    res.send(200);
});

app.delete('/heron/v1/delete_id', function(req, res){
    console.log(req);
    res.send(200);
});

app.delete('/heron/v1/delete_id_key', function(req, res){
    console.log(req);
    res.send(200);
});

app.listen(9999);
