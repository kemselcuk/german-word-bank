# main.py
# This is the main entry point for the FastAPI application.

from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
import uvicorn

# --- ADD THIS IMPORT ---
from fastapi.middleware.cors import CORSMiddleware
# -----------------------

from database import engine, get_db
import models
import schemas
import crud

# Create all the database tables based on the models
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="German Word Bank API",
    description="An API to store and manage German words, their translations, and usage.",
    version="1.0.0",
)

# --- ADD THIS SECTION FOR CORS ---
# This defines which origins (frontends) are allowed to communicate with our API.
origins = [
    "http://localhost:5173", # The address of your React (Vite) frontend
    "http://localhost:3000", # In case you use Create React App in the future
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allows all methods (GET, POST, etc.)
    allow_headers=["*"], # Allows all headers
)
# ---------------------------------


# --- API Endpoints ---

@app.get("/", tags=["Root"])
def read_root():
    """A simple root endpoint to confirm the API is running."""
    return {"message": "Welcome to the German Word Bank API!"}

# --- Word Endpoints ---

@app.post("/words/", response_model=schemas.Word, status_code=status.HTTP_201_CREATED, tags=["Words"])
def create_word(word: schemas.WordCreate, db: Session = Depends(get_db)):
    """
    Create a new word in the database.
    - Checks if the word already exists.
    - Handles linking categories to the new word.
    """
    db_word = crud.get_word_by_german_word(db, german_word=word.german_word)
    if db_word:
        raise HTTPException(status_code=400, detail="This German word already exists in the database.")
    return crud.create_word(db=db, word=word)

# @app.get("/words/", response_model=list[schemas.Word], tags=["Words"])
# def read_words(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
#     """
#     Retrieve a list of all words from the database with pagination.
#     """
#     words = crud.get_words(db, skip=skip, limit=limit)
#     return words

@app.get("/words/", response_model=schemas.WordsResponse, tags=["Words"])
def read_words(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve a list of all words from the database with pagination
    and the total word count.
    """
    words_data = crud.get_words(db, skip=skip, limit=limit)
    return words_data

@app.get("/words/{word_id}", response_model=schemas.Word, tags=["Words"])
def read_word(word_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a single word by its ID.
    """
    db_word = crud.get_word(db, word_id=word_id)
    if db_word is None:
        raise HTTPException(status_code=404, detail="Word not found")
    return db_word

@app.put("/words/{word_id}", response_model=schemas.Word, tags=["Words"])
def update_word_details(word_id: int, word: schemas.WordUpdate, db: Session = Depends(get_db)):
    """
    Update an existing word's details.
    """
    db_word = crud.update_word(db, word_id=word_id, word_update=word)
    if db_word is None:
        raise HTTPException(status_code=404, detail="Word not found")
    return db_word

@app.delete("/words/{word_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Words"])
def delete_word_entry(word_id: int, db: Session = Depends(get_db)):
    """
    Delete a word from the database.
    """
    success = crud.delete_word(db, word_id=word_id)
    if not success:
        raise HTTPException(status_code=404, detail="Word not found")
    return {"ok": True}


# --- Category Endpoints ---

@app.post("/categories/", response_model=schemas.Category, status_code=status.HTTP_201_CREATED, tags=["Categories"])
def create_category_for_words(category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    """
    Create a new category.
    - Checks if the category name already exists to prevent duplicates.
    """
    db_category = crud.get_category_by_name(db, name=category.name)
    if db_category:
        raise HTTPException(status_code=400, detail="Category already exists.")
    return crud.create_category(db=db, category=category)

@app.get("/categories/", response_model=list[schemas.Category], tags=["Categories"])
def read_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve a list of all categories.
    """
    categories = crud.get_categories(db, skip=skip, limit=limit)
    return categories

# This allows running the app directly for development
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
