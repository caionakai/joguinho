import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';
import './Cadastro.css';
import saber from './saber.png';
import archer from './archer.png';
import corrin from './corrin.png';

class Cadastro extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.mudaInput = this.mudaInput.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.msgServidor = this.msgServidor.bind(this);

    this.state = {
			nome: '',
			selecionado: ''
    };
  }
	mudaInput(e2) {
    this.setState({selecionado: e2.target.value});
  }
  handleChange(e) {
    this.setState({ nome: e.target.value });
  }

  msgServidor(){
	var soap = require('soap-everywhere');
	var url = 'http://localhost:8001/wscalc1?wsdl';
	var nome = this.state.nome;
	var props = this.props
	var foto = this.state.selecionado
	soap.createClient(url, function(err, client) {
	    if (err) throw err;
			// interfaces
			console.log(client.describe().ws.funcoes);
			client.CreateUser({name:nome},function(err,res){
				if (err) throw err;
				console.log(res);
				props.history.push({pathname:'/', state: res.User, foto:foto});
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
	            value={this.state.nome}
	            placeholder="Digite um nome"
	            onChange={this.handleChange}
	        />
				<div id="inputs">
					<label class="radio-inline">
							<input type="radio" name="persona" id="persona" value='saber'
							onChange={this.mudaInput}/>
							<img src={saber}/>
					</label>
					<label class="radio-inline">
							<input type="radio" name="persona" id="persona" value='archer'
							onChange={this.mudaInput}/>
							<img src={archer}/>
					</label>	
					<label class="radio-inline">
							<input type="radio" name="persona" id="persona" value="corrin" 
							onChange={this.mudaInput}/>
							<img src={corrin}/>
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