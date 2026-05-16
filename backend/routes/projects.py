from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from database import get_db
from utils.dependencies import get_current_user
from models.user import User
from services.project_service import (
    create_project,
    get_project_by_id,
    get_user_projects,
    update_project,
    delete_project,
    get_project_count
)

router = APIRouter(prefix="/projects", tags=["Projects"])


# Pydantic schemas
class ProjectCreate(BaseModel):
    """Schema for creating a project"""
    name: str
    description: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "E-commerce Platform",
                "description": "Building a modern e-commerce platform with AI recommendations"
            }
        }


class ProjectUpdate(BaseModel):
    """Schema for updating a project"""
    name: Optional[str] = None
    description: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "Updated Project Name",
                "description": "Updated description"
            }
        }


class ProjectResponse(BaseModel):
    """Schema for project response"""
    id: int
    user_id: int
    name: str
    description: Optional[str]
    extraction_result: Optional[dict]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ProjectListResponse(BaseModel):
    """Schema for project list response"""
    total: int
    projects: List[ProjectResponse]


@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_new_project(
    project_data: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new project.
    
    Requires authentication.
    
    - **name**: Project name (required)
    - **description**: Project description (optional)
    """
    project = create_project(
        db=db,
        user_id=current_user.id,
        name=project_data.name,
        description=project_data.description
    )
    return project


@router.get("/", response_model=ProjectListResponse)
def list_projects(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all projects for the authenticated user.
    
    Requires authentication.
    
    - **skip**: Number of projects to skip (pagination)
    - **limit**: Maximum number of projects to return
    """
    projects = get_user_projects(db=db, user_id=current_user.id, skip=skip, limit=limit)
    total = get_project_count(db=db, user_id=current_user.id)
    
    return {
        "total": total,
        "projects": projects
    }


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific project by ID.
    
    Requires authentication.
    Only returns projects owned by the authenticated user.
    """
    project = get_project_by_id(db=db, project_id=project_id, user_id=current_user.id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    return project


@router.put("/{project_id}", response_model=ProjectResponse)
def update_existing_project(
    project_id: int,
    project_data: ProjectUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a project.
    
    Requires authentication.
    Only allows updating projects owned by the authenticated user.
    
    - **name**: New project name (optional)
    - **description**: New project description (optional)
    """
    project = update_project(
        db=db,
        project_id=project_id,
        user_id=current_user.id,
        name=project_data.name,
        description=project_data.description
    )
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_project(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a project.
    
    Requires authentication.
    Only allows deleting projects owned by the authenticated user.
    
    This will also delete all associated documents, embeddings, and chat history.
    """
    success = delete_project(db=db, project_id=project_id, user_id=current_user.id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    return None

# Made with Bob
