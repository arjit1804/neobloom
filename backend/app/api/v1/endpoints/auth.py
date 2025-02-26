from datetime import datetime, timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import logging

from app.api.deps import get_db, get_current_user
from app.core.config import settings
from app.core.security import (
    verify_password, 
    get_password_hash, 
    create_access_token,
    generate_password_reset_token,
    verify_password_reset_token,
    generate_verification_token
)
from app.models.user import User
from app.schemas.user import (
    UserCreate, 
    UserResponse, 
    PasswordResetRequest, 
    PasswordReset,
    PasswordChange
)
from app.schemas.token import Token

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(
    *,
    db: Session = Depends(get_db),
    user_in: UserCreate
) -> Any:
    """
    Register a new user
    """
    # Check if user with this email already exists
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists"
        )
    
    # Check if user with this username already exists
    user = db.query(User).filter(User.username == user_in.username).first()
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this username already exists"
        )
    
    # Create new user
    verification_token = generate_verification_token()
    db_user = User(
        email=user_in.email,
        username=user_in.username,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        bio=user_in.bio,
        avatar_url=user_in.avatar_url,
        is_active=True,
        is_superuser=False,
        is_verified=False,  # User needs to verify email
        verification_token=verification_token
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # TODO: Send verification email
    
    return db_user

@router.post("/login", response_model=Token)
def login(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    # Try to find user by email
    user = db.query(User).filter(User.email == form_data.username).first()
    
    # If not found by email, try by username
    if not user:
        user = db.query(User).filter(User.username == form_data.username).first()
    
    # If still not found or password doesn't match, raise error
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email/username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    # Update last login time and login count
    user.last_login = datetime.utcnow()
    user.login_count += 1
    db.commit()
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        subject=user.id, expires_delta=access_token_expires
    )
    
    # Return token
    return {
        "access_token": token,
        "token_type": "bearer",
        "expires_at": datetime.utcnow() + access_token_expires
    }

@router.post("/password-reset-request", status_code=status.HTTP_202_ACCEPTED)
def request_password_reset(
    reset_request: PasswordResetRequest,
    db: Session = Depends(get_db)
) -> Any:
    """
    Request a password reset
    """
    user = db.query(User).filter(User.email == reset_request.email).first()
    if user:
        # Generate password reset token
        token = generate_password_reset_token(user.email)
        
        # Set password reset token and expiry
        user.password_reset_token = token
        user.password_reset_expires = datetime.utcnow() + timedelta(hours=24)
        db.commit()
        
        # TODO: Send password reset email
    
    # Always return success to prevent email enumeration
    return {"message": "If your email is registered, you will receive a password reset link"}

@router.post("/password-reset", status_code=status.HTTP_200_OK)
def reset_password(
    reset_data: PasswordReset,
    db: Session = Depends(get_db)
) -> Any:
    """
    Reset password using reset token
    """
    email = verify_password_reset_token(reset_data.token)
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired token"
        )
    
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check if token matches and is not expired
    if (user.password_reset_token != reset_data.token or 
        not user.password_reset_expires or 
        user.password_reset_expires < datetime.utcnow()):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired token"
        )
    
    # Update password
    user.hashed_password = get_password_hash(reset_data.new_password)
    user.password_reset_token = None
    user.password_reset_expires = None
    db.commit()
    
    return {"message": "Password reset successful"}

@router.post("/change-password", status_code=status.HTTP_200_OK)
def change_password(
    password_data: PasswordChange,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Change password (requires authentication)
    """
    # Verify current password
    if not verify_password(password_data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect password"
        )
    
    # Update password
    current_user.hashed_password = get_password_hash(password_data.new_password)
    db.commit()
    
    return {"message": "Password changed successfully"}

@router.post("/verify-email/{token}", status_code=status.HTTP_200_OK)
def verify_email(
    token: str,
    db: Session = Depends(get_db)
) -> Any:
    """
    Verify email using verification token
    """
    user = db.query(User).filter(User.verification_token == token).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification token"
        )
    
    # Mark user as verified
    user.is_verified = True
    user.verification_token = None
    db.commit()
    
    return {"message": "Email verified successfully"} 