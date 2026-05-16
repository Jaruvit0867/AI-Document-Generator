from typing import List, Optional
from sqlalchemy.orm import Session
from models.project import Project


def create_project(db: Session, user_id: int, name: str, description: Optional[str] = None) -> Project:
    """Create a new project for a user"""
    project = Project(
        user_id=user_id,
        name=name,
        description=description
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


def get_project_by_id(db: Session, project_id: int, user_id: int) -> Optional[Project]:
    """Get a project by ID, ensuring it belongs to the user"""
    return db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == user_id
    ).first()


def get_user_projects(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[Project]:
    """Get all projects for a user with pagination"""
    return db.query(Project).filter(
        Project.user_id == user_id
    ).order_by(Project.created_at.desc()).offset(skip).limit(limit).all()


def update_project(
    db: Session,
    project_id: int,
    user_id: int,
    name: Optional[str] = None,
    description: Optional[str] = None,
    extraction_result: Optional[dict] = None
) -> Optional[Project]:
    """Update a project"""
    project = get_project_by_id(db, project_id, user_id)
    if not project:
        return None
    
    if name is not None:
        project.name = name
    if description is not None:
        project.description = description
    if extraction_result is not None:
        project.extraction_result = extraction_result
    
    db.commit()
    db.refresh(project)
    return project


def delete_project(db: Session, project_id: int, user_id: int) -> bool:
    """Delete a project"""
    project = get_project_by_id(db, project_id, user_id)
    if not project:
        return False
    
    db.delete(project)
    db.commit()
    return True


def get_project_count(db: Session, user_id: int) -> int:
    """Get total number of projects for a user"""
    return db.query(Project).filter(Project.user_id == user_id).count()

# Made with Bob
