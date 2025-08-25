# This file handles the database connection and session management.

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# The database URL for SQLite. This will create a file named 'wordbank.db'
# in the same directory.
SQLALCHEMY_DATABASE_URL = "sqlite:///./wordbank.db"

# Create the SQLAlchemy engine
# The 'connect_args' is needed only for SQLite to allow multithreading.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Each instance of the SessionLocal class will be a database session.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# This Base class will be inherited by our ORM models (in models.py)
Base = declarative_base()

# Dependency for FastAPI endpoints to get a DB session
def get_db():
    """
    This function is a dependency that creates and yields a new database session
    for each request, and ensures it's closed afterward.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
