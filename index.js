var express = require('express'),
app = express();

var bodyParser = require('body-parser');

app.use(bodyParser.text());
// Parse JSON content as text so we can use an eval to parse it.  This will allow us to test a JS vulnerability
//app.use(bodyParser.text({type: 'application/json'}));

// Static directory
app.use('/docs', express.static('docs'));

// Setup database connection
var pg = require('pg');
var conString = "postgres://postgres:postgres@localhost/security_game";

var levels = {    
    intro : {
        description : "A simple introductory level to teach the player how the game works.",
        uri : "/granitebed"
    },
    private_resource : {
        description : "Find an undocumented resource by guessing the resource name ",
        uri : "/funnybadger"
    },
    leaky_header : {
        description : "Locate a private backend server by looking at response headers",
        uri : "/valuehorn"
    },
    unprotected_delete : {
        description : "Delete a set of resources by making an undocumented call",
        uri : "/publicitytax"
    },
    unprotected_collection : {
        description : "Retrieve a collection to find a hidden datum",
        uri : "/remedybus"
    },
    spoof_token : {
        description : "Steal a token from a javascript application and use it access a resource",
        uri : "/speakercube"
    },
    js_injection : {
        description: "Use javascript injection to retrieve a variable from memory",
        uri: "/sardineladder"
    },
    predictable_token: {
        description: "an incremental access token that can be easily guessed",
        uri: "/tractorguitar"
    },
    sql_injection: {
        description : "An unprotected SQL call against a postgres DB that is open for exploitation.  The next link is located in the data",
        uri: "/stoneorder"
    },    
    command_injection: {
        description: "Access a protected file resource (simulated)",        
        uri : "/saladsummit"
    },
    mobile_app_key: {
        description: "Extract an API secret key by reverse engineering a mobile app (requires advanced tooling)",
        uri: "/hazygorilla"
    },
    finish: {
        description: "A success message indicating that the player has won the game",
        uri: "/beltpoem"
    }
}

// Sets the order of levels and allows us to easily enable or disable levels.
// For example, I usually disable SQL and javascript injection for cloud implementations.
//var levelOrder = ["intro", "private_resource", "leaky_header", "unprotected_delete", "",  "finish" ];
var levelOrder = [
    levels.intro, 
    levels.private_resource, 
    levels.leaky_header, 
    levels.unprotected_delete, 
    levels.unprotected_collection,  
    levels.spoof_token,
    levels.js_injection,
    levels.predictable_token,
    levels.command_injection,
    levels.sql_injection,
    levels.finish];

function generateResponse(level, properties, links) {
    var response = {};
    
    for( var i = 0; i < levelOrder.length; i++ ) {
        if( levelOrder[i] === level ) {
            response.level = i;
        }
    }
    
    for( var key in properties ) {
        response[key] = properties[key];
    }
    if( links ) {
        response.links = [];
        for( var key in links ) {
            response.links.push({rel: key, href: links[key]});
        }
    }
    return response;
}

function getNextLevelId(currentLevel) {
    // Find this level identifier in the array of levels
    var index = -1;
    for( var i = 0; i < levelOrder.length; i++ ) {
        if( levelOrder[i] === currentLevel ) {
            index = i;
            break;
        }
    }
    
    if( index < 0 || index === levelOrder.length ) {
        return "";
    }else {
        return levelOrder[index+1].uri;        
    }    
}

// API
app.get('/', function(req, res) {
    res.redirect('/docs/help.html');
});

app.get('/starthere', function(req, res){
    var firstLevel = levelOrder[0];
    var response = {message: "The first API is located at " +  firstLevel.uri + ".  Good Luck!"};
    res.send(response);
})

/**
 * Introductory Level
 * 
*/
app.get(levels.intro.uri, function( req, res ) {
    var response = 
        generateResponse(levels.intro, 
        {
        objective: "retrieve a resource", 
        instructions: "retrieve " + levels.intro.uri + "/welcome in order to move to level 1."
        });
    res.send(response);
});

app.get(levels.intro.uri + '/welcome', function( req, res ) {
    var nextLevel = getNextLevelId(levels.intro);
    console.log(nextLevel);
    var response = 
    generateResponse(levels.intro, 
    {
        message: "congratulations, you have made it to the next level!  Follow the link with a rel of 'next' to retrieve the next level's instructions."
    },
    {
        next: nextLevel
    });
    res.send(response);
});

/**
 * Introductory Level
 * 
*/
app.get(levels.private_resource.uri, function( req, res ) {
    var response = 
    generateResponse(levels.private_resource, 
        {
            objective: "retrieve a secret resource", 
            instructions: "The link to the next level is located in a list of invoices.  You must find and retrieve this private resource and retrieve it. If you get stuck you can follow the hint link - but try to solve the puzzle yourself first."
        }, 
        {
            hint: levels.private_resource.uri + '/hint'
        });
    res.send(response);
});

