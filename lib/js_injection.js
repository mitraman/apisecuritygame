var express = require('express')
    path    = require('path');

var app        = module.exports = express(),
    moduleName = path.basename(module.id, ".js");

var bodyParser = require('body-parser');
app.use(bodyParser.text());

app.post('/orders', function( req, res ) {    
    
    var nextLevelUri = module.parent.exports.getNextLevel(moduleName).uri;
    var levelIndex = module.parent.exports.namedIndex[moduleName].index;

    var secret_answer = "Congratulations, you have made it through level " + levelIndex + "! Your next API challenge is located at " + nextLevelUri;    
    var secret = secret_answer;
    secret += "\n\nWhat Happened:";
    secret += "\n OWASP A1:2017 - Injection";
    secret += "\n OWASP A8:2017 - Insecure Deserialization";
    secret += "\n\# Server-side code was insecure and looked like:";
    secret += "\n  var secure = \"" + secret_answer + "\"";
    secret += "\n  var responseValue = {\"order_number\": \"3888203-13\"};"
    secret += "\n  var jsonBody = eval( req.body );"
    secret += "\n  res.send(responseValue);"
    secret += "\n\nLessonds learned:";
    secret += "\n  Don’t use eval() for parsing.";
    secret += "\n  All parsers represent an attack surface (XML, JSON, etc..)";
    secret += "\n  Filter messages for safety, before parsing";
    secret += "\n  Only use safe, tested parsers designed for public usage";

    var responseValue = {"order_number": "3888203-13"};    
    try {
      var jsonBody = eval(req.body);    
    }
    catch(err) {
      console.log(err);
      res.send("Error: input body may not be empty");
    }

    response = responseValue;
    res.send(responseValue);
});

app.get('/orders', function( req, res ) {
    res.status(500).send('Order status retrieval has been turned off for this exercise. This is a dead end. Try another hack vector');
});

app.get('/orders/:order_id', function( req, res ) {
    res.status(500).send('Order status retrieval has been turned off for this exercise. This is a dead end. Try another hack vector');
});
