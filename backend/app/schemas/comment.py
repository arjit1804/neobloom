from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime

from app.schemas.user import UserProfile

# Base Comment Schema (shared properties)
class CommentBase(BaseModel):
    content: str = Field(..., min_length=1, max_length=1000)

# Schema for creating a comment
class CommentCreate(CommentBase):
    post_id: str
    parent_id: Optional[str] = None

# Schema for updating a comment
class CommentUpdate(BaseModel):
    content: Optional[str] = Field(None, min_length=1, max_length=1000)
    is_approved: Optional[bool] = None
    
    class Config:
        extra = "forbid"

# Schema for comment response (returned to client)
class CommentResponse(CommentBase):
    id: str
    post_id: str
    user_id: str
    parent_id: Optional[str] = None
    is_approved: bool
    like_count: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    user: UserProfile
    
    class Config:
        orm_mode = True

# Schema for nested comment response (for threaded comments)
class CommentNestedResponse(CommentResponse):
    replies: List[Any] = []  # Will be populated with CommentResponse objects
    
    class Config:
        orm_mode = True 