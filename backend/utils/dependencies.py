from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db
from services.auth_service import decode_access_token, get_user_by_id
from models.user import User

# HTTP Bearer token scheme
security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    Dependency to get current authenticated user from JWT token.
    Raises HTTPException if token is invalid or user not found.
    """
    token = credentials.credentials
    print(f"[AUTH DEBUG] Received token: {token[:20]}...")
    
    # Decode token
    payload = decode_access_token(token)
    print(f"[AUTH DEBUG] Decoded payload: {payload}")
    
    if payload is None:
        print("[AUTH DEBUG] Payload is None - token decode failed")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Get user ID from token (convert from string to int)
    user_id_str = payload.get("sub")
    print(f"[AUTH DEBUG] User ID from token (string): {user_id_str}")
    
    if user_id_str is None:
        print("[AUTH DEBUG] User ID is None in payload")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    try:
        user_id = int(user_id_str)
        print(f"[AUTH DEBUG] User ID converted to int: {user_id}")
    except (ValueError, TypeError):
        print(f"[AUTH DEBUG] Failed to convert user_id to int: {user_id_str}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user ID in token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Get user from database
    user = get_user_by_id(db, user_id=user_id)
    print(f"[AUTH DEBUG] User from DB: {user}")
    
    if user is None:
        print(f"[AUTH DEBUG] User not found in DB for ID: {user_id}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    print(f"[AUTH DEBUG] Authentication successful for user: {user.email}")
    return user

# Made with Bob
