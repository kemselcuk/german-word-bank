import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { Copy, Check } from 'lucide-react';

const AiHelperModal = ({ show, handleClose, wordType, onApplyData }) => {
  // New state to manage the two-step process
  const [step, setStep] = useState(1);
  const [germanWord, setGermanWord] = useState('');

  const [pastedJson, setPastedJson] = useState('');
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Reset the state every time the modal is opened
  useEffect(() => {
    if (show) {
      setStep(1);
      setGermanWord('');
      setPastedJson('');
      setError(null);
      setCopied(false);
    }
  }, [show]);

  // Generate the prompt and JSON structure once the user provides the word
  const { promptText, jsonStructure } = useMemo(() => {
    if (!germanWord) return { promptText: '', jsonStructure: {} };

    const base = {
      "german_word": germanWord,
      "english_translation": "...",
      "turkish_translation": "...",
      "basic_sentence": "...",
      "advanced_sentence": "...",
      "note": "..."
    };

    let structure;
    if (wordType === 'noun') {
      structure = { ...base, "artikel": "der | die | das", "plural_form": "..." };
    } else if (wordType === 'verb') {
      structure = {
        ...base,
        "conjugations": {
          "präsens": { "ich": "...", "du": "...", "er/sie/es": "...", "wir": "...", "ihr": "...", "sie/Sie": "..." }
        }
      };
    } else {
      structure = base;
    }

    const prompt = `For the German ${wordType} "${germanWord}", provide the following details in a pure JSON format, with no extra text or explanations before or after the JSON block.\n\n${JSON.stringify(structure, null, 2)}`;
    return { promptText: prompt, jsonStructure: structure };
  }, [wordType, germanWord]);

  const handleNextStep = (e) => {
    e.preventDefault();
    if (germanWord.trim()) {
      setStep(2);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    setError(null);
    if (!pastedJson.trim()) {
      setError('Please paste the JSON response from the AI.');
      return;
    }
    try {
      const data = JSON.parse(pastedJson);
      // Pass both the AI data and the original German word back
      onApplyData(data, germanWord);
      handleClose();
    } catch (err) {
      setError('Invalid JSON format. Please check the pasted text.');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title className="modal-title-glow">AI Helper</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {step === 1 && (
          <Form onSubmit={handleNextStep}>
            <p className="text">Enter the German word you want to add.</p>
            <Form.Group>
              <Form.Control
                type="text"
                value={germanWord}
                onChange={(e) => setGermanWord(e.target.value)}
                placeholder="e.g., Haus, lernen, schön"
                required
                autoFocus
              />
            </Form.Group>
            <div className="d-grid mt-3">
              <Button className="btn-glow" type="submit">Done</Button>
            </div>
          </Form>
        )}

        {step === 2 && (
          <>
            <p className="text">1. Copy the full prompt below and paste it into your AI.</p>
            <div className="ai-code-block">
              <pre><code>{promptText}</code></pre>
              <Button variant="outline-secondary" size="sm" className="copy-button" onClick={handleCopy}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </Button>
            </div>
            <p className="text mt-3">2. Paste the AI's full JSON response here.</p>
            <Form.Control
              as="textarea"
              rows={8}
              value={pastedJson}
              onChange={(e) => setPastedJson(e.target.value)}
              placeholder="Paste the JSON response here..."
            />
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          </>
        )}
      </Modal.Body>
      {step === 2 && (
        <Modal.Footer className="no-border-top">
          <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
          <Button className="btn-glow" onClick={handleApply}>Apply Data</Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default AiHelperModal;