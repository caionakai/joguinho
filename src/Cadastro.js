import React from 'react';
import {Button, ControlLabel, FormControl, FormGroup} from 'react-bootstrap';
import './Cadastro.css';
import saber from './img/saber.png';
import archer from './img/archer.png';
import corrin from './img/corrin.png';
import {url} from "./App";

const soap = require('soap-everywhere');

class Cadastro extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.mudaInput = this.mudaInput.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.msgServidor = this.msgServidor.bind(this);

        this.state = {
            user:{
                name: '',
                imagem: ''
            }
        }
        ;
    }

    componentDidMount() {
        this.setState(this.props.location.state);
    }

    mudaInput(foto, imagem) {
        let user = this.state.user;
        user.imagem = imagem;
        user.foto = foto;
        this.setState({user: user});
    }

    handleChange(e) {
        let user = this.state.user;
        user.name=e.target.value;
        this.setState({user: user});
    }

    msgServidor() {

        let obj = this.state.user;
        let props = this.props;
        soap.createClient(url, function (err, client) {
            if (err) throw err;
            // interfaces
            console.log(client.describe().ws.funcoes);
            client.CreateUser(obj, function (err, res) {
                if (err) throw err;
                console.log(res.user);
                props.history.push({pathname: '/', state: res});
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
                            value={this.state.user.name}
                            placeholder="Digite um nome"
                            onChange={this.handleChange}
                        />
                        <div id="inputs">
                            <label className="radio-inline">
                                <input type="radio" name="persona" id="persona" value='saber'
                                       onChange={()=>{this.mudaInput('Saber',saber)}}/>
                                <img src={saber} alt={'Saber'}/>
                            </label>
                            <label className="radio-inline">
                                <input type="radio" name="persona" id="persona" value='archer'
                                       onChange={()=>{this.mudaInput('Archer',archer)}}/>
                                <img src={archer} alt={'Archer'}/>
                            </label>
                            <label className="radio-inline">
                                <input type="radio" name="persona" id="persona" value="corrin"
                                       onChange={()=>{this.mudaInput('Corrin',corrin)}}/>
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