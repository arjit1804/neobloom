from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime
import re

# Base Tag Schema (shared properties)
class TagBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    description: Optional[str] = None
    color: Optional[str] = None

# Schema for creating a tag
class TagCreate(TagBase):
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

# Schema for updating a tag
class TagUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=50)
    slug: Optional[str] = None
    description: Optional[str] = None
    color: Optional[str] = None
    
    @validator('slug', pre=True)
    def validate_slug(cls, v):
        if v:
            return re.sub(r'[^\w\-]', '', v.lower().replace(' ', '-'))
        return v
    
    class Config:
        extra = "forbid"

# Schema for tag response (returned to client)
class TagResponse(TagBase):
    id: str
    slug: str
    post_count: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True 