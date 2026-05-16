from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from utils.dependencies import get_current_user
from models.user import User
from services.chat_service import (
    create_chat_message,
    get_chat_history,
    delete_chat_history
)
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/projects/{project_id}/chat", tags=["chat"])


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    id: int
    user_message: str
    ai_response: str
    created_at: str
    
    class Config:
        from_attributes = True


@router.post("", response_model=ChatResponse, status_code=status.HTTP_201_CREATED)
async def send_chat_message(
    project_id: int,
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Send a chat message and get AI response using RAG.
    
    The AI will:
    - Search for relevant document chunks using vector similarity
    - Use the project's extraction result as additional context
    - Generate a contextual response using GPT-4
    - Store the conversation in chat history
    
    Example request:
    ```json
    {
        "message": "What are the main features of this project?"
    }
    ```
    """
    try:
        chat_entry = create_chat_message(
            db=db,
            project_id=project_id,
            user_id=current_user.id,
            user_message=request.message
        )
        
        return ChatResponse(
            id=chat_entry.id,
            user_message=chat_entry.user_message,
            ai_response=chat_entry.ai_response,
            created_at=chat_entry.created_at.isoformat()
        )
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error in chat: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process chat message"
        )


@router.get("", response_model=list[ChatResponse])
async def get_project_chat_history(
    project_id: int,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get chat history for a project.
    
    Returns up to `limit` messages ordered by creation time (oldest first).
    
    Query parameters:
    - limit: Maximum number of messages to return (default: 50, max: 100)
    """
    try:
        # Limit maximum to 100 messages
        limit = min(limit, 100)
        
        chat_history = get_chat_history(
            db=db,
            project_id=project_id,
            user_id=current_user.id,
            limit=limit
        )
        
        return [
            ChatResponse(
                id=chat.id,
                user_message=chat.user_message,
                ai_response=chat.ai_response,
                created_at=chat.created_at.isoformat()
            )
            for chat in chat_history
        ]
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error getting chat history: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve chat history"
        )


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
async def clear_chat_history(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete all chat history for a project.
    
    This action cannot be undone.
    """
    try:
        delete_chat_history(
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
        logger.error(f"Error deleting chat history: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete chat history"
        )

# Made with Bob
