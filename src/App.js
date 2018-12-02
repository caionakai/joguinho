import React, { Component } from 'react';
import './App.css';
import { Button, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';
import saber from './saber.png';
import archer from './archer.png';
import corrin from './corrin.png';

class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleChange = this.handleChange.bind(this);
    this.addInventario = this.addInventario.bind(this);
    this.state = {
      name: 'None',
      x: '--',
      y: '--',
      item: '',
      imagem:saber
    }
  }
  addInventario(){
    var soap = require('soap-everywhere');
    var url = 'http://localhost:8001/wscalc1?wsdl';
    var nome = this.state.nome;
    soap.createClient(url, function(err, client) {
        if (err) throw err;
        // interfaces
        // console.log(client.describe().ws.funcoes);
        client.AddInventario({name:'x', item:'caio'},function(err,res){
          if (err) throw err;
          console.log(res);
        });
  
    });   
  }
  handleChange(e) {
    this.setState({ item: e.target.value });
  }
  componentDidMount(){
    this.setState(this.props.location.state)
    switch (this.props.location.foto){
      case 'corrin': {
        this.setState({imagem: corrin});
        break;
      }
      case 'saber':{
        this.setState({imagem: saber});
        break;
      }
      case 'archer':{
        this.setState({imagem: archer});
        break;
      }
      default:{
        this.setState({imagem: null})
      }
    }
    // console.log(this.props.location.state)

  }
  render() {
    return (
      <div className="App">
        <h1>Página Inicial</h1>
        <h2>Nome: {this.state.name} </h2>
        <h2>x: {this.state.x} </h2>
        <h2>y: {this.state.y} </h2>
        <img src={this.state.imagem}/>
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
	        </FormGroup>
	      </form>
      </div>
    );
  }

  load_map(){
      const soap = require('soap-everywhere');
      const url = 'http://localhost:8001/wscalc1?wsdl';
      let nome = 'Gabriel';

      soap.createClient(url, function(err, client) {
          if (err) throw err;
          // interfaces
          console.log(client.describe().ws.funcoes);
          client.GetMap({user:nome},function(err,res){
              if (err) throw err;
              console.log(res);
          });

      });
  }
}

export default App;
