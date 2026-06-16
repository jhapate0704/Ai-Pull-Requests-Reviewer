from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv("backend/.env")

database_url = os.getenv("DATABASE_URL")
if database_url:
    engine = create_engine(database_url)
    try:
        with engine.begin() as conn:
            conn.execute(text("ALTER TABLE users ADD COLUMN avatar_url VARCHAR;"))
            print("Successfully added avatar_url column to users table.")
    except Exception as e:
        print(f"Migration error or column already exists: {e}")
else:
    print("DATABASE_URL not found in backend/.env")
