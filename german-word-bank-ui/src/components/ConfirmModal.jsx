import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { AlertTriangle } from 'lucide-react';

const ConfirmModal = ({ show, handleClose, handleConfirm, title, body }) => {
  return (
    <Modal show={show} onHide={handleClose} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title className="modal-title-glow d-flex align-items-center">
          <AlertTriangle size={24} className="me-2" /> 
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="fs-5">{body}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button className="btn-glow" onClick={handleConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;