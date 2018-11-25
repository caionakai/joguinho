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
            map.append({x: i, y: j, usuario: null})
        }
    }
}

create_map();

function load_map(user) {
    return map.filter(position => {
        return Math.abs(position.x - user.map_x) <= 2 && Math.abs(position.y - user.map_y) <= 2
    })
}


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
            },
            GetMap: function (user) {
                return {map: load_map(user)}
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