var express = require('express')
    path    = require('path');

var app        = module.exports = express(),
    moduleName = path.basename(module.id, ".js");
    
app.get('/invoices', function( req, res ) {
    var token = req.get('X-API-ACCESS-Token');
    if( token === '29902914' ) {
        var response = {
            invoices: [
                { id: 23211, date: '30/11/14', value: '39892.32' },
                { id: 23299, date: '28/11/14', value: '42.10' }
            ]
        }
        res.send(response);
    } else if( token === '29902913' ) {
        res.status(401).send('token expired');
    } else {
        res.status(401).send('you are not authorized to access this resource');
    }
});

app.get('/secret', function( req, res ) {
    var nextLevelUri = module.parent.exports.getNextLevel(moduleName).uri;
    var levelIndex = module.parent.exports.namedIndex[moduleName].index;
  
    var token = req.get('X-API-ACCESS-Token');
    if( token === '29902914' ) {
        var response = 
            module.parent.exports.generateResponse(levelIndex, 
            {            
                message: "Congratulations, you have made it to the next level!"
            },
            {
                next: nextLevelUri
            },
            [
                "OWASP A3:2017 - Sensitive Data Exposure",
                "Don’t rely on tokens that are easily guess-able",
                "Incremental tokens are obviously insecure , but other generators may be susceptible, as well.",
                "UUID v4 and v5 are a safe bet."
                
            ]);
        res.send(response);        
    } else if ( token === '29902913' ) {
        res.send(401, 'token expired');
    } else {
        res.send(401, 'you are not authorized to access this resource');
    }   
});