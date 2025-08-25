import React from 'react';
import { Card, Col } from 'react-bootstrap';

const WordCard = ({ word, onClick }) => (
  <Col>
    <Card
      bg="dark"
      text="light"
      className="h-100 shadow-sm word-card border-secondary"
      onClick={() => onClick(word)}
      style={{ cursor: 'pointer' }}
    >
      <Card.Body>
        <Card.Title className="text-warning fw-bold">{word.german_word}</Card.Title>
        <Card.Text>{word.english_translation}</Card.Text>
      </Card.Body>
    </Card>
  </Col>
);

export default WordCard;
