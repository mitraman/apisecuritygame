var express = require('express')
    path    = require('path');
 
var app        = module.exports = express(),
    moduleName = path.basename(module.id, ".js");
 
app.get('/invoices', function(req, res ) {
    var token = req.get('X-API-ACCESS-Token');
    if( token === 'leapingzebras' ) {
        var response = {
            invoices: [
                { id: 23211, date: '30/11/14', value: '39892.32' },
                { id: 23299, date: '28/11/14', value: '42.10' }
            ]
        }
        res.send(response);
    } else {
        res.status(401).send('You are not authorized to access this resource');
    }
});

app.get('/secret', function( req, res ) {
    var token = req.get('X-API-ACCESS-Token');
    if( token === 'leapingzebras' ) {
        var nextLevelUri = module.parent.exports.getNextLevel(moduleName).uri;
        var levelIndex = module.parent.exports.namedIndex[moduleName].index;
        var response = 
            module.parent.exports.generateResponse(levelIndex,
            {            
                message: "Congratulations, you have made it to the next level!",
            },
            {
                next: nextLevelUri                             
            },
            [
                "OWASP A3:2017 - Sensitive Data Exposure",
                "Single page apps are often too easy to reverse-engineer, if not carefully designed",
                "Don’t put access codes in publicly viewable places"
            ]);
        res.send(response);
    } else {
        res.status(401).send('You are not authorized to access this resource');
    }

});