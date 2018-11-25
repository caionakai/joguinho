/*jslint node: true */
"use strict";

const soap = require('soap');
const http = require('http');

let userList = [];

let user = {
    name: 'Gabriel',
    map_x: 0,
    map_y: 0
};

userList.unshift(user);
userList.unshift(user);
userList.unshift(user);
userList.unshift(user);
userList.unshift(user);

let service = {
    ws: {
        calc: {
            GetUser: function (name) {
                console.log(name);
                return {User: user}
            },
            GetUserList: function (name) {
                return {Users: userList}
            }
        }
    }
};

const xml = require('fs').readFileSync('myservice.wsdl', 'utf8');

let server = http.createServer(function (request, response) {
    response.end("404: Not Found: " + request.url);
});

server.listen(8001);
soap.listen(server, '/wscalc1', service, xml);