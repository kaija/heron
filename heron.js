var cluster = require('cluster');

HTTP_PORT = 80;
HTTPS_PORT = 443;

if(cluster.isMaster) {

  var cpu = require('os').cpus().length;
  for (var i = 0; i < cpu ; i+=1) {
    cluster.fork();
  }

}else{
  var express = require('express');
  var https = require('https');
  var fs = require('fs');

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


  var register = function(app){
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.set('views', __dirname + '/views');
    app.engine('html', require('ejs').renderFile);


    app.get('/', function(req, res){
        res.render('index.html');
    });

    app.get('/heron/v1/query_id_all', function(req, res){
      if(redis_conn){
        if(req.query.id != null){
          console.log("Query all key value with id [" + req.query.id + "]");
          redis_cli.hkeys(req.query.id, function(err, obj){
            var query = [];
            for(var i in obj){
              var key = obj[i];
              query.push(key);
            }
            var result = [];
            redis_cli.hmget(req.query.id, query, function(err, val){
              for(var i in obj){
                var key = obj[i];
                var va  = val[i];
                result.push({"key":key, "val":va});
              }
              res.send(200, result);
            });
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
        if(req.query.id != null && req.query.key != null){
          console.log("Query with id [" + req.query.id + "]  key [" + req.query.key +"]" );
          redis_cli.hmget(req.query.id, req.query.key ,function(err, obj){
            res.send(200, obj);
          });
        }else{
          res.send(400, "Missing parameter...");
        }
      }else{
        res.send(500, "Database not ready!");
      }
    });

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

    app.post('/heron/v1/insert', function(req, res){
      if(redis_conn){
        if(req.body.id != null && req.body.val != null){
          var mkey;
          if(req.body.key != null){
            mkey = req.body.key;
          }else{
            mkey = new Date().getTime();
          }
          console.log("Insert with id [" + req.body.id + "]  key [" + mkey +"] val ["  + req.body.val + "]");
          redis_cli.hmset(req.body.id, mkey, req.body.val);
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
        if(req.query.id != null && req.query.key != null){
          console.log("Delete id  [" + req.query.id + "] key [" + req.query.key +"]");
          redis_cli.hdel(req.query.id, req.query.key, function(err, obj){
            res.send(200);
          });
        }else{
          res.send(400, "Missing parameter...");
        }
      }else{
        res.send(500, "Database not ready!");
      }
    });
  };



  var http = express();
  register(http);
  http.listen(HTTP_PORT);

  var options = {
    key: fs.readFileSync("/home/kaija/source/heron/heron/ssl.key"),
    cert: fs.readFileSync("/home/kaija/source/heron/heron/ssl.crt")
  };
  https.createServer(options, http).listen(HTTPS_PORT);

}
