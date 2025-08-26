import React, { useState, useMemo } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { Copy, Check } from 'lucide-react';

const AiHelperModal = ({ show, handleClose, wordType, onApplyData }) => {
  const [pastedJson, setPastedJson] = useState('');
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Generate the appropriate JSON structure based on the selected word type
  const jsonStructure = useMemo(() => {
    const base = {
      "german_word": "...",
      "english_translation": "...",
      "turkish_translation": "...",
      "basic_sentence": "...",
      "advanced_sentence": "...",
      "note": "..."
    };

    if (wordType === 'noun') {
      return { ...base, 
        "artikel": "der | die | das",
        "plural_form": "..." };
    }
    if (wordType === 'verb') {
      return {
        ...base,
        "conjugations": {
          "präsens": {
            "ich": "...", "du": "...", "er/sie/es": "...",
            "wir": "...", "ihr": "...", "sie/Sie": "..."
          }
        }
      };
    }
    return base;
  }, [wordType]);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(jsonStructure, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  const handleApply = () => {
    setError(null);
    if (!pastedJson.trim()) {
      setError('Please paste the JSON response from the AI.');
      return;
    }
    try {
      const data = JSON.parse(pastedJson);
      onApplyData(data); // Send the parsed data back to the parent
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
        <p className="text">1. Copy the structure below and ask your AI to fill it for your German word.</p>
        <div className="ai-code-block">
          <pre><code>{JSON.stringify(jsonStructure, null, 2)}</code></pre>
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
      </Modal.Body>
      <Modal.Footer className="no-border-top">
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button className="btn-glow" onClick={handleApply}>Apply Data</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AiHelperModal;