# Project Documentation Rules (Non-Obvious Only)

## Project Structure Quirks

### Frontend Directory State
- `frontend/` currently only contains `.next/` build artifacts and `API_DOCUMENTATION.md`
- No actual Next.js source code exists yet - needs to be built from scratch
- This is intentional for the hackathon - frontend is to be created

### Backend Documentation Location
- Comprehensive API docs in [`backend/API_DOCUMENTATION.md`](../../backend/API_DOCUMENTATION.md) (1566 lines)
- Includes complete workflow examples and frontend implementation guide
- Duplicate copy exists in `frontend/API_DOCUMENTATION.md` (same content)

### Hidden Implementation Details

#### Trailing Slash Requirement
- API endpoints require trailing slash for list operations: `/projects/` not `/projects`
- This is FastAPI router configuration, not documented in OpenAPI spec
- Frontend must use trailing slash or requests will fail

#### Text Upload Workaround
- Backend has no endpoint for raw text submission
- Frontend must convert pasted text to `.txt` file in browser before upload
- This is by design - all content goes through document upload pipeline

#### Processing Time Expectations
- Extraction endpoint can take 30-60 seconds to complete
- This is normal - LLM processing time, not a bug
- Frontend must show appropriate loading states

#### Diagram Format
- Diagrams are Mermaid syntax strings, not visual files
- Stored as text in database `mermaid_content` field
- Frontend must use mermaid library to render
- NOT draw.io XML format despite what might be assumed

### Database Schema Location
- Schema in [`backend/schema.sql`](../../backend/schema.sql) must be run manually
- Not auto-applied by migrations - manual `psql` command required
- [`init_db()`](../../backend/database.py:31) only creates extension and tables, not schema

### Environment Variable Naming
- Frontend uses `NEXT_PUBLIC_` prefix (Next.js requirement)
- Backend uses plain names without prefix
- `OPENAI_BASE_URL` supports any OpenAI-compatible provider, not just OpenAI

### Chat Feature Dependencies
- Chat requires documents uploaded AND embeddings processed first
- Will fail silently or return poor results without embeddings
- This dependency is not enforced by API - frontend must handle