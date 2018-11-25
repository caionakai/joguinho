/*jslint node: true */
"use strict";

var soap = require('soap');
var http = require('http');


var user = {
    name: 'Gabriel',
    map_x: 0,
    map_y: 0
};

var service = {
    ws: {
        calc: {
            GetUser : function (name) {
                console.log(name);
                return {User: user}
            }
        }
    }
};

var xml = require('fs').readFileSync('myservice.wsdl', 'utf8');

var server = http.createServer(function(request,response) {
    response.end("404: Not Found: "+request.url);
});

server.listen(8001);
soap.listen(server, '/wscalc1', service, xml);