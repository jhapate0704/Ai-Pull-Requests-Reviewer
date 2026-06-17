"""
File: migrate_db.py

Purpose:
Runs a database migration to add missing columns to the database schemas.

Responsibilities:
- Load backend configuration environments.
- Establish a connection to the SQL database using SQLAlchemy.
- Execute SQL command to add avatar_url column to the users table.
- Handle potential errors if the column already exists.

Dependencies:
- sqlalchemy
- os
- dotenv
"""

from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

# Load backend-specific environment variables for the database URL
load_dotenv("backend/.env")

database_url = os.getenv("DATABASE_URL")
if database_url:
    # Initialize the database engine with the loaded URL
    engine = create_engine(database_url)
    try:
        # Open transaction block and execute schema alteration
        # Why:
        # Add avatar_url column to store user profiles from Github.
        with engine.begin() as conn:
            conn.execute(text("ALTER TABLE users ADD COLUMN avatar_url VARCHAR;"))
            print("Successfully added avatar_url column to users table.")
    except Exception as e:
        # Silently capture error if column already exists or migration was run previously
        print(f"Migration error or column already exists: {e}")
else:
    print("DATABASE_URL not found in backend/.env")

