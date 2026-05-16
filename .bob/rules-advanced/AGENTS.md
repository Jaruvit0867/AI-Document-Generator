# Project Advanced Coding Rules (Non-Obvious Only)

## Backend Code Patterns

### API Route Definitions
- Project routes use trailing slash: `@router.post("/", ...)` not `@router.post("")`
- This creates endpoint `POST /projects/` (with slash) which is required by frontend

### Database Initialization
- [`init_db()`](../../backend/database.py:31) auto-creates pgvector extension on startup
- No manual `CREATE EXTENSION vector` needed in application code
- Schema file still includes it for manual database setup

### OpenAI Client Configuration
- Client initialized with `base_url` parameter for provider flexibility
- Not hardcoded to OpenAI - supports any OpenAI-compatible API
- Example in [`extraction_service.py`](../../backend/services/extraction_service.py:15-18)

### Extraction Service
- Uses JSON mode for structured output (requires model support)
- Context building in [`build_context_from_documents()`](../../backend/services/extraction_service.py:21) combines all docs
- Truncates at 100,000 characters to avoid token limits

### Diagram Generation
- Generates Mermaid syntax strings, not diagram objects
- Stored as text in `mermaid_content` field
- Frontend must render using mermaid library

## Frontend Requirements (To Be Built)

### Text-to-File Conversion
- Backend only accepts file uploads, not raw text
- Must convert pasted text to Blob/File object in browser before upload
- Use `new File([text], 'requirements.txt', { type: 'text/plain' })`

### API Base URL
- Must read from `process.env.NEXT_PUBLIC_API_BASE_URL`
- Default: `https://backend-hackaton-v2.vercel.app`
- All API calls must use this base URL

### Authentication Headers
- Token stored in localStorage (hackathon approach)
- All protected requests need: `Authorization: Bearer ${token}`
- 401 responses must clear token and redirect to login

### Processing Pipeline Order
- Must follow exact sequence: upload → embeddings → extract → diagrams → proposal
- Each step depends on previous completion
- Extraction takes 30-60 seconds (show loading state)

## Access to MCP and Browser Tools
This mode has access to MCP (Model Context Protocol) and Browser tools for enhanced capabilities.