# "Create, Read, Update, Delete" - this file contains all the functions
# that directly interact with the database.

from sqlalchemy.orm import Session
import models
import schemas

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

def get_words(db: Session, skip: int = 0, limit: int = 100):
    """
    Fetch a list of words with pagination and the total count.
    """
    # Query to get the paginated list of words
    words = db.query(models.Word).offset(skip).limit(limit).all()
    
    # Query to get the total number of words in the table
    total_count = db.query(models.Word).count()
    
    # Return both in a dictionary
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