app.get(levels.private_resource.uri + '/hint', function( req, res ) {
    var response = 
    generateResponse(levels.private_resource, 
        {
            message: "the resource can be accessed by guessing the URL.  What is a likely name for an invoices resource? If you are still stuck follow the link to the next hint"
        }, 
        {
            hint: levels.private_resource.uri + '/hint/jackal'
        });    
    res.send(response);
});

app.get(levels.private_resource.uri + '/hint/jackal', function( req, res ) {
    var response = 
    generateResponse(levels.private_resource,                     
    {        
        message: "the resource is located at " + levels.private_resource.uri + "/invoices"
    });
    res.send(response);
});

app.get(levels.private_resource.uri + '/invoices', function( req, res ) {
    var nextLevel = getNextLevelId(levels.private_resource);
    var response = 
    generateResponse(levels.private_resource,
    {      
        message: "congratulations, you have made it to the next level!"
    },
    {
        next: nextLevel
    });
    res.send(response);
});

/**
 * Leaky Header
 * 
*/
app.get(levels.leaky_header.uri, function( req, res ) {            
    var response = 
        generateResponse(levels.leaky_header,
        {        
            objective: "Find an undocumented, secret resource",
            instructions: "The secret resource you need is located in a secret backend server.  Find the address of the backend server and make a GET call to its root URI.",        
        },
        {
            hint: levels.leaky_header.uri + '/hint'
        });
    
    res.setHeader('X-Version', '3.2.3');
    res.setHeader('X-SecretsServer', '/sanityblanket');
    res.setHeader('X-MessageID', '1999a0sdd');
    res.send(response);
});
app.get('/sanityblanket', function( req, res ) {
    var nextLevel = getNextLevelId(levels.leaky_header);
    var response = 
        generateResponse(levels.leaky_header,
        {        
            message: "congratulations, you have made it to the next level!"
        },
        {
            next: nextLevel
        });
    res.send(response);
});

app.get(levels.leaky_header.uri + '/hint', function( req, res ) {
    var response = 
        generateResponse(levels.leaky_header,
        {        
            message: "look for implementation details that might be leaking in this APIs response"        
        });
    res.setHeader('X-Version', '3.2.3');
    res.setHeader('X-SecretsServer', '/sanityblanket');
    res.setHeader('X-MessageID', '1999a0sdd');
    res.send(response);
});



/**
 * Level 3
 * 
*/
app.get(levels.unprotected_delete.uri, function( req, res ) {
    var response = 
        generateResponse(levels.unprotected_delete, 
        {
            objective: "Remove a collection of records from an API.",
            instructions: "Determine how to remove all of the tax record resources.  Open the documentation link in your browser to read the documentation for this level's API."
        },
        {
            documentation: '/docs/publicitytax.html'
        });                
    res.send(response);
});

app.post(levels.unprotected_delete.uri + '/records', function( req, res ) {
    res.send(401, 'you are not authorized to create this resource');
});
app.get(levels.unprotected_delete.uri + '/records', function( req, res ) {
    var response = 
        generateResponse(levels.unprotected_delete,
        {
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
    });
    res.send(response);
});
            
app.delete(levels.unprotected_delete.uri + '/records', function( req, res ) {
    var nextLevel = getNextLevelId(levels.unprotected_delete);
    var response = 
        generateResponse(levels.unprotected_delete,
        {        
            message: "Congratulations, you have made it to the next level!"
        },
        {
            next: nextLevel
        });
    res.send(202, response);
});
           
            
/**
 * Level 4
 * 
*/
app.get(levels.unprotected_collection.uri, function( req, res ) {
    var response = 
        generateResponse(levels.unprotected_collection, 
            {
                objective: "Retrieve a private resource",            
                instructions: "The link to the next level is hidden in Jay Grime's student record.  However, the only student record you are authorized to retrieve is " + levels.unprotected_collection.uri + "/students/778820.  Jay Grime's student ID is 778441"
            });    
    res.send(response);
});

app.get(levels.unprotected_collection.uri + '/students/:studentId', function( req, res ) {
    var studentId = req.params.studentId;    
    
    if( studentId === '778820' ) {
        var response = 
            generateResponse(levels.unprotected_collection,
            {            
                student_record: {
                    id: 778820,
                    name: "Wally Walliston",
                    date_of_birth: "11-30-1976",
                    notes: "Wally is a great student."            
                }                
            });    
        res.send(response);
    } else {
        res.send(403, 'You are not authorized to retrieve this resource.');
    }
});

app.get(levels.unprotected_collection.uri + '/students', function( req, res ) {
            var nextLevel = getNextLevelId(levels.unprotected_collection);
    var response = 
        generateResponse(levels.unprotected_collection,
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
                notes: "Congratulations!  Go to " + nextLevel + " for the next API"            
            }]                
        });
    res.send(response);
});

/**
 * Level 5
 * 
*/
app.get(levels.spoof_token.uri, function( req, res ) {
    var response = 
        generateResponse(levels.spoof_token,
        {
            objective: "Bypass access control and retrieve a protected resource",
            instructions: "The link to the next API is located in the protected resource : " + levels.spoof_token.uri + "/secret.  You can view a sample app client by following the url in the app property of this response."
        },
        {
            app: "/docs/speakercubeapp.html"
        });
    res.send(response);
});

app.get(levels.spoof_token.uri + '/invoices', function(req, res ) {
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

app.get(levels.spoof_token.uri + '/secret', function( req, res ) {
    var token = req.get('X-API-ACCESS-Token');
    if( token === 'leapingzebras' ) {
        var nextLevel = getNextLevelId(levels.spoof_token);
        var response = 
            generateResponse(levels.spoof_token,
            {            
                message: "congratulations, you have made it to the next level!",
            },
            {
                next: nextLevel                             
            });
        res.send(response);
    } else {
        res.send(401, 'You are not authorized to access this resource');
    }
    
});

/**
 * Level 6
 * 
*/
app.get(levels.js_injection.uri, function( req, res ) {
    var response = 
        generateResponse(levels.js_injection,
        {
            objective: "Execute arbitrary javascript code",
            instructions: "The URI for the next resource is located in a serverside javascript variable called: 'secret'"
        },
        {
            documentation: "/docs/sardineladder.html",
            hint: levels.js_injection.uri + "/hint"
        });
    res.send(response);
});

app.get(levels.js_injection.uri + '/hint', function(req, res ) {
   var response = 
       generateResponse(levels.js_injection, 
        {
            message: "The API server is evaluating the JSON request bodies with an eval() statement."
        },
       {
           hint: levels.js_injection.uri + '/hint/BerryBadger'
       }
   );
    res.send(response);
});

app.get(levels.js_injection.uri + '/hint/BerryBadger', function(req, res ) {
   var response = generateResponse(levels.js_injection, 
    {
        message: "The server uses the variable responseValue to store the response it is sending.  Try sending responseValue='test' as the body of a POST request.  Consult this API's documentation to find a resource you can POST to."
    }
   );
    res.send(response);
});

app.post(levels.js_injection.uri + '/orders', function( req, res ) {    
    var secret = 'Congratulations, you have made it to level 7!  Your next API is located at ' + getNextLevelId(levels.js_injection);    
    //console.dir(req.body);
        
    var responseValue = {"order_number": "3888203-13"};    
    try {
      var jsonBody = eval(req.body);    
    }
    catch(err) {
      console.log(err);
      res.send("Error: input body may not be empty");
    }
    
    res.send(responseValue);
});

app.get(levels.js_injection.uri + '/orders', function( req, res ) {
    res.send(500, 'Sorry, order status retrieval is temporarily down');
});

app.get(levels.js_injection.uri + '/orders/:order_id', function( req, res ) {
    res.send(500, 'Sorry, order status retrieval is temporarily down');
});

/** Add APi documentation so students learn that they can POST data to orders **/

/**
 * Incremental Access Token
 * 
*/
app.get(levels.predictable_token.uri, function( req, res ) {
    var response = 
        generateResponse(levels.predictable_token,
        {
            obejctive: "Bypass access control by guessing predictable access token to retrieve a protected resource.",
            instructions: "A protected resource is located at " + levels.predictable_token.uri + "/secret."
        },
        {
            app: "/docs/tractorguitar.html",
        });
    res.send(response);
});

app.get(levels.predictable_token.uri + '/hint', function( req, res ) {
    var response = 
        generateResponse(levels.predictable_token,
        {        
            message: "try using the access token that the client application uses."
        },
        {
            hint: levels.predictable_token.uri + '/hint/galileo'
        });    
    res.send(response);
});


app.get(levels.predictable_token.uri + '/hint/galileo', function( req, res ) {
    var response = 
        generateResponse(levels.predictable_token,
        {        
            message: "another expired token is 29902912.  Figure out the pattern and take advantage of it."
        });
    res.send(response);
});

app.get(levels.predictable_token.uri + '/invoices', function( req, res ) {
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
        res.send(401, 'token expired');
    } else {
        res.send(401, 'you are not authorized to access this resource');
    }
});

app.get(levels.predictable_token.uri + '/secret', function( req, res ) {
    var token = req.get('X-API-ACCESS-Token');
    if( token === '29902914' ) {
        var nextLevel = getNextLevelId(levels.predictable_token);
        var response = 
            generateResponse(levels.predictable_token, 
            {            
                message: "congratulations, you have made it to the next level!"
            },
            {
                next: nextLevel
            });
        res.send(response);        
    } else if ( token === '29902913' ) {
        res.send(401, 'token expired');
    } else {
        res.send(401, 'you are not authorized to access this resource');
    }   
});


/**
 * Command Injection
 * 
*/
app.get(levels.command_injection.uri, function( req, res ) {
    var response = 
        generateResponse(levels.command_injection,
        {
            objective: "retrieve data from a server side file",
            instructions: "The URI for the next API is located in a file named /etc/secret.txt hosted in the API server"
        },
        {
            documentation: "/docs/saladsummit.html"
        });    
    res.send(response);
});


app.get(levels.command_injection.uri + '/documents', function( req, res ) {
    var fileName = req.query.doc;
    
    if( fileName === '/etc/secret.txt' ) {
        var nextLevel = getNextLevelId(levels.command_injection);
        var response = 
            generateResponse(levels.command_injection, 
            {            
                message: "congratulations, you have made it to the next level!"
            },
            {
                next: nextLevel 
            });
        res.send(200, response);        
    }else {
        res.send(404, 'unable to locate PDF document');
    }        
});

/**
 * SQL Injection
 * 
*/
app.get(levels.sql_injection.uri, function( req, res ) {
    var response = 
        generateResponse(levels.sql_injection,
        {
            objective: "Access private data from a database",
            instructions: "This is an order retrieval API.  A link to the next level is in the description of one of the orders.  You only get one order resource to start with: " + levels.sql_injection.uri + "/orders/1003"
        },
        {
             hint: levels.sql_injection.uri + '/hint'
        });
    res.send(response);    
});

app.get(levels.sql_injection.uri + '/hint', function( req, res ) {
    var response = 
        generateResponse(levels.sql_injection,
        {        
            message: "The orders are contained within an SQL databse behind the API.  Try to trick the server into providing you with all of the order table's rows."
        },
        {
            hint: levels.sql_injection.uri + "/hint/beluga"
        });
    res.send(response);    
});

app.get(levels.sql_injection.uri + '/hint/beluga', function( req, res ) {
    var response = 
        generateResponse(levels.sql_injection,
        {        
            message: "the order number is used in an SQL statement: 'SELECT * FROM ORDERS WHERE ORDER_ID = idParameter"
        },
        {
            hint: levels.sql_injection.uri + "/hint/firetruck"
        });
    res.send(response);    
});

app.get(levels.sql_injection.uri + '/hint/firetruck', function( req, res ) {
    var response = 
        generateResponse(levels.sql_injection, 
        {               
            message: "Make the API construct an SQL statement that will be true for all orders.  Don't forget to URL encode your statement"
        },
        {
            hint: levels.sql_injection.uri + "/hint/helicopter"
        });
    res.send(response);    
});

app.get(levels.sql_injection.uri + '/hint/helicopter', function( req, res ) {
    var response = 
        generateResponse(levels.sql_injection, 
        {
            message: "Try passing in '1003 or 1=1' as the order identifier (The URL encoded string is '1003%20or%201%3D1')"        
        });
    res.send(response);    
});


app.get(levels.sql_injection.uri + '/orders/:orderId', function( req, res ) {
    var id = req.params.orderId;

      //var conString = process.env.DATABASE_URL || conString;
      pg.connect(conString, function(err, client, done) {      
      if(err) {
        return console.error('error fetching client from pool', err);
      }
        var queryString = 'SELECT * from orders where order_id = ' + id;
      client.query(queryString, function(err, result) {
        //call `done()` to release the client back to the pool
        done();

        if(err) {
              res.send(500, 'unable to retrieve orders');
          return console.error('error running query', err);          
        }
          
          var orderResult = [];
          for( var i = 0; i < result.rowCount; i++ ) {
              orderResult.push(result.rows[i]);
          }
          
          var response = 
              generateResponse(levels.sql_injection,
                {
            orders: orderResult
          });
          res.send(response);
        
        //output: 1
      });
    });    
});

app.get(levels.finish, function( req, res ) {
    var response = 
        generateResponse(levels.finish, 
         {
             message: "CONGRATULATIONS!  You have finished the API security game."
         },
         {
             reward: "Not Implemented Yet. :("
         });
});

/**
 * Level 10
 * 
*/
/*
app.get('/' + levelNames[10], function( req, res ) {
    var response = {
        level: "10",
        instructions: "reverse engineer a mobile application",
        hint: ""
    };
    res.send(response);
});
*/

var port = process.env.PORT || 8082;
app.listen(port);
console.log('Express server started on port %s', port);
