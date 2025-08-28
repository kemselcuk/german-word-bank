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
import AddCategoryModal from './components/AddCategoryModal.jsx';
import ExercisesPage from './components/ExercisesPage.jsx';
import FlashcardModal from './components/FlashcardModal.jsx';
import WriteTheWordModal from './components/WriteTheWordModal.jsx';
import HomePage from './components/HomePage.jsx';
import PaginationComponent from './components/PaginationComponent.jsx';
import ConfirmModal from './components/ConfirmModal.jsx';
import SettingsPage from './components/SettingsPage.jsx';

// --- Configuration ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(() => {
    const savedView = localStorage.getItem('currentPage');
    return savedView || 'home';
  }); 
  const [isFlashcardModalOpen, setIsFlashcardModalOpen] = useState(false);
  const [isWriteTheWordModalOpen, setIsWriteTheWordModalOpen] = useState(false);
  const [wordsPerPage] = useState(20); // Show 20 words per page
  const [totalWords, setTotalWords] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [recentWords, setRecentWords] = useState([]);
  
  

  // ... (Data Fetching logic remains the same) ...
  const fetchWords = useCallback(async (page, categoryId) => {
    setError(null);
    const skip = (page - 1) * wordsPerPage;
    let url = `${API_BASE_URL}/words/?skip=${skip}&limit=${wordsPerPage}`;
    // If a category is selected, add it to the request URL
    if (categoryId) {
      url += `&category_id=${categoryId}`;
    }
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch words. Please ensure the backend server is running and supports pagination.');
      
      const data = await response.json();
      setWords(data.words); // The words are now in a nested property
      setTotalWords(data.total_count); // Set the total count
    } catch (err) {
      setError(err.message);
    }
  }, [wordsPerPage]);

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

    const fetchRecentWords = useCallback(async () => {
    try {
      // This API call ignores pagination and specifically gets the 10 newest words
      const response = await fetch(`${API_BASE_URL}/words/?ordering=-id&skip=0&limit=10`);
      if (!response.ok) throw new Error('Failed to fetch recent words.');
      const data = await response.json();
      setRecentWords(data.words);
    } catch (err) {
      console.error("Fetch recent words error:", err);
      // Don't set the main error state for this, as it's a background task
      }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // Pass both the page number and selected category to fetchWords
      await fetchWords(pageNumber, selectedCategory);
      setIsLoading(false);
    };
    // We only load categories once, so that can be a separate effect
    if (categories.length === 0) {
        fetchCategories();
    }
    loadData();
  }, [pageNumber, selectedCategory, fetchWords, categories.length, fetchCategories]);

  useEffect(() => {
    fetchCategories();
    fetchRecentWords();
  }, [fetchCategories, fetchRecentWords]);


  // ... (Event Handlers logic remains the same) ...
  const handleOpenAddModal = () => setIsAddModalOpen(true);
  const handleCloseAddModal = () => setIsAddModalOpen(false);

  const handleCategorySelect = (categoryId) => {
  setSelectedCategory(categoryId);
  setPageNumber(1); // Reset to page 1 whenever a new category is chosen
};
  
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

  const handleOpenAddCategoryModal = () => setIsAddCategoryModalOpen(true);
  const handleCloseAddCategoryModal = () => setIsAddCategoryModalOpen(false);

  const handleCategoryAdded = () => {
    fetchCategories(); // Refetch categories to show the new one
    handleCloseAddCategoryModal();
  };

  const handleWordAdded = () => {
    fetchRecentWords();
    handleCloseAddModal();
    setSearchTerm('');
    setCurrentPage('words');
    if (pageNumber !== 1) {
      setPageNumber(1);
    } else {
      // If already on page 1, we need to manually trigger a refetch
      fetchWords(1);
      fetchCategories(); // Also refetch categories in case a new one was added
    }
  };

  const handleWordUpdated = () => {
    fetchRecentWords();
    handleCloseUpdateModal();
    setCurrentPage('words');
    // Go to page 1 to see the updated word
     if (pageNumber !== 1) {
      setPageNumber(1);
    } else {
      fetchWords(1);
    }
  };

  // This function opens the confirmation modal
  const handleDeleteRequest = (wordId) => {
    setItemToDelete(wordId); // Remember which word we're about to delete
    setIsConfirmModalOpen(true);
  };

  // This function runs only after the user clicks "Confirm" in the modal
  const executeDelete = async () => {
    if (!itemToDelete) return;

    try {
      const response = await fetch(`${API_BASE_URL}/words/${itemToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete the word.');
      }

      // Close all modals and refetch the data
      setIsConfirmModalOpen(false);
      handleCloseDetailModal();
      fetchWords(pageNumber, selectedCategory);
      fetchRecentWords();
      setItemToDelete(null);

    } catch (err) {
      console.error("Delete error:", err);
      setError(err.message);
      setIsConfirmModalOpen(false); // Close modal on error too
    }
  };

  const totalPages = Math.ceil(totalWords / wordsPerPage);

  const handleStartExercise = (exerciseKey) => {
    if (exerciseKey === 'flashcards') {
      setIsFlashcardModalOpen(true);
    } else if (exerciseKey === 'write_the_word') {
      setIsWriteTheWordModalOpen(true);
    }
  };

  const filteredWords = words.filter(word => 
  word.german_word.toLowerCase().includes(searchTerm.toLowerCase())
);

const navigate = (view) => {
  localStorage.setItem('currentPage', view); // Save the view to storage
  setCurrentPage(view); // Update the state
};

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
      <Header onNavigate={navigate}/>
      
      <div className="app-container content-wrapper">
        {currentPage === 'home' && (
          <HomePage 
            recentWords={recentWords}
            onOpenAddWordModal={handleOpenAddModal} 
            onWordClick={handleOpenDetailModal}
          />
        )}
        {currentPage === 'words' && (
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
              onSelectCategory={handleCategorySelect}
              onAddCategory={handleOpenAddCategoryModal}
            />
          )}
        
          <main>
            {renderContent()}
          </main>
          <PaginationComponent
              currentPage={pageNumber}
              totalPages={totalPages}
              onPageChange={setPageNumber}
            />
        </Container>
        )}
        {currentPage === 'exercises' && (
          <ExercisesPage onStartExercise={handleStartExercise} />
        )}
        {currentPage === 'settings' && (
          <SettingsPage />
        )}
        </div>

        {/* --- Modals --- */}

        {isAddModalOpen && <AddWordModal show={isAddModalOpen} initialWord={searchTerm} categories={categories} handleClose={handleCloseAddModal} onWordAdded={handleWordAdded} onAddCategory={handleOpenAddCategoryModal} />}
        {isDetailModalOpen && <WordDetailModal show={isDetailModalOpen} word={selectedWord} handleClose={handleCloseDetailModal} onEdit={handleOpenUpdateModal} onDelete={handleDeleteRequest}  />}
        {isUpdateModalOpen && (
        <UpdateWordModal
          show={isUpdateModalOpen}
          word={wordToUpdate}
          categories={categories}
          handleClose={handleCloseUpdateModal}
          onWordUpdated={handleWordUpdated}
        /> 
        )}
        {isAddCategoryModalOpen && (
        <AddCategoryModal
          show={isAddCategoryModalOpen}
          handleClose={handleCloseAddCategoryModal}
          onCategoryAdded={handleCategoryAdded}
        />
        )}
        <ConfirmModal
          show={isConfirmModalOpen}
          handleClose={() => setIsConfirmModalOpen(false)}
          handleConfirm={executeDelete}
          title="Confirm Deletion"
          body="Are you sure you want to permanently delete this word?"
        />
        <FlashcardModal 
          show={isFlashcardModalOpen} 
          handleClose={() => setIsFlashcardModalOpen(false)} 
          words={words} 
        />
        <WriteTheWordModal 
          show={isWriteTheWordModalOpen} 
          handleClose={() => setIsWriteTheWordModalOpen(false)} 
          words={words}
        />
    </>
  );
}