import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

const Header = ({ onNavigate }) => {
  // This function prevents the page from reloading on click
  const handleNavClick = (e, page) => {
    e.preventDefault();
    onNavigate(page);
  };

  return (
    <Navbar fixed="top" expand="lg" className="app-navbar">
      <Container>
        <Navbar.Brand href="#home" className="navbar-brand-glow">
          Wortschatz
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#words" onClick={(e) => handleNavClick(e, 'words')}>Words</Nav.Link>
            <Nav.Link href="#exercises" onClick={(e) => handleNavClick(e, 'exercises')}>Exercises</Nav.Link>
            <Nav.Link href="#settings" onClick={(e) => handleNavClick(e, 'settings')}>Settings</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;