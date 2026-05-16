from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from database import Base


class Project(Base):
    """Project model for storing project information and extraction results"""
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    extraction_result = Column(JSON)  # Stores the structured extraction JSON
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Note: Relationships to Document and Chat models will be added in Phase 2
    # when those models are created
    
    def __repr__(self):
        return f"<Project(id={self.id}, name={self.name}, user_id={self.user_id})>"

# Made with Bob
