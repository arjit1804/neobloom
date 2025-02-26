from pydantic import BaseModel, Field, validator
from typing import Optional, List, Any
from datetime import datetime
import re

# Base Category Schema (shared properties)
class CategoryBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    parent_id: Optional[str] = None

# Schema for creating a category
class CategoryCreate(CategoryBase):
    slug: Optional[str] = None
    
    @validator('slug', pre=True, always=True)
    def generate_slug(cls, v, values):
        if v:
            # If slug is provided, validate and return it
            slug = re.sub(r'[^\w\-]', '', v.lower().replace(' ', '-'))
            return slug
        elif 'name' in values:
            # Generate slug from name
            slug = re.sub(r'[^\w\-]', '', values['name'].lower().replace(' ', '-'))
            return slug
        return None

# Schema for updating a category
class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    slug: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    parent_id: Optional[str] = None
    
    @validator('slug', pre=True)
    def validate_slug(cls, v):
        if v:
            return re.sub(r'[^\w\-]', '', v.lower().replace(' ', '-'))
        return v
    
    class Config:
        extra = "forbid"

# Schema for category response (returned to client)
class CategoryResponse(CategoryBase):
    id: str
    slug: str
    post_count: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

# Schema for nested category response (for hierarchical views)
class CategoryNestedResponse(CategoryResponse):
    subcategories: List[Any] = []  # Will be populated with CategoryResponse objects
    
    class Config:
        orm_mode = True 