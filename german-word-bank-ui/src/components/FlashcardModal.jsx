import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { ArrowRight, RotateCw } from 'lucide-react';

const FlashcardModal = ({ show, handleClose, words }) => {
  const [shuffledWords, setShuffledWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // This effect runs when the modal is opened
  useEffect(() => {
    if (show && words.length > 0) {
      // Shuffle the words and reset the state for a new session
      const shuffled = [...words].sort(() => Math.random() - 0.5);
      setShuffledWords(shuffled);
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  }, [show, words]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    // Move to the next card, or loop back to the start
    const nextIndex = (currentIndex + 1) % shuffledWords.length;
    setCurrentIndex(nextIndex);
    setIsFlipped(false); // Show the front of the next card
  };

  const currentWord = shuffledWords[currentIndex];

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="modal-title-glow">Flashcard Exercise</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        {shuffledWords.length > 0 && currentWord ? (
          <>
            <div className="flashcard-container" onClick={handleFlip}>
              <div className={`flashcard ${isFlipped ? 'is-flipped' : ''}`}>
                {/* Front of the Card */}
                <div className="flashcard-face flashcard-front">
                  <p className="text mb-2">German Word</p>
                  <h2 className="flashcard-german-word">
                    {currentWord.artikel && `${currentWord.artikel} `}{currentWord.german_word}
                  </h2>
                </div>
                {/* Back of the Card */}
                <div className="flashcard-face flashcard-back"> <p className="text mb-2">Translation</p> <h3 className="flashcard-translation english-translation-text">{currentWord.english_translation}</h3> <h4 className="text-muted turkish-translation-text">{currentWord.turkish_translation}</h4> </div>
              </div>
            </div>
            <p className="text-center flashcard-progress">
              Card {currentIndex + 1} of {shuffledWords.length}
            </p>
          </>
        ) : (
          <div className="text-center p-5">
            <p>No words to practice. Add some words to your list first!</p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="no-border-top">
        <Button variant="outline-secondary" onClick={handleFlip}>
          <RotateCw size={16} className="me-2" />
          Flip Card
        </Button>
        <Button className="btn-glow" onClick={handleNext}>
          Next Word
          <ArrowRight size={16} className="ms-2" />
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FlashcardModal;