"""
File: auth.py

Purpose:
Handles authentication, token encryption/decryption, JWT token generation,
and current user dependency verification for the FastAPI application.

Responsibilities:
- Cryptographic encryption/decryption of GitHub access tokens using Fernet.
- Encoding and decoding JWT tokens for user session management.
- Authentication dependency injection to protect endpoints and fetch active user records.

Dependencies:
- cryptography
- PyJWT
- fastapi
- sqlalchemy
"""

import os
import jwt
from datetime import datetime, timedelta
from cryptography.fernet import Fernet
from fastapi import HTTPException, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from backend.app.database import get_db
from sqlalchemy.orm import Session
import backend.app.models as models

# Initialize the HTTP Bearer scheme for parsing Authorization headers
security = HTTPBearer()

# JWT Secret used to sign and verify session tokens
JWT_SECRET = os.getenv("JWT_SECRET", "super-secret-jwt-key")

# Symmetric Fernet key used to encrypt sensitive GitHub tokens in the database
FERNET_KEY = os.getenv("FERNET_KEY", Fernet.generate_key().decode())

# Initialize Fernet cipher for symmetric encryption
fernet = Fernet(FERNET_KEY.encode())

def encrypt_token(token: str) -> str:
    """
    Encrypts a plain text GitHub token.

    Why:
    GitHub OAuth access tokens are sensitive credentials. To prevent exposure
    if the database is compromised, they must be stored in encrypted form.

    What happens:
    Converts token to bytes, encrypts it using Fernet cipher, and returns decoded string.

    Args:
        token (str): The raw GitHub access token.

    Returns:
        str: The encrypted token as a string.
    """
    return fernet.encrypt(token.encode()).decode()

def decrypt_token(encrypted_token: str) -> str:
    """
    Decrypts an encrypted GitHub token.

    Why:
    Needed to retrieve the original GitHub OAuth access token to make authenticated API
    requests to GitHub on behalf of the user.

    What happens:
    Converts encrypted token string to bytes, decrypts it using Fernet, and decodes to raw string.

    Args:
        encrypted_token (str): The encrypted GitHub access token.

    Returns:
        str: The decrypted raw GitHub token.
    """
    return fernet.decrypt(encrypted_token.encode()).decode()

def create_jwt_token(data: dict) -> str:
    """
    Generates a JWT token for user authentication session.

    Why:
    Provides a stateless authentication mechanism for the frontend to authenticate subsequent API calls.

    What happens:
    Copies input payload dictionary, appends an expiration timestamp (7 days validity),
    and encodes the payload using HS256 algorithm with JWT_SECRET.

    Args:
        data (dict): Dict of user data (e.g., {"user_id": user.id}) to include in the token payload.

    Returns:
        str: A signed JWT token string.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm="HS256")

def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security), db: Session = Depends(get_db)) -> models.User:
    """
    Dependency injection function to validate JWT token and fetch active user.

    Why:
    Protects API endpoints by requiring a valid Authorization Bearer header,
    identifying and loading the logged-in user context.

    What happens:
    Decodes the JWT credentials using JWT_SECRET, extracts the user ID,
    queries the SQLite database for the corresponding user, and returns it.
    Raises HTTPException (401) if validation, user lookup, or signature fails.

    Args:
        credentials (HTTPAuthorizationCredentials): Authorization header token injected by FastAPI.
        db (Session): Database session dependency.

    Returns:
        models.User: The authenticated user instance from the database.

    Raises:
        HTTPException: If token is invalid, user is missing, or verification failed.
    """
    try:
        # Decode and verify the signature and validity of the JWT token
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=["HS256"])
        user_id: int = payload.get("user_id")
        
        # Verify user ID exists in payload structure
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # Look up the user record in the SQL database
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        
        return user
    except jwt.PyJWTError:
        # Handle expiration or invalid signatures
        raise HTTPException(status_code=401, detail="Could not validate credentials")

