import React, {Component} from 'react';
import {Nav, Navbar, NavItem} from 'react-bootstrap';

// componente cabeçalho é usado em todas as páginas
class Header extends Component {
    render(){
        return(
            <div>
                <Navbar inverse collapseOnSelect>
                    <Navbar.Header>
                        <Navbar.Brand>
                        <a href="/">SD Campiolo</a>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav>
                        <NavItem eventKey={1} href="/cadastro">
                            Cadastro
                        </NavItem>
                        </Nav>
                        <Nav pullRight>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>;
            </div>
        );
    }
}

export default Header;