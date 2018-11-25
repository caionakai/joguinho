/*jslint node: true */
"use strict";

const soap = require('soap');
const http = require('http');
const matrixSize = 100;

let userList = [];


function createUser(name){
    // generate two random numbers to define the position of the user in the map
    var map_x = Math.floor((Math.random() * matrixSize)) // gabriel esse é o tamanho da matriz
    var map_y = Math.floor((Math.random() * matrixSize))
    
    let user = {
        name: name,
        map_x: map_x,
        map_y: map_y
    };
    userList.unshift(user);
    return user;
}

function getUser(name){
    return userList.find(x=> x.name===name)
}


let service = {
    ws: {
        funcoes: {
            GetUser: function (name) {
                console.log(name);
                return {User: getUser(name)}
            },
            GetUserList: function (name) {
                return {Users: userList}
            },
            CreateUser: function (name){
                return {User: createUser(name)}
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