# This file defines the SQLAlchemy ORM models, which represent the database tables.

import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey,
    Table,
)
from sqlalchemy.orm import relationship
from sqlalchemy.types import JSON

from database import Base

# Association Table for the many-to-many relationship between Word and Category
word_category_association_table = Table(
    "word_categories",
    Base.metadata,
    Column("word_id", Integer, ForeignKey("words.id"), primary_key=True),
    Column("category_id", Integer, ForeignKey("categories.id"), primary_key=True),
)

class Word(Base):
    __tablename__ = "words"

    id = Column(Integer, primary_key=True, index=True)
    german_word = Column(String(100), nullable=False, unique=True, index=True)
    english_translation = Column(String(100), nullable=False)
    turkish_translation = Column(String(100), nullable=False)

    # Noun-specific fields
    artikel = Column(String(3), nullable=True)
    plural_form = Column(String(100), nullable=True)

    # Verb-specific field
    conjugations = Column(JSON, nullable=True)

    # Example sentences
    basic_sentence = Column(Text, nullable=True)
    advanced_sentence = Column(Text, nullable=True)

    # Optional fields
    note = Column(Text, nullable=True)
    image_url = Column(String(255), nullable=True)

    # Self-referencing relationship for gender pairs
    gender_pair_id = Column(Integer, ForeignKey("words.id"), nullable=True)
    gender_pair = relationship("Word", remote_side=[id], uselist=False)

    # Timestamps
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Many-to-many relationship with Category
    categories = relationship(
        "Category",
        secondary=word_category_association_table,
        back_populates="words"
    )

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False, unique=True, index=True)

    # The other side of the many-to-many relationship
    words = relationship(
        "Word",
        secondary=word_category_association_table,
        back_populates="categories"
    )
