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

// Import our new stylesheet
import './App.css'; 

// Import separated components
import WordCard from './components/WordCard.jsx';
import AddWordModal from './components/AddWordModal.jsx';
import WordDetailModal from './components/WordDetailModal.jsx';
import Header from './components/Header.jsx'; 
import CategoryFilter from './components/CategoryFilter.jsx';
import UpdateWordModal from './components/UpdateWordModal.jsx';

// --- Configuration ---
const API_BASE_URL = 'http://127.0.0.1:8000';

// --- Main App Component ---
export default function App() {
  // ... (State Management logic remains the same) ...
  const [words, setWords] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [wordToUpdate, setWordToUpdate] = useState(null);

  // ... (Data Fetching logic remains the same) ...
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


  // ... (Event Handlers logic remains the same) ...
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

  const handleOpenUpdateModal = (word) => {
    setWordToUpdate(word);
    setIsDetailModalOpen(false); // Close detail modal before opening update modal
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setWordToUpdate(null);
  };

  const handleWordAdded = () => {
    fetchWords();
    setSearchTerm('');
  };

  const handleWordUpdated = () => {
    fetchWords();
    handleCloseUpdateModal();
  };

  const filteredWords = words.filter(word => {
    // Category filter logic
    const categoryMatch = selectedCategory
      ? word.categories.some(cat => cat.id === selectedCategory)
      : true; // If no category is selected, all words match

    // Search term filter logic
    const searchMatch = word.german_word.toLowerCase().includes(searchTerm.toLowerCase());

    return categoryMatch && searchMatch;
  });

  const renderContent = () => {
    if (isLoading) {
      return <div className="text-center"><Spinner animation="border" /></div>;
    }
    if (error) {
      return <Alert className="text-center alert-custom">{error}</Alert>;
    }
    if (words.length === 0) {
      return (
        <Alert className="text-center alert-custom">
          No words found yet. Add your first word using the button above!
        </Alert>
      );
    }
    if (filteredWords.length === 0) {
      return <p className="text-center text-muted">No words match your search.</p>;
    }
    return (
      <Row xs={2} sm={3} md={4} lg={5} className="g-4">
        {filteredWords.map((word, index) => (
          <WordCard 
            key={word.id} 
            word={word} 
            onClick={handleOpenDetailModal} 
            style={{ animationDelay: `${index * 50}ms` }} // Staggered animation
          />
        ))}
      </Row>
    );
  };

  // --- Render UI ---
return (
    <>
      <Header />
      
      <div className="app-container content-wrapper">
        <Container>
          {/* This header is the title on the page, not the new navbar */}
          <header className="text-center mb-5">
            <h1 className="display-3 header-title">
              Wortschatz
            </h1>
            <p className="header-subtitle">Your Personal German Word Bank</p>
          </header>

          <Row className="justify-content-center mb-5">
            <Col md={8} lg={6}>
              <InputGroup className="search-input-group">
                <Form.Control
                  size="lg"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search a word or add a new one..."
                  className="form-control"
                />
                <Button className="btn-glow" onClick={handleOpenAddModal}>
                  <Plus size={24} />
                </Button>
              </InputGroup>
            </Col>
          </Row>

          {categories.length > 0 && (
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          )}


          <main>
            {renderContent()}
          </main>
        </Container>

        {isAddModalOpen && <AddWordModal show={isAddModalOpen} initialWord={searchTerm} categories={categories} handleClose={handleCloseAddModal} onWordAdded={handleWordAdded} />}
        {isDetailModalOpen && <WordDetailModal show={isDetailModalOpen} word={selectedWord} handleClose={handleCloseDetailModal} onEdit={handleOpenUpdateModal} />}
        {isUpdateModalOpen && (
        <UpdateWordModal
          show={isUpdateModalOpen}
          word={wordToUpdate}
          categories={categories}
          handleClose={handleCloseUpdateModal}
          onWordUpdated={handleWordUpdated}
        />
      )}
      </div>
    </>
  );
}