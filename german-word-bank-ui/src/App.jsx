import React, { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { 
  Container, 
  Row, 
  Col, 
  Form, 
  InputGroup,
  Spinner,
  Alert,
  Button
} from 'react-bootstrap';

// Import separated components
import WordCard from './components/WordCard.jsx';
import AddWordModal from './components/AddWordModal.jsx';
import WordDetailModal from './components/WordDetailModal.jsx';

// --- Configuration ---
const API_BASE_URL = 'http://127.0.0.1:8000';

// --- Main App Component ---
export default function App() {
  // --- State Management ---
  const [words, setWords] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // --- Data Fetching ---
  const fetchWords = useCallback(async () => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/words/?limit=100`);
      if (!response.ok) throw new Error('Failed to fetch words. Please ensure the backend server is running.');
      const data = await response.json();
      setWords(data);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/categories/`);
        if (!response.ok) throw new Error('Failed to fetch categories.');
        const data = await response.json();
        setCategories(data);
    } catch (err) {
        console.error("Fetch categories error:", err);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchWords(), fetchCategories()]);
      setIsLoading(false);
    };
    loadData();
  }, [fetchWords, fetchCategories]);

  // --- Event Handlers ---
  const handleOpenAddModal = () => setIsAddModalOpen(true);
  const handleCloseAddModal = () => setIsAddModalOpen(false);
  
  const handleOpenDetailModal = (word) => {
    setSelectedWord(word);
    setIsDetailModalOpen(true);
  };
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedWord(null);
  };

  const handleWordAdded = () => {
    fetchWords();
    setSearchTerm('');
  };

  const filteredWords = words.filter(word => 
    word.german_word.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderContent = () => {
    if (isLoading) {
      return <div className="text-center"><Spinner animation="border" variant="warning" /></div>;
    }
    if (error) {
      return <Alert variant="danger" className="text-center">{error}</Alert>;
    }
    if (words.length === 0) {
      return (
        <Alert variant="info" className="text-center bg-dark text-white border-info">
          No words found yet. Add your first word using the button above!
        </Alert>
      );
    }
    if (filteredWords.length === 0) {
      return <p className="text-center text-muted">No words match your search.</p>;
    }
    return (
      <Row xs={2} sm={3} md={4} lg={5} className="g-4">
        {filteredWords.map(word => (
          <WordCard key={word.id} word={word} onClick={handleOpenDetailModal} />
        ))}
      </Row>
    );
  };

  // --- Render UI ---
  return (
    <div className="text-light min-vh-100 py-5">
      <Container>
        <header className="text-center mb-5">
          <h1 className="display-3 fw-bold" style={{ color: '#ffc107' }}>
            Wortschatz
          </h1>
          <p className="text-muted fs-5">Your Personal German Word Bank</p>
        </header>

        <Row className="justify-content-center mb-5">
          <Col md={8} lg={6}>
            <InputGroup>
              <Form.Control
                size="lg"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search a word or add a new one..."
                className="form-control"
              />
              <Button variant="warning" onClick={handleOpenAddModal}>
                <Plus size={24} />
              </Button>
            </InputGroup>
          </Col>
        </Row>

        <main>
          {renderContent()}
        </main>
      </Container>

      {isAddModalOpen && <AddWordModal show={isAddModalOpen} initialWord={searchTerm} categories={categories} handleClose={handleCloseAddModal} onWordAdded={handleWordAdded} />}
      {isDetailModalOpen && <WordDetailModal show={isDetailModalOpen} word={selectedWord} handleClose={handleCloseDetailModal} />}
    </div>
  );
}
