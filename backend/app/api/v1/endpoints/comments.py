from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
import logging

from app.api.deps import get_db, get_current_user, get_current_verified_user, get_current_superuser
from app.models.comment import Comment
from app.models.post import Post
from app.models.user import User
from app.schemas.comment import CommentCreate, CommentUpdate, CommentResponse, CommentNestedResponse

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
def create_comment(
    *,
    db: Session = Depends(get_db),
    comment_in: CommentCreate,
    current_user: User = Depends(get_current_verified_user)
) -> Any:
    """
    Create a new comment
    """
    # Check if post exists
    post = db.query(Post).filter(Post.id == comment_in.post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Check if parent comment exists if provided
    if comment_in.parent_id:
        parent_comment = db.query(Comment).filter(Comment.id == comment_in.parent_id).first()
        if not parent_comment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Parent comment not found"
            )
        
        # Check if parent comment belongs to the same post
        if parent_comment.post_id != comment_in.post_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Parent comment does not belong to the same post"
            )
    
    # Create comment
    db_comment = Comment(
        content=comment_in.content,
        post_id=comment_in.post_id,
        user_id=current_user.id,
        parent_id=comment_in.parent_id,
        is_approved=True  # Auto-approve comments for now
    )
    
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    
    return db_comment

@router.get("/post/{post_id}", response_model=List[CommentNestedResponse])
def get_comments_by_post(
    *,
    db: Session = Depends(get_db),
    post_id: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100)
) -> Any:
    """
    Get all top-level comments for a post
    """
    # Check if post exists
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Get top-level comments (no parent)
    comments = db.query(Comment).filter(
        Comment.post_id == post_id,
        Comment.parent_id == None,
        Comment.is_approved == True
    ).order_by(desc(Comment.created_at)).offset(skip).limit(limit).all()
    
    return comments

@router.get("/{comment_id}", response_model=CommentNestedResponse)
def get_comment(
    *,
    db: Session = Depends(get_db),
    comment_id: str
) -> Any:
    """
    Get comment by ID
    """
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )
    
    return comment

@router.put("/{comment_id}", response_model=CommentResponse)
def update_comment(
    *,
    db: Session = Depends(get_db),
    comment_id: str,
    comment_in: CommentUpdate,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Update comment
    """
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )
    
    # Check if user is author or superuser
    if comment.user_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Update comment attributes
    for field, value in comment_in.dict(exclude_unset=True).items():
        setattr(comment, field, value)
    
    db.add(comment)
    db.commit()
    db.refresh(comment)
    
    return comment

@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(
    *,
    db: Session = Depends(get_db),
    comment_id: str,
    current_user: User = Depends(get_current_user)
) -> None:
    """
    Delete comment
    """
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )
    
    # Check if user is author or superuser
    if comment.user_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Delete comment
    db.delete(comment)
    db.commit()
    
    # For status code 204, we don't return anything
    return

@router.post("/{comment_id}/like", response_model=CommentResponse)
def like_comment(
    *,
    db: Session = Depends(get_db),
    comment_id: str,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Like a comment
    """
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )
    
    # Increment like count
    comment.like_count += 1
    db.commit()
    db.refresh(comment)
    
    return comment

@router.post("/{comment_id}/approve", response_model=CommentResponse)
def approve_comment(
    *,
    db: Session = Depends(get_db),
    comment_id: str,
    current_user: User = Depends(get_current_superuser)
) -> Any:
    """
    Approve a comment (superuser only)
    """
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )
    
    # Approve comment
    comment.is_approved = True
    db.commit()
    db.refresh(comment)
    
    return comment 