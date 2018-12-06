import React, {Component} from 'react';
import './App.css';
import {Button, Modal, ProgressBar, ListGroupItem, ListGroup, Table, Panel, Row, Col, Grid} from 'react-bootstrap';
import skull from './skull.png';
import sword from './sword.png';
import pistol from './pistol.png';
import bow from './bow.png';
import potion from './potion.png';
import {confirmAlert} from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
const ip = require('ip').address();
const url = 'http://20.0.189.232:8001/wscalc1?wsdl';
const soap = require('soap-everywhere');

class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.handleItem = this.handleItem.bind(this);
        this.comprar = this.comprar.bind(this);
        this.load_map = this.load_map.bind(this);
        this.render_map = this.render_map.bind(this);
        this.use_item = this.use_item.bind(this);
        this.load_position = this.load_position.bind(this);
        this.state = {
            user: {},
            item: '',
            map: [],
            imagem: null,
            lgShow: false,
            imgItem: '',
            enemy: ''
        }
    }

    handleItem(obj) {
        this.setState({item: obj});
    }

    componentDidMount() {
        let self = this;
        new Promise(async function (response, reject) {
            try {
                await self.setState(self.props.location.state);
                response()
            }
            catch (e) {
                reject(e)
            }
        }).then(function () {
            self.load_map();
        })

    }

    load_position(x, y) {
        return this.state.map.find(position => {
            return position.x == x && position.y == y
        })
    };

    render_map() {
        let table = [];

        let size = Math.sqrt(this.state.map.length);
        // Outer loop to create parent
        let children = [];
        children.push(<td>{`_//_`}</td>);
        for (let j = 0; j < size; j++) {
            children.push(<td>{`_${(j + 1).toString().padStart(2, '0')}_`}</td>)
        }
        table.push(<tr>{children}</tr>);
        for (let i = 0; i < size; i++) {
            let children = [];
            //Inner loop to create children
            children.push(<td>{`_${(i + 1).toString().padStart(2, '0')}_`}</td>);
            for (let j = 0; j < size; j++) {
                let position = this.load_position(i, j);
                if (Math.abs(this.state.user.x - position.x) > this.state.user.view || Math.abs(this.state.user.y - position.y) > this.state.user.view) {
                    children.push(<td>{`_~~_`}</td>)
                }
                else {
                    if (position.monster && position.monster.hasOwnProperty('name')) {

                        // eslint-disable-next-line
                        children.push(
                            <td style={{fontSize: '.8em'}}>
                                <a className={'hand'}
                                   onClick={() => this.atacar(position, 'monster')}>{position.monster.name.toUpperCase()}</a>

                            </td>);
                    }
                    else if (position.usuario && position.usuario.hasOwnProperty('name')) {
                        if (position.x === this.state.user.x && position.y === this.state.user.y)
                            children.push(
                                <td style={{fontSize: '.8em'}}>
                                    {this.state.user.foto.toUpperCase()}
                                </td>);
                        else {
                            // eslint-disable-next-line
                            children.push(
                                <td style={{fontSize: '.8em'}}>
                                    <a className={'hand'}
                                       onClick={() => this.atacar(position, 'usuario')}>{position.usuario.foto.toUpperCase()}</a>
                                </td>)
                        }
                    }
                    else {
                        // eslint-disable-next-line
                        children.push(<td>
                            <a className={'hand'}
                               onClick={() => this.move(position)}>{`_.._`}</a>
                        </td>)
                    }
                }
            }
            //Create the parent and add the children
            table.push(<tr>{children}</tr>)
        }
        return table;
    }

    atacar(enemy, type, item = null) {
        let obj = {
            atacante: this.state.user,
            alvo: enemy,
            item: item,
            type: type
        };
        soap.createClient(url, function (err, client) {
            if (err) throw err;
            client.Atacar(obj, function (err, res) {
                if (err) throw err;
                console.log(res)
            })
        })
    }

    move(location) {


        let obj = {
            atacante: {
                ataque: this.state.user.ataque,
                name: this.state.user.name,
                x: this.state.user.x,
                y: this.state.user.y
            },
            alvo: location
        };
        soap.createClient(url, function (err, client) {
            if (err) throw err;
            client.Move(obj, function (err, res) {
                if (err) throw err;
                console.log(res)
            })
        })
    }


    comprar() {
        let nome = this.state.user.name;
        let item = this.state.item;
        let self = this;
        let preco = item.valor;

        if (this.state.user.gold < item.valor) {
            alert("vc nao tem money suficiente $$");
            this.setState({lgShow: false})
        }
        else {
            soap.createClient(url, function (err, client) {
                if (err) throw err;


                client.AddInventario({name: nome, item: item}, function (err, res) {
                    if (err) throw err;
                    self.setState({
                        inventario: res.Inventario
                    });
                });
                client.RemoveGold({name: nome, valor: preco}, function (err, res) {
                    if (err) throw err;
                    console.log(res);
                    self.setState({
                        gold: res.Gold
                    });
                });

            });
            this.setState({lgShow: false})
        }
    }

    use_item(item) {
        var nome = this.state.user.name;
        let self = this;
        console.log(item);
        soap.createClient(url, function (err, client) {
            if (err) throw err;


            client.Use_Item({name: nome, item: item}, function (err, res) {
                if (err) throw err;
                self.setState({
                    inventario: res.Inventario
                });
            });
        });
    }

    inventario_item(item, size=1) {
        let attr = <ListGroup header={item.name} >
            {(item.ataque && item.ataque > 0) ? `Dano ${item.ataque}` : `Cura ${item.cura}`}
        </ListGroup>;
        return (
            <ListGroupItem onClick={() => {
                if((parseInt(item.cura) > 0))
                    return this.use_item(item)
            }} className={'hand'}>
                <td><img src={item.imagem} style={{maxWidth: '40px', maxHeight: '40px'}} alt={item.name}/></td>
                <td>
                    Quantidade: [{size}]
                    {attr}
                </td>
            </ListGroupItem>
        )
    }

    imprimeInventario() {
        let count = {};
        let count2 = {};
        let inventario = this.state.user.inventario;
        if (inventario) {
            if (!(inventario instanceof Array)) {
                inventario = [inventario]
            }
            inventario.forEach(function (i) {
                count[i.name] = i;
                count2[i.name] = (count2[i.name] || 0) + 1;
            });
        }
        let keys = Object.keys(count);
        let self = this;
        return keys.map(key => {
            return self.inventario_item(count[key], count2[key])
        });
    }

    lista() {
        let array = [];
        array.push(
            <label style={{width: '25%', padding: '2%'}}><p>Preço $50</p>
                <input type="radio" name="a" value="sword"
                       onChange={() => this.handleItem({name: 'sword', imagem: sword, valor: 50, ataque: 10})}/>
                <img src={sword} alt={"Espada"} style={{width:'100%'}}/></label>
        );
        array.push(
            <label style={{width: '25%', padding: '2%'}}><p>Preço $50</p>
                <input type="radio" name="a" value="pistol"
                       onChange={() => this.handleItem({name: 'pistol', imagem: pistol, valor: 50, ataque: 10})}/>
                <img src={pistol} alt={'Pistola'} style={{width:'100%'}}/></label>
        );
        array.push(
            <label style={{width: '25%', padding: '2%'}}><p>Preço $50</p>
                <input type="radio" name="a" value="bow"
                       onChange={() => this.handleItem({name: 'bow', imagem: bow, valor: 50, ataque: 10})}/>
                <img src={bow} alt={'Arco'} style={{width:'100%'}}/></label>
        );
        array.push(
            <label style={{width: '25%', padding: '2%'}}><p>Preço $10</p>
                <input type="radio" name="a" value="potion"
                       onChange={() => this.handleItem({
                           name: 'potion',
                           imagem: potion,
                           valor: 10,
                           ataque: 0,
                           cura: 30
                       })}/>
                <img src={potion} style={{width:'100%'}} alt={'Poção de cura'}/></label>
        );
        return array
    }

    batalha = (enemy, inventario, disabled) => {
        let count = {};
        let count2 = {};
        count['Ataque basico'] = {};
        if (inventario) {
            if (!(inventario instanceof Array)) {
                inventario = [inventario]
            }
            inventario.forEach(function (i) {
                count[i.name] = i;
                count2[i.name] = (count2[i.name] || 0) + 1;
            });
        }
        let keys = Object.keys(count);
        let position = this.load_position(enemy.x, enemy.y);
        return keys.map(key => {
            return (

                <Col sm={4}>
                    <center>
                        <Button className="btn btn-xs btn-block"
                                disabled={disabled}
                                onClick={() => this.atacar(position, (enemy.turn == 'true') ? 'duel_monster' : 'duel', count[key])}> {key} [{count2[key] || '∞'}]</Button>
                    </center>
                </Col>
            )
        });
    };

    render() {
        let lgClose = () => this.setState({lgShow: false});
        return (
            <div className="App">

                <table style={{width: '80%', marginLeft: '10%'}}>
                    <tr style={{border: '1px solid black'}}>
                        <td style={{border: '1px solid black', textAlign: 'center'}}>
                            <h4>Nome: {this.state.user.name}</h4>
                        </td>
                        <td style={{border: '1px solid black', fontWeight: 'bold', textAlign: 'center'}}>MAPA</td>
                        <td style={{
                            border: '1px solid black',
                            fontWeight: 'bold',
                            textAlign: 'center'
                        }}>INVENTÁRIO <Button id="botaoLoja" bsStyle="primary"
                                              onClick={() => this.setState({lgShow: true})}>
                            Loja
                        </Button></td>
                    </tr>
                    <tr style={{border: '1px solid black'}}>
                        <th style={{width: '25%', border: '1px solid black', textAlign: 'center'}}>
                            <ProgressBar striped bsStyle="danger" now={this.state.user.life}
                                         max={this.state.user.maximo_life} label="Life"/>
                            <var style={{color: 'yellow', fontSize: '20px'}}>Gold: ${this.state.user.gold}</var>
                            <img src={this.state.user.imagem} alt={this.state.user.name} style={{width: '100%'}}/>
                        </th>

                        <th style={{border: '1px solid black', width: '40%', textAlign: 'center'}}>
                            {this.render_map()}
                        </th>

                        <th style={{border: '1px solid black', width: '35%'}}>
                            <ListGroup>
                                {this.imprimeInventario()}
                            </ListGroup>
                        </th>
                    </tr>
                </table>

                <Modal bsSize="large"
                       aria-labelledby="contained-modal-title-sm"
                       show={this.state.lgShow} onHide={lgClose}
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-sm">Lojinha</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.lista()}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.comprar}>Comprar</Button>
                        <Button onClick={lgClose}>Fechar</Button>
                    </Modal.Footer>
                </Modal>

                <Modal bsSize="large"
                       aria-labelledby="contained-modal-title-sm"
                       show={this.state.user.duel}
                >
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-sm">
                            <center>Duelo
                                {' '}
                                <var style={{color: 'red'}}>{this.state.user.name}[{this.state.user.foto}]</var>
                                {' contra '}
                                <var
                                    style={{color: 'red'}}> {this.state.enemy.name} {(this.state.enemy.foto) ? `[${this.state.enemy.foto}]` : '[Monstro]'}</var>
                                {' '}
                            </center>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Table>
                            <tr>
                                <td style={{width: '50%', padding: '2px'}}>
                                    <ListGroup>
                                        <ListGroupItem>
                                            <ProgressBar striped bsStyle="danger"
                                                         now={this.state.user.life}
                                                         max={this.state.user.maximo_life}
                                                         label={this.state.user.life}/>
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            Vida: {this.state.user.life} / {this.state.user.maximo_life}
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            Nome: {this.state.user.name}
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            Ataque base: {this.state.user.ataque}
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            Classe: {this.state.user.foto}
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <Grid style={{width: '100%'}}>
                                                <Row className="show-grid">
                                                    {this.batalha(this.state.enemy,
                                                        this.state.user.inventario,
                                                        this.state.user.turn === "false")}
                                                </Row>
                                            </Grid>
                                        </ListGroupItem>
                                    </ListGroup>
                                </td>
                                <td style={{width: '50%', padding: '2px'}}>
                                    <ListGroup>
                                        <ListGroupItem>
                                            <ProgressBar striped bsStyle="danger"
                                                         now={this.state.enemy.life}
                                                         max={this.state.enemy.maximo_life}
                                                         label={this.state.enemy.life}/>
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            Vida: {this.state.enemy.life} / {this.state.enemy.maximo_life}
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            Nome: {this.state.enemy.name}
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            Ataque base: {this.state.enemy.ataque}
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            Classe: {(this.state.enemy.foto) ? `[${this.state.enemy.foto}]` : '[Monstro]'}
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <Grid style={{width: '100%'}}>
                                                <Row className="show-grid">
                                                    {this.batalha(this.state.user,
                                                        null,
                                                        true)}
                                                </Row>
                                            </Grid>
                                        </ListGroupItem>
                                    </ListGroup>
                                </td>
                            </tr>
                        </Table>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            onClick={() => this.atacar(this.state.enemy, 'quit')}>{'Sair'}</Button>
                    </Modal.Footer>
                </Modal>

            </div>
        );
    }

    morreu = async () => {
        let self = this;
        this.setState({user: {}});
        await confirmAlert({
            title: <center>Você morreu!!</center>,
            message: <center>Deseja criar outro personagem? <img src={skull}/></center>,
            buttons: [
                {
                    label: 'Sim',
                    onClick: () => {
                        self.props.history.push({pathname: '/cadastro'})
                    }
                },
                {
                    label: 'Não',
                    onClick: () => {
                        self.props.history.push({pathname: '/home'})
                    }
                }
            ]
        })
    };

    load_map() {
        let obj = {name: this.state.user.name};
        let self = this;
        new Promise(async function (response, reject) {
            try {
                await soap.createClient(url, function (err, client) {
                    if (err) throw err;
                    // interfaces
                    client.GetMap(obj, function (err, res) {
                        if (err) throw err;
                        self.setState(res.map)
                    });
                    client.GetInventarioList(obj, function (err, res) {
                        if (err) throw err;
                        self.setState({inventario: res.Inventario.Inventario})
                    });

                    client.GetUser(obj, function (err, res) {
                        if (err) throw err;
                        if (!('name' in res.User) || res.User.life <= 0) {
                            delete self.state.user.duel;
                            delete self.state.user.turn;
                            self.morreu()
                        }
                        else {
                            if ('duel' in res.User) {
                                let position = self.load_position(res.User.duel.x, res.User.duel.y);
                                if (position && position.usuario) {
                                    self.setState({enemy: position.usuario})
                                }
                                else if (position && position.monster) {
                                    self.setState({enemy: position.monster})
                                }
                                else {
                                    self.setState({enemy: {}})

                                }
                            }
                            self.setState({user: res.User});
                            response()
                        }

                    });

                });

            }
            catch (e) {
                reject(e)
            }

        }).then(function () {
            if (self.state.user.name) {
                setTimeout(self.load_map, 300);
            }
        })
    }
}

export default App;
export {url};
