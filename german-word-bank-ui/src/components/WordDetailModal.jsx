import React from 'react';
import { Modal, Badge, Button } from 'react-bootstrap';
import { Pencil } from 'lucide-react';

const WordDetailModal = ({ show, word, handleClose, onEdit }) => {
  if (!word) return null;
  const artikelClass = word.artikel ? `artikel-${word.artikel}` : '';

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <span className="modal-title-glow fs-2 fw-bold">
            {/* Conditionally render the colored article */}
            {word.artikel && <span className={`me-2 ${artikelClass}`}>{word.artikel}</span>}
            {word.german_word}
          </span>
          <p className="text fs-7 mb-0">{word.english_translation} --- {word.turkish_translation}</p>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {word.image_url && <img src={word.image_url} alt={word.german_word} className="img-fluid rounded mb-3" />}
        
        {word.categories && word.categories.length > 0 && (
            <div className="mb-3">
                {word.categories.map(cat => <Badge key={cat.id} className="me-1 badge-glow">{cat.name}</Badge>)}
            </div>
        )}
        
        {word.plural_form && <p><strong>Plural:</strong> {word.plural_form}</p>}
        {word.basic_sentence && <p><strong>Basic Sentence:</strong> {word.basic_sentence}</p>}
        {word.advanced_sentence && <p><strong>Advanced Sentence:</strong> {word.advanced_sentence}</p>}
        {word.note && <p><strong>Note:</strong> {word.note}</p>}

        {word.conjugations && Object.keys(word.conjugations).length > 0 && (
          <div>
            <strong>Conjugations:</strong>
            <div className="conjugation-display">
              {Object.entries(word.conjugations).map(([tense, pairs]) => (
                <div key={tense} className="tense-block">
                  <h5 className="tense-title">
                    {tense.charAt(0).toUpperCase() + tense.slice(1)}
                  </h5>
                  {Object.entries(pairs).map(([pronoun, verb]) => (
                    <div key={pronoun} className="conjugation-row">
                      <span className="conjugation-pronoun">{pronoun}</span>
                      <span className="conjugation-verb">{verb}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-warning" onClick={() => onEdit(word)}>
          <Pencil size={16} className="me-2" />
          Edit Word
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WordDetailModal;