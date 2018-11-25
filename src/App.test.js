import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter , Switch, Route} from 'react-router-dom'

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(    <BrowserRouter>
        <Switch>
            <Route path="/" exact={true} component={App} />
        </Switch>
    </ BrowserRouter>);
  ReactDOM.unmountComponentAtNode(div);
});
