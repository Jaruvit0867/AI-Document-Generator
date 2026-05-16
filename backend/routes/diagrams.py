from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from database import get_db
from utils.dependencies import get_current_user
from models.user import User
from services.diagram_service import (
    generate_all_diagrams,
    get_project_diagrams,
    get_diagram_by_id,
    delete_project_diagrams
)
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/projects/{project_id}/diagrams", tags=["diagrams"])


class DiagramResponse(BaseModel):
    id: int
    project_id: int
    diagram_type: str
    title: str
    mermaid_content: str
    created_at: str
    
    class Config:
        from_attributes = True


@router.post("/generate", response_model=List[DiagramResponse], status_code=status.HTTP_201_CREATED)
async def generate_diagrams(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Generate all diagram types from project extraction data.
    
    This endpoint creates 4 types of diagrams:
    - System Architecture (graph)
    - User Flow (flowchart)
    - Development Timeline (gantt)
    - Data Model (ERD)
    
    Prerequisites:
    - Project must have extraction_result populated
    - Run POST /projects/{id}/extract first if not done
    
    Returns:
    - List of generated diagrams with Mermaid syntax
    """
    try:
        diagrams = generate_all_diagrams(
            db=db,
            project_id=project_id,
            user_id=current_user.id
        )
        
        return [
            DiagramResponse(
                id=diagram.id,
                project_id=diagram.project_id,
                diagram_type=diagram.diagram_type,
                title=diagram.title,
                mermaid_content=diagram.mermaid_content,
                created_at=diagram.created_at.isoformat()
            )
            for diagram in diagrams
        ]
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error generating diagrams: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate diagrams"
        )


@router.get("", response_model=List[DiagramResponse])
async def list_diagrams(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all diagrams for a project.
    
    Returns diagrams ordered by creation time (newest first).
    """
    try:
        diagrams = get_project_diagrams(
            db=db,
            project_id=project_id,
            user_id=current_user.id
        )
        
        return [
            DiagramResponse(
                id=diagram.id,
                project_id=diagram.project_id,
                diagram_type=diagram.diagram_type,
                title=diagram.title,
                mermaid_content=diagram.mermaid_content,
                created_at=diagram.created_at.isoformat()
            )
            for diagram in diagrams
        ]
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error getting diagrams: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve diagrams"
        )


@router.get("/{diagram_id}", response_model=DiagramResponse)
async def get_diagram(
    project_id: int,
    diagram_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific diagram by ID.
    """
    try:
        diagram = get_diagram_by_id(
            db=db,
            project_id=project_id,
            diagram_id=diagram_id,
            user_id=current_user.id
        )
        
        return DiagramResponse(
            id=diagram.id,
            project_id=diagram.project_id,
            diagram_type=diagram.diagram_type,
            title=diagram.title,
            mermaid_content=diagram.mermaid_content,
            created_at=diagram.created_at.isoformat()
        )
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error getting diagram: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve diagram"
        )


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
async def delete_diagrams(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete all diagrams for a project.
    
    This action cannot be undone.
    You can regenerate diagrams using POST /projects/{id}/diagrams/generate
    """
    try:
        delete_project_diagrams(
            db=db,
            project_id=project_id,
            user_id=current_user.id
        )
        
        return None
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error deleting diagrams: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete diagrams"
        )

# Made with Bob
