import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    Navbar,
    Nav,
    NavDropdown
} from 'react-bootstrap';

const Navigation = () => {
  
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="p-4"> 
        <Navbar.Brand href="#home">Navbar</Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link href="#home">Home</Nav.Link>
                <Nav.Link href="#features">About</Nav.Link>
                    <NavDropdown title="Link" id="navbarScrollingDropdown">
                        <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                        <NavDropdown.Item href="#action4">Another action</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action5">Something else here</NavDropdown.Item>
                    </NavDropdown>
                <Nav.Link href="#contact">Contact</Nav.Link>
            </Nav>
  </Navbar>
 )
}

export default Navigation; 
