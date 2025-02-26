import logging
from sqlalchemy.orm import Session
import os

from app.db.database import Base, engine
from app.core.config import settings
from app.core.security import get_password_hash
from app.models.user import User
from app.models.category import Category
from app.models.tag import Tag

logger = logging.getLogger(__name__)

# Initial categories
INITIAL_CATEGORIES = [
    {
        "name": "Artificial Intelligence",
        "slug": "artificial-intelligence",
        "description": "Articles about AI, machine learning, and neural networks",
        "color": "#3498db",
        "icon": "FiCpu"
    },
    {
        "name": "Web Development",
        "slug": "web-development",
        "description": "Articles about web development, frameworks, and best practices",
        "color": "#e74c3c",
        "icon": "FiCode"
    },
    {
        "name": "Cyberpunk Design",
        "slug": "cyberpunk-design",
        "description": "Articles about cyberpunk aesthetics, neon design, and futuristic interfaces",
        "color": "#9b59b6",
        "icon": "FiZap"
    },
    {
        "name": "Digital Marketing",
        "slug": "digital-marketing",
        "description": "Articles about SEO, content marketing, and social media strategies",
        "color": "#2ecc71",
        "icon": "FiTrendingUp"
    }
]

# Initial tags
INITIAL_TAGS = [
    {"name": "AI", "slug": "ai", "color": "#3498db"},
    {"name": "Machine Learning", "slug": "machine-learning", "color": "#2980b9"},
    {"name": "React", "slug": "react", "color": "#61dafb"},
    {"name": "Next.js", "slug": "nextjs", "color": "#000000"},
    {"name": "Python", "slug": "python", "color": "#3776ab"},
    {"name": "FastAPI", "slug": "fastapi", "color": "#009688"},
    {"name": "Cyberpunk", "slug": "cyberpunk", "color": "#ff00ff"},
    {"name": "Neon", "slug": "neon", "color": "#39ff14"},
    {"name": "SEO", "slug": "seo", "color": "#ff9900"},
    {"name": "Content Creation", "slug": "content-creation", "color": "#ff6b6b"}
]

def init_db(db: Session) -> None:
    """
    Initialize the database with initial data
    """
    # Create tables
    Base.metadata.create_all(bind=engine)
    logger.info("Created database tables")
    
    # Create initial superuser if not exists
    create_initial_superuser(db)
    
    # Create initial categories if not exists
    create_initial_categories(db)
    
    # Create initial tags if not exists
    create_initial_tags(db)

def create_initial_superuser(db: Session) -> None:
    """
    Create initial superuser if not exists
    """
    # Check if superuser already exists
    superuser = db.query(User).filter(User.is_superuser == True).first()
    if superuser:
        logger.info("Superuser already exists")
        return
    
    # Get superuser credentials from environment variables
    superuser_email = os.getenv("FIRST_SUPERUSER_EMAIL", "admin@neobloom.com")
    superuser_password = os.getenv("FIRST_SUPERUSER_PASSWORD", "Admin123!")
    superuser_username = os.getenv("FIRST_SUPERUSER_USERNAME", "admin")
    
    # Create superuser
    superuser = User(
        email=superuser_email,
        username=superuser_username,
        hashed_password=get_password_hash(superuser_password),
        full_name="NeoBloom Admin",
        is_superuser=True,
        is_active=True,
        is_verified=True
    )
    
    db.add(superuser)
    db.commit()
    logger.info(f"Created initial superuser: {superuser_email}")

def create_initial_categories(db: Session) -> None:
    """
    Create initial categories if not exists
    """
    # Check if categories already exist
    existing_categories = db.query(Category).count()
    if existing_categories > 0:
        logger.info("Categories already exist")
        return
    
    # Create categories
    for category_data in INITIAL_CATEGORIES:
        category = Category(**category_data)
        db.add(category)
    
    db.commit()
    logger.info(f"Created {len(INITIAL_CATEGORIES)} initial categories")

def create_initial_tags(db: Session) -> None:
    """
    Create initial tags if not exists
    """
    # Check if tags already exist
    existing_tags = db.query(Tag).count()
    if existing_tags > 0:
        logger.info("Tags already exist")
        return
    
    # Create tags
    for tag_data in INITIAL_TAGS:
        tag = Tag(**tag_data)
        db.add(tag)
    
    db.commit()
    logger.info(f"Created {len(INITIAL_TAGS)} initial tags") 