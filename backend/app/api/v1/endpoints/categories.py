from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
import logging

from app.api.deps import get_db, get_current_superuser
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse, CategoryNestedResponse

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    *,
    db: Session = Depends(get_db),
    category_in: CategoryCreate,
    current_user = Depends(get_current_superuser)
) -> Any:
    """
    Create a new category (superuser only)
    """
    # Check if category with this name already exists
    category = db.query(Category).filter(Category.name == category_in.name).first()
    if category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A category with this name already exists"
        )
    
    # Check if category with this slug already exists
    category = db.query(Category).filter(Category.slug == category_in.slug).first()
    if category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A category with this slug already exists"
        )
    
    # Check if parent category exists if provided
    if category_in.parent_id:
        parent = db.query(Category).filter(Category.id == category_in.parent_id).first()
        if not parent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Parent category not found"
            )
    
    # Create category
    db_category = Category(
        name=category_in.name,
        slug=category_in.slug,
        description=category_in.description,
        icon=category_in.icon,
        color=category_in.color,
        parent_id=category_in.parent_id
    )
    
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    
    return db_category

@router.get("/", response_model=List[CategoryResponse])
def get_categories(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100)
) -> Any:
    """
    Get all categories
    """
    categories = db.query(Category).filter(Category.parent_id == None).offset(skip).limit(limit).all()
    return categories

@router.get("/nested", response_model=List[CategoryNestedResponse])
def get_nested_categories(
    db: Session = Depends(get_db)
) -> Any:
    """
    Get all categories in a nested structure
    """
    categories = db.query(Category).filter(Category.parent_id == None).all()
    return categories

@router.get("/{category_id}", response_model=CategoryResponse)
def get_category(
    *,
    db: Session = Depends(get_db),
    category_id: str
) -> Any:
    """
    Get category by ID
    """
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    return category

@router.get("/slug/{slug}", response_model=CategoryResponse)
def get_category_by_slug(
    *,
    db: Session = Depends(get_db),
    slug: str
) -> Any:
    """
    Get category by slug
    """
    category = db.query(Category).filter(Category.slug == slug).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    return category

@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    *,
    db: Session = Depends(get_db),
    category_id: str,
    category_in: CategoryUpdate,
    current_user = Depends(get_current_superuser)
) -> Any:
    """
    Update category (superuser only)
    """
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    # Check if name is being updated and already exists
    if category_in.name and category_in.name != category.name:
        existing_category = db.query(Category).filter(Category.name == category_in.name).first()
        if existing_category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Category with this name already exists"
            )
    
    # Check if slug is being updated and already exists
    if category_in.slug and category_in.slug != category.slug:
        existing_category = db.query(Category).filter(Category.slug == category_in.slug).first()
        if existing_category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Category with this slug already exists"
            )
    
    # Check if parent category exists if provided
    if category_in.parent_id and category_in.parent_id != category.parent_id:
        # Prevent setting self as parent
        if category_in.parent_id == category.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot set category as its own parent"
            )
        
        parent = db.query(Category).filter(Category.id == category_in.parent_id).first()
        if not parent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Parent category not found"
            )
    
    # Update category attributes
    for field, value in category_in.dict(exclude_unset=True).items():
        setattr(category, field, value)
    
    db.add(category)
    db.commit()
    db.refresh(category)
    
    return category

@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    *,
    db: Session = Depends(get_db),
    category_id: str,
    current_user = Depends(get_current_superuser)
) -> None:
    """
    Delete category (superuser only)
    """
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    # Check if category has posts
    if category.posts and len(category.posts) > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete category with posts"
        )
    
    # Delete category
    db.delete(category)
    db.commit()
    
    # For status code 204, we don't return anything
    return 