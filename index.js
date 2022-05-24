console.log('hello Node.js');

//starting a Http server
// the primary file for the server

//dependencies

var http = require('http');
var https = require('https');
var url = require('url');
var fs = require('fs');
var stringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var _data = require('./lib/data');

//testing
//@TODO delete this
// _data.create('test', 'sample', {'name': 'test'}, function(err){
//      console.log('created', err);
    
// });
//reading data
_data.read('test', 'sample', function(err, data){
     console.log('Success!', err, 'data', data);
    
});

// instantiate the http server
var httpServer = http.createServer(function (req, res){
    unifiedServer(req, res);

});
//get the key and certificate for the https server
var httpsServerOptions = {
    'key' : fs.readFileSync('./https/key.pem'),
    'cert' : fs.readFileSync('./https/cert.pem')
};
//instantiate the https server
var httpsServer = https.createServer(httpsServerOptions, function (req, res){
    unifiedServer(req, res);
});

//start the server and listen to the port according to the environment
httpServer.listen(config.httpPort, function(){
    console.log('The server is listening on port ' + config.httpPort + ' in ' + config.envName + ' mode');
});
// server.listen(3000, function(){
//     console.log('listening on port 3000 now');
// });
//https listening
httpsServer.listen(config.httpsPort, function(){
    console.log('The server is listening on port ' + config.httpsPort + ' in ' + config.envName + ' mode');
});
// all the server logic for both http and https
var unifiedServer = function(req, res) {
     //get the url and parse it
    var parsedUrl = url.parse(req.url, true);
    console.log('The Request is: ' + req.url);

    //get the path from the url
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    //get the query string as an object
    var queryStringObject = parsedUrl.query;

    //get the http method
    var method = req.method.toLowerCase();

    //get the headers as an object
    var headers = req.headers;

    //get the payload, if any
    var decoder = new stringDecoder('utf-8');
    var buffer = '';
    req.on('data', function (data){
        buffer += decoder.write(data);
    });
    req.on('end', function (){
        buffer += decoder.end();
        //choose the handler where this request will go to, if not found go to the not found handler
        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
        //construct the data object to send to the handler
        var data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : buffer
        };
        //route the request to the handler specified in the router
        chosenHandler(data, function(statusCode, payload){
            //use the status code called back by the handler, or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            //use the payload called back by the handler, or default to an empty object
            payload = typeof(payload) == 'object' ? payload : {};
            //convert the payload to a string
            var payloadString = JSON.stringify(payload);
            //return the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
            res.end('Hello duke lester, welcome to node js');
            console.log('Returning this response: ', statusCode, payloadString);
             
             //log the requested url
            console.log('Request for ' + trimmedPath + ' received' + ' using ' + method +'query string ' + JSON.stringify(queryStringObject));
            console.log('Request Headers ' + JSON.stringify(headers) + '\n');
            console.log('Request Payload is' + buffer);
        });
    });

}


//define handlers
var handlers = {};

//ping handler
handlers.ping = function(data, callback){
    callback(200);
};

// //sample handler
// handlers.sample = function(data, callback){
//     // callback a http status code and a payload object
//     callback(406, {'name': 'sample handler'});
// };
//not found handler
handlers.notFound = function(data, callback){
    callback(404);
};
//define a request router
// var router = {
//     'sample':handlers.sample,
// }

//ping handler
var router = {
    'ping':handlers.ping,
}