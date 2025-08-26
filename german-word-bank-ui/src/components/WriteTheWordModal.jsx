import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { ArrowRight, CheckCircle, RotateCcw } from 'lucide-react';

const WriteTheWordModal = ({ show, handleClose, words }) => {
  const [shuffledWords, setShuffledWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState(''); // 'correct', 'incorrect', or ''
  const [isFinished, setIsFinished] = useState(false); // New state to track completion
  const inputRef = useRef(null);

  // This function now also resets the 'isFinished' state for a new session
  const startNewSession = () => {
    if (words.length > 0) {
      const shuffled = [...words].sort(() => Math.random() - 0.5);
      setShuffledWords(shuffled);
      setCurrentIndex(0);
      setUserInput('');
      setIsAnswered(false);
      setFeedback('');
      setIsFinished(false); // Reset the finished state
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  };

  useEffect(() => {
    if (show) {
      startNewSession();
    }
  }, [show, words]);

  const currentWord = shuffledWords[currentIndex];

  const handleCheckAnswer = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return; // Don't check empty answers
    if (userInput.trim().toLowerCase() === currentWord.german_word.toLowerCase()) {
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }
    setIsAnswered(true);
  };

  // This function now checks if it's the last word
  const handleNext = () => {
    if (currentIndex < shuffledWords.length - 1) {
      // If not the last word, move to the next one
      setCurrentIndex(currentIndex + 1);
      setUserInput('');
      setIsAnswered(false);
      setFeedback('');
      inputRef.current?.focus();
    } else {
      // If it is the last word, end the exercise
      setIsFinished(true);
    }
  };

  // The main content of the modal body
  const renderExerciseContent = () => {
    if (isFinished) {
      return (
        <div className="text-center p-5">
          <CheckCircle size={48} className="text-success mb-3" />
          <h3>Exercise Complete!</h3>
          <p className="text-muted">You've gone through all the words.</p>
          <Button className="btn-glow mt-3" onClick={startNewSession}>
            <RotateCcw size={16} className="me-2" />
            Practice Again
          </Button>
        </div>
      );
    }

    if (currentWord) {
      return (
        <>
          <div className="write-word-prompt">
            <p className="prompt-label">English Translation</p>
            <h3 className="prompt-translation">{currentWord.english_translation}</h3>
          </div>

          <Form onSubmit={isAnswered ? (e) => { e.preventDefault(); handleNext(); } : handleCheckAnswer}>
            <Form.Control
              ref={inputRef}
              type="text"
              className="write-word-input"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type the German word..."
              disabled={isAnswered}
              autoComplete="off"
            />
            
            {/* THIS IS THE KEY FIX for the feedback bug. It only shows when answered. */}
            {isAnswered && feedback && (
              <Alert variant="light" className={`feedback-alert ${feedback}`}>
                {feedback === 'correct' ? 'Correct!' : `Incorrect. The answer is: ${currentWord.german_word}`}
              </Alert>
            )}

            <div className="d-grid gap-2 mt-4">
              {!isAnswered ? (
                <Button className="btn-glow" type="submit">Check Answer</Button>
              ) : (
                <Button className="btn-glow" onClick={handleNext} type="button">
                  Next Word <ArrowRight size={16} />
                </Button>
              )}
            </div>
          </Form>
        </>
      );
    }

    return <p className="text-center p-5">Add some words to your list to start practicing!</p>;
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="modal-title-glow">Write the Word</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        {renderExerciseContent()}
      </Modal.Body>
    </Modal>
  );
};

export default WriteTheWordModal;