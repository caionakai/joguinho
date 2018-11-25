import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap';
import './Cadastro.css';

class Cadastro extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.msgServidor = this.msgServidor.bind(this);

    this.state = {
      a: '',
      b: '',
    };
  }

  // getValidationState() {
  //   const length = this.state.value.length;
  //   if (length > 10) return 'success';
  //   else if (length > 5) return 'warning';
  //   else if (length > 0) return 'error';
  //   return null;
  // }

  handleChange(e) {
    this.setState({ a: e.target.value });
  }
  handleChange2(e) {
    this.setState({ b: e.target.value });
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

        client.GetUserList({name:'Gabriel'},function(err,res){
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
	          // validationState={this.getValidationState()}
	        >
	        <ControlLabel>Teste</ControlLabel>
	        <FormControl
	            type="text"
	            value={this.state.value}
	            placeholder="Digite um numero"
	            onChange={this.handleChange}
	        />
	        <FormControl
	            type="text"
	            value={this.state.b}
	            placeholder="Digite outro numero"
	            onChange={this.handleChange2}
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