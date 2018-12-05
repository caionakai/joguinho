import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter , Switch, Route} from 'react-router-dom'
import Cadastro from './Cadastro'
import Header from './Header.js'
import Home from "./home";
ReactDOM.render(
    <div>
        <Header></Header>
	    <BrowserRouter>
            <Switch>
                <Route path="/" exact={true} component={App} />
                <Route path="/cadastro" render={(props) => ( <Cadastro {...props}/>)}/>
                <Route path="/home" render={(props) => ( <Home {...props}/>)}/>
            </Switch>
        </ BrowserRouter>
    </div>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
