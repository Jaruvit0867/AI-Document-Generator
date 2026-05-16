"""
Text processing utilities for chunking and preparation
"""
from typing import List


def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
    """
    Split text into overlapping chunks.
    
    For MVP, we use simple character-based chunking.
    In production, you might want to use token-based chunking or semantic chunking.
    
    Args:
        text: Text to chunk
        chunk_size: Size of each chunk in characters
        overlap: Number of overlapping characters between chunks
    
    Returns:
        List of text chunks
    """
    if not text or len(text) == 0:
        return []
    
    chunks = []
    start = 0
    text_length = len(text)
    
    while start < text_length:
        # Get chunk
        end = start + chunk_size
        chunk = text[start:end]
        
        # Only add non-empty chunks
        if chunk.strip():
            chunks.append(chunk.strip())
        
        # Move to next chunk with overlap
        start = end - overlap
        
        # Prevent infinite loop if overlap >= chunk_size
        if overlap >= chunk_size:
            start = end
    
    return chunks


def clean_text(text: str) -> str:
    """
    Clean and normalize text.
    
    Args:
        text: Text to clean
    
    Returns:
        Cleaned text
    """
    # Remove excessive whitespace
    text = ' '.join(text.split())
    
    # Remove null bytes
    text = text.replace('\x00', '')
    
    return text.strip()


def prepare_text_for_embedding(text: str) -> str:
    """
    Prepare text for embedding generation.
    
    Args:
        text: Text to prepare
    
    Returns:
        Prepared text
    """
    # Clean the text
    text = clean_text(text)
    
    # Truncate if too long (OpenAI has token limits)
    # For text-embedding-3-small, max is 8191 tokens
    # Roughly 1 token = 4 characters, so ~32000 characters
    max_chars = 30000
    if len(text) > max_chars:
        text = text[:max_chars]
    
    return text

# Made with Bob
