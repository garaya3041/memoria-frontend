import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import {Ejemplo1} from '../../models/Ejemplo1';
import {Ejemplo2} from '../../models/Ejemplo2';
import {Ejemplo3} from '../../models/Ejemplo3';
import { useNavigate } from 'react-router-dom';

const NavbarUSM = () => {

    const navigate = useNavigate();

    const volver = () => {
        setTimeout(()=>{
            navigate('/');
        },150)
    }

    return (
        <>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Container>
                <Navbar.Brand href="/">Home</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                    <Nav.Link href="/tutorial">Definiciones</Nav.Link>
                    <NavDropdown title="Ejemplos" id="collasible-nav-dropdown">
                        {
                            window.location.pathname !== '/arbol' 
                            ?
                            <>
                                <Ejemplo1 />
                                <Ejemplo2 />
                                <Ejemplo3 />
                            </>
                            :
                            <>
                                <NavDropdown.Item onClick={volver}>Volver a Home</NavDropdown.Item>
                            </>
                        }
                    </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}
 
export default NavbarUSM;