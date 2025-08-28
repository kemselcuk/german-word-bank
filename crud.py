# "Create, Read, Update, Delete" - this file contains all the functions
# that directly interact with the database.

from sqlalchemy.orm import Session
import models
import schemas
from typing import Optional

# --- Word CRUD Functions ---

def get_word(db: Session, word_id: int):
    """Fetch a single word by its primary key ID."""
    return db.query(models.Word).filter(models.Word.id == word_id).first()

def get_word_by_german_word(db: Session, german_word: str):
    """Fetch a single word by its German name."""
    return db.query(models.Word).filter(models.Word.german_word == german_word).first()

    # def get_words(db: Session, skip: int = 0, limit: int = 100):
    #     """Fetch a list of words with pagination."""
    #     return db.query(models.Word).offset(skip).limit(limit).all()

def get_words(db: Session, skip: int = 0, limit: int = 100, category_id: Optional[int] = None, ordering: Optional[str] = None, search: Optional[str] = None):
    """
    Fetch a list of words with pagination and the total count.
    """
    # Start with a base query that can be modified
    query = db.query(models.Word)

    # If a category_id is provided, apply a filter to the query
    if category_id is not None:
        # This uses the 'categories' relationship defined in your models.
        # It finds words where ANY of their linked categories match the given id.
        query = query.filter(models.Word.categories.any(id=category_id))

    # If a search term is provided, apply a filter to the query
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (models.Word.german_word.ilike(search_term)) |
            (models.Word.english_translation.ilike(search_term)) 
        )

    if ordering:
        # Determine sort direction (descending if the string starts with '-')
        direction = "desc" if ordering.startswith("-") else "asc"
        # Get the column name by removing the potential '-' prefix
        column_name = ordering.lstrip('-')

        # SECURITY: Whitelist of columns that are allowed to be sorted on.
        # This prevents users from trying to sort on an invalid or sensitive column.
        allowed_columns = [
            "id", "german_word", "english_translation",
            "turkish_translation", "created_at", "updated_at"
        ]

        if column_name in allowed_columns:
            # Get the actual SQLAlchemy column object from the model
            sort_column = getattr(models.Word, column_name)

            # Apply the ordering to the query
            if direction == "desc":
                query = query.order_by(sort_column.desc())
            else:
                query = query.order_by(sort_column.asc())

    # First, get the total count from the (potentially filtered) query
    total_count = query.count()

    # Then, apply pagination and retrieve the words from the same query
    words = query.offset(skip).limit(limit).all()

    return {"words": words, "total_count": total_count}

def create_word(db: Session, word: schemas.WordCreate):
    """Create a new word record in the database."""
    # Create a dictionary of the word data, excluding the category_ids
    db_word_data = word.dict(exclude={"category_ids"})
    db_word = models.Word(**db_word_data)

    # Handle categories
    if word.category_ids:
        categories = db.query(models.Category).filter(models.Category.id.in_(word.category_ids)).all()
        db_word.categories = categories

    db.add(db_word)
    db.commit()
    db.refresh(db_word)
    return db_word

def update_word(db: Session, word_id: int, word_update: schemas.WordUpdate):
    """Update an existing word's information."""
    db_word = get_word(db, word_id)
    if not db_word:
        return None

    update_data = word_update.dict(exclude_unset=True)
    
    # Handle category updates separately
    if "category_ids" in update_data:
        category_ids = update_data.pop("category_ids")
        if category_ids is not None:
            categories = db.query(models.Category).filter(models.Category.id.in_(category_ids)).all()
            db_word.categories = categories

    # Update the rest of the fields
    for key, value in update_data.items():
        setattr(db_word, key, value)

    db.commit()
    db.refresh(db_word)
    return db_word

def delete_word(db: Session, word_id: int):
    """Delete a word from the database."""
    db_word = get_word(db, word_id)
    if not db_word:
        return False
    db.delete(db_word)
    db.commit()
    return True

# --- Category CRUD Functions ---

def get_category(db: Session, category_id: int):
    """Fetch a single category by its ID."""
    return db.query(models.Category).filter(models.Category.id == category_id).first()

def get_category_by_name(db: Session, name: str):
    """Fetch a single category by its name."""
    return db.query(models.Category).filter(models.Category.name == name).first()

def get_categories(db: Session, skip: int = 0, limit: int = 100):
    """Fetch a list of categories with pagination."""
    return db.query(models.Category).offset(skip).limit(limit).all()

def create_category(db: Session, category: schemas.CategoryCreate):
    """Create a new category record."""
    db_category = models.Category(name=category.name)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

# --- Check Duplicate ---

def get_word_by_german_and_english(db: Session, german_word: str, english_translation: str):
    """
    Fetch a single word by its exact German word and English translation pair.
    Returns the word object if a match is found, otherwise None.
    """
    return db.query(models.Word).filter(
        models.Word.german_word == german_word,
        models.Word.english_translation == english_translation
    ).first()
