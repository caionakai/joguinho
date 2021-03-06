/*jslint node: true */
"use strict";

const soap = require('soap');
const express = require('express');
const cors = require('cors');

let Map = {
    map: [],
    // função para criar o mapa
    create: function () {
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 15; j++) {
                this.map.unshift({x: i, y: j})
            }
        }
        for (let i = 0; i < 10; i++)
            this.add_random_monster()
    },

    // função para adicionar monstros randomicos no mapa
    add_random_monster: function () {
        switch (Math.floor((Math.random() * 4))) {
            case 1: {
                this.add_monster({
                    name: 'Wolf',
                    life: 200,
                    maximo_life: 200,
                    gold: 350,
                    inventario: [],
                    ataque: 25
                });
                break;
            }
            case 2: {
                this.add_monster({
                    name: 'Bat',
                    life: 70,
                    maximo_life: 70,
                    gold: 120,
                    inventario: [],
                    ataque: 10
                });
                break;
            }
            case 3: {
                this.add_monster({
                    name: 'Spider',
                    life: 100,
                    maximo_life: 100,
                    gold: 200,
                    inventario: [],
                    ataque: 20
                });
                break;
            }
        }
    }, 
    
    // função que adiciona o monstro em alguma posição
    add_monster: function (monster) {
        let position = Map.clear();
        monster.x = position.x;
        monster.y = position.y;
        this.load_location(position.x, position.y).monster = monster
    },

    // função que retorna o mapa
    load: function () {
        return this.map
    },

    // função de adicionar usuário em determinada posição
    add_user: function (user) {
        this.load_location(user.x, user.y).usuario = user
    },

    // função que retorna o que tem no mapa (monstro | usuario) 
    load_location: function (x, y) { // get usuario
        return this.map.find(obj => obj.x === parseInt(x) && obj.y === parseInt(y))
    },

    // função que verifica se o usuário pode se movimentar ou monstro pode ser criado em determinada posição
    clear: function () {
        let len = Math.sqrt(Map.map.length);
        let position = Map.load_location(Math.floor((Math.random() * len)), Math.floor((Math.random() * len)));
        while (position.usuario || position.monster) {
            position = Map.load_location(Math.floor((Math.random() * len)), Math.floor((Math.random() * len)))
        }
        return position
    }
};
let User = {
    userList: [],

    // função que cria o usuário
    create: function (obj) {
        let position = Map.clear();
        let user = { // funcao para criar usuario
            x: position.x,
            y: position.y,
            view: 2,
            inventario: [],
            gold: 150,
            life: 100,
            maximo_life: 100,
            ataque: 20,
            ...obj
        };
        this.userList.push(user);
        Map.add_user(user);
        return user;
    },

    // função que retorna o usuário pelo nome
    load_name: function (name) { // get usuario
        return this.userList.find(x => x.name === name)
    },

    // função que retorna o usuário pela posição
    load_location: function (x, y) { // get usuario
        return this.userList.find(obj => obj.x === parseInt(x) && obj.y === parseInt(y))
    },

    // função que apaga o usuário
    remove: function (x, y) {
        delete Map.load_location(x, y).usuario;
        let i = this.userList.findIndex(obj => obj.x === parseInt(x) && obj.y === parseInt(y));
        this.userList.splice(i, 1);
    },

    // função que remove o gold do usuário (usado quando ele compra algo na loja)
    remove_gold: function (name, valor) {// tira dinheiro do usuario
        let user = this.load_name(name);
        user.gold -= valor;
        return user.gold
    },

    // função que trata da batalha entre usuárioxusuário | usuárioxmonstro
    atacar: function (obj) {
        let atacante = this.load_location(obj.atacante.x, obj.atacante.y);
        switch (obj.type) {
            case 'usuario': {
                let alvo = this.load_location(obj.alvo.x, obj.alvo.y);
                let map_atacante =  Map.load_location(obj.atacante.x, obj.atacante.y);
                let map_alvo =  Map.load_location(obj.alvo.x, obj.alvo.y);
                alvo.duel = {x: map_atacante.x, y: map_atacante.y};
                alvo.turn = false;
                atacante.duel = {x: map_alvo.x, y: map_alvo.y};
                atacante.turn = true;
                return alvo
            }
            case 'duel':{
                let alvo = this.load_location(obj.alvo.x, obj.alvo.y);
                if (atacante.turn){
                    let item = {ataque: 0};
                    if (obj.item){
                        item = this.use_item(obj.atacante.name, obj.item);
                    }
                    if(!(obj.item && obj.item.cura >0)){
                        alvo.life -= atacante.ataque + item.ataque;
                    }
                    if (obj.type)
                    alvo.turn = true;
                    atacante.turn = false;
                    console.log(`Atacando usuario ${alvo.name} vida ~ ${alvo.life}`);
                    if (alvo.life <= 0) {
                        atacante.gold += alvo.gold;
                        atacante.inventario.concat(alvo.inventario.map((item => {
                            return Object.assign({}, item)
                        })));
                        this.remove(obj.alvo.x, obj.alvo.y)
                    }
                    if (alvo.life <=0 || atacante.life <= 0){delete atacante.duel;
                        delete alvo.duel;
                        delete atacante.duel;
                        delete atacante.turn;
                        delete alvo.turn;
                    }
                }
                return alvo
            }
            case 'duel_monster':{
                let alvo = Map.load_location(obj.alvo.x, obj.alvo.y).monster;
                let item = {ataque: 0};
                if (obj.item){
                    item = this.use_item(obj.atacante.name, obj.item);
                }
                if(!(obj.item && obj.item.cura >0)){
                    alvo.life -= atacante.ataque + item.ataque;
                }
                atacante.life -= alvo.ataque;
                console.log(`Atacando ${alvo.name} vida ~ ${alvo.life}`);
                if (alvo.life <= 0) {
                    atacante.gold += alvo.gold;
                    atacante.inventario.concat(alvo.inventario.map((item => {
                        return Object.assign({}, item)
                    })));
                    delete Map.load_location(obj.alvo.x, obj.alvo.y).monster;
                    Map.add_random_monster();
                }
                else if (atacante.life <= 0) {
                    alvo.inventario.concat(atacante.inventario.map((item => {
                        return Object.assign({}, item)
                    })));
                    alvo.gold = atacante.gold;
                    this.remove(obj.atacante.x, obj.atacante.y);
                }
                if (alvo.life <=0 || atacante.life <= 0){delete atacante.duel;
                    delete alvo.duel;
                    delete atacante.duel;
                    delete atacante.turn;
                    delete alvo.turn;
                }
                return alvo
            }
            case 'quit':{
                let alvo = Map.load_location(obj.alvo.x, obj.alvo.y).monster;
                if(!alvo){
                    alvo = this.load_location(obj.alvo.x, obj.alvo.y)
                }
                delete alvo.duel;
                delete atacante.duel;
                delete atacante.turn;
                delete alvo.turn;
                return alvo;
            }

            case 'monster': {
                let alvo = Map.load_location(obj.alvo.x, obj.alvo.y).monster;
                let map_atacante =  Map.load_location(obj.atacante.x, obj.atacante.y);
                let map_alvo =  Map.load_location(obj.alvo.x, obj.alvo.y);
                alvo.duel = {x: map_atacante.x, y: map_atacante.y};
                alvo.turn = true;
                atacante.duel = {x: map_alvo.x, y: map_alvo.y};
                atacante.turn = true;
                return alvo
            }
        }

    },

    // função para andar no mapa
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

    // função para adicionar item no invetário
    add_item: function (name, item) { // adiciona item no inventario passando name do usuario e o item
        this.load_name(name).inventario.push(item)
    },

    delete_item: function (name, item_usado) {
        let i = this.load_name(name).inventario.findIndex(item => item.name == item_usado.name && item.ataque == item_usado.ataque);
        this.load_name(name).inventario.splice(i, 1)
    },

    find_item: function(name, item_usado){
        return this.load_name(name).inventario.find(item => item.name == item_usado.name && item.ataque == item_usado.ataque);
    },

    // função que usa os itens (poção ou arma)
    use_item: function (name, item) {
        switch (item.name) {
            case 'potion': {
                let x = this.load_name(name);
                if (x.life >= 100) return {ataque: 0};

                x.life += parseInt(item.cura);
                if ((x.life >= 100)) x.life = 100;

                this.delete_item(name, item);
                return {ataque: 0}
            }
            case 'potion2': {

                let x = this.load_name(name);
                if (x.life >= 100) return {ataque: 0};

                x.life += parseInt(item.cura);
                console.log(item);
                if ((x.life >= 100)) x.life = 100;

                this.delete_item(name, item);
                return {ataque: 0}
            }
            default:{
                let ataque = this.find_item(name,item).ataque;
                this.delete_item(name,item);
                return {ataque: parseInt(ataque)};
            }
        }
    }
};
Map.create();
let service = {
    ws: {
        // nome das funções definidas também no wsdl
        funcoes: {
            GetUser: function (obj) {
                return {User: User.load_name(obj.name)}
            },
            Atacar: function (obj) {
                return User.atacar(obj)
            },
            Move: function (obj) {
                return User.move(obj)
            },
            GetMap: function () {
                return {map: Map.load()}
            },
            CreateUser: function (obj) {
                return {user: User.create(obj)}
            },
            GetInventarioList: function (obj) {
                return {Inventario: User.load_name(obj.name).inventario}
            },
            AddInventario: function (obj) {
                User.add_item(obj.name, obj.item);
                return {Inventario: User.load_name(obj.name).inventario}
            },
            RemoveGold: function (obj) {
                return {Gold: User.remove_gold(obj.name, obj.valor)}
            },
            Use_Item: function (obj) {
                User.use_item(obj.name, obj.item);
                return {Inventario: User.load_name(obj.name).inventario}
            }
        }
    }
};

let xml = require('fs').readFileSync('myservice.wsdl', 'utf8');
let server = express();

// remove o bug do Cors
server.use(cors());

// servidor escutando na porta 8001
server.listen(8001);
soap.listen(server, '/wscalc1', service, xml);
console.log("Servidor Ligado..");