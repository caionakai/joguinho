/*jslint node: true */
"use strict";

const ip =require('ip').address();
const soap = require('soap');
const express = require('express');
const cors = require('cors');

let Map = {
    map: [],
    create: function () {
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 15; j++) {
                this.map.unshift({x: i, y: j})
            }
        }
        for(let i=0;i< 10;i++)
            this.add_random_monster()
    },
    add_random_monster: function () {

        switch (Math.floor((Math.random() * 4))) {
            case 1:{
                this.add_monster({
                    name: 'Wolf',
                    life: 100,
                    gold: 10,
                    inventario: [],
                    ataque: 10
                });
                break;
            }
            case 2:{
                this.add_monster({
                    name: 'Bat',
                    life: 50,
                    gold: 5,
                    inventario: [],
                    ataque: 10
                });
                break;
            }
            case 3:{
                this.add_monster({
                    name: 'Spider',
                    life: 200,
                    gold: 30,
                    inventario: [],
                    ataque: 25
                });
                break;
            }
        }
    }
    ,add_monster: function (monster){
        let position = Map.clear();
        this.load_location(position.x, position.y).monster = monster
    },
    load: function () {
        return this.map
    },
    add_user: function (user) {
        this.load_location(user.x,user.y).usuario = user
    },
    load_location: function (x,y) { // get usuario
        return this.map.find( obj => obj.x === parseInt(x) && obj.y === parseInt(y))
    },
    clear: function () {
        let len =  Math.sqrt(Map.map.length);
        let position = Map.load_location(Math.floor((Math.random() * len)), Math.floor((Math.random() * len)));
        while (position.usuario || position.monster){
            position = Map.load_location(Math.floor((Math.random() * len)), Math.floor((Math.random() * len)))
        }
        return position
    }
};
let User = {
    userList: [],
    create: function (name, foto) {
        let position = Map.clear();
        let user = { // funcao para criar usuario
            name: name,
            x: position.x,
            y: position.y,
            foto: foto,
            view: 2,
            inventario: [],
            gold: 150,
            life: 100,
            ataque: 20
        };
        this.userList.push(user);
        Map.add_user(user);
        return user;
    },
    load_name: function (name) { // get usuario
        return this.userList.find( x => x.name === name)
    },
    load_location: function (x,y) { // get usuario
        return this.userList.find( obj => obj.x === parseInt(x) && obj.y === parseInt(y))
    },
    remove: function (x,y){
        delete Map.load_location(x, y).usuario;
        let i = this.userList.findIndex(obj => obj.x === parseInt(x) && obj.y === parseInt(y));
        this.userList.splice(i,1);
    },
    remove_gold: function (name, valor) {// tira dinheiro do usuario
        let user = this.load_name(name);
        user.gold -= valor;
        return user.gold
    },
    atacar: function (obj) {
        let atacante = this.load_location(obj.atacante.x, obj.atacante.y);
        switch (obj.type) {
            case 'usuario':{
                let alvo = this.load_location(obj.alvo.x, obj.alvo.y);

                alvo.life -= atacante.ataque;
                console.log(`Atacando usuario ${alvo.name} vida ~ ${alvo.life}`);
                if(alvo.life <= 0){
                    atacante.gold += alvo.gold;
                    atacante.inventario.concat(alvo.inventario);
                    this.remove(obj.alvo.x,obj.alvo.y)
                }
                return alvo
            }
            case 'monster':{

                let alvo = Map.load_location(obj.alvo.x, obj.alvo.y).monster;
                alvo.life -= atacante.ataque;
                atacante.life -= alvo.ataque;
                console.log(`Atacando monstro vida ~ ${alvo.life}`);
                if(alvo.life <= 0){
                    atacante.gold += alvo.gold;
                    atacante.inventario.concat(alvo.inventario);
                    delete Map.load_location(obj.alvo.x, obj.alvo.y).monster;
                    Map.add_random_monster();
                }
                else if(atacante.life <=0){
                    alvo.inventario.concat(atacante.inventario);
                    alvo.gold = atacante.gold;
                    this.remove(obj.atacante.x,obj.atacante.y);
                }
                return alvo
            }
        }

    },
    move: function (obj) {
        let position_alvo = Map.load_location(obj.atacante.x, obj.atacante.y);
        delete position_alvo.usuario;

        position_alvo = Map.load_location(obj.alvo.x, obj.alvo.y);
        let user = this.load_location(obj.atacante.x, obj.atacante.y);
        user.x = position_alvo.x;
        user.y = position_alvo.y;
        position_alvo.usuario = user;
        return user
    },
    add_item: function (name, item) { // adiciona item no inventario passando name do usuario e o item
        this.load_name(name).inventario.push(item)
    },
    delete_item: function (name, item_name) {
        let i = this.load_name(name).inventario.findIndex(item => item.name === item_name);
        this.load_name(name).inventario.splice(i,1)
    },
    use_item: function (name, item_name, valor) {
        switch (item_name) {
            case 'potion':{// cura vida passando name do usuario e qnt de vida a ser curada
                let x =this.load_name(name);
                x.life += parseInt(valor);
                this.delete_item(name,item_name);
                return x.life
            }
        }
    }
};
Map.create();
let service = {
    ws: {
        funcoes: {
            GetUser: function (obj) {
                return {User: User.load_name(obj.name)}
            },
            Atacar: function(obj){
              return User.atacar(obj)
            },
            Move: function(obj){
              return User.move(obj)
            },
            GetMap: function () {
                return {map: Map.load()}
            },
            CreateUser: function (obj) {
                return {User: User.create(obj.name, obj.foto)}
            },
            GetInventarioList: function (obj) {
                return {Inventario:User.load_name(obj.name).inventario}
            },
            AddInventario: function (obj) {
                User.add_item(obj.name, obj.item);
                return {Inventario: User.load_name(obj.name).inventario}
            },
            RemoveGold: function (obj){
                return {Gold: User.remove_gold(obj.name, obj.valor) }
            },
            CuraVida: function (obj){
                User.use_item(obj.name,'potion', obj.valor);
                return {Inventario: User.load_name(obj.name).inventario}
            }
        }
    }
};

let xml = require('fs').readFileSync('myservice.wsdl', 'utf8');
xml = xml.replace('localhost', ip);
let server = express();

server.use(cors());

server.listen(8001);
soap.listen(server, '/wscalc1', service, xml);
console.log("server on..");