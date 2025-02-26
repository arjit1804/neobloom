from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime
import logging
import re

from app.api.deps import get_db, get_current_user, get_current_verified_user
from app.models.post import Post
from app.models.tag import Tag
from app.models.category import Category
from app.models.user import User
from app.schemas.post import PostCreate, PostUpdate, PostResponse, PostListResponse

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
def create_post(
    *,
    db: Session = Depends(get_db),
    post_in: PostCreate,
    current_user: User = Depends(get_current_verified_user)
) -> Any:
    """
    Create a new post
    """
    # Check if slug already exists
    if post_in.slug:
        existing_post = db.query(Post).filter(Post.slug == post_in.slug).first()
        if existing_post:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Post with this slug already exists"
            )
    
    # Check if category exists if provided
    if post_in.category_id:
        category = db.query(Category).filter(Category.id == post_in.category_id).first()
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found"
            )
    
    # Calculate reading time (rough estimate: 200 words per minute)
    word_count = len(re.findall(r'\w+', post_in.content))
    reading_time = max(1, round(word_count / 200))
    
    # Create post
    db_post = Post(
        title=post_in.title,
        slug=post_in.slug,
        content=post_in.content,
        summary=post_in.summary,
        featured_image=post_in.featured_image,
        is_published=post_in.is_published,
        is_featured=post_in.is_featured,
        meta_title=post_in.meta_title or post_in.title,
        meta_description=post_in.meta_description or post_in.summary,
        meta_keywords=post_in.meta_keywords,
        category_id=post_in.category_id,
        author_id=current_user.id,
        reading_time=reading_time,
        published_at=datetime.utcnow() if post_in.is_published else None
    )
    
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    
    # Add tags if provided
    if post_in.tag_ids:
        tags = db.query(Tag).filter(Tag.id.in_(post_in.tag_ids)).all()
        db_post.tags = tags
        db.commit()
        db.refresh(db_post)
    
    # Update category post count
    if post_in.category_id:
        category = db.query(Category).filter(Category.id == post_in.category_id).first()
        category.post_count = db.query(Post).filter(Post.category_id == category.id).count()
        db.commit()
    
    # Update tag post counts
    for tag in db_post.tags:
        tag.post_count = len(tag.posts)
        db.commit()
    
    return db_post

@router.get("/", response_model=List[PostListResponse])
def get_posts(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    category_id: Optional[str] = None,
    tag_id: Optional[str] = None,
    author_id: Optional[str] = None,
    search: Optional[str] = None,
    published_only: bool = True
) -> Any:
    """
    Get all posts with optional filtering
    """
    query = db.query(Post)
    
    # Filter by published status
    if published_only:
        query = query.filter(Post.is_published == True)
    
    # Filter by category
    if category_id:
        query = query.filter(Post.category_id == category_id)
    
    # Filter by tag
    if tag_id:
        query = query.join(Post.tags).filter(Tag.id == tag_id)
    
    # Filter by author
    if author_id:
        query = query.filter(Post.author_id == author_id)
    
    # Search in title and content
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Post.title.ilike(search_term)) | 
            (Post.content.ilike(search_term)) |
            (Post.summary.ilike(search_term))
        )
    
    # Order by published date (newest first)
    query = query.order_by(desc(Post.published_at))
    
    # Paginate
    posts = query.offset(skip).limit(limit).all()
    
    return posts

@router.get("/{slug}", response_model=PostResponse)
def get_post(
    *,
    db: Session = Depends(get_db),
    slug: str
) -> Any:
    """
    Get post by slug
    """
    post = db.query(Post).filter(Post.slug == slug).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Increment view count
    post.view_count += 1
    db.commit()
    
    return post

@router.put("/{post_id}", response_model=PostResponse)
def update_post(
    *,
    db: Session = Depends(get_db),
    post_id: str,
    post_in: PostUpdate,
    current_user: User = Depends(get_current_verified_user)
) -> Any:
    """
    Update post
    """
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Check if user is author or superuser
    if post.author_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Check if slug is being updated and already exists
    if post_in.slug and post_in.slug != post.slug:
        existing_post = db.query(Post).filter(Post.slug == post_in.slug).first()
        if existing_post:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Post with this slug already exists"
            )
    
    # Check if category exists if provided
    if post_in.category_id and post_in.category_id != post.category_id:
        category = db.query(Category).filter(Category.id == post_in.category_id).first()
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found"
            )
    
    # Calculate reading time if content is updated
    if post_in.content:
        word_count = len(re.findall(r'\w+', post_in.content))
        reading_time = max(1, round(word_count / 200))
        post_in_dict = post_in.dict(exclude_unset=True)
        post_in_dict["reading_time"] = reading_time
    else:
        post_in_dict = post_in.dict(exclude_unset=True)
    
    # Set published_at if publishing for the first time
    if post_in.is_published and post_in.is_published != post.is_published:
        post_in_dict["published_at"] = datetime.utcnow()
    
    # Update post attributes
    for field, value in post_in_dict.items():
        if field != "tag_ids":  # Handle tags separately
            setattr(post, field, value)
    
    # Update tags if provided
    if post_in.tag_ids is not None:
        tags = db.query(Tag).filter(Tag.id.in_(post_in.tag_ids)).all()
        
        # Update tag post counts for removed tags
        old_tags = post.tags
        for tag in old_tags:
            if tag not in tags:
                tag.post_count -= 1
        
        post.tags = tags
        
        # Update tag post counts for new tags
        for tag in tags:
            tag.post_count = len(tag.posts)
    
    db.add(post)
    db.commit()
    db.refresh(post)
    
    # Update category post count if category changed
    if post_in.category_id and post_in.category_id != post.category_id:
        # Update old category count
        if post.category_id:
            old_category = db.query(Category).filter(Category.id == post.category_id).first()
            if old_category:
                old_category.post_count = db.query(Post).filter(Post.category_id == old_category.id).count()
        
        # Update new category count
        new_category = db.query(Category).filter(Category.id == post_in.category_id).first()
        if new_category:
            new_category.post_count = db.query(Post).filter(Post.category_id == new_category.id).count()
        
        db.commit()
    
    return post

@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    *,
    db: Session = Depends(get_db),
    post_id: str,
    current_user: User = Depends(get_current_verified_user)
) -> None:
    """
    Delete post
    """
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Check if user is author or superuser
    if post.author_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Store category_id and tags before deletion
    category_id = post.category_id
    tags = post.tags.copy()
    
    # Delete post
    db.delete(post)
    db.commit()
    
    # Update category post count
    if category_id:
        category = db.query(Category).filter(Category.id == category_id).first()
        if category:
            category.post_count = db.query(Post).filter(Post.category_id == category.id).count()
            db.commit()
    
    # Update tag post counts
    for tag in tags:
        tag.post_count = len(tag.posts)
        db.commit()
    
    # For status code 204, we don't return anything
    return

@router.post("/{post_id}/like", response_model=PostResponse)
def like_post(
    *,
    db: Session = Depends(get_db),
    post_id: str,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Like a post
    """
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Increment like count
    post.like_count += 1
    db.commit()
    db.refresh(post)
    
    return post 