import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

const API_BASE_URL = 'http://127.0.0.1:8000';

const AddCategoryModal = ({ show, handleClose, onCategoryAdded }) => {
  const [categoryName, setCategoryName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setSubmitError('Category name cannot be empty.');
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/categories/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: categoryName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create category.');
      }
      onCategoryAdded(); // Notify the parent component to refetch
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="modal-title-glow">Create New Category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g., Verbs, Food, Travel"
              required
              autoFocus
            />
          </Form.Group>
          {submitError && <Alert variant="danger">{submitError}</Alert>}
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleClose} className="me-2">Cancel</Button>
            <Button className="btn-glow" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddCategoryModal;