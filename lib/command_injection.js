var express = require('express')
    path    = require('path');

var app        = module.exports = express(),
    moduleName = path.basename(module.id, ".js");

app.get('/documents', function( req, res ) {
    var fileName = req.query.doc;

    var nextLevelUri = module.parent.exports.getNextLevel(moduleName).uri;
    var levelIndex = module.parent.exports.namedIndex[moduleName].index;

    if ( fileName === '/etc/secret.txt' ) {
        var response = 
            module.parent.exports.generateResponse(levelIndex, 
            {            
                message: "congratulations, you have made it to the next level!"
            },
            {
                next: nextLevelUri 
            });
        res.send(response);        
    } else {
        res.status(400).send('Unable to locate the requested PDF document');
    }        
});