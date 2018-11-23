import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(    <BrowserRouter>
        <Switch>
            <Route path="/" exact={true} component={App} />
            <Route path="/sobre" component={Sobre} />
        </Switch>
    </ BrowserRouter>);
  ReactDOM.unmountComponentAtNode(div);
});
