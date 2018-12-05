import React, {Component} from 'react';
import './App.css';
import {Button, Modal, ProgressBar, ListGroupItem, ListGroup} from 'react-bootstrap';
import saber from './saber.png';
import archer from './archer.png';
import corrin from './corrin.png';
import sword from './sword.png';
import pistol from './pistol.png';
import bow from './bow.png';
import potion from './potion.png';

const ip = require('ip').address();
const url = 'http://' + ip + ':8001/wscalc1?wsdl';
const soap = require('soap-everywhere');

class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.handleItem = this.handleItem.bind(this);
        this.comprar = this.comprar.bind(this);
        this.load_map = this.load_map.bind(this);
        this.render_map = this.render_map.bind(this);
        this.use_item = this.use_item.bind(this);
        this.state = {
            name: '',
            x: '--',
            y: '--',
            view: 0,
            item: '',
            map: [],
            imagem: null,
            lgShow: false,
            inventario: [],
            gold: 0,
            imgItem: ''
        }
    }

    handleItem(obj) {
        this.setState({item: obj});
    }

    componentDidUpdate() {
        if (!this.state.imagem)
            switch (this.state.foto) {
                case 'corrin': {
                    this.setState({imagem: corrin});
                    break;
                }
                case 'saber': {
                    this.setState({imagem: saber});
                    break;
                }
                case 'archer': {
                    this.setState({imagem: archer});
                    break;
                }
                default: {
                    this.setState({imagem: 'oi'})
                }
            }
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
                let position = this.state.map[i * size + j];
                if (Math.abs(this.state.x - position.x) > this.state.view || Math.abs(this.state.y - position.y) > this.state.view) {
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
                        if (position.x === this.state.x && position.y === this.state.y)
                            children.push(
                                <td style={{fontSize: '.8em'}}>
                                    {this.state.foto.toUpperCase()}
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

    atacar(enemy, type) {
        let obj = {
            atacante: {ataque: this.state.ataque, name: this.state.name, x: this.state.x, y: this.state.y},
            alvo: enemy,
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
            atacante: {ataque: this.state.ataque, name: this.state.name, x: this.state.x, y: this.state.y},
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
        let nome = this.state.name;
        let item = this.state.item;
        let self = this;
        let preco = item.valor;

        if (this.state.gold < item.valor) {
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
        var nome = this.state.name;
        let self = this;
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

    inventario_item(item) {
        let attr = <ListGroup header={item.name} href="#" onClick={()=>this.use_item(item)}>
            {item.ataque? `Dano ${item.ataque}`: `Cura ${item.cura}`}
        </ListGroup>;
        return (
            <ListGroupItem>
                <td><img src={item.imagem} style={{maxWidth: '40px', maxHeight: '40px'}} alt={item.name}/></td>
                <td>
                    {attr}
                </td>
            </ListGroupItem>
        )
    }

    imprimeInventario() {
        let array = [];
        let item = this.state.inventario;

        // console.log(item)
        if (!item) return;
        if (!(item instanceof Array)) {
            array.push(this.inventario_item(item));
            return array
        }
        for (let i = 0; i < item.length; i++) {
            array.push(this.inventario_item(item[i]))
        }
        return array
    }

    lista() {
        let array = [];
        array.push(
            <label style={{width: '50%', padding: '2%'}}><p>Preço $50</p>
                <input type="radio" name="a" value="sword"
                       onChange={() => this.handleItem({name: 'sword', imagem: sword, valor: 50, ataque: 10})}/>
                <img src={sword} alt={"Espada"}/></label>
        );
        array.push(
            <label style={{width: '50%', padding: '2%'}}><p>Preço $50</p>
                <input type="radio" name="a" value="pistol"
                       onChange={() => this.handleItem({name: 'pistol', imagem: pistol, valor: 50, ataque: 10})}/>
                <img src={pistol} alt={'Pistola'}/></label>
        );
        array.push(
            <label style={{width: '50%', padding: '2%'}}><p>Preço $50</p>
                <input type="radio" name="a" value="bow"
                       onChange={() => this.handleItem({name: 'bow', imagem: bow, valor: 50, ataque: 10})}/>
                <img src={bow} alt={'Arco'}/></label>
        );
        array.push(
            <label style={{width: '50%', padding: '2%'}}><p>Preço $10</p>
                <input type="radio" name="a" value="potion"
                       onChange={() => this.handleItem({name: 'potion', imagem: potion, valor: 10, cura: 30})}/>
                <img src={potion} alt={'Poção de cura'}/></label>
        );
        return array
    }

    render() {
        let lgClose = () => this.setState({lgShow: false});
        return (
            <div className="App">

                <table style={{width: '80%', marginLeft: '10%'}}>
                    <tr style={{border: '1px solid black'}}>
                        <td style={{border: '1px solid black', textAlign: 'center'}}><h4>Nome: {this.state.name}</h4>
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
                            <ProgressBar striped bsStyle="danger" now={this.state.life} label="Life"/>
                            <var style={{color: 'yellow', fontSize: '20px'}}>Gold: ${this.state.gold}</var>
                            <img src={this.state.imagem} alt={this.state.name} style={{width: '100%'}}/>
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

            </div>
        );
    }

    load_map() {
        let obj = {name: this.state.name};
        let self = this;
        new Promise(async function (response, reject) {
            try {
                let redirect = 0;
                await soap.createClient(url, function (err, client) {
                    if (err) throw err;
                    // interfaces
                    client.GetMap(obj, function (err, res) {
                        if (err) throw err;
                        self.setState(res.map)
                    });
                    client.GetUser(obj, function (err, res) {
                        if (err) throw err;
                        if (!('name' in res.User) || self.state.life <= 0) {
                            if (self.state.life <= 0 && redirect === 0) {
                                alert("Você morreu")
                            }
                            redirect = 1;
                            delete self.props.location.state;
                            delete self.state.name;

                            self.props.history.push({pathname: '/cadastro'})
                        }
                        self.setState(res.User)
                    });
                    client.GetInventarioList(obj, function (err, res) {
                        if (err) throw err;
                        self.setState({inventario: res.Inventario.Inventario})
                    })

                });
                setTimeout(response, 300);
            }
            catch (e) {
                reject(e)
            }

        }).then(function () {
            if (self.state.name) {
                self.load_map();
            }
        })
    }
}

export default App;
export {url};
