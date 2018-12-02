/*jslint node: true */
"use strict";

const soap = require('soap');
const http = require('http');

let userList = [];
let map = [];

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

// funcao para criar usuario
function createUser(name){
    // generate two random numbers to define the position of the user in the map
    let map_x = Math.floor((Math.random() * Math.sqrt(map.length)));
    let map_y = Math.floor((Math.random() * Math.sqrt(map.length)));
    let inventario = [];
    let gold = 0;

    // user object
    let user = {
        name: name,
        x: map_x,
        y: map_y,
        inventario: inventario,
        gold: gold,
        
    };

    userList.unshift(user);
    return user;
}

// get usuario
function getUser(name){
    console.log(userList)
    let x =userList.find(x=> x.name == name)
    console.log(x)
    return x
}

// adiciona item no inventario passando nome do usuario e o item
function addInventario(name, item){
    let user = getUser(name)
    user.inventario.unshift(item)
}

// get inventario passando nome do usuario
function getInventario(name){
    return userList.find(x=> x.name == name).inventario
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
            CreateUser: function (obj){
                return {User: createUser(obj.name)}
            },
            GetInventarioList: function (obj){
                return {Inventario: getInventario(obj.name)}
            },
            AddInventario: function (obj){
                addInventario(obj.name, obj.item)
                return {Inventario: getInventario(obj.name)}
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
console.log("server on..")