import React from 'react';
import { Card, Col } from 'react-bootstrap';

const WordCard = ({ word, onClick, style }) => {

const artikelClass = word.artikel ? `artikel-${word.artikel}` : '';
return(
  <Col style={style}>
    <Card
      className="h-100 shadow-sm word-card"
      onClick={() => onClick(word)}
    >
      <Card.Body>
        <Card.Title>
            {/* Conditionally render the colored article */}
            {word.artikel && <span className={`me-2 ${artikelClass}`}>{word.artikel}</span>}
            {word.german_word}
          </Card.Title>
        <Card.Text>{word.english_translation}</Card.Text>
      </Card.Body>
    </Card>
  </Col>
);
};

export default WordCard;