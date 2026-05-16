from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base


class Diagram(Base):
    """Diagram model for storing generated Mermaid diagrams"""
    __tablename__ = "diagrams"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    diagram_type = Column(String(50), nullable=False)  # system_architecture, user_flow, development_workflow, data_model
    title = Column(String(255), nullable=False)
    mermaid_content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<Diagram(id={self.id}, type={self.diagram_type}, project_id={self.project_id})>"

# Made with Bob