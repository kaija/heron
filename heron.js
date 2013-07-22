var express = require('express');
var app = express();
var redis = require("redis"),
redis_cli = redis.createClient();

redis_cli.on("error", function (err) {
    console.log("error event - " + redis_cli.host + ":" + redis_cli.port + " - " + err);
});

redis_conn = false;

redis_cli.on("connect", function(){
    console.log("Connected to local redis server!.");
    redis_conn = true;
});

app.use(express.bodyParser());

app.get('/heron/v1/query_id', function(req, res){
  if(redis_conn){
    if(req.query.id != null){
      console.log("Query with id [" + req.query.id + "]");
      redis_cli.hkeys(req.query.id, function(err, obj){
        res.send(200, obj);
      });
    }else{
      res.send(400, "Missing parameter...");
    }
  }else{
    res.send(500, "Database not ready!");
  }
});

app.get('/heron/v1/query_id_key', function(req, res){
  if(redis_conn){
    if(req.query.id != null && req.query.time != null){
      console.log("Query with id [" + req.query.id + "]  key [" + req.query.time +"]" );
      redis_cli.hmget(req.query.id, req.query.time ,function(err, obj){
        res.send(200, obj);
      });
    }else{
      res.send(400, "Missing parameter...");
    }
  }else{
    res.send(500, "Database not ready!");
  }
});


app.post('/heron/v1/insert', function(req, res){
  if(redis_conn){
    if(req.body.id != null && req.body.val != null){
      var time = new Date().getTime();
      console.log("Insert with id [" + req.body.id + "]  time [" + time +"] val ["  + req.body.val + "]");
      redis_cli.hmset(req.body.id, time, req.body.val);
      res.send(200);
    }else{
      res.send(400, "Missing parameter...");
    }
  }else{
    res.send(500, "Database not ready!");
  }
});

app.delete('/heron/v1/delete_id', function(req, res){
  if(redis_conn){
    if(req.query.id != null){
      console.log("Delete id all value [" + req.query.id + "]");
      redis_cli.del(req.query.id, function(err, obj){
        res.send(200);
      });
    }else{
      res.send(400, "Missing parameter...");
    }
  }else{
    res.send(500, "Database not ready!");
  }
});

app.delete('/heron/v1/delete_id_key', function(req, res){
  if(redis_conn){
    if(req.query.id != null && req.query.time != null){
      console.log("Delete id  [" + req.query.id + "] time [" + req.query.time +"]");
      redis_cli.hdel(req.query.id, req.query.time, function(err, obj){
        res.send(200);
      });
    }else{
      res.send(400, "Missing parameter...");
    }
  }else{
    res.send(500, "Database not ready!");
  }
});

app.listen(9999);
