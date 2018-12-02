import React, {Component} from 'react';
import './App.css';
import {Button, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';
import saber from './saber.png';
import archer from './archer.png';
import corrin from './corrin.png';

class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.handleChange = this.handleChange.bind(this);
        this.addInventario = this.addInventario.bind(this);
        this.load_map = this.load_map.bind(this);
        this.render_map = this.render_map.bind(this);
        this.state = {
            name: 'None',
            x: '--',
            y: '--',
            item: '',
            map: [],
            imagem: saber
        }
    }

    addInventario() {
        var soap = require('soap-everywhere');
        var url = 'http://localhost:8001/wscalc1?wsdl';
        var nome = this.state.nome;
        soap.createClient(url, function (err, client) {
            if (err) throw err;
            // interfaces
            // console.log(client.describe().ws.funcoes);
            client.AddInventario({name: 'x', item: 'caio'}, function (err, res) {
                if (err) throw err;
                console.log(res);
            });

        });
    }

    handleChange(e) {
        this.setState({item: e.target.value});
    }

    componentDidMount() {
        this.setState(this.props.location.state);
        this.load_map();

        switch (this.props.location.foto) {
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
                this.setState({imagem: null})
            }
        }
        // console.log(this.props.location.state)

    }

    render_map() {
        let table = [];
        console.log(this.state.map);
        let size = Math.sqrt(this.state.map.length);
        // Outer loop to create parent
        let children = [];
        children.push(<td>{`_//_`}</td>);
        for (let j = 0; j < size; j++) {
            children.push(<td>{`_${(j +1).toString().padStart(2, '0')}_`}</td>)
        }
        table.push(<tr>{children}</tr>);
        for (let i = 0; i < size; i++) {
            let children = [];
            //Inner loop to create children
            children.push(<td>{`_${(i +1).toString().padStart(2, '0')}_`}</td>);
            for (let j = 0; j < size; j++) {
                if ('usuario' in this.state.map[i * size + j]) {
                    children.push(<td>{`_EE_`}</td>)
                }
                else {
                    children.push(<td>{`_##_`}</td>)
                }
            }
            //Create the parent and add the children
            table.push(<tr>{children}</tr>)
        }
        return table
    }

    render() {
        return (
            <div className="App">
                <table style={{width: '80%', marginLeft: '10%'}}>
                    <tr style={{ border: '1px solid black'}}>
                        <th style={{width: '25%',  border: '1px solid black'}}>
                            <h4>{this.state.name}</h4>
                            <img src={this.state.imagem} style={{width: '100%'}}/>
                        </th>
                        <th style={{ border: '1px solid black', width: '40%'}}>
                            {this.render_map()}
                        </th>
                        <th style={{ border: '1px solid black', width: '35%'}}> asdsad</th>
                    </tr>
                </table>

                <Button onClick={this.load_map}>Click</Button>
                <form>
                    <FormGroup
                        controlId="formBasicText"
                    >
                        <ControlLabel>Adicione um item no inventário</ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.nome}
                            placeholder="Digite um item"
                            onChange={this.handleChange}
                        />
                        <Button id="btn" onClick={this.addInventario} bsStyle="info">ADD inventario</Button>
                        <Button id="btn" onClick={this.load_map} bsStyle="info">Load Map</Button>
                    </FormGroup>
                </form>
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
            console.log(client.describe().ws.funcoes);
            client.GetMap(obj, function (err, res) {
                if (err) throw err;
                self.setState(res.map)
            });

        });
    }
}

export default App;
