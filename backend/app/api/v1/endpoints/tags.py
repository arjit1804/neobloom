from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
import logging

from app.api.deps import get_db, get_current_superuser
from app.models.tag import Tag
from app.schemas.tag import TagCreate, TagUpdate, TagResponse

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/", response_model=TagResponse, status_code=status.HTTP_201_CREATED)
def create_tag(
    *,
    db: Session = Depends(get_db),
    tag_in: TagCreate,
    current_user = Depends(get_current_superuser)
) -> Any:
    """
    Create a new tag (superuser only)
    """
    # Check if tag with this name already exists
    tag = db.query(Tag).filter(Tag.name == tag_in.name).first()
    if tag:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A tag with this name already exists"
        )
    
    # Check if tag with this slug already exists
    tag = db.query(Tag).filter(Tag.slug == tag_in.slug).first()
    if tag:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A tag with this slug already exists"
        )
    
    # Create tag
    db_tag = Tag(
        name=tag_in.name,
        slug=tag_in.slug,
        description=tag_in.description,
        color=tag_in.color
    )
    
    db.add(db_tag)
    db.commit()
    db.refresh(db_tag)
    
    return db_tag

@router.get("/", response_model=List[TagResponse])
def get_tags(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100)
) -> Any:
    """
    Get all tags
    """
    tags = db.query(Tag).offset(skip).limit(limit).all()
    return tags

@router.get("/{tag_id}", response_model=TagResponse)
def get_tag(
    *,
    db: Session = Depends(get_db),
    tag_id: str
) -> Any:
    """
    Get tag by ID
    """
    tag = db.query(Tag).filter(Tag.id == tag_id).first()
    if not tag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tag not found"
        )
    
    return tag

@router.get("/slug/{slug}", response_model=TagResponse)
def get_tag_by_slug(
    *,
    db: Session = Depends(get_db),
    slug: str
) -> Any:
    """
    Get tag by slug
    """
    tag = db.query(Tag).filter(Tag.slug == slug).first()
    if not tag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tag not found"
        )
    
    return tag

@router.put("/{tag_id}", response_model=TagResponse)
def update_tag(
    *,
    db: Session = Depends(get_db),
    tag_id: str,
    tag_in: TagUpdate,
    current_user = Depends(get_current_superuser)
) -> Any:
    """
    Update tag (superuser only)
    """
    tag = db.query(Tag).filter(Tag.id == tag_id).first()
    if not tag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tag not found"
        )
    
    # Check if name is being updated and already exists
    if tag_in.name and tag_in.name != tag.name:
        existing_tag = db.query(Tag).filter(Tag.name == tag_in.name).first()
        if existing_tag:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tag with this name already exists"
            )
    
    # Check if slug is being updated and already exists
    if tag_in.slug and tag_in.slug != tag.slug:
        existing_tag = db.query(Tag).filter(Tag.slug == tag_in.slug).first()
        if existing_tag:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tag with this slug already exists"
            )
    
    # Update tag attributes
    for field, value in tag_in.dict(exclude_unset=True).items():
        setattr(tag, field, value)
    
    db.add(tag)
    db.commit()
    db.refresh(tag)
    
    return tag

@router.delete("/{tag_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tag(
    *,
    db: Session = Depends(get_db),
    tag_id: str,
    current_user = Depends(get_current_superuser)
) -> None:
    """
    Delete tag (superuser only)
    """
    tag = db.query(Tag).filter(Tag.id == tag_id).first()
    if not tag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tag not found"
        )
    
    # Check if tag has posts
    if tag.posts and len(tag.posts) > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete tag with posts"
        )
    
    # Delete tag
    db.delete(tag)
    db.commit()
    
    # For status code 204, we don't return anything
    return 