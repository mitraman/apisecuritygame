var express = require('express');
 
var app = module.exports = express();

app.post('/records', function( req, res ) {
    res.send(401, 'You are not authorized to create this resource');
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
     
     level = module.parent.exports.namedIndex["unprotected_delete"];
     
     var response = module.parent.exports.generateResponse(null, taxRecords);
     res.send(response);
});

app.delete('/records', function( req, res ) {
    var nextLevelUri = module.parent.exports.getNextLevel("unprotected_delete").uri;
    var response = 
        module.parent.exports.generateResponse(null,
        {        
            message: "Congratulations, you have made it to the next level!"
        },
        {
            next: nextLevelUri
        });
    res.send(202, response);
});
