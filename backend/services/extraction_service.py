"""
Extraction service for generating structured project proposals using RAG
"""
import json
from typing import Dict, Any
from sqlalchemy.orm import Session
from openai import OpenAI
from config import get_settings
from models.document import Document
from services.embedding_service import search_similar_chunks, create_embeddings_for_project
from services.project_service import update_project
from utils.prompts import EXTRACTION_SYSTEM_PROMPT, get_extraction_prompt

settings = get_settings()
client = OpenAI(
    api_key=settings.openai_api_key,
    base_url=settings.openai_base_url
)


def build_context_from_documents(db: Session, project_id: int, max_chunks: int = 20) -> str:
    """
    Build context from project documents using RAG.
    
    Args:
        db: Database session
        project_id: ID of the project
        max_chunks: Maximum number of chunks to include
    
    Returns:
        Combined context string
    """
    # Get all documents for the project
    documents = db.query(Document).filter(Document.project_id == project_id).all()
    
    if not documents:
        raise ValueError("No documents found for this project")
    
    # For MVP, we'll use a simple approach: combine all document content
    # In production, you might want to use more sophisticated RAG with query-based retrieval
    context_parts = []
    
    for doc in documents:
        context_parts.append(f"=== Document: {doc.filename} ===\n{doc.content}\n")
    
    context = "\n\n".join(context_parts)
    
    # Truncate if too long (GPT-4 has context limits)
    max_context_length = 100000  # characters
    if len(context) > max_context_length:
        context = context[:max_context_length] + "\n\n[Context truncated due to length...]"
    
    return context


def extract_project_information(db: Session, project_id: int, user_id: int) -> Dict[str, Any]:
    """
    Extract structured information from project documents using LLM.
    
    Args:
        db: Database session
        project_id: ID of the project
        user_id: ID of the user (for authorization)
    
    Returns:
        Extracted project information as dictionary
    """
    print(f"[EXTRACTION] Starting extraction for project {project_id}")
    
    # Ensure embeddings exist for all documents
    print("[EXTRACTION] Checking/creating embeddings...")
    embedding_count = create_embeddings_for_project(db, project_id)
    print(f"[EXTRACTION] Embeddings ready ({embedding_count} new embeddings created)")
    
    # Build context from documents
    print("[EXTRACTION] Building context from documents...")
    context = build_context_from_documents(db, project_id)
    print(f"[EXTRACTION] Context built ({len(context)} characters)")
    
    # Generate extraction using GPT-4
    print("[EXTRACTION] Calling GPT-4 for extraction...")
    try:
        response = client.chat.completions.create(
            model=settings.openai_model,
            messages=[
                {"role": "system", "content": EXTRACTION_SYSTEM_PROMPT},
                {"role": "user", "content": get_extraction_prompt(context)}
            ],
            response_format={"type": "json_object"},
            temperature=0.3,  # Lower temperature for more consistent extraction
            max_tokens=4000
        )
        
        # Parse the JSON response
        extraction_text = response.choices[0].message.content
        extraction_data = json.loads(extraction_text)
        
        print("[EXTRACTION] Successfully extracted project information")
        
        # Update project with extraction result
        update_project(
            db=db,
            project_id=project_id,
            user_id=user_id,
            extraction_result=extraction_data
        )
        
        print("[EXTRACTION] Saved extraction to project")
        
        return extraction_data
        
    except json.JSONDecodeError as e:
        print(f"[EXTRACTION ERROR] Failed to parse JSON: {e}")
        raise ValueError("Failed to parse extraction result as JSON")
    except Exception as e:
        print(f"[EXTRACTION ERROR] Extraction failed: {e}")
        raise


def get_project_extraction(db: Session, project_id: int, user_id: int) -> Dict[str, Any]:
    """
    Get extraction result for a project.
    If not yet extracted, perform extraction.
    
    Args:
        db: Database session
        project_id: ID of the project
        user_id: ID of the user
    
    Returns:
        Extraction result
    """
    from services.project_service import get_project_by_id
    
    project = get_project_by_id(db, project_id, user_id)
    if not project:
        raise ValueError("Project not found")
    
    # If extraction already exists, return it
    if project.extraction_result:
        return project.extraction_result
    
    # Otherwise, perform extraction
    return extract_project_information(db, project_id, user_id)


def get_proposal_data(db: Session, project_id: int, user_id: int) -> Dict[str, Any]:
    """
    Get proposal data (extraction without risks and open_questions).
    Includes generated diagrams if available.
    
    Args:
        db: Database session
        project_id: ID of the project
        user_id: ID of the user
    
    Returns:
        Filtered extraction result for proposal with diagrams
    """
    from models.diagram import Diagram
    
    extraction = get_project_extraction(db, project_id, user_id)
    
    # Create a copy and remove internal fields
    proposal = extraction.copy()
    proposal.pop('risks', None)
    proposal.pop('open_questions', None)
    
    # Get diagrams for the project
    diagrams = db.query(Diagram).filter(
        Diagram.project_id == project_id
    ).all()
    
    # Add diagrams to proposal
    if diagrams:
        proposal['diagrams'] = [
            {
                'id': diagram.id,
                'type': diagram.diagram_type,
                'title': diagram.title,
                'mermaid_content': diagram.mermaid_content,
                'created_at': diagram.created_at.isoformat()
            }
            for diagram in diagrams
        ]
    else:
        proposal['diagrams'] = []
    
    return proposal

# Made with Bob
