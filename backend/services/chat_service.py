from sqlalchemy.orm import Session
from models.chat import ChatHistory
from models.project import Project
from models.document import Document
from services.embedding_service import search_similar_chunks
from openai import OpenAI
from config import get_settings
import logging

logger = logging.getLogger(__name__)

settings = get_settings()
client = OpenAI(
    api_key=settings.openai_api_key,
    base_url=settings.openai_base_url
)

def create_chat_message(
    db: Session,
    project_id: int,
    user_id: int,
    user_message: str
) -> ChatHistory:
    """
    Create a chat message with AI response using RAG.
    
    Args:
        db: Database session
        project_id: Project ID
        user_id: User ID (for authorization)
        user_message: User's question
        
    Returns:
        ChatHistory object with user message and AI response
    """
    # Verify project ownership
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == user_id
    ).first()
    
    if not project:
        raise ValueError("Project not found or access denied")
    
    # Retrieve relevant context using RAG
    relevant_chunks = search_similar_chunks(
        db=db,
        project_id=project_id,
        query_text=user_message,
        limit=5
    )
    
    # Build context from retrieved chunks
    # Get document info for each chunk
    context_parts = []
    for chunk in relevant_chunks:
        # Get document filename
        document = db.query(Document).filter(Document.id == chunk.document_id).first()
        filename = document.filename if document else "Unknown"
        context_parts.append(f"[Document: {filename}]\n{chunk.chunk_text}")
    
    context = "\n\n".join(context_parts)
    
    # Get extraction result if available
    extraction_context = ""
    if project.extraction_result:
        extraction_context = f"\n\nProject Extraction Summary:\n{str(project.extraction_result)}"
    
    # Generate AI response using GPT-4
    system_prompt = """You are an AI assistant helping users understand their project documents.

Your role:
- Answer questions based on the provided document context
- Be concise and accurate
- If the context doesn't contain enough information, say so clearly
- Reference specific documents when relevant
- Help users understand their project better

Guidelines:
- Keep responses focused and practical
- Use bullet points for clarity when appropriate
- Cite document names when referencing specific information
- If asked about something not in the context, acknowledge the limitation"""

    user_prompt = f"""Context from project documents:
{context}
{extraction_context}

User Question: {user_message}

Please provide a helpful answer based on the context above."""

    try:
        response = client.chat.completions.create(
            model=settings.openai_model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            max_tokens=1000
        )
        
        ai_response = response.choices[0].message.content
        
    except Exception as e:
        logger.error(f"Error generating AI response: {str(e)}")
        ai_response = "I apologize, but I encountered an error generating a response. Please try again."
    
    # Save chat history
    chat_entry = ChatHistory(
        project_id=project_id,
        user_message=user_message,
        ai_response=ai_response
    )
    
    db.add(chat_entry)
    db.commit()
    db.refresh(chat_entry)
    
    return chat_entry


def get_chat_history(
    db: Session,
    project_id: int,
    user_id: int,
    limit: int = 50
) -> list[ChatHistory]:
    """
    Get chat history for a project.
    
    Args:
        db: Database session
        project_id: Project ID
        user_id: User ID (for authorization)
        limit: Maximum number of messages to return
        
    Returns:
        List of ChatHistory objects
    """
    # Verify project ownership
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == user_id
    ).first()
    
    if not project:
        raise ValueError("Project not found or access denied")
    
    # Get chat history ordered by creation time
    chat_history = db.query(ChatHistory).filter(
        ChatHistory.project_id == project_id
    ).order_by(
        ChatHistory.created_at.asc()
    ).limit(limit).all()
    
    return chat_history


def delete_chat_history(
    db: Session,
    project_id: int,
    user_id: int
) -> bool:
    """
    Delete all chat history for a project.
    
    Args:
        db: Database session
        project_id: Project ID
        user_id: User ID (for authorization)
        
    Returns:
        True if successful
    """
    # Verify project ownership
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == user_id
    ).first()
    
    if not project:
        raise ValueError("Project not found or access denied")
    
    # Delete all chat history
    db.query(ChatHistory).filter(
        ChatHistory.project_id == project_id
    ).delete()
    
    db.commit()
    return True

# Made with Bob
