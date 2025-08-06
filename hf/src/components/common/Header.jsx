import React, { useContext } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { HouseDoor, Shop, Box, Tools, Person } from 'react-bootstrap-icons';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          ElectroMarket KE
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" active={isActive('/')}>
              <HouseDoor className="me-1" /> Home
            </Nav.Link>
            <Nav.Link as={Link} to="/businesses" active={isActive('/businesses')}>
              <Shop className="me-1" /> Businesses
            </Nav.Link>
            <Nav.Link as={Link} to="/products" active={isActive('/products')}>
              <Box className="me-1" /> Products
            </Nav.Link>
            <Nav.Link as={Link} to="/services" active={isActive('/services')}>
              <Tools className="me-1" /> Services
            </Nav.Link>
          </Nav>
          <Nav>
            {user ? (
              <>
                <Button 
                  as={Link} 
                  to="/profile" 
                  variant="outline-light" 
                  className="me-2"
                >
                  <Person className="me-1" /> Profile
                </Button>
                <Button variant="danger" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button as={Link} to="/login" variant="primary">
                Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;