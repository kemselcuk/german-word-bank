import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert, InputGroup } from 'react-bootstrap';

const API_BASE_URL = 'http://127.0.0.1:8000';

const pronouns = [
  { key: 'ich', label: 'ich' },
  { key: 'du', label: 'du' },
  { key: 'er_sie_es', label: 'er/sie/es' },
  { key: 'wir', label: 'wir' },
  { key: 'ihr', label: 'ihr' },
  { key: 'sie_Sie', label: 'sie/Sie' },
];

const UpdateWordModal = ({ show, word, categories, handleClose, onWordUpdated }) => {
  const [wordType, setWordType] = useState('other');
  const [formData, setFormData] = useState({});
  const [conjugationInputs, setConjugationInputs] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Pre-populate the form when a word is passed in
  useEffect(() => {
    if (word) {
      // Determine word type based on available data
      if (word.artikel || word.plural_form) setWordType('noun');
      else if (word.conjugations) setWordType('verb');
      else setWordType('other');

      // Set form data from the word object
      setFormData({
        german_word: word.german_word || '',
        english_translation: word.english_translation || '',
        turkish_translation: word.turkish_translation || '',
        artikel: word.artikel || '',
        plural_form: word.plural_form || '',
        basic_sentence: word.basic_sentence || '',
        advanced_sentence: word.advanced_sentence || '',
        note: word.note || '',
        image_url: word.image_url || '',
        category_ids: word.categories ? word.categories.map(cat => cat.id) : [],
      });

      // Set conjugation data if it exists
      const präsens = word.conjugations?.präsens || {};
      setConjugationInputs({
        ich: präsens.ich || '',
        du: präsens.du || '',
        er_sie_es: präsens['er/sie/es'] || '',
        wir: präsens.wir || '',
        ihr: präsens.ihr || '',
        sie_Sie: präsens['sie/Sie'] || '',
      });
    }
  }, [word]);

  const wordTypeOptions = [
    { value: 'other', label: 'Other' },
    { value: 'noun', label: 'Noun' },
    { value: 'verb', label: 'Verb' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleConjugationChange = (e) => {
    const { name, value } = e.target;
    setConjugationInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryClick = (categoryId) => {
    setFormData(prev => {
      const newCategoryIds = prev.category_ids.includes(categoryId)
        ? prev.category_ids.filter(id => id !== categoryId)
        : [...prev.category_ids, categoryId];
      return { ...prev, category_ids: newCategoryIds };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    let payload = { ...formData };
    
    // Build payload similar to AddWordModal, but for a PUT request
    if (wordType === 'verb') {
      const formattedConjugations = { präsens: {} };
      for (const p of pronouns) {
        if (conjugationInputs[p.key]) {
          formattedConjugations.präsens[p.label] = conjugationInputs[p.key];
        }
      }
      payload.conjugations = formattedConjugations;
    }

    if (wordType !== 'noun') {
      payload.artikel = null;
      payload.plural_form = null;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/words/${word.id}`, { // Note the word ID in the URL
        method: 'PUT', // Use PUT for updating
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update word.');
      }
      onWordUpdated(); // Call the success handler
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title className="modal-title-glow">Update Word</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* The form JSX is identical to AddWordModal, but pre-filled */}
          {/* Word Type Pills */}
          <Form.Group className="mb-3">
            <Form.Label>Word Type</Form.Label>
            <div className="category-pill-container">
              {wordTypeOptions.map(opt => (
                <div key={opt.value} className={`category-pill ${wordType === opt.value ? 'selected' : ''}`} onClick={() => setWordType(opt.value)}>
                  {opt.label}
                </div>
              ))}
            </div>
          </Form.Group>
          {/* Word/Translation Inputs */}
          <Row>
            <Col md={4}><Form.Group className="mb-3"><Form.Control type="text" name="german_word" value={formData.german_word} onChange={handleChange} placeholder="German Word" required /></Form.Group></Col>
            <Col md={4}><Form.Group className="mb-3"><Form.Control type="text" name="english_translation" value={formData.english_translation} onChange={handleChange} placeholder="English Translation" required /></Form.Group></Col>
            <Col md={4}><Form.Group className="mb-3"><Form.Control type="text" name="turkish_translation" value={formData.turkish_translation} onChange={handleChange} placeholder="Turkish Translation" required /></Form.Group></Col>
          </Row>
          {/* Noun Fields */}
          {wordType === 'noun' && (
             <Row>
               <Col md={6}>
                 <Form.Group className="mb-3">
                   <Form.Label>Artikel</Form.Label>
                   <div className="category-pill-container">
                     {['der', 'die', 'das'].map(art => (
                       <div
                         key={art}
                         className={`category-pill ${formData.artikel === art ? 'selected' : ''}`}
                         onClick={() => setFormData(prev => ({ ...prev, artikel: art }))}
                       >
                         {art}
                       </div>
                     ))}
                   </div>
                 </Form.Group>
               </Col>
               <Col md={6}>
                 <Form.Group className="mb-3">
                   <Form.Label>Plural Form</Form.Label>
                   <Form.Control type="text" name="plural_form" value={formData.plural_form} onChange={handleChange} placeholder="Plural Form" />
                 </Form.Group>
               </Col>
             </Row>
           )}
          {/* Verb Fields */}
          {wordType === 'verb' && (
            <Form.Group className="mb-3">
              <Form.Label>Präsens (Present Tense) Conjugations</Form.Label>
              {pronouns.map(p => (
                <InputGroup className="mb-2" key={p.key}>
                  <InputGroup.Text className="conjugation-label">{p.label}</InputGroup.Text>
                  <Form.Control type="text" name={p.key} value={conjugationInputs[p.key]} onChange={handleConjugationChange} placeholder={`Conjugation for ${p.label}`} />
                </InputGroup>
              ))}
            </Form.Group>
          )}
          {/* Other Fields */}
          <Form.Group className="mb-3"><Form.Control as="textarea" name="basic_sentence" value={formData.basic_sentence} onChange={handleChange} placeholder="Basic Sentence (A1/A2)" rows={2} /></Form.Group>
          <Form.Group className="mb-3"><Form.Control as="textarea" name="advanced_sentence" value={formData.advanced_sentence} onChange={handleChange} placeholder="Advanced Sentence (B2/C1)" rows={3} /></Form.Group>
          <Form.Group className="mb-3"><Form.Control type="text" name="image_url" value={formData.image_url} onChange={handleChange} placeholder="Image URL (optional)" /></Form.Group>
          <Form.Group className="mb-3"><Form.Control as="textarea" name="note" value={formData.note} onChange={handleChange} placeholder="Notes (optional)" rows={2} /></Form.Group>
          {/* Category Pills */}
          <Form.Group className="mb-3">
            <Form.Label>Categories</Form.Label>
            <div className="category-pill-container">
              {categories.map(cat => (
                <div key={cat.id} className={`category-pill ${formData.category_ids?.includes(cat.id) ? 'selected' : ''}`} onClick={() => handleCategoryClick(cat.id)}>
                  {cat.name}
                </div>
              ))}
            </div>
          </Form.Group>
          
          {submitError && <Alert variant="danger">{submitError}</Alert>}

          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleClose} className="me-2">Cancel</Button>
            <Button className="btn-glow" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Word'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateWordModal;