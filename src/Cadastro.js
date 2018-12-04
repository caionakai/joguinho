import React from 'react';
import {Button, ControlLabel, FormControl, FormGroup} from 'react-bootstrap';
import './Cadastro.css';
import saber from './saber.png';
import archer from './archer.png';
import corrin from './corrin.png';
import {url} from "./App";

const soap = require('soap-everywhere');

class Cadastro extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.mudaInput = this.mudaInput.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.msgServidor = this.msgServidor.bind(this);

        this.state = {
            name: '',
            imagem: ''
        };
    }

    componentDidMount() {
        this.setState(this.props.location.state);
    }

    mudaInput(e2) {
        this.setState({imagem: e2.target.value});
    }

    handleChange(e) {
        this.setState({name: e.target.value});
    }

    msgServidor() {

        let nome = this.state.name;
        let props = this.props;
        let foto = this.state.imagem;
        soap.createClient(url, function (err, client) {
            if (err) throw err;
            // interfaces
            console.log(client.describe().ws.funcoes);
            client.CreateUser({name: nome, foto: foto}, function (err, res) {
                if (err) throw err;
                console.log(res);
                props.history.push({pathname: '/', state: {...res.User, foto: foto}});
            });

        });

    }

    render() {
        return (
            <div id="form">
                <form>
                    <FormGroup
                        controlId="formBasicText"
                    >
                        <ControlLabel>Nome do Usuário</ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.name}
                            placeholder="Digite um nome"
                            onChange={this.handleChange}
                        />
                        <div id="inputs">
                            <label className="radio-inline">
                                <input type="radio" name="persona" id="persona" value='saber'
                                       onChange={this.mudaInput}/>
                                <img src={saber} alt={'Saber'}/>
                            </label>
                            <label className="radio-inline">
                                <input type="radio" name="persona" id="persona" value='archer'
                                       onChange={this.mudaInput}/>
                                <img src={archer} alt={'Archer'}/>
                            </label>
                            <label className="radio-inline">
                                <input type="radio" name="persona" id="persona" value="corrin"
                                       onChange={this.mudaInput}/>
                                <img src={corrin} alt={'Corrin'}/>
                            </label>
                        </div>
                        <Button id="btn" onClick={this.msgServidor} bsStyle="info">Criar Usuário</Button>
                    </FormGroup>
                </form>
            </div>
        );
    }
}

export default Cadastro;