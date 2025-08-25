import React from 'react';
import { Card, Col } from 'react-bootstrap';

const WordCard = ({ word, onClick, style }) => (
  <Col style={style}>
    <Card
      className="h-100 shadow-sm word-card"
      onClick={() => onClick(word)}
    >
      <Card.Body>
        <Card.Title>{word.german_word}</Card.Title>
        <Card.Text>{word.english_translation}</Card.Text>
      </Card.Body>
    </Card>
  </Col>
);

export default WordCard;