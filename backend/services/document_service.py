"""
Document service for handling file uploads and text extraction
"""
import os
import tempfile
from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import UploadFile
from models.document import Document
from utils.file_utils import extract_text_from_file, get_file_size, is_supported_file_type


def create_document(
    db: Session,
    project_id: int,
    filename: str,
    content: str,
    file_type: str,
    file_size: int
) -> Document:
    """Create a new document record"""
    document = Document(
        project_id=project_id,
        filename=filename,
        content=content,
        file_type=file_type,
        file_size=file_size
    )
    db.add(document)
    db.commit()
    db.refresh(document)
    return document


async def process_uploaded_file(
    db: Session,
    project_id: int,
    file: UploadFile
) -> Document:
    """
    Process an uploaded file: save temporarily, extract text, store in database
    
    Args:
        db: Database session
        project_id: ID of the project this document belongs to
        file: Uploaded file from FastAPI
    
    Returns:
        Created Document object
    
    Raises:
        ValueError: If file type is not supported
    """
    # Validate file type
    if not is_supported_file_type(file.filename):
        raise ValueError(f"Unsupported file type. Supported types: .txt, .docx, .pdf")
    
    # Get file extension
    _, file_extension = os.path.splitext(file.filename)
    
    # Create temporary file to save upload
    with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp_file:
        # Write uploaded content to temp file
        content = await file.read()
        temp_file.write(content)
        temp_file_path = temp_file.name
    
    try:
        # Extract text from file
        extracted_text = extract_text_from_file(temp_file_path, file_extension)
        
        # Get file size
        file_size = len(content)
        
        # Create document record
        document = create_document(
            db=db,
            project_id=project_id,
            filename=file.filename,
            content=extracted_text,
            file_type=file_extension,
            file_size=file_size
        )
        
        return document
        
    finally:
        # Clean up temporary file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)


def get_project_documents(
    db: Session,
    project_id: int,
    skip: int = 0,
    limit: int = 100
) -> List[Document]:
    """Get all documents for a project"""
    return db.query(Document).filter(
        Document.project_id == project_id
    ).order_by(Document.created_at.desc()).offset(skip).limit(limit).all()


def get_document_by_id(db: Session, document_id: int, project_id: int) -> Optional[Document]:
    """Get a document by ID, ensuring it belongs to the specified project"""
    return db.query(Document).filter(
        Document.id == document_id,
        Document.project_id == project_id
    ).first()


def delete_document(db: Session, document_id: int, project_id: int) -> bool:
    """Delete a document"""
    document = get_document_by_id(db, document_id, project_id)
    if not document:
        return False
    
    db.delete(document)
    db.commit()
    return True


def get_document_count(db: Session, project_id: int) -> int:
    """Get total number of documents for a project"""
    return db.query(Document).filter(Document.project_id == project_id).count()

# Made with Bob
