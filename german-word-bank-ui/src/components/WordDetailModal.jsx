import React from 'react';
import { Modal, Badge } from 'react-bootstrap';

const WordDetailModal = ({ show, word, handleClose }) => {
  if (!word) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered data-bs-theme="dark">
      <Modal.Header closeButton>
        <Modal.Title>
          <span className="text-warning fw-bold fs-2">
            {word.artikel && `${word.artikel} `}{word.german_word}
          </span>
          <p className="text-muted fs-6 mb-0">{word.english_translation} / {word.turkish_translation}</p>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {word.image_url && <img src={word.image_url} alt={word.german_word} className="img-fluid rounded mb-3" />}
        
        {word.categories && word.categories.length > 0 && (
            <div className="mb-3">
                {word.categories.map(cat => <Badge bg="warning" text="dark" key={cat.id} className="me-1">{cat.name}</Badge>)}
            </div>
        )}
        
        {word.plural_form && <p><strong>Plural:</strong> {word.plural_form}</p>}
        {word.basic_sentence && <p><strong>Basic Sentence:</strong> {word.basic_sentence}</p>}
        {word.advanced_sentence && <p><strong>Advanced Sentence:</strong> {word.advanced_sentence}</p>}
        {word.note && <p><strong>Note:</strong> {word.note}</p>}

        {word.conjugations && (
            <div>
                <strong>Conjugations:</strong>
                <pre className="p-2 rounded" style={{backgroundColor: '#000', color: '#fff'}}><code>{JSON.stringify(word.conjugations, null, 2)}</code></pre>
            </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default WordDetailModal;
