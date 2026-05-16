from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Dict, Any
from database import get_db
from utils.dependencies import get_current_user
from models.user import User
from services.extraction_service import (
    extract_project_information,
    get_project_extraction,
    get_proposal_data
)
from services.project_service import get_project_by_id
from services.embedding_service import create_embeddings_for_project

router = APIRouter(prefix="/projects/{project_id}", tags=["Extraction"])


# Pydantic schemas
class ExtractionResponse(BaseModel):
    """Schema for extraction response"""
    message: str
    extraction: Dict[str, Any]


class ProcessResponse(BaseModel):
    """Schema for processing response"""
    message: str
    embeddings_created: int


@router.post("/process-embeddings", response_model=ProcessResponse)
def process_project_embeddings(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Process all documents in a project to create embeddings.
    
    This endpoint should be called after uploading documents and before extraction.
    It chunks the documents and generates vector embeddings for RAG.
    
    Requires authentication.
    """
    # Verify project exists and belongs to user
    project = get_project_by_id(db, project_id, current_user.id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    try:
        # Create embeddings for all documents
        count = create_embeddings_for_project(db, project_id)
        
        return {
            "message": "Embeddings processed successfully",
            "embeddings_created": count
        }
    except Exception as e:
        print(f"Error processing embeddings: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process embeddings: {str(e)}"
        )


@router.post("/extract", response_model=ExtractionResponse)
def extract_project(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Extract structured information from project documents using AI.
    
    This endpoint:
    1. Ensures embeddings exist for all documents
    2. Uses RAG to retrieve relevant context
    3. Calls GPT-4 to extract structured information
    4. Saves the extraction result to the project
    
    Requires authentication.
    
    Note: This operation may take 30-60 seconds depending on document size.
    """
    # Verify project exists and belongs to user
    project = get_project_by_id(db, project_id, current_user.id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    try:
        # Perform extraction
        extraction_result = extract_project_information(db, project_id, current_user.id)
        
        return {
            "message": "Extraction completed successfully",
            "extraction": extraction_result
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        print(f"Error during extraction: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Extraction failed: {str(e)}"
        )


@router.get("/extraction", response_model=Dict[str, Any])
def get_extraction(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get the extraction result for a project.
    
    If extraction hasn't been performed yet, this will trigger it.
    
    Requires authentication.
    """
    # Verify project exists and belongs to user
    project = get_project_by_id(db, project_id, current_user.id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    try:
        extraction_result = get_project_extraction(db, project_id, current_user.id)
        return extraction_result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        print(f"Error getting extraction: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get extraction: {str(e)}"
        )


@router.get("/proposal", response_model=Dict[str, Any])
def get_proposal(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get the proposal data for a project.
    
    This returns the extraction result without internal fields (risks, open_questions).
    Suitable for generating client-facing proposals.
    
    Requires authentication.
    """
    # Verify project exists and belongs to user
    project = get_project_by_id(db, project_id, current_user.id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    try:
        proposal_data = get_proposal_data(db, project_id, current_user.id)
        return proposal_data
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        print(f"Error getting proposal: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get proposal: {str(e)}"
        )

# Made with Bob
