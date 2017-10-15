// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var mongo = require('mongodb').MongoClient;

var url = 'mongodb://fcc:fccadmin@ds119685.mlab.com:19685/shortener-fcc'

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.enable('trust proxy')
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.json({"error" : "HOME"})
  
});

app.get('/:num', function (request, response) {
  
    mongo.connect(url, function(err, db){
      if(err){
        return console.error(err);
      }
      else{
        var urls = db.collection('urls')
        var num = request.params.num;
        
        urls.find({num : +num},{original_url: 1, _id:0}).toArray(function(err, results){
          if(results.length == 0){
            response.json({"error": "URL not found!"})
          }
          else{
            var url = results[0].original_url;
            response.redirect(url);
          }
        })
        
      }
    })
  
});


app.get('/new/*?', function(request, response) {
    
  mongo.connect(url, function(err, db){
      if(err){
        return console.error(err);
      }
    else{
        var urls = db.collection('urls');
        var num = Math.floor(1000 + Math.random() * 9000);
        var original_url = request.params[0];
        var obj = {"original_url" : original_url, "short_url" : 'http://' + request.hostname + '/' + num}
        var insert_obj = {"original_url" : original_url, "short_url" : 'http://' + request.hostname + '/' + num, "num" : num}
        
        urls.insert(insert_obj);
      
        response.json(obj);
    }
  });  
  
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});


