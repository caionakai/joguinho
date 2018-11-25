/*jslint node: true */
"use strict";

var soap = require('soap');
var http = require('http');

var usuarios = []
var mapa = []
function create_mapa(){
    for (var x = 0; x < 30; x++) {
        let linha = []
        for(var y = 0; y< 30; y++){
            linha.unshift('X')
        } 
        mapa.unshift(linha)
    }
}
create_mapa()
var teste = [1,2,3]
// function create_usario(nome){
//     usuarios.unshift({nome: nome, map_position= [0,0]})
// }

var service = {
    ws: {
        calc: {
            sumar : function(args) {
                var n = 1*args.a + 1*args.b;
                return { sumres : n };
            },

            multiplicar : function(args) {
                var n = args.a * args.b;
                return { mulres : n };
            },
            devolvenome : function(){
                var nomeres = "Caio"
                return { nomeres };
            },
            criarusuario : function(nome){
                create_usario(nome);
                return { teste }
            }
        },

    }
};

var xml = require('fs').readFileSync('myservice.wsdl', 'utf8');

var server = http.createServer(function(request,response) {
    response.end("404: Not Found: "+request.url);
});
server.listen(8001);
soap.listen(server, '/wscalc1', service, xml);
console.log("Servidor ligado..")