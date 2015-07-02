var express = require('express'),
    app     = express(),
    _       = require('lodash'),
    conf    = require('config');

app.use('/docs', express.static('docs'));

// API's Home Document
app.get('/', function(req, res) {
    res.redirect('/docs/help.html');
});

app.get('/starthere', function(req, res){
    var firstLevel = 1;
    var response = {message: "The first API is located at " +  conf.levels[0].uri + ".  Good Luck!"};
    res.send(response);
})

// Set up levels
conf.levels.forEach(setupChallengeLevel);

function setupChallengeLevel(currLevel, levelIndex, allLevels) {
  // Level's task
  app.get(currLevel.uri, function(req, res) {
    
      var props = {};
      props.objective    = currLevel.objective;
      props.instructions = currLevel.instructions;
      
      var links = {};
           
      // Do we have any hints to take care of?      
      if (currLevel.hints && Array.isArray(currLevel.hints)) {
        links.hint = currLevel.hints[0].uri;        
                  
        app.get(currLevel.hints[0].uri, function(req, res) {  
          
          var hint0props = {};
              hint0props.message = currLevel.hints[0].message;
          var hint0links = {};
              
              // Do we have second hint? (rare).
              if (currLevel.hints[1]) {
                hint0links.hint = currLevel.hints[1].uri
                app.get(currLevel.hints[1].uri, function(req, res) {          
                  
                  var hint1properties = { message: currLevel.hints[1].message }
                  var hint1response = generateResponse(levelIndex, 
                                                       hint1properties);
                  res.send(hint1response);
                });
                
              }
                                        
          var hint0response = generateResponse(levelIndex, hint0props, hint0links);    
          res.send(hint0response);
        });  
      }
      
      var response = generateResponse( levelIndex, 
                                       props, links);

      if (currLevel.headers && currLevel.headers.length > 0) { 
        for ( var headerIdx in currLevel.headers ) {
          // Header entries in our config are single string, because
          // YAML can be a major pain in the neck with characters in the keys
          // so we have to split those here, post-factum:
          var headerParts = currLevel.headers[headerIdx].split(":");
          res.set(_(headerParts[0]).trim(), _(headerParts[1]).trim());
        }
      }
                                       
      res.send(response);
  });
    
  // Level's solution
  if (currLevel.solution && currLevel.solution.uri) {
    app.get(currLevel.solution.uri, function( req, res ) {
        
        if (allLevels && allLevels[levelIndex+1] && allLevels[levelIndex+1].uri) {
          var nextLevelUri = allLevels[levelIndex+1].uri;
        }        
        
        var response = 
          generateResponse( levelIndex, 
                            { message: currLevel.solution.response },
                            { next: nextLevelUri });                            
        res.send(response);
    });    
  }
  
}


var port = process.env.PORT || 8082;
app.listen(port);
console.log('Express server started on port %s', port);

//--- Helper Functions

function generateResponse(levelIndex, properties, links) {
    var response = {};
    
    // Humans love indexes that start with 1, but machins love 0s
    response.level = levelIndex + 1; 
    
    for( var key in properties ) {
        response[key] = properties[key];
    }
    
    if ( links ) {
        response.links = [];
        for( var key in links ) {
            response.links.push({rel: key, href: links[key]});
        }
    }
    if (response.links && response.links.length < 1 ) { delete response.links; }
    
    return response;
}