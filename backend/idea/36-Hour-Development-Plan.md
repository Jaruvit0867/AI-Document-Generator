# 36-Hour Development Plan
## AI-Assisted Document Generator MVP

---
## Backend (18 hours)

### Phase 1: Core Infrastructure (6 hours)
**Priority: CRITICAL - Must complete first**

- **Step 1: Setup Project & Database (2 hours)**
  - Initialize Node.js/Python backend project
  - Setup PostgreSQL with pgvector extension
  - Create database schema: users, projects, documents, chat_history, vector_embeddings
  - Configure environment variables
  - **Dependencies:** None
  - **Can skip if time limited:** No

- **Step 2: Authentication System (2 hours)**
  - Implement JWT-based auth (login/register)
  - Create user table and auth endpoints
  - Simple password hashing (bcrypt)
  - **Dependencies:** Database setup
  - **Can skip if time limited:** Use hardcoded token for demo

- **Step 3: Project CRUD API (2 hours)**
  - Create endpoints: POST /projects, GET /projects, GET /projects/:id, DELETE /projects/:id
  - Basic project metadata storage (name, description, created_at)
  - **Dependencies:** Auth system
  - **Can skip if time limited:** No - core feature

### Phase 2: Document Processing Pipeline (7 hours)
**Priority: HIGH - Core functionality**

- **Step 4: File Upload & Text Extraction (2 hours)**
  - Implement file upload endpoint (POST /projects/:id/documents)
  - Support .txt, .docx, .pdf formats
  - Extract text content using libraries (python-docx, PyPDF2, or similar)
  - Store raw text in documents table
  - **Dependencies:** Project CRUD
  - **Can skip if time limited:** Only support .txt files

- **Step 5: Text Chunking & Embedding (2.5 hours)**
  - Implement chunking strategy (500-1000 tokens per chunk with 100 token overlap)
  - Generate embeddings using OpenAI API (text-embedding-3-small)
  - Store chunks with embeddings in vector_embeddings table
  - **Dependencies:** Document upload
  - **Can skip if time limited:** Use simpler chunking (fixed 500 chars)

- **Step 6: LLM Extraction Pipeline (2.5 hours)**
  - Create endpoint: POST /projects/:id/extract
  - Implement RAG retrieval to get relevant chunks
  - Use GPT-4 with structured output to generate the fixed JSON format
  - Store extraction result in projects table
  - **Dependencies:** Embeddings ready
  - **Can skip if time limited:** No - core feature

### Phase 3: Interactive Features (5 hours)
**Priority: MEDIUM - Demo enhancement**

- **Step 7: AI Chat with RAG (3 hours)**
  - Create endpoint: POST /projects/:id/chat
  - Implement vector similarity search for context retrieval
  - Generate AI responses using retrieved context
  - Store chat history in chat_history table
  - **Dependencies:** Embeddings and extraction
  - **Can skip if time limited:** Yes - focus on extraction only

- **Step 8: Proposal Export (2 hours)**
  - Create endpoint: GET /projects/:id/proposal
  - Filter out "risks" and "open_questions" from extraction JSON
  - Return cleaned JSON for frontend rendering
  - **Dependencies:** Extraction pipeline
  - **Can skip if time limited:** Frontend can filter directly

**Backend Time Allocation:**
- Critical: 10 hours
- High: 7 hours
- Medium: 5 hours (can be skipped)
- Buffer: 1 hour for debugging

---

## Frontend (14 hours)

### Phase 1: Core Pages & Navigation (5 hours)
**Priority: CRITICAL - Must complete first**

- **Step 1: Project Setup & Auth Pages (2 hours)**
  - Initialize React/Vue project with routing
  - Create Login page (simple form with JWT storage)
  - Create Register page
  - Setup axios/fetch for API calls
  - **Dependencies:** Backend auth endpoints
  - **Can skip if time limited:** Skip register, use hardcoded login

- **Step 2: Dashboard & Project List (1.5 hours)**
  - Create Projects Dashboard page
  - Display project cards with name, date
  - Add "Create Project" button
  - **Dependencies:** Backend project API
  - **Can skip if time limited:** No

- **Step 3: Create Project Modal (1.5 hours)**
  - Build modal/form for project creation
  - Input: project name, description
  - Handle API call and redirect to workspace
  - **Dependencies:** Project list page
  - **Can skip if time limited:** No

### Phase 2: Project Workspace (6 hours)
**Priority: HIGH - Core functionality**

- **Step 4: Document Upload Interface (2 hours)**
  - Create file upload component (drag-drop or file picker)
  - Support multiple file uploads
  - Show upload progress and file list
  - Display uploaded documents
  - **Dependencies:** Backend upload endpoint
  - **Can skip if time limited:** Single file upload only

- **Step 5: Extraction Trigger & Display (2.5 hours)**
  - Add "Generate Extraction" button
  - Show loading state during processing
  - Display structured output in organized sections
  - Format JSON data into readable UI (cards/accordions)
  - **Dependencies:** Backend extraction endpoint
  - **Can skip if time limited:** No - core feature

- **Step 6: Proposal Preview (1.5 hours)**
  - Create proposal preview page/modal
  - Render extraction data in document-like format
  - Hide risks and open_questions sections
  - **Dependencies:** Extraction display
  - **Can skip if time limited:** Use extraction view as proposal

### Phase 3: Interactive Features (5 hours)
**Priority: MEDIUM - Demo enhancement**

- **Step 7: AI Chat with RAG (3 hours)**
  - Create endpoint: POST /projects/:id/chat
  - Implement vector similarity search for context retrieval
  - Generate AI responses using retrieved context
  - Store chat history in chat_history table
  - **Dependencies:** Embeddings and extraction
  - **Can skip if time limited:** Yes - focus on extraction only

- **Step 8: Chart / Diagram Generator (2.5 hours)**
  - Generate project diagrams from extraction JSON
  - Use Mermaid syntax for fast implementation and frontend rendering
  - Supported MVP diagrams:
    - System Architecture Diagram
    - User Flow Diagram
    - Development Workflow Diagram
    - ERD / Data Model Diagram
  - Create endpoint: POST /projects/:id/diagrams/generate
  - Create endpoint: GET /projects/:id/diagrams
  - Store diagram type, title, Mermaid content, and created_at
  - **Dependencies:** Extraction pipeline
  - **Can skip if time limited:** Generate only 1 architecture diagram

- **Step 9: Proposal Export (2 hours)**
  - Create endpoint: GET /projects/:id/proposal
  - Include generated diagrams in proposal output
  - Filter out "risks" and "open_questions" from extraction JSON
  - Return cleaned JSON for frontend rendering
  - **Dependencies:** Extraction pipeline and diagram generator
  - **Can skip if time limited:** Frontend can filter directly

**Frontend Time Allocation:**
- Critical: 5 hours
- High: 6 hours
- Low: 3 hours (can be skipped)
- Buffer: 0 hours

---

## Testing (4 hours)

### Phase 1: Functional Testing (2 hours)
**Priority: HIGH - Validate core flow**

- **Step 1: End-to-End Flow Testing (1.5 hours)**
  - Test complete user journey: login → create project → upload docs → generate extraction → view proposal
  - Verify all API endpoints work correctly
  - Check data persistence across sessions
  - **Dependencies:** Backend + Frontend complete
  - **Can skip if time limited:** No - needed for demo

- **Step 2: Error Handling Validation (0.5 hours)**
  - Test file upload failures
  - Test invalid login credentials
  - Verify error messages display correctly
  - **Dependencies:** Core features working
  - **Can skip if time limited:** Yes - focus on happy path

### Phase 2: Document Quality Testing (2 hours)
**Priority: MEDIUM - Validate AI accuracy**

- **Step 3: Create Test Cases (0.5 hours)**
  - Prepare 3 test projects with different document types:
    1. Well-structured technical spec
    2. Meeting minutes (MOM)
    3. Unstructured notes/chat logs
  - **Dependencies:** None (can prepare in parallel)
  - **Can skip if time limited:** Use 1 test case only

- **Step 4: Extraction Quality Testing (1.5 hours)**
  - Upload test documents to each project
  - Generate extractions and review output quality
  - Verify JSON structure consistency
  - Check if AI identifies missing/unclear information
  - Document any hallucinations or errors
  - **Dependencies:** Test cases ready
  - **Can skip if time limited:** Quick smoke test only

**Testing Time Allocation:**
- High: 1.5 hours
- Medium: 2.5 hours (can be reduced)
- Buffer: 0 hours

---

## Critical Path Summary

### Must Complete (28 hours):
1. Backend: Database + Auth + Project CRUD + Upload + Extraction (16 hours)
2. Frontend: Auth + Dashboard + Upload UI + Extraction Display (11 hours)
3. Testing: E2E flow test (1.5 hours)

### Can Skip if Time Limited (8 hours):
- AI Chat feature (5 hours total)
- DOCX export (1 hour)
- Advanced error handling (0.5 hours)
- Detailed quality testing (1.5 hours)

### Recommended Execution Order:
1. **Hours 0-6:** Backend Phase 1 (Infrastructure)
2. **Hours 6-13:** Backend Phase 2 (Document Processing)
3. **Hours 13-18:** Frontend Phase 1 (Core Pages) + Backend Phase 3 start
4. **Hours 18-24:** Frontend Phase 2 (Workspace) + Backend Phase 3 finish
5. **Hours 24-30:** Frontend Phase 3 (if time) + Integration fixes
6. **Hours 30-34:** Testing Phase 1 & 2
7. **Hours 34-36:** Buffer for debugging and demo preparation

### Key Technical Decisions for Speed:
- Use OpenAI API instead of local models (faster, more reliable)
- PostgreSQL + pgvector (simpler than separate vector DB)
- Simple JWT auth (no OAuth complexity)
- REST API (faster than GraphQL setup)
- React/Vue with basic styling (no complex UI framework)
- Skip user management features (focus on core flow)

### Demo Preparation Checklist:
- [ ] Prepare 1-2 sample documents ready to upload
- [ ] Have test account credentials ready
- [ ] Clear, clean database state
- [ ] Stable internet connection for API calls
- [ ] Backup plan if API rate limits hit