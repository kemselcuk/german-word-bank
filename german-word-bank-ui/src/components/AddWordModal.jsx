import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert, InputGroup } from 'react-bootstrap';
import { BrainCircuit } from 'lucide-react';
import AiHelperModal from './AiHelperModal.jsx';

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
    basic_sentence: '',
    advanced_sentence: '',
    note: '',
    image_url: '',
    category_ids: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isAiHelperOpen, setIsAiHelperOpen] = useState(false);

  const handleApplyAiData = (aiData) => {
    // Populate the main form data
    setFormData(prev => ({
      ...prev,
      german_word: aiData.german_word || prev.german_word,
      artikel: aiData.artikel || prev.artikel,
      english_translation: aiData.english_translation || prev.english_translation,
      turkish_translation: aiData.turkish_translation || prev.turkish_translation,
      basic_sentence: aiData.basic_sentence || prev.basic_sentence,
      advanced_sentence: aiData.advanced_sentence || prev.advanced_sentence,
      note: aiData.note || prev.note,
      plural_form: aiData.plural_form || prev.plural_form,
    }));

    // Populate the conjugation inputs if they exist in the AI data
    if (aiData.conjugations?.präsens) {
      const präsens = aiData.conjugations.präsens;
      setConjugationInputs({
        ich: präsens.ich || '',
        du: präsens.du || '',
        er_sie_es: präsens['er/sie/es'] || '',
        wir: präsens.wir || '',
        ihr: präsens.ihr || '',
        sie_Sie: präsens['sie/Sie'] || '',
      });
    }
  };

  const wordTypeOptions = [
    { value: 'other', label: 'Other' },
    { value: 'noun', label: 'Noun' },
    { value: 'verb', label: 'Verb' }
  ];

  // Define pronouns outside the component
  const pronouns = [
  { key: 'ich', label: 'ich' },
  { key: 'du', label: 'du' },
  { key: 'er_sie_es', label: 'er/sie/es' },
  { key: 'wir', label: 'wir' },
  { key: 'ihr', label: 'ihr' },
  { key: 'sie_Sie', label: 'sie/Sie' },
];

const [conjugationInputs, setConjugationInputs] = useState({
  ich: '', du: '', er_sie_es: '', wir: '', ihr: '', sie_Sie: ''
});

useEffect(() => {
  if (wordType !== 'verb') {
    setConjugationInputs({ ich: '', du: '', er_sie_es: '', wir: '', ihr: '', sie_Sie: '' });
  }
}, [wordType]);

const handleConjugationChange = (e) => {
  const { name, value } = e.target;
  setConjugationInputs(prev => ({ ...prev, [name]: value }));
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
// 2. ADD this new handler for the category pills
  const handleCategoryClick = (categoryId) => {
    setFormData(prev => {
      const currentCategoryIds = prev.category_ids;
      // If the ID is already selected, remove it. Otherwise, add it.
      const newCategoryIds = currentCategoryIds.includes(categoryId)
        ? currentCategoryIds.filter(id => id !== categoryId)
        : [...currentCategoryIds, categoryId];
      
      return { ...prev, category_ids: newCategoryIds };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    let payload = { ...formData };
    
    // If no categories were selected, find and assign the "no category" ID
    if (payload.category_ids.length === 0) {
      const noCategory = categories.find(cat => cat.name.toLowerCase() === 'no category');
      if (noCategory) {
        payload.category_ids = [noCategory.id];
      }
    }

    if (wordType === 'verb') {
    const formattedConjugations = {
      präsens: {
        ich: conjugationInputs.ich,
        du: conjugationInputs.du,
        'er/sie/es': conjugationInputs.er_sie_es,
        wir: conjugationInputs.wir,
        ihr: conjugationInputs.ihr,
        'sie/Sie': conjugationInputs.sie_Sie,
      }
    };
    
    // Clean up any empty fields
    for (const key in formattedConjugations.präsens) {
      if (!formattedConjugations.präsens[key]) {
        delete formattedConjugations.präsens[key];
      }
    }
    payload.conjugations = formattedConjugations;
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
    <>
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title className="modal-title-glow">Add a New Word</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* Form fields remain the same */}
          <Form.Group className="mb-3">
            <Form.Label>Word Type</Form.Label>
            <div className="category-pill-container">
              {wordTypeOptions.map(opt => (
                <div
                  key={opt.value}
                  className={`category-pill ${wordType === opt.value ? 'selected' : ''}`}
                  onClick={() => setWordType(opt.value)}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          </Form.Group>
          <Button
              variant="outline-secondary"
              className="ai-helper-button"
              onClick={() => setIsAiHelperOpen(true)}
            >
              <BrainCircuit size={18} className="me-2" />
              Fill from AI
            </Button>

          <Row>
            <Col md={4}><Form.Group className="mb-3"><Form.Control type="text" name="german_word" value={formData.german_word} onChange={handleChange} placeholder="German Word" required /></Form.Group></Col>
            <Col md={4}><Form.Group className="mb-3"><Form.Control type="text" name="english_translation" value={formData.english_translation} onChange={handleChange} placeholder="English Translation" required /></Form.Group></Col>
            <Col md={4}><Form.Group className="mb-3"><Form.Control type="text" name="turkish_translation" value={formData.turkish_translation} onChange={handleChange} placeholder="Turkish Translation" required /></Form.Group></Col>
          </Row>

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

           {wordType === 'verb' && (
             <Form.Group className="mb-3">
               <Form.Label>Präsens (Present Tense) Conjugations</Form.Label>
               {pronouns.map(p => (
                 <InputGroup className="mb-2" key={p.key}>
                   <InputGroup.Text className="conjugation-label">{p.label}</InputGroup.Text>
                   <Form.Control
                     type="text"
                     name={p.key}
                     value={conjugationInputs[p.key]}
                     onChange={handleConjugationChange}
                     placeholder={`Conjugation for ${p.label}`}
                   />
                 </InputGroup>
               ))}
             </Form.Group>
           )}

          <Form.Group className="mb-3"><Form.Control as="textarea" name="basic_sentence" value={formData.basic_sentence} onChange={handleChange} placeholder="Basic Sentence (A1/A2)" rows={2} /></Form.Group>
          <Form.Group className="mb-3"><Form.Control as="textarea" name="advanced_sentence" value={formData.advanced_sentence} onChange={handleChange} placeholder="Advanced Sentence (B2/C1)" rows={3} /></Form.Group>
          <Form.Group className="mb-3"><Form.Control type="text" name="image_url" value={formData.image_url} onChange={handleChange} placeholder="Image URL (optional)" /></Form.Group>
          <Form.Group className="mb-3"><Form.Control as="textarea" name="note" value={formData.note} onChange={handleChange} placeholder="Notes (optional)" rows={2} /></Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Categories</Form.Label>
            <div className="category-pill-container">
              {categories.map(cat => {
                const isSelected = formData.category_ids.includes(cat.id);
                return (
                  <div
                    key={cat.id}
                    className={`category-pill ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleCategoryClick(cat.id)}
                  >
                    {cat.name}
                  </div>
                );
              })}
            </div>
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
    <AiHelperModal
        show={isAiHelperOpen}
        handleClose={() => setIsAiHelperOpen(false)}
        wordType={wordType}
        onApplyData={handleApplyAiData}
      />
      </>
  );
};

export default AddWordModal;