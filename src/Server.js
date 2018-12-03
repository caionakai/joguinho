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
function createUser(name, foto) {
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
        foto: foto,
        view: 2,
        inventario: inventario,
        gold: gold,
        life: life,
        ataque: 20

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
    let dinheiro = userList.find(x => x.name === name).gold;
    userList.find(x => x.name === name).gold = dinheiro - valor;

    return  userList.find(x => x.name === name).gold
}
function ataque(obj) {
    let x = userList.filter(x => obj.atacante.x == x.x && obj.atacante.y == x.y)
    let y = userList.filter(x => obj.alvo.x == x.x && obj.alvo.y == x.y)
    y[0].life -= x[0].ataque;
    if (y[0].life <= 0){
        let pos = map.filter(po => po.x == obj.alvo.x && po.y == obj.alvo.y);
        delete pos[0].usuario
    }
    return y[0]
}
function move(obj) {
    let pos = map.filter(po => po.x == obj.atacante.x && po.y == obj.atacante.y);
    delete pos[0].usuario;
    pos = map.filter(po => po.x == obj.alvo.x && po.y == obj.alvo.y);
    let i = userList.findIndex(x => obj.atacante.x == x.x && obj.atacante.y == x.y);
    userList[i].x = obj.alvo.x;
    userList[i].y = obj.alvo.y;
    pos[0].usuario = userList[i];
    return userList[i]
}

// adiciona item no inventario passando nome do usuario e o item
function addInventario(name, item) {
    let user = getUser(name);
    user.inventario.unshift(item)
}

// get inventario passando nome do usuario
function getInventario(name) {
    let x = userList.find(x => x.name === name);
    if (x)
        return x.inventario;
    return []
}

let service = {
    ws: {
        funcoes: {
            GetUser: function (obj) {
                return {User: getUser(obj.name)}
            },
            GetUserList: function (name) {
                return {Users: userList}
            },
            Atacar: function(obj){
              return ataque(obj)
            },
            Move: function(obj){
              return move(obj)
            },
            GetMap: function (obj) {
                let x = getUser(obj.name);
                return {map: load_map(x)}
            },
            CreateUser: function (obj) {
                return {User: createUser(obj.name, obj.foto)}
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