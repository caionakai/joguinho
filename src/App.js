import React, { Component } from 'react';
import './App.css';
import { Navbar, NavItem, NavDropdown, Nav, MenuItem } from 'react-bootstrap';
import Header from './Header.js'

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


      </div>
    );
  }
}

export default App;
