from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from database import get_db
from services.auth_service import (
    authenticate_user,
    create_user,
    get_user_by_email,
    create_access_token
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


# Pydantic schemas
class UserRegister(BaseModel):
    """Schema for user registration"""
    email: EmailStr
    password: str
    
    @classmethod
    def validate_password(cls, v):
        """Validate password length"""
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters long")
        if len(v.encode('utf-8')) > 72:
            raise ValueError("Password is too long (max 72 bytes)")
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "securepassword123"
            }
        }


class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "securepassword123"
            }
        }


class Token(BaseModel):
    """Schema for token response"""
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    """Schema for user response"""
    id: int
    email: str
    
    class Config:
        from_attributes = True


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """
    Register a new user.
    
    - **email**: Valid email address
    - **password**: User password (will be hashed)
    """
    # Check if user already exists
    existing_user = get_user_by_email(db, email=user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    user = create_user(db, email=user_data.email, password=user_data.password)
    return user


@router.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """
    Login with email and password to get JWT token.
    
    - **email**: User email
    - **password**: User password
    
    Returns JWT access token that should be included in Authorization header as:
    `Authorization: Bearer <token>`
    """
    # Authenticate user
    user = authenticate_user(db, email=user_data.email, password=user_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    print(f"[LOGIN DEBUG] Creating token for user ID: {user.id}")
    access_token = create_access_token(data={"sub": str(user.id)})  # Convert to string for JWT
    print(f"[LOGIN DEBUG] Generated token: {access_token[:50]}...")
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


from utils.dependencies import get_current_user
from models.user import User

@router.get("/me", response_model=UserResponse)
def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    return current_user

# Made with Bob
