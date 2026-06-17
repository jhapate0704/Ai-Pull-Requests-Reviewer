"""
File: database.py

Purpose:
Sets up SQLAlchemy database connections, sessions, and base models.

Responsibilities:
- Load environmental configuration.
- Initialize database engine for SQLite/PostgreSQL depending on the database URL.
- Expose SessionLocal class to create database sessions.
- Provide Base declarative class for modeling tables.
- Define get_db generator helper for route-based dependency injection.

Dependencies:
- sqlalchemy
- os
- dotenv
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load database configuration environments from backend folder
load_dotenv("backend/.env")

# Default to a local SQLite database for easy out-of-the-box setup
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./sql_app.db")

# If using SQLite, we need check_same_thread=False
# Why:
# SQLite by default only allows access to a connection from a single thread. 
# FastAPI handles request routes concurrently across multiple threads, so we disable 
# the thread check for local SQLite usage.
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Configure the local session factory bound to our database engine.
# Autocommit/autoflush are disabled to ensure transactions are explicitly committed.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative base model class from which all SQL tables will inherit
Base = declarative_base()

def get_db():
    """
    Dependency injection generator helper to manage SQL session lifecycle.

    Why:
    Ensures that each HTTP request gets its own database connection session,
    and automatically cleans it up/closes it after the request completes.

    What happens:
    Creates a new database Session, yields it to the dependency caller, and 
    runs a cleanup 'finally' block to close the session when the calling thread finishes.

    Yields:
        Session: Active SQLAlchemy Session instance.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

