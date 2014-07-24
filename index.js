var express = require('express'),
app = express();

var bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use('/docs', express.static('docs'));

// API
app.get('/', function(req, res){
    var response = {message: "GET /granitebed to get started."};
    res.send(response);
});

/**
 * Level 0
 * 
*/
app.get('/granitebed', function( req, res ) {
    var response = {
        level: "0",
        instructions: "retrieve /granitebed/welcome in order to move to level 1.",        
    };
    res.send(response);
});

app.get('/granitebed/welcome', function( req, res ) {
    var response = {
        level: "0",
        message: "congratulations, you have made it to level 1!  Follow the link in the next property to get your next set of instructions.",
        next: "/funnybadger"
    };
    res.send(response);
});

/**
 * Level 1
 * 
*/
app.get('/funnybadger', function( req, res ) {
    var response = {
        level: "1",
        instructions: "The link to the next level is located in a secret resource.  You must find and retrieve this resource.",
        hint: "the name of the secret resource is: secrets"
    };
    res.send(response);
});

app.get('/funnybadger/secrets', function( req, res ) {
    var response = {
        level: "1",
        message: "congratulations, you have made it to level 2!",
        next: "/valuehorn"
    };
    res.send(response);
});

/**
 * Level 2
 * 
*/
app.get('/valuehorn', function( req, res ) {
    var response = {
        level: "2",
        instructions: "The secret resource you need is located on a backend server.  Find the address of the backend server and make a GET call to the root URI",
        hint: "look for implementation details that may be leaking in this response"
    };
    res.setHeader('X-Version', '3.2.3');
    res.setHeader('X-SecretsServer', '/sanityblanket');
    res.setHeader('X-MessageID', '1999a0sdd');
    res.send(response);
});
app.get('/sanityblanket', function( req, res ) {
    var response = {
        level: "2",
        message: "congratulations, you have made it to level 3!",
        next: "/publicitytax"
    };
    res.send(response);
});

/**
 * Level 3
 * 
*/
app.get('/publicitytax', function( req, res ) {
    var response = {
        level: "3",
        instructions: "Remove all of the tax records from this tax record API",
        hint: "This API's documentation is located at /docs/publicitytax.html"
    };
    res.send(response);
});

app.get('/publicitytax/records', function( req, res ) {
    var response = {
        level: "3",
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
    res.send(response);
});
            
app.delete('/publicitytax/records', function( req, res ) {
    var response = {
        level: "3",
        message: "congratulations, you have made it to level 4!",
        next: "/remedybus"
    };
    res.send(response);
});
           
            
/**
 * Level 4
 * 
*/
app.get('/remedybus', function( req, res ) {
    var response = {
        level: "4",
        instructions: "The link to the next level is hidden in Jay Grime's student record.",
        hint: "The student record you are authorized to see is /remedybus/students/778820.  Jay Grime's student ID is 778441"
    };
    res.send(response);
});

app.get('/remedybus/students/:studentId', function( req, res ) {
    var studentId = req.params.studentId;    
    
    if( studentId === '778820' ) {
        var response = {
            level: "4",
            student_record: {
                id: 778820,
                name: "Wally Walliston",
                date_of_birth: "11-30-1976",
                notes: "Wally is a great student."            
            }                
        };    
        res.send(response);
    } else {
        res.send(403, 'You are not authorized to retrieve this resource.');
    }
});

app.get('/remedybus/students', function( req, res ) {
    var response = {
        level: "4",
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
            notes: "Congratulations!  Go to /speakercube for the next API"            
        }]                
    };
    res.send(response);
});

/**
 * Level 5
 * 
*/
app.get('/speakercube', function( req, res ) {
    var response = {
        level: "5",
        instructions: "The link to the next API is located in the protected resource : /speakercube/secret",
        hint: "A sample client application is available at /docs/speakercubeapp.html"
    };
    res.send(response);
});

app.get('/speakercube/invoices', function(req, res ) {
    var token = req.get('X-API-ACCESS-Token');
    if( token === 'leapingzebras' ) {
        var response = {
            invoices: [
                { id: 23211, date: '30/11/14', value: '39892.32' },
                { id: 23299, date: '28/11/14', value: '42.10' }
            ]
        }
        res.send(response);
    }else {
        res.send(401, 'You are not authorized to access this resource');
    }
});

app.get('/speakercube/secret', function( req, res ) {
    var token = req.get('X-API-ACCESS-Token');
    if( token === 'leapingzebras' ) {
        var response = {
            level: "5",
            message: "congratulations, you have made it to level 6!",
            next: "THAT IS THE END FOR NOW! Stay tuned for more."
        };
        res.send(response);
    } else {
        res.send(401, 'You are not authorized to access this resource');
    }
    
});

/**
 * Level 6
 * 
*/
app.get('/stoneorder', function( req, res ) {
    var response = {
        level: "6",
        instructions: "",
        hint: ""
    };
    res.send(response);
});

/**
 * Level 7
 * 
*/
app.get('/tractorguitar', function( req, res ) {
    var response = {
        level: "7",
        instructions: "",
        hint: ""
    };
    res.send(response);
});

/**
 * Level 8
 * 
*/
app.get('/saladsummit', function( req, res ) {
    var response = {
        level: "8",
        instructions: "",
        hint: ""
    };
    res.send(response);
});

/**
 * Level 9
 * 
*/
app.get('/sardineladder', function( req, res ) {
    var response = {
        level: "9",
        instructions: "",
        hint: ""
    };
    res.send(response);
});

/**
 * Level 10
 * 
*/
app.get('/beltpoem', function( req, res ) {
    var response = {
        level: "10",
        instructions: "",
        hint: ""
    };
    res.send(response);
});

var port = process.env.PORT || 8082;
app.listen(port);
console.log('Express server started on port %s', port);