import React, { Component } from 'react';
import './App.css';
import {Button} from "react-bootstrap";

class App extends Component {
  render() {
    return (
      <div className="App">
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
