from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from datetime import datetime
from database import get_db
from utils.dependencies import get_current_user
from models.user import User
from services.document_service import (
    process_uploaded_file,
    get_project_documents,
    get_document_by_id,
    delete_document,
    get_document_count
)
from services.project_service import get_project_by_id

router = APIRouter(prefix="/projects/{project_id}/documents", tags=["Documents"])


# Pydantic schemas
class DocumentResponse(BaseModel):
    """Schema for document response"""
    id: int
    project_id: int
    filename: str
    content: str
    file_type: str
    file_size: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class DocumentListResponse(BaseModel):
    """Schema for document list response"""
    total: int
    documents: List[DocumentResponse]


@router.post("/upload", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    project_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Upload a document to a project.
    
    Requires authentication.
    Supported file types: .txt, .docx, .pdf
    
    - **file**: File to upload
    """
    # Verify project exists and belongs to user
    project = get_project_by_id(db, project_id, current_user.id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    try:
        # Process uploaded file
        document = await process_uploaded_file(db, project_id, file)
        return document
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        print(f"Error processing file: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process file"
        )


@router.get("/", response_model=DocumentListResponse)
def list_documents(
    project_id: int,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all documents for a project.
    
    Requires authentication.
    
    - **skip**: Number of documents to skip (pagination)
    - **limit**: Maximum number of documents to return
    """
    # Verify project exists and belongs to user
    project = get_project_by_id(db, project_id, current_user.id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    documents = get_project_documents(db, project_id, skip, limit)
    total = get_document_count(db, project_id)
    
    return {
        "total": total,
        "documents": documents
    }


@router.get("/{document_id}", response_model=DocumentResponse)
def get_document(
    project_id: int,
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific document by ID.
    
    Requires authentication.
    """
    # Verify project exists and belongs to user
    project = get_project_by_id(db, project_id, current_user.id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    document = get_document_by_id(db, document_id, project_id)
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    return document


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_document(
    project_id: int,
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a document.
    
    Requires authentication.
    """
    # Verify project exists and belongs to user
    project = get_project_by_id(db, project_id, current_user.id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    success = delete_document(db, document_id, project_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    return None

# Made with Bob
