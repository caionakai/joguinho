import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';
import './Cadastro.css';

class Cadastro extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
    this.msgServidor = this.msgServidor.bind(this);

    this.state = {
      nome: ''
    };
  }

  handleChange(e) {
    this.setState({ nome: e.target.value });
  }

  msgServidor(){
	var soap = require('soap-everywhere');
	var url = 'http://localhost:8001/wscalc1?wsdl';
	var nome = this.state.nome;

	soap.createClient(url, function(err, client) {
	    if (err) throw err;
			// interfaces
			console.log(client.describe().ws.funcoes);
			client.CreateUser({name:nome},function(err,res){
				if (err) throw err;
				console.log(res);
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
	        <ControlLabel>Teste</ControlLabel>
	        <FormControl
	            type="text"
	            value={this.state.nome}
	            placeholder="Digite um numero"
	            onChange={this.handleChange}
	        />
	        <Button id="btn" onClick={this.msgServidor} bsStyle="info">Enviar</Button>
	        </FormGroup>
	      </form>
    	</div>
    );
  }
}

export default Cadastro;