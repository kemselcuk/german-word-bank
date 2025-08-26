import React from 'react';
import { Container, Row, Button } from 'react-bootstrap';
import { PlusCircle } from 'lucide-react';
import WordCard from './WordCard.jsx'; // We'll reuse the WordCard component

const HomePage = ({ words, onOpenAddWordModal, onWordClick }) => {
  // Get the 10 most recently added words (assuming the API returns them in descending order)
  const recentWords = words.slice(0, 10);

  return (
    <Container>
      {/* Hero Section */}
      <div className="hero-section text-center">
        <h1 className="display-2 header-title">Welcome to Wortschatz</h1>
        <p className="hero-subtitle">
          Your personal vault for German vocabulary.
          <br />
          Save new words, practice with exercises, and watch your fluency grow.
        </p>
      </div>

      {/* Call-to-Action Button */}
      <div className="text-center">
        <Button className="btn-glow cta-button" onClick={onOpenAddWordModal}>
          <PlusCircle size={24} className="me-2" />
          Add Your First Word
        </Button>
      </div>

      {/* Recently Added Words Section */}
      {recentWords.length > 0 && (
        <div className="recent-words-section">
          <h2 className="text-center recent-words-title">Recently Added</h2>
          <Row xs={2} sm={3} md={4} lg={5} className="g-4 justify-content-center">
            {recentWords.map(word => (
              <WordCard key={word.id} word={word} onClick={onWordClick} />
            ))}
          </Row>
        </div>
      )}
    </Container>
  );
};

export default HomePage;