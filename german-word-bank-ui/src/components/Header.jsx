import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

const Header = () => {
  // This function prevents the page from reloading on click
  const handleNavClick = (e) => {
    e.preventDefault();
    console.log("Navigation to this page is not implemented yet.");
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
            <Nav.Link href="#words" onClick={handleNavClick}>Words</Nav.Link>
            <Nav.Link href="#exercises" onClick={handleNavClick}>Exercises</Nav.Link>
            <Nav.Link href="#settings" onClick={handleNavClick}>Settings</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;