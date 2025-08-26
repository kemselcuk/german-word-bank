import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const WriteTheWordModal = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="modal-title-glow">Write the Word Exercise</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center p-5">
        <h4>"Write the Word" exercise will be here!</h4>
        <p className="text-muted">This feature is coming soon.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WriteTheWordModal;