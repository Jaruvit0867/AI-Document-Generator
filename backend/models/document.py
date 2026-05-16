from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base


class Document(Base):
    """Document model for storing uploaded files and their content"""
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    filename = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)  # Extracted text content
    file_type = Column(String(50))  # .txt, .docx, .pdf
    file_size = Column(Integer)  # Size in bytes
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<Document(id={self.id}, filename={self.filename}, project_id={self.project_id})>"

# Made with Bob
