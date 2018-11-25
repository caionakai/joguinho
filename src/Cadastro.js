import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap';
import './Cadastro.css';

class Cadastro extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
    this.msgServidor = this.msgServidor.bind(this);

    this.state = {
      value: ''
    };
  }

  getValidationState() {
    const length = this.state.value.length;
    if (length > 10) return 'success';
    else if (length > 5) return 'warning';
    else if (length > 0) return 'error';
    return null;
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  msgServidor(){
var soap = require('soap-everywhere');
var url = 'http://localhost:8001/wscalc1?wsdl';

soap.createClient(url, function(err, client) {
    if (err) throw err;

    console.log(client.describe().ws.calc);

    client.GetUser({name:'Gabriel'},function(err,res){
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
	          validationState={this.getValidationState()}
	        >
	        <ControlLabel>Teste</ControlLabel>
	        <FormControl
	            type="text"
	            value={this.state.value}
	            placeholder="Digite aqui"
	            onChange={this.handleChange}
	        />
	        <FormControl.Feedback />
	        <Button id="btn" onClick={this.msgServidor} bsStyle="info">Enviar</Button>
	        </FormGroup>
	      </form>
    	</div>
    );
  }
}

export default Cadastro;