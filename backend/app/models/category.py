from sqlalchemy import Column, String, DateTime, Text, Integer, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.db.database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, unique=True, index=True, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text)
    icon = Column(String)  # Icon or image URL
    color = Column(String)  # Hex color code
    post_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Foreign key for parent category (for hierarchical categories)
    parent_id = Column(String, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    
    # Relationships
    posts = relationship("Post", back_populates="category")
    subcategories = relationship("Category", 
                               backref="parent",
                               remote_side=[id],
                               cascade="all")
    
    def __repr__(self):
        return f"<Category {self.name}>" 