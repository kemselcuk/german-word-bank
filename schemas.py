# This file defines the Pydantic models (schemas) for data validation,
# serialization, and API documentation.

from pydantic import BaseModel
from typing import Optional, List, Any
import datetime

# --- Category Schemas ---

class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int

    class Config:
        orm_mode = True

# --- Word Schemas ---

class WordBase(BaseModel):
    german_word: str
    english_translation: str
    turkish_translation: str
    artikel: Optional[str] = None
    plural_form: Optional[str] = None
    conjugations: Optional[dict] = None
    basic_sentence: Optional[str] = None
    advanced_sentence: Optional[str] = None
    note: Optional[str] = None
    image_url: Optional[str] = None
    gender_pair_id: Optional[int] = None

class WordCreate(WordBase):
    # When creating a word, we can pass a list of category IDs
    category_ids: Optional[List[int]] = []

class WordUpdate(WordBase):
    # Similar to create, but all fields are optional for updates
    german_word: Optional[str] = None
    english_translation: Optional[str] = None
    turkish_translation: Optional[str] = None
    category_ids: Optional[List[int]] = []

# This is the main schema for reading/returning word data.
# It includes the full category objects, not just their IDs.
class Word(WordBase):
    id: int
    created_at: datetime.datetime
    updated_at: datetime.datetime
    categories: List[Category] = []

    class Config:
        orm_mode = True

# We need to update the Category schema to include the relationship
# back to the Word schema to avoid circular import issues.
class Category(Category):
    words: List[Word] = []

class WordsResponse(BaseModel):
    total_count: int
    words: List[Word]