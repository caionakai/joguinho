/*jslint node: true */
"use strict";

const soap = require('soap');
const http = require('http');

let userList = [];
let map = [];

function create_map() {
    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
            map.unshift({x: i, y: j})
        }
    }
}

create_map();

function load_map(user) {
    return map
}
function map_add_user(user) {
    let x = map.findIndex( posi=> posi.x === user.x && posi.y === user.y )
    map[x].usuario = user;
}
// funcao para criar usuario
function createUser(name) {
    // generate two random numbers to define the position of the user in the map
    let map_x = Math.floor((Math.random() * Math.sqrt(map.length)));
    let map_y = Math.floor((Math.random() * Math.sqrt(map.length)));
    let inventario = [];
    let gold = 60;
    let life = 100;
    // user object
    let user = {
        name: name,
        x: map_x,
        y: map_y,
        inventario: inventario,
        gold: gold,
        life: life,

    };
    map_add_user(user);
    userList.unshift(user);
    return user;
}

// get usuario
function getUser(name) {
    return userList.find(x => x.name === name);
}

// tira dinheiro do usuario
function removeGold(name ,valor){
    let dinheiro = userList.find(x => x.name === name).gold
    userList.find(x => x.name === name).gold = dinheiro - valor

    return  userList.find(x => x.name === name).gold
}

// adiciona item no inventario passando nome do usuario e o item
function addInventario(name, item) {
    let user = getUser(name);
    user.inventario.unshift(item)
}

// get inventario passando nome do usuario
function getInventario(name) {
    let x = userList.find(x => x.name === name)
    if (x)
        return x.inventario
    return []
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
            GetMap: function (obj) {
                let x = getUser(obj.name);
                return {map: load_map(x)}
            },
            CreateUser: function (obj) {
                return {User: createUser(obj.name)}
            },
            GetInventarioList: function (obj) {
                return {Inventario: getInventario(obj.name)}
            },
            AddInventario: function (obj) {
                addInventario(obj.name, obj.item);
                return {Inventario: getInventario(obj.name)}
            },
            RemoveGold: function (obj){
                return {Gold: removeGold(obj.name, obj.valor) }
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
console.log("server on..");