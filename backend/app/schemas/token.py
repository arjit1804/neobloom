from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str
    expires_at: datetime
    
class TokenPayload(BaseModel):
    sub: str  # subject (user id)
    exp: datetime  # expiration time
    iat: Optional[datetime] = None  # issued at
    jti: Optional[str] = None  # JWT ID
    type: str = "access"  # token type
    fresh: bool = False  # is token fresh (for critical operations)
    
class TokenData(BaseModel):
    user_id: str
    is_superuser: bool = False 