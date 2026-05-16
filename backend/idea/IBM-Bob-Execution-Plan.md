# IBM Bob Step-by-Step Execution Plan
## AI-Assisted Document Generator MVP

---

## Backend Execution Steps

### Step 1: Initialize Backend Project Structure
**Goal:** Create a Python FastAPI backend project with proper folder structure

**Instruction for IBM Bob:**
Create a new Python FastAPI project in a `backend/` directory. Set up the following structure:
- `backend/main.py` - FastAPI application entry point
- `backend/requirements.txt` - Python dependencies
- `backend/.env.example` - Environment variables template
- `backend/config.py` - Configuration management
- `backend/database.py` - Database connection setup
- `backend/models/` - Database models directory
- `backend/routes/` - API routes directory
- `backend/services/` - Business logic directory
- `backend/utils/` - Utility functions directory

Include these dependencies in requirements.txt:
- fastapi
- uvicorn
- sqlalchemy
- psycopg2-binary
- pgvector
- python-jose[cryptography]
- passlib[bcrypt]
- python-multipart
- openai
- python-docx
- PyPDF2
- python-dotenv

**Expected Output:**
- Complete backend folder structure
- requirements.txt with all dependencies
- Basic FastAPI app in main.py with health check endpoint
- .env.example with placeholders for DATABASE_URL, SECRET_KEY, OPENAI_API_KEY

**Files/Modules:**
- `backend/main.py`
- `backend/requirements.txt`
- `backend/.env.example`
- `backend/config.py`
- `backend/database.py`

**Dependency:** None

---

### Step 2: Setup Database Models
**Goal:** Create SQLAlchemy models for users, projects, documents, embeddings, and chat history

**Instruction for IBM Bob:**
Create database models in `backend/models/` directory:

1. `backend/models/user.py` - User model with fields: id, email, hashed_password, created_at
2. `backend/models/project.py` - Project model with fields: id, user_id, name, description, extraction_result (JSON), created_at
3. `backend/models/document.py` - Document model with fields: id, project_id, filename, content (text), created_at
4. `backend/models/embedding.py` - Embedding model with fields: id, document_id, chunk_text, embedding (vector), chunk_index
5. `backend/models/chat.py` - Chat model with fields: id, project_id, user_message, ai_response, created_at

Setup PostgreSQL connection in `backend/database.py` with pgvector extension enabled.

**Expected Output:**
- 5 model files in backend/models/
- Database connection setup with pgvector support
- Alembic migration files (optional for MVP)

**Files/Modules:**
- `backend/models/user.py`
- `backend/models/project.py`
- `backend/models/document.py`
- `backend/models/embedding.py`
- `backend/models/chat.py`
- `backend/database.py` (updated)

**Dependency:** Step 1 completed

---

### Step 3: Implement Authentication System
**Goal:** Create JWT-based authentication with login and register endpoints

**Instruction for IBM Bob:**
Create authentication system:

1. `backend/services/auth_service.py` - Functions for password hashing, JWT token creation/verification
2. `backend/routes/auth.py` - API endpoints:
   - POST /auth/register - Create new user
   - POST /auth/login - Login and return JWT token
3. `backend/utils/dependencies.py` - JWT token validation dependency for protected routes

Use simple JWT with 24-hour expiration. Store tokens in Authorization header as Bearer token.

**Expected Output:**
- Working register endpoint that creates users
- Working login endpoint that returns JWT token
- Token validation dependency for protecting routes
- Password hashing with bcrypt

**Files/Modules:**
- `backend/services/auth_service.py`
- `backend/routes/auth.py`
- `backend/utils/dependencies.py`
- `backend/main.py` (updated to include auth routes)

**Dependency:** Step 2 completed

---

### Step 4: Implement Project CRUD Operations
**Goal:** Create API endpoints for managing projects

**Instruction for IBM Bob:**
Create project management endpoints in `backend/routes/projects.py`:

- POST /projects - Create new project (requires auth)
- GET /projects - List all user's projects (requires auth)
- GET /projects/{project_id} - Get single project details (requires auth)
- DELETE /projects/{project_id} - Delete project (requires auth)

Each endpoint should validate user ownership and return appropriate error messages.

**Expected Output:**
- 4 working project endpoints
- Proper authentication checks
- JSON responses with project data
- Error handling for not found/unauthorized

**Files/Modules:**
- `backend/routes/projects.py`
- `backend/services/project_service.py`
- `backend/main.py` (updated to include project routes)

**Dependency:** Step 3 completed

---

### Step 5: Implement File Upload and Text Extraction
**Goal:** Create endpoint to upload documents and extract text content

**Instruction for IBM Bob:**
Create document upload system:

1. `backend/routes/documents.py` - POST /projects/{project_id}/documents endpoint
2. `backend/services/document_service.py` - Functions to:
   - Handle file upload (accept .txt, .docx, .pdf)
   - Extract text from different file formats
   - Store document in database
   - Return document metadata

Support multiple file uploads in single request. Extract text using python-docx for .docx and PyPDF2 for .pdf files.

**Expected Output:**
- Working file upload endpoint
- Text extraction from .txt, .docx, .pdf files
- Documents stored in database with extracted content
- File metadata returned in response

**Files/Modules:**
- `backend/routes/documents.py`
- `backend/services/document_service.py`
- `backend/utils/file_utils.py`
- `backend/main.py` (updated to include document routes)

**Dependency:** Step 4 completed

---

### Step 6: Implement Text Chunking and Embedding Generation
**Goal:** Process uploaded documents into chunks and generate embeddings

**Instruction for IBM Bob:**
Create embedding generation system:

1. `backend/services/embedding_service.py` - Functions to:
   - Split document text into chunks (500-1000 tokens with 100 token overlap)
   - Generate embeddings using OpenAI API (text-embedding-3-small model)
   - Store chunks with embeddings in database
   - Handle batch processing for multiple documents

2. Add POST /projects/{project_id}/process-embeddings endpoint to trigger processing

Use simple character-based chunking for MVP (500 characters per chunk, 50 character overlap).

**Expected Output:**
- Text chunking function that splits documents
- OpenAI embedding generation
- Embeddings stored in database with pgvector
- Endpoint to trigger embedding generation

**Files/Modules:**
- `backend/services/embedding_service.py`
- `backend/routes/documents.py` (updated)
- `backend/utils/text_utils.py`

**Dependency:** Step 5 completed

---

### Step 7: Implement RAG-based Extraction Pipeline
**Goal:** Create the core extraction endpoint that generates structured JSON output

**Instruction for IBM Bob:**
Create extraction pipeline:

1. `backend/services/extraction_service.py` - Functions to:
   - Retrieve relevant chunks using vector similarity search
   - Build context from retrieved chunks
   - Call OpenAI GPT-4 with structured output prompt
   - Parse and validate JSON response
   - Store extraction result in project

2. `backend/routes/extraction.py` - POST /projects/{project_id}/extract endpoint

The extraction should generate this exact JSON structure:
```json
{
  "project_overview": {
    "project_name": "",
    "problem": "",
    "proposed_solution": "",
    "target_users": []
  },
  "requirements": {
    "functional": [],
    "non_functional": []
  },
  "feature_breakdown": [],
  "user_flow": [],
  "business_process": [],
  "scope": {
    "in_scope": [],
    "out_of_scope": []
  },
  "architecture": {
    "frontend": "",
    "backend": "",
    "database": "",
    "integrations": [],
    "infrastructure": ""
  },
  "timeline": [],
  "risks": [],
  "open_questions": []
}
```

Use GPT-4 with JSON mode and provide clear system prompt explaining the extraction task.

**Expected Output:**
- Working extraction endpoint
- Vector similarity search for context retrieval
- GPT-4 integration with structured output
- Validated JSON stored in project.extraction_result
- Error handling for API failures

**Files/Modules:**
- `backend/services/extraction_service.py`
- `backend/routes/extraction.py`
- `backend/utils/prompts.py` (system prompts)
- `backend/main.py` (updated to include extraction routes)

**Dependency:** Step 6 completed

---

### Step 8: Implement Proposal Export Endpoint
**Goal:** Create endpoint to get proposal-ready JSON (without risks and open_questions)

**Instruction for IBM Bob:**
Create proposal export endpoint:

1. `backend/routes/proposal.py` - GET /projects/{project_id}/proposal endpoint
2. Filter out "risks" and "open_questions" fields from extraction_result
3. Return cleaned JSON for frontend rendering

Simple endpoint that reads project.extraction_result and removes sensitive fields.

**Expected Output:**
- Working proposal endpoint
- Filtered JSON without risks/open_questions
- Proper error handling if extraction not yet generated

**Files/Modules:**
- `backend/routes/proposal.py`
- `backend/main.py` (updated to include proposal routes)

**Dependency:** Step 7 completed

---

### Step 9: Add CORS and Final Backend Configuration
**Goal:** Configure CORS for frontend integration and finalize backend setup

**Instruction for IBM Bob:**
Update `backend/main.py`:
1. Add CORS middleware to allow frontend origin
2. Configure proper error handlers
3. Add request logging
4. Create startup script or Docker setup (optional)
5. Add README.md with setup instructions

**Expected Output:**
- CORS configured for local development
- Global error handling
- Backend ready for frontend integration
- Documentation on how to run the backend

**Files/Modules:**
- `backend/main.py` (updated)
- `backend/README.md`
- `backend/run.sh` or `backend/Dockerfile` (optional)

**Dependency:** Step 8 completed

---

## Frontend Execution Steps

### Step 10: Initialize Frontend Project
**Goal:** Create React frontend project with routing and basic structure

**Instruction for IBM Bob:**
Create a new React project in `frontend/` directory using Vite or Create React App:

1. Initialize React project with TypeScript (optional) or JavaScript
2. Install dependencies:
   - react-router-dom (routing)
   - axios (API calls)
   - tailwindcss or basic CSS (styling)
3. Setup folder structure:
   - `frontend/src/pages/` - Page components
   - `frontend/src/components/` - Reusable components
   - `frontend/src/services/` - API service functions
   - `frontend/src/utils/` - Utility functions
   - `frontend/src/context/` - Auth context
4. Create `frontend/src/services/api.js` - Axios instance with base URL and auth interceptor

**Expected Output:**
- Working React project
- Folder structure created
- Dependencies installed
- API service configured with axios

**Files/Modules:**
- `frontend/package.json`
- `frontend/src/App.jsx`
- `frontend/src/main.jsx`
- `frontend/src/services/api.js`
- `frontend/src/index.css`

**Dependency:** Backend Step 9 completed (for API integration)

---

### Step 11: Create Authentication Pages
**Goal:** Build login and register pages with JWT token management

**Instruction for IBM Bob:**
Create authentication system:

1. `frontend/src/context/AuthContext.jsx` - Auth context for managing user state and token
2. `frontend/src/pages/Login.jsx` - Login form with email/password
3. `frontend/src/pages/Register.jsx` - Register form (optional for MVP)
4. `frontend/src/services/authService.js` - API calls for login/register
5. Store JWT token in localStorage
6. Add protected route wrapper component

**Expected Output:**
- Working login page
- JWT token stored in localStorage after login
- Auth context providing user state
- Protected routes that redirect to login if not authenticated

**Files/Modules:**
- `frontend/src/context/AuthContext.jsx`
- `frontend/src/pages/Login.jsx`
- `frontend/src/pages/Register.jsx`
- `frontend/src/services/authService.js`
- `frontend/src/components/ProtectedRoute.jsx`

**Dependency:** Step 10 completed

---

### Step 12: Create Projects Dashboard
**Goal:** Build dashboard page showing list of user's projects

**Instruction for IBM Bob:**
Create projects dashboard:

1. `frontend/src/pages/Dashboard.jsx` - Main dashboard page
2. `frontend/src/components/ProjectCard.jsx` - Card component for each project
3. `frontend/src/services/projectService.js` - API calls for project CRUD
4. Display project list with name, description, created date
5. Add "Create New Project" button
6. Add click handler to navigate to project workspace

**Expected Output:**
- Dashboard page showing user's projects
- Project cards with basic info
- Create project button
- Navigation to project workspace on click

**Files/Modules:**
- `frontend/src/pages/Dashboard.jsx`
- `frontend/src/components/ProjectCard.jsx`
- `frontend/src/services/projectService.js`

**Dependency:** Step 11 completed

---

### Step 13: Create Project Creation Modal
**Goal:** Build modal/form to create new projects

**Instruction for IBM Bob:**
Create project creation UI:

1. `frontend/src/components/CreateProjectModal.jsx` - Modal with form
2. Form fields: project name (required), description (optional)
3. Handle form submission and API call
4. Close modal and refresh project list on success
5. Show error messages if creation fails

**Expected Output:**
- Working modal with form
- Project creation via API
- Success/error handling
- Dashboard updates with new project

**Files/Modules:**
- `frontend/src/components/CreateProjectModal.jsx`
- `frontend/src/pages/Dashboard.jsx` (updated)

**Dependency:** Step 12 completed

---

### Step 14: Create Project Workspace Page
**Goal:** Build main workspace page for managing a single project

**Instruction for IBM Bob:**
Create project workspace:

1. `frontend/src/pages/ProjectWorkspace.jsx` - Main workspace page
2. Display project name and description at top
3. Create tabs or sections for:
   - Documents (upload area)
   - Extraction Results (display area)
   - Proposal Preview
4. Fetch project details on page load
5. Add navigation back to dashboard

**Expected Output:**
- Workspace page with project info
- Tab/section structure for different views
- Project data loaded from API
- Back button to dashboard

**Files/Modules:**
- `frontend/src/pages/ProjectWorkspace.jsx`
- `frontend/src/App.jsx` (updated with route)

**Dependency:** Step 13 completed

---

### Step 15: Implement File Upload Interface
**Goal:** Create document upload component with file selection and upload

**Instruction for IBM Bob:**
Create file upload UI:

1. `frontend/src/components/FileUpload.jsx` - Upload component
2. Support drag-and-drop or file picker
3. Show selected files before upload
4. Display upload progress
5. `frontend/src/services/documentService.js` - API calls for document upload
6. Show list of uploaded documents after upload
7. Accept .txt, .docx, .pdf files

**Expected Output:**
- Working file upload component
- File selection UI (drag-drop or picker)
- Upload progress indicator
- List of uploaded documents
- Success/error messages

**Files/Modules:**
- `frontend/src/components/FileUpload.jsx`
- `frontend/src/services/documentService.js`
- `frontend/src/pages/ProjectWorkspace.jsx` (updated)

**Dependency:** Step 14 completed

---

### Step 16: Implement Extraction Trigger and Results Display
**Goal:** Add button to generate extraction and display structured results

**Instruction for IBM Bob:**
Create extraction UI:

1. `frontend/src/components/ExtractionResults.jsx` - Component to display extraction JSON
2. Add "Generate Extraction" button in workspace
3. Show loading spinner during extraction
4. `frontend/src/services/extractionService.js` - API call for extraction
5. Display extraction results in organized sections:
   - Project Overview
   - Requirements (Functional & Non-functional)
   - Feature Breakdown
   - Scope (In/Out)
   - Architecture
   - Timeline
   - User Flow & Business Process
6. Format arrays as lists, objects as cards
7. Handle case when extraction not yet generated

**Expected Output:**
- Generate extraction button
- Loading state during processing
- Structured display of extraction results
- Organized sections with proper formatting
- Error handling

**Files/Modules:**
- `frontend/src/components/ExtractionResults.jsx`
- `frontend/src/services/extractionService.js`
- `frontend/src/pages/ProjectWorkspace.jsx` (updated)

**Dependency:** Step 15 completed

---

### Step 17: Create Proposal Preview
**Goal:** Build proposal preview page showing filtered extraction data

**Instruction for IBM Bob:**
Create proposal preview:

1. `frontend/src/pages/ProposalPreview.jsx` - Proposal preview page
2. `frontend/src/services/proposalService.js` - API call to get proposal (filtered JSON)
3. Display proposal in document-like format
4. Hide "risks" and "open_questions" sections
5. Add print/export button (browser print for MVP)
6. Style to look like a professional document

**Expected Output:**
- Proposal preview page
- Document-like formatting
- Filtered data (no risks/open_questions)
- Print button using browser print
- Professional styling

**Files/Modules:**
- `frontend/src/pages/ProposalPreview.jsx`
- `frontend/src/services/proposalService.js`
- `frontend/src/App.jsx` (updated with route)

**Dependency:** Step 16 completed

---

### Step 18: Add Navigation and Polish UI
**Goal:** Finalize frontend with navigation, styling, and error handling

**Instruction for IBM Bob:**
Polish the frontend:

1. Add navigation bar with logo, user info, logout button
2. Improve overall styling and responsiveness
3. Add loading states for all API calls
4. Add error boundaries and error messages
5. Add empty states (no projects, no documents, etc.)
6. Test all user flows and fix any UI bugs
7. Create `frontend/README.md` with setup instructions

**Expected Output:**
- Navigation bar on all pages
- Consistent styling across app
- Loading states and error handling
- Empty states with helpful messages
- Responsive design
- Documentation

**Files/Modules:**
- `frontend/src/components/Navbar.jsx`
- `frontend/src/components/ErrorBoundary.jsx`
- `frontend/src/App.jsx` (updated)
- `frontend/src/index.css` (updated)
- `frontend/README.md`

**Dependency:** Step 17 completed

---

## Testing Execution Steps

### Step 19: Prepare Test Data
**Goal:** Create 3 test projects with different document types

**Instruction for IBM Bob:**
Create test data files:

1. Create `testing/test-data/` directory
2. Create 3 project folders:
   - `testing/test-data/project1-ecommerce/`
   - `testing/test-data/project2-crm/`
   - `testing/test-data/project3-mobile-app/`
3. For each project, create 3 documents:
   - `structured-spec.txt` - Well-structured technical specification
   - `meeting-notes.txt` - Meeting minutes (MOM format)
   - `rough-notes.txt` - Unstructured personal notes/chat logs
4. Create `testing/test-scenarios.md` - Document describing each test case

**Expected Output:**
- 3 project folders with test documents
- 9 total test documents (3 per project)
- Test scenarios documentation
- Variety of document structures (clean to messy)

**Files/Modules:**
- `testing/test-data/project1-ecommerce/structured-spec.txt`
- `testing/test-data/project1-ecommerce/meeting-notes.txt`
- `testing/test-data/project1-ecommerce/rough-notes.txt`
- `testing/test-data/project2-crm/` (same structure)
- `testing/test-data/project3-mobile-app/` (same structure)
- `testing/test-scenarios.md`

**Dependency:** Backend and Frontend completed (Steps 1-18)

---

### Step 20: Execute End-to-End Testing
**Goal:** Test complete user flow from login to proposal generation

**Instruction for IBM Bob:**
Create and execute E2E test plan:

1. Create `testing/e2e-test-checklist.md` with test steps
2. Test the following flow manually:
   - Register/Login
   - Create new project
   - Upload documents from test data
   - Trigger extraction
   - View extraction results
   - View proposal preview
   - Test with all 3 test projects
3. Document any bugs or issues found
4. Verify JSON structure consistency across all extractions
5. Check that proposal correctly filters out risks/open_questions

**Expected Output:**
- E2E test checklist document
- Test results for all 3 projects
- Bug report (if any issues found)
- Confirmation that core flow works end-to-end
- Screenshots or recordings of successful tests

**Files/Modules:**
- `testing/e2e-test-checklist.md`
- `testing/test-results.md`
- `testing/bugs-found.md` (if applicable)

**Dependency:** Step 19 completed

---

### Step 21: Validate Extraction Quality
**Goal:** Review AI extraction quality and identify any issues

**Instruction for IBM Bob:**
Perform extraction quality analysis:

1. Create `testing/extraction-quality-report.md`
2. For each test project, analyze:
   - Completeness: Are all key requirements extracted?
   - Accuracy: Is the extracted information correct?
   - Consistency: Is the JSON structure consistent?
   - Ambiguity handling: Does AI identify unclear/missing info?
   - Hallucinations: Any made-up information?
3. Compare extraction quality across document types:
   - Structured vs unstructured
   - Complete vs incomplete information
4. Document recommendations for improvement
5. Create `testing/demo-preparation.md` with demo script

**Expected Output:**
- Quality analysis report
- Comparison of extraction results
- List of strengths and weaknesses
- Demo preparation guide
- Recommendations for future improvements

**Files/Modules:**
- `testing/extraction-quality-report.md`
- `testing/demo-preparation.md`
- `testing/recommendations.md`

**Dependency:** Step 20 completed

---

## Summary

**Total Steps:** 21 steps
**Estimated Time:** 36 hours
- Backend: 9 steps (~18 hours)
- Frontend: 9 steps (~14 hours)
- Testing: 3 steps (~4 hours)

**Critical Path (Must Complete):**
- Steps 1-8: Backend core functionality
- Steps 10-17: Frontend core functionality
- Step 20: E2E testing

**Can Skip if Time Limited:**
- Step 3: Register endpoint (use hardcoded login)
- Step 8: Proposal endpoint (frontend can filter directly)
- Step 11: Register page
- Step 18: UI polish (focus on functionality)
- Step 21: Quality analysis (do quick smoke test only)

**Execution Strategy:**
1. Complete backend steps 1-7 first (core extraction pipeline)
2. Start frontend steps 10-16 while backend is being tested
3. Integrate and test end-to-end
4. Polish and prepare demo

**Key Success Metrics:**
- User can upload documents
- AI generates structured extraction
- Proposal preview displays correctly
- Demo runs smoothly without crashes