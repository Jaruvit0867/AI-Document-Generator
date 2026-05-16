"""
Embedding service for generating and managing vector embeddings
"""
from typing import List
from sqlalchemy.orm import Session
from openai import OpenAI
from config import get_settings
from models.embedding import Embedding
from models.document import Document
from utils.text_utils import chunk_text, prepare_text_for_embedding

settings = get_settings()
client = OpenAI(
    api_key=settings.openai_api_key,
    base_url=settings.openai_base_url
)


def generate_embedding(text: str) -> List[float]:
    """
    Generate embedding vector for text using OpenAI API.
    
    Args:
        text: Text to generate embedding for
    
    Returns:
        Embedding vector (list of floats)
    """
    # Prepare text
    prepared_text = prepare_text_for_embedding(text)
    
    # Generate embedding using OpenAI
    response = client.embeddings.create(
        model=settings.openai_embedding_model,
        input=prepared_text
    )
    
    return response.data[0].embedding


def create_embeddings_for_document(db: Session, document_id: int) -> List[Embedding]:
    """
    Create embeddings for all chunks of a document.
    
    Args:
        db: Database session
        document_id: ID of the document to process
    
    Returns:
        List of created Embedding objects
    """
    # Get document
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise ValueError(f"Document {document_id} not found")
    
    # Chunk the document content
    chunks = chunk_text(document.content, chunk_size=500, overlap=50)
    
    print(f"[EMBEDDING] Processing {len(chunks)} chunks for document {document_id}")
    
    embeddings = []
    for index, chunk in enumerate(chunks):
        try:
            # Generate embedding
            embedding_vector = generate_embedding(chunk)
            
            # Create embedding record
            embedding = Embedding(
                document_id=document_id,
                chunk_text=chunk,
                chunk_index=index,
                embedding=embedding_vector
            )
            db.add(embedding)
            embeddings.append(embedding)
            
            print(f"[EMBEDDING] Created embedding {index + 1}/{len(chunks)}")
            
        except Exception as e:
            print(f"[EMBEDDING ERROR] Failed to create embedding for chunk {index}: {e}")
            # Continue with other chunks even if one fails
            continue
    
    db.commit()
    print(f"[EMBEDDING] Successfully created {len(embeddings)} embeddings")
    
    return embeddings


def create_embeddings_for_project(db: Session, project_id: int) -> int:
    """
    Create embeddings for all documents in a project.
    
    Args:
        db: Database session
        project_id: ID of the project
    
    Returns:
        Number of embeddings created
    """
    # Get all documents for the project
    documents = db.query(Document).filter(Document.project_id == project_id).all()
    
    total_embeddings = 0
    for document in documents:
        # Check if embeddings already exist
        existing_count = db.query(Embedding).filter(
            Embedding.document_id == document.id
        ).count()
        
        if existing_count > 0:
            print(f"[EMBEDDING] Document {document.id} already has {existing_count} embeddings, skipping")
            continue
        
        # Create embeddings
        embeddings = create_embeddings_for_document(db, document.id)
        total_embeddings += len(embeddings)
    
    return total_embeddings


def get_document_embeddings(db: Session, document_id: int) -> List[Embedding]:
    """Get all embeddings for a document"""
    return db.query(Embedding).filter(
        Embedding.document_id == document_id
    ).order_by(Embedding.chunk_index).all()


def search_similar_chunks(
    db: Session,
    project_id: int,
    query_text: str,
    limit: int = 5
) -> List[Embedding]:
    """
    Search for similar chunks using vector similarity.
    
    Args:
        db: Database session
        project_id: ID of the project to search in
        query_text: Text to search for
        limit: Maximum number of results
    
    Returns:
        List of similar embeddings ordered by similarity
    """
    # Generate embedding for query
    query_embedding = generate_embedding(query_text)
    
    # Get all document IDs for the project
    document_ids = db.query(Document.id).filter(
        Document.project_id == project_id
    ).all()
    document_ids = [doc_id[0] for doc_id in document_ids]
    
    if not document_ids:
        return []
    
    # Search for similar embeddings using cosine similarity
    # pgvector uses <=> operator for cosine distance (lower is more similar)
    results = db.query(Embedding).filter(
        Embedding.document_id.in_(document_ids)
    ).order_by(
        Embedding.embedding.cosine_distance(query_embedding)
    ).limit(limit).all()
    
    return results


def delete_document_embeddings(db: Session, document_id: int) -> int:
    """
    Delete all embeddings for a document.
    
    Args:
        db: Database session
        document_id: ID of the document
    
    Returns:
        Number of embeddings deleted
    """
    count = db.query(Embedding).filter(
        Embedding.document_id == document_id
    ).delete()
    db.commit()
    return count

# Made with Bob
