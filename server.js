var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');

var oxford = require('project-oxford');
client = new oxford.Client('ec2b16bb7cae4ef0a44b59303245dbc4');

var PORT = 3000;

var app = express();
app.set('port', (process.env.PORT || PORT));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

app.get('/result', function(req, res) {
  console.log('public' + req.query.imageURL);
  client.face.detect({
    path: 'public' + req.query.imageURL,
    analyzesAge: true,
    analyzesGender: true
  }).then(function(response) {
    console.log(response);
    res.json(response);
  });
});

app.listen(process.env.PORT || PORT, function(){
  console.log('app starting');
});
