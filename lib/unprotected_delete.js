var express = require('express')
    path    = require('path');

var app        = module.exports = express(),
    moduleName = path.basename(module.id, ".js");

app.post('/records', function( req, res ) {
    res.status(401).send('You are not authorized to create this resource');
});

app.get('/records', function( req, res ) {
    var taxRecords =  {
         records: [
         {        
             statement_date: '14/07/2013',
             amount_due: '2399.00'
         },
         {        
             statement_date: '15/07/2013',
             amount_due: '92.30'
         },
         {        
             statement_date: '14/07/2013',
             amount_due: '-1402.03'
         },
         {        
             statement_date: '14/07/2013',
             amount_due: '322.22'
         },
         {        
             statement_date: '16/07/2013',
             amount_due: '19399.39'
         },
         {        
             statement_date: '14/07/2013',
             amount_due: '-2.20'
         },
         {        
             statement_date: '14/07/2013',
             amount_due: '14.00'
         },
         {        
             statement_date: '14/07/2013',
             amount_due: '63993.32'
         },
         ]
     };
     
     level = module.parent.exports.namedIndex[moduleName];
     
     var response = module.parent.exports.generateResponse(null, taxRecords);
     res.send(response);
});

app.delete('/records', function( req, res ) {
    var nextLevelUri = module.parent.exports.getNextLevel(moduleName).uri;
    var levelIndex = module.parent.exports.namedIndex[moduleName].index;
    var response = 
        module.parent.exports.generateResponse(levelIndex,
        {        
            message: "Congratulations, you have made it to the next level!"
        },
        {
            next: nextLevelUri
        },
        [
            "URI Style APIs are object-focused",
            "Tooling/frameworks may automate object access for CRUD pattern. This can be dangerous",
            "Proactively white-list object access – do not allow access by default!"
        ]);
    res.status(202).send(response);
});
