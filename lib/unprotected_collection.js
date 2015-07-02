var express = require('express');
 
var app = module.exports = express();
 
 
app.get('/students/:studentId', function( req, res ) {
    var studentId = req.params.studentId;    

    if( studentId === '778820' ) {
        var response = 
            module.parent.exports.generateResponse(null,
            {            
                student_record: {
                    id: 778820,
                    name: "Wally Walliston",
                    date_of_birth: "1976-11-30",
                    notes: "Wally is a great student."            
                }                
            });    
        res.send(response);
    } else {
        res.send(403, 'You are not authorized to retrieve this resource.');
    }
});

app.get('/students', function( req, res ) {
    
    var nextLevelUri = module.parent.exports.getNextLevel("unprotected_collection").uri;
    
    var response = 
        module.parent.exports.generateResponse(null,
        {        
            student_records: [{
                id: 778820,
                name: "Wally Walliston",
                date_of_birth: "11-30-1976",
                notes: "Wally is a great student."            
            },
            {
                id: 778201,
                name: "Ben Cleaver",
                date_of_birth: "02-15-2001",
                notes: ""            
            },
            {
                id: 778441,
                name: "Jay Grimes",
                date_of_birth: "12-22-1979",
                notes: "Congratulations!  Go to " + nextLevelUri + " for the next API"            
            }]                
        });
    res.send(response);
});