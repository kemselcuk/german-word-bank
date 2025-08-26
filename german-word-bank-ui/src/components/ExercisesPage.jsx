import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Layers, Type } from 'lucide-react';

const exercises = [
  {
    key: 'flashcards',
    title: 'Flashcard Exercise',
    description: 'Test your memory. See a German word and try to recall its English or Turkish translation.',
    icon: <Layers size={40} className="mb-3" />,
  },
  {
    key: 'write_the_word',
    title: 'Write the Word',
    description: 'A tougher challenge. You will be shown a translation and you must type the correct German word.',
    icon: <Type size={40} className="mb-3" />,
  }
];

const ExercisesPage = ({ onStartExercise }) => {
  return (
    <Container>
      <header className="text-center mb-5">
        <h1 className="display-3 header-title">Exercises</h1>
        <p className="header-subtitle">Choose an activity to test your knowledge</p>
      </header>
      <Row className="justify-content-center g-4">
        {exercises.map(ex => (
          <Col md={6} lg={5} key={ex.key}>
            <div className="exercise-card" onClick={() => onStartExercise(ex.key)}>
              <div className="exercise-card-icon">{ex.icon}</div>
              <h3 className="exercise-card-title">{ex.title}</h3>
              <p className="exercise-card-description">{ex.description}</p>
              <Button className="btn-glow mt-auto">Start Exercise</Button>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ExercisesPage;