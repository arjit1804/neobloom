from pydantic import BaseModel, Field, validator
from typing import Optional, List, Any
from datetime import datetime
import re

from app.schemas.user import UserProfile

# Base Post Schema (shared properties)
class PostBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    content: str = Field(..., min_length=10)
    summary: Optional[str] = None
    featured_image: Optional[str] = None
    is_published: bool = False
    is_featured: bool = False
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None
    category_id: Optional[str] = None

# Schema for creating a post
class PostCreate(PostBase):
    slug: Optional[str] = None
    tag_ids: Optional[List[str]] = []
    
    @validator('slug', pre=True, always=True)
    def generate_slug(cls, v, values):
        if v:
            # If slug is provided, validate and return it
            slug = re.sub(r'[^\w\-]', '', v.lower().replace(' ', '-'))
            return slug
        elif 'title' in values:
            # Generate slug from title
            slug = re.sub(r'[^\w\-]', '', values['title'].lower().replace(' ', '-'))
            return slug
        return None

# Schema for updating a post
class PostUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=200)
    slug: Optional[str] = None
    content: Optional[str] = Field(None, min_length=10)
    summary: Optional[str] = None
    featured_image: Optional[str] = None
    is_published: Optional[bool] = None
    is_featured: Optional[bool] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None
    category_id: Optional[str] = None
    tag_ids: Optional[List[str]] = None
    published_at: Optional[datetime] = None
    
    @validator('slug', pre=True)
    def validate_slug(cls, v):
        if v:
            return re.sub(r'[^\w\-]', '', v.lower().replace(' ', '-'))
        return v
    
    class Config:
        extra = "forbid"

# Schema for post response (returned to client)
class PostResponse(PostBase):
    id: str
    slug: str
    author_id: str
    view_count: int
    like_count: int
    reading_time: int
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    author: UserProfile
    tags: List[Any] = []  # Will be populated with TagResponse objects
    category: Optional[Any] = None  # Will be populated with CategoryResponse object
    
    class Config:
        orm_mode = True

# Schema for post list response (simplified for list views)
class PostListResponse(BaseModel):
    id: str
    title: str
    slug: str
    summary: Optional[str] = None
    featured_image: Optional[str] = None
    is_published: bool
    is_featured: bool
    view_count: int
    like_count: int
    reading_time: int
    published_at: Optional[datetime] = None
    created_at: datetime
    author: UserProfile
    category: Optional[Any] = None  # Will be populated with CategoryResponse object
    
    class Config:
        orm_mode = True 