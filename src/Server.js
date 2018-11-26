/*jslint node: true */
"use strict";

const soap = require('soap');
const http = require('http');

let userList = [];
let map = [];
let user = {
    name: 'Gabriel',
    map_x: 0,
    map_y: 0
};

function create_map() {
    for (let i = 0; i < 30; i++) {
        for (let j = 0; j < 30; j++) {
            map.unshift({x: i, y: j, usuario: null})
        }
    }
}

create_map();

function load_map(user) {
    return map.filter(position => {
        return Math.abs(position.x - user.map_x) <= 2 && Math.abs(position.y - user.map_y) <= 2
    })
}
function createUser(name){
    // generate two random numbers to define the position of the user in the map
    let map_x = Math.floor((Math.random() * Math.sqrt(map.length)));
    let map_y = Math.floor((Math.random() * Math.sqrt(map.length)));

    let user = {
        name: name,
        map_x: map_x,
        map_y: map_y
    };
    userList.unshift(user);
    return user;
}

function getUser(name){
    return userList.find(x=> x.name === name)
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
            GetMap: function (name) {
                return {map: load_map(getUser(user))}
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