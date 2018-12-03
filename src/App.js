import React, {Component} from 'react';
import './App.css';
import {Modal, Button, ProgressBar} from 'react-bootstrap';
import saber from './saber.png';
import archer from './archer.png';
import corrin from './corrin.png';
import sword from './sword.png';
import pistol from './pistol.png';
import bow from './bow.png';

class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.handleChange = this.handleChange.bind(this);
        this.handleItem = this.handleItem.bind(this);
        this.comprar = this.comprar.bind(this);
        this.load_map = this.load_map.bind(this);
        this.render_map = this.render_map.bind(this);
        this.verificaItemImage = this.verificaItemImage.bind(this);
        this.state = {
            name: 'None',
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

    handleItem(item_name, item_image) {
        this.setState({item: {name:item_name, imagem:item_image}});
    }

    handleChange(e) {
        this.setState({item: e.target.value});
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
            await self.setState(self.props.location.state);
            response()
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
                let position = this.state.map[i * size + j]
                if (Math.abs(this.state.x - position.x) > this.state.view || Math.abs(this.state.y - position.y) > this.state.view) {
                    children.push(<td>{`_~~_`}</td>)
                }
                else {
                    if ('usuario' in this.state.map[i * size + j]) {
                        if (position.x == this.state.x && position.y == this.state.y)
                            children.push(
                                <td style={{fontSize: '.8em'}}>
                                    {this.state.foto.toUpperCase()}
                                </td>);
                        else
                            children.push(
                                <td style={{fontSize: '.8em'}}>
                                    <a className={'hand'}
                                       onClick={() => this.atacar(position.usuario)}>{position.usuario.foto.toUpperCase()}</a>
                                </td>)
                    }
                    else {
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
        return table
    }

    atacar(enemy) {
        const soap = require('soap-everywhere');
        const url = 'http://localhost:8001/wscalc1?wsdl';
        let obj = {
            atacante: {ataque: this.state.ataque, name: this.state.name, x: this.state.x, y: this.state.y},
            alvo: enemy
        };
        let self = this;
        soap.createClient(url, function (err, client) {
            if (err) throw err;
            client.Atacar(obj, function (err, res) {
                if (err) throw err;
                console.log(res)
            })
        })
    }

    move(location) {
        const soap = require('soap-everywhere');
        const url = 'http://localhost:8001/wscalc1?wsdl';
        let obj = {
            atacante: {ataque: this.state.ataque, name: this.state.name, x: this.state.x, y: this.state.y},
            alvo: location
        };
        let self = this;
        soap.createClient(url, function (err, client) {
            if (err) throw err;
            client.Move(obj, function (err, res) {
                if (err) throw err;
                console.log(res)
            })
        })
    }

    verificaItemImage(nomeItem) {
        switch (nomeItem) {
            case 'sword': {
                this.setState({imgItem: sword});
                break;
            }
            case 'pistol': {
                this.setState({imgItem: pistol});
                break;
            }
            case 'bow': {
                this.setState({imgItem: bow});
                break;
            }
            default: {
                this.setState({imgItem: null})
            }
        }
    }

    comprar() {
        var soap = require('soap-everywhere');
        var url = 'http://localhost:8001/wscalc1?wsdl';
        var nome = this.state.name;
        var item = this.state.item;
        let self = this;
        if (this.state.gold < 50) {
            alert("vc nao tem money suficiente $$");
            this.setState({lgShow: false})
        }
        else {
            soap.createClient(url, function (err, client) {
                if (err) throw err;


                client.AddInventario({name: nome, item: item}, function (err, res) {
                    if (err) throw err;
                    console.log(res);
                    self.setState({
                        inventario: res.Inventario
                    });
                });
                client.RemoveGold({name: nome, valor: 50}, function (err, res) {
                    if (err) throw err;
                    console.log(res);
                    self.setState({
                        gold: res.Gold
                    });
                });

            });
            this.verificaItemImage(item)
            this.setState({lgShow: false})
        }
    }

    imprimeInventario() {
        let array = [];
        let item = this.state.inventario

        console.log(item)
        if(!item) return;
        if(!(item instanceof Array)){
            array.push(<li style={{paddingLeft: '3%'}}><img src={item.imagem}
                                                            style={{maxWidth: '40px', maxHeight: '40px'}}/>{item.name}
            </li>)            
            return array;
        }

        for (let i = 0; i < item.length; i++) {
            console.log(item[i])
            // console.log(i)

            array.push(<li style={{paddingLeft: '3%'}}><img src={item[i].imagem}
                                                            style={{maxWidth: '40px', maxHeight: '40px'}}/>{item[i].name}
            </li>)

        }
        return array
    }

    lista() {
        let array = []
        array.push(
            <label style={{width: '50%', padding: '2%'}}><p>Preço $50</p>
                <input type="radio" name="a" value="sword" onChange={()=>this.handleItem('sword', sword)}/>
                <img src={sword}/></label>
        )
        array.push(
            <label style={{width: '50%', padding: '2%'}}><p>Preço $50</p>
                <input type="radio" name="a" value="pistol" onChange={()=>this.handleItem('pistol', pistol)}/>
                <img src={pistol}/></label>
        )
        array.push(
            <label style={{width: '50%', padding: '2%'}}><p>Preço $50</p>
                <input type="radio" name="a" value="bow" onChange={()=>this.handleItem('bow', bow)}/>
                <img src={bow}/></label>
        )
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
                            <a style={{color: 'yellow', fontSize: '20px'}}>Gold: ${this.state.gold}</a>
                            <img src={this.state.imagem} style={{width: '100%'}}/>
                        </th>

                        <th style={{border: '1px solid black', width: '40%', textAlign: 'center'}}>
                            {this.render_map()}
                        </th>

                        <th style={{border: '1px solid black', width: '35%'}}>
                            <center>

                            </center>
                            {this.imprimeInventario()}
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
        const soap = require('soap-everywhere');
        const url = 'http://localhost:8001/wscalc1?wsdl';
        let obj = {name: this.state.name};
        let self = this;
        soap.createClient(url, function (err, client) {
            if (err) throw err;
            // interfaces
            client.GetMap(obj, function (err, res) {
                if (err) throw err;
                self.setState(res.map)
            });
            client.GetUser(obj, function (err, res) {
                if (err) throw err;
                if (!('name' in res.User)) {
                    console.log('redirect');
                    self.props.history.push({pathname: '/cadastro'});
                }
                self.setState(res.User)
            });
            client.GetInventarioList(obj, function (err, res) {
                if (err) throw err;
                // console.log(res.Inventario.Inventario.name)
                self.setState({inventario: res.Inventario.Inventario})
            })

        });
        setTimeout(this.load_map, 1000);
    }
}

export default App;
