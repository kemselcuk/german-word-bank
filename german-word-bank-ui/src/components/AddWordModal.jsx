import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';

const API_BASE_URL = 'http://127.0.0.1:8000';

const AddWordModal = ({ show, initialWord, categories, handleClose, onWordAdded }) => {
  // ... (State and handler logic remains the same) ...
  const [wordType, setWordType] = useState('other');
  const [formData, setFormData] = useState({
    german_word: initialWord || '',
    english_translation: '',
    turkish_translation: '',
    artikel: '',
    plural_form: '',
    conjugations: '',
    basic_sentence: '',
    advanced_sentence: '',
    note: '',
    image_url: '',
    category_ids: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCategoryChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    setFormData(prev => ({ ...prev, category_ids: selectedOptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    let payload = { ...formData };

    if (wordType === 'verb' && payload.conjugations) {
      try {
        payload.conjugations = JSON.parse(payload.conjugations);
      } catch (err) {
        setSubmitError('Invalid JSON format for conjugations.');
        setIsSubmitting(false);
        return;
      }
    } else {
        delete payload.conjugations;
    }

    if (wordType !== 'noun') {
      delete payload.artikel;
      delete payload.plural_form;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/words/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create word.');
      }
      onWordAdded();
      handleClose();
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title className="modal-title-glow">Add a New Word</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* Form fields remain the same */}
          <Form.Group className="mb-3">
            <Form.Label>Word Type</Form.Label>
            <Form.Select value={wordType} onChange={(e) => setWordType(e.target.value)}>
              <option value="other">Other (Adjective, etc.)</option>
              <option value="noun">Noun</option>
              <option value="verb">Verb</option>
            </Form.Select>
          </Form.Group>

          <Row>
            <Col md={4}><Form.Group className="mb-3"><Form.Control type="text" name="german_word" value={formData.german_word} onChange={handleChange} placeholder="German Word" required /></Form.Group></Col>
            <Col md={4}><Form.Group className="mb-3"><Form.Control type="text" name="english_translation" value={formData.english_translation} onChange={handleChange} placeholder="English Translation" required /></Form.Group></Col>
            <Col md={4}><Form.Group className="mb-3"><Form.Control type="text" name="turkish_translation" value={formData.turkish_translation} onChange={handleChange} placeholder="Turkish Translation" required /></Form.Group></Col>
          </Row>

          {wordType === 'noun' && (
            <Row>
              <Col><Form.Group className="mb-3"><Form.Control type="text" name="artikel" value={formData.artikel} onChange={handleChange} placeholder="Artikel (der, die, das)" /></Form.Group></Col>
              <Col><Form.Group className="mb-3"><Form.Control type="text" name="plural_form" value={formData.plural_form} onChange={handleChange} placeholder="Plural Form" /></Form.Group></Col>
            </Row>
          )}

          {wordType === 'verb' && (
            <Form.Group className="mb-3">
              <Form.Control as="textarea" name="conjugations" value={formData.conjugations} onChange={handleChange} placeholder='Conjugations (JSON format) e.g., {"präsens": {"ich": "lerne"}}' rows={4} />
            </Form.Group>
          )}

          <Form.Group className="mb-3"><Form.Control as="textarea" name="basic_sentence" value={formData.basic_sentence} onChange={handleChange} placeholder="Basic Sentence (A1/A2)" rows={2} /></Form.Group>
          <Form.Group className="mb-3"><Form.Control as="textarea" name="advanced_sentence" value={formData.advanced_sentence} onChange={handleChange} placeholder="Advanced Sentence (B2/C1)" rows={3} /></Form.Group>
          <Form.Group className="mb-3"><Form.Control type="text" name="image_url" value={formData.image_url} onChange={handleChange} placeholder="Image URL (optional)" /></Form.Group>
          <Form.Group className="mb-3"><Form.Control as="textarea" name="note" value={formData.note} onChange={handleChange} placeholder="Notes (optional)" rows={2} /></Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Categories</Form.Label>
            <Form.Select multiple htmlSize={5} name="category_ids" value={formData.category_ids} onChange={handleCategoryChange}>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </Form.Select>
          </Form.Group>
          
          {submitError && <Alert variant="danger">{submitError}</Alert>}

          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleClose} className="me-2">Cancel</Button>
            <Button className="btn-glow" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Word'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddWordModal;