# 36-Hour Development Plan
## AI-Assisted Document Generator MVP

---
## Backend (18 hours)

### Phase 1: Core Infrastructure (6 hours)
**Priority: CRITICAL - Must complete first**

- **Step 1: Setup Project & Database (2 hours)** ✅ COMPLETED
  - ✅ Initialize Python FastAPI backend project
  - ✅ Setup PostgreSQL with pgvector extension
  - ✅ Create database schema: users, projects, documents, chat_history, vector_embeddings
  - ✅ Configure environment variables
  - **Dependencies:** None
  - **Can skip if time limited:** No
  - **Files Created:**
    - `backend/main.py` - FastAPI application with health check endpoints
    - `backend/requirements.txt` - All Python dependencies
    - `backend/.env.example` - Environment variables template
    - `backend/config.py` - Configuration management
    - `backend/database.py` - Database connection with pgvector support
    - `backend/models/__init__.py` - Models package
    - `backend/routes/__init__.py` - Routes package
    - `backend/services/__init__.py` - Services package
    - `backend/utils/__init__.py` - Utils package
    - `backend/README.md` - Setup instructions
    - `backend/.gitignore` - Git ignore file

- **Step 2: Authentication System (2 hours)** ✅ COMPLETED
  - ✅ Implement JWT-based auth (login/register)
  - ✅ Create user table and auth endpoints
  - ✅ Simple password hashing (bcrypt)
  - **Dependencies:** Database setup
  - **Can skip if time limited:** Use hardcoded token for demo
  - **Files Created:**
    - `backend/models/user.py` - User database model
    - `backend/services/auth_service.py` - Password hashing, JWT token creation/verification, user authentication
    - `backend/routes/auth.py` - Auth endpoints (POST /auth/register, POST /auth/login, GET /auth/me)
    - `backend/utils/dependencies.py` - JWT token validation dependency for protected routes
    - `backend/main.py` - Updated to include auth routes

- **Step 3: Project CRUD API (2 hours)** ✅ COMPLETED
  - ✅ Create endpoints: POST /projects, GET /projects, GET /projects/:id, PUT /projects/:id, DELETE /projects/:id
  - ✅ Basic project metadata storage (name, description, created_at, extraction_result)
  - ✅ Authentication-protected routes
  - **Dependencies:** Auth system
  - **Can skip if time limited:** No - core feature
  - **Files Created:**
    - `backend/models/project.py` - Project database model with relationships
    - `backend/services/project_service.py` - Project CRUD operations
    - `backend/routes/projects.py` - Project endpoints (POST, GET, PUT, DELETE)
    - `backend/main.py` - Updated to include project routes
    - `backend/schema.sql` - Complete database schema for all tables

### Phase 2: Document Processing Pipeline (7 hours)
**Priority: HIGH - Core functionality**

- **Step 4: File Upload & Text Extraction (2 hours)** ✅ COMPLETED
  - ✅ Implement file upload endpoint (POST /projects/:id/documents/upload)
  - ✅ Support .txt, .docx, .pdf formats
  - ✅ Extract text content using libraries (python-docx, PyPDF2)
  - ✅ Store raw text in documents table
  - **Dependencies:** Project CRUD
  - **Can skip if time limited:** Only support .txt files
  - **Files Created:**
    - `backend/models/document.py` - Document database model
    - `backend/utils/file_utils.py` - Text extraction utilities for .txt, .docx, .pdf
    - `backend/services/document_service.py` - Document upload and management logic
    - `backend/routes/documents.py` - Document endpoints (POST upload, GET list, GET by ID, DELETE)
    - `backend/main.py` - Updated to include document routes

- **Step 5: Text Chunking & Embedding (2.5 hours)** ✅ COMPLETED
  - ✅ Implement chunking strategy (500 chars per chunk with 50 char overlap)
  - ✅ Generate embeddings using OpenAI API (text-embedding-3-small)
  - ✅ Store chunks with embeddings in embeddings table with pgvector
  - **Dependencies:** Document upload
  - **Can skip if time limited:** Use simpler chunking (fixed 500 chars)
  - **Files Created:**
    - `backend/models/embedding.py` - Embedding model with pgvector support
    - `backend/utils/text_utils.py` - Text chunking and cleaning utilities
    - `backend/services/embedding_service.py` - Embedding generation and vector search
    - `backend/routes/extraction.py` - POST /projects/{id}/process-embeddings endpoint

- **Step 6: LLM Extraction Pipeline (2.5 hours)** ✅ COMPLETED
  - ✅ Create endpoint: POST /projects/{id}/extract
  - ✅ Implement RAG retrieval to get relevant chunks
  - ✅ Use GPT-4 with structured output to generate the fixed JSON format
  - ✅ Store extraction result in projects table
  - **Dependencies:** Embeddings ready
  - **Can skip if time limited:** No - core feature
  - **Files Created:**
    - `backend/utils/prompts.py` - System prompts for LLM extraction
    - `backend/services/extraction_service.py` - RAG-based extraction logic
    - `backend/routes/extraction.py` - Extraction endpoints (POST extract, GET extraction, GET proposal)
    - `backend/main.py` - Updated to include extraction routes
  - **Can skip if time limited:** No - core feature

### Phase 3: Interactive Features (5 hours)
**Priority: MEDIUM - Demo enhancement**

- **Step 7: AI Chat with RAG (3 hours)** ✅ COMPLETED
  - ✅ Create endpoint: POST /projects/:id/chat
  - ✅ Implement vector similarity search for context retrieval
  - ✅ Generate AI responses using retrieved context
  - ✅ Store chat history in chat_history table
  - **Dependencies:** Embeddings and extraction
  - **Can skip if time limited:** Yes - focus on extraction only
  - **Files Created:**
    - `backend/models/chat.py` - ChatHistory database model
    - `backend/services/chat_service.py` - Chat logic with RAG (vector search + GPT-4)
    - `backend/routes/chat.py` - Chat endpoints (POST chat, GET history, DELETE history)
    - `backend/main.py` - Updated to include chat routes
    - `backend/API_DOCUMENTATION.md` - Updated with chat endpoints documentation

- **Step 8: Chart / Diagram Generator (2.5 hours)** ✅ COMPLETED
  - ✅ Generate project diagrams from extraction JSON
  - ✅ Use Mermaid syntax for fast implementation and frontend rendering
  - ✅ Supported MVP diagrams:
    - System Architecture Diagram
    - User Flow Diagram
    - Development Workflow Diagram
    - ERD / Data Model Diagram
  - ✅ Create endpoint: POST /projects/:id/diagrams/generate
  - ✅ Create endpoint: GET /projects/:id/diagrams
  - ✅ Store diagram type, title, Mermaid content, and created_at
  - **Dependencies:** Extraction pipeline
  - **Files Created:**
    - `backend/models/diagram.py` - Diagram database model
    - `backend/services/diagram_service.py` - Mermaid diagram generation logic (4 diagram types)
    - `backend/routes/diagrams.py` - Diagram endpoints (POST generate, GET list, GET by ID, DELETE)
    - `backend/schema.sql` - Added diagrams table
    - `backend/main.py` - Updated to include diagram routes

- **Step 9: Proposal Export (2 hours)** ✅ COMPLETED
  - ✅ Create endpoint: GET /projects/:id/proposal
  - ✅ Include generated diagrams in proposal output
  - ✅ Filter out "risks" and "open_questions" from extraction JSON
  - ✅ Return cleaned JSON for frontend rendering
  - **Dependencies:** Extraction pipeline and diagram generator
  - **Can skip if time limited:** Frontend can filter directly
  - **Files Modified:**
    - `backend/services/extraction_service.py` - Updated `get_proposal_data()` to include diagrams
    - `backend/routes/extraction.py` - Proposal endpoint already exists (GET /projects/{id}/proposal)

---