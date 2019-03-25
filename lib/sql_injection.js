var express = require('express')
    path    = require('path');

var app        = module.exports = express(),
    moduleName = path.basename(module.id, ".js");

app.get('/orders/:orderId', function( req, res ) {
    var id = decodeURI(req.params.orderId);
    
    var nextLevelUri = module.parent.exports.getNextLevel(moduleName).uri;
    var levelIndex = module.parent.exports.namedIndex[moduleName].index;

    var regex = /(DELETE|DROP|TRUNCATE)/ig
    
    if (id == 1003) {
     var response = 
          module.parent.exports.generateResponse(levelIndex,
          {        
            orders: [{
                id: 1003,
                name: "ferns",
                quantity: 11
            }]                
          });
      res.send(response);   
    }
    
    if (id.match(regex)) { // trying to delete my data? COME ON!
      res.status(401).send("That's just mean! Get your hack in, but don't delete my database!");
    }

    var regexNumeric = /^\d+\s*$/ig

    if (id.match(regexNumeric)) { 
      res.status(404).send("Order item could not be found");
    }
    
    // TODO: needs more work
    var regex2 = /\d+\s+or\s+\d+\s*(=|>|<)\s*\d+/ig

    if( id.match(regex2) ) {        
      var response = 
          module.parent.exports.generateResponse(levelIndex,
          {        
              orders: [{
                  id: 1003,
                  name: "ferns",
                  quantity: 11
              },
              {
                  id: 778201,
                  name: "Burgundy Pinot Noir",
                  quantity: 100            
              },
              {
                  id: 3002,
                  name: "API Gateway",
                  quantity: 15            
              },
              {
                  id: 1442,
                  name: "Congratulations! The next level is: " + nextLevelUri,
                  quantity: 1            
              }]                
          },[],
          [
            "Never pass parameters directly into SQL query",
            "Caution: Parameters may pass through many systems before reaching database",
            "Filter parameters",
            "NoSQL databases are also susceptible to injection"
          ]);
      res.send(response);       
    }   
    
        
});