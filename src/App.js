import React, { Component } from 'react';
import './App.css';
import {Button} from "react-bootstrap";

class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      name: 'None',
      x: '--',
      y: '--',
    }
  }
  
  componentDidMount(){
    this.setState(this.props.location.state)
    console.log(this.props.location.state)
  }
  render() {
    return (
      <div className="App">
        <h1>Página Inicial</h1>
        <h2>Nome: {this.state.name} </h2>
        <h2>x: {this.state.x} </h2>
        <h2>y: {this.state.y} </h2>
          <Button onClick={this.load_map}>Click</Button>
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
