from sqlalchemy import Column, Integer, String, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    github_id = Column(Integer, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, nullable=False)
    avatar_url = Column(String, nullable=True)
    encrypted_github_token = Column(String, nullable=False)
    
    reviews = relationship("ReviewHistory", back_populates="user")

class ReviewHistory(Base):
    __tablename__ = "review_history"

    id = Column(Integer, primary_key=True, index=True)
    pr_url = Column(String, index=True, nullable=False)
    repo = Column(String, index=True, nullable=False)
    owner = Column(String, index=True, nullable=False)
    pr_score = Column(Integer, nullable=True)
    files_reviewed = Column(Integer, default=0)
    reviews_json = Column(JSON, nullable=False)  # Stores the actual review content
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True) # Making it nullable so old reviews don't crash
    user = relationship("User", back_populates="reviews")
