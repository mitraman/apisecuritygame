var express = require('express')
    path    = require('path');

var app        = module.exports = express(),
    moduleName = path.basename(module.id, ".js");

var bodyParser = require('body-parser');
app.use(bodyParser.text());

app.post('/orders', function( req, res ) {    
    
    var nextLevelUri = module.parent.exports.getNextLevel(moduleName).uri;
    var levelIndex = module.parent.exports.namedIndex[moduleName].index;

    var secret = "Congratulations, you have made it through level " + levelIndex + "! Your next API challenge is located at " + nextLevelUri;    

    var responseValue = {"order_number": "3888203-13"};    
    try {
      var jsonBody = eval(req.body);    
    }
    catch(err) {
      console.log(err);
      res.send("Error: input body may not be empty");
    }

    res.send(responseValue);
});

app.get('/orders', function( req, res ) {
    res.status(500).send('Order status retrieval has been turned off for this exercise. This is a dead end. Try another hack vector');
});

app.get('/orders/:order_id', function( req, res ) {
    res.status(500).send('Order status retrieval has been turned off for this exercise. This is a dead end. Try another hack vector');
});
