import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

const Header = ({ onNavigate, currentPage }) => {

  const handleNavClick = (e, page) => {
    e.preventDefault();
    onNavigate(page);
  };

  return (
    <Navbar className="app-navbar">
      <Container>
        <Navbar.Brand href="#home" onClick={(e) => handleNavClick(e, 'home')}>
          Wortschatz
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* CHANGED 'className' to 'active' prop on all links */}
            <Nav.Link 
              href="#home" 
              active={currentPage === 'home'} 
              onClick={(e) => handleNavClick(e, 'home')}>
              Home
            </Nav.Link>
            <Nav.Link 
              href="#words" 
              active={currentPage === 'words'} 
              onClick={(e) => handleNavClick(e, 'words')}>
              Words
            </Nav.Link>
            <Nav.Link 
              href="#exercises" 
              active={currentPage === 'exercises'} 
              onClick={(e) => handleNavClick(e, 'exercises')}>
              Exercises
            </Nav.Link>
            <Nav.Link 
              href="#settings" 
              active={currentPage === 'settings'} 
              onClick={(e) => handleNavClick(e, 'settings')}>
              Settings
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;