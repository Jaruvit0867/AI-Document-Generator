# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Critical Non-Obvious Information

### API Endpoint Quirks
- **MUST use trailing slash**: `POST /projects/` (not `/projects`) for list/create operations
- Backend deployed at: `https://backend-hackaton-v2.vercel.app`
- Frontend must use `NEXT_PUBLIC_API_BASE_URL` environment variable

### Backend Architecture
- Uses OpenAI-compatible API providers via `OPENAI_BASE_URL` config (not just OpenAI)
- Extraction requires JSON mode support from LLM provider
- Embedding dimension is hardcoded to 1536 in schema (must match model output)
- Database auto-initializes pgvector extension on startup via [`init_db()`](backend/database.py:31)

### Document Processing Pipeline
- Backend does NOT accept raw text directly - must upload as file
- Frontend must convert pasted text to `.txt` file in browser before upload
- Extraction can take 30-60 seconds (long-running operation)
- Must call endpoints in sequence: upload → process-embeddings → extract → diagrams → proposal

### Diagram Generation
- Outputs Mermaid syntax (NOT draw.io XML)
- Diagram types: `system_architecture`, `user_flow`, `development_workflow`, `data_model`
- Generated from extraction_result JSONB field in projects table
- Requires extraction to be completed first

### Authentication
- JWT tokens stored in localStorage (hackathon MVP approach)
- Token expires after 1440 minutes (24 hours)
- 401 responses should clear token and redirect to login

### Frontend State
- Frontend directory currently only contains `.next/` and `API_DOCUMENTATION.md`
- Needs to be built from scratch using Next.js + React + TypeScript + TailwindCSS
- No existing components or pages yet

### Database Schema
- Uses PostgreSQL with pgvector extension
- `extraction_result` stored as JSONB in projects table
- Schema must be run manually: `psql -d doc_generator_db -f schema.sql`
- Tables: users, projects, documents, embeddings, chat_history, diagrams

### Chat Feature
- Requires documents to be uploaded and embeddings processed first
- Uses RAG (Retrieval Augmented Generation) with vector similarity search
- Chat history stored per project in database

## Commands

### Backend
```bash
# Run backend
cd backend
python main.py
# or
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Setup database
psql -U postgres -d doc_generator_db -f schema.sql
```

### Frontend (to be created)
```bash
# Will need Next.js setup
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (.env)
- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - JWT secret (generate with `python generate_secret_key.py`)
- `OPENAI_API_KEY` - API key for LLM provider
- `OPENAI_BASE_URL` - API endpoint (default: https://api.openai.com/v1)
- `OPENAI_MODEL` - Chat model name (default: gpt-4)
- `OPENAI_EMBEDDING_MODEL` - Embedding model (default: text-embedding-3-small)

### Frontend (.env.local - to be created)
- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL (default: https://backend-hackaton-v2.vercel.app)