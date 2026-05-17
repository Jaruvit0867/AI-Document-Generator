# AI Document Generator - Testing Guide

## Overview
This guide provides instructions for running comprehensive tests on the AI Document Generator system, including functional testing and document quality assessment.

## Prerequisites

### Backend Setup
1. Ensure PostgreSQL is running with pgvector extension
2. Create `.env` file in backend directory with required variables:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/ai_doc_gen
   SECRET_KEY=your-secret-key
   OPENAI_API_KEY=your-openai-api-key
   OPENAI_BASE_URL=https://api.openai.com/v1
   OPENAI_MODEL=gpt-4
   ```
3. Install dependencies: `cd backend && pip install -r requirements.txt`
4. Initialize database: `python -c "from database import init_db; init_db()"`
5. Start backend: `uvicorn main:app --reload`

### Frontend Setup (Optional for E2E testing)
1. Install dependencies: `cd frontend && npm install`
2. Update API URL in `src/lib/api.ts` if needed
3. Start frontend: `npm run dev`

### Test Environment
1. Install test dependencies: `pip install requests`
2. Ensure backend is running on `http://localhost:8000`

## Phase 1: Functional Testing (2 hours)

### Automated E2E Tests

Run the automated test suite:
```bash
python test_e2e.py
```

This will test:
- ✓ Backend health check
- ✓ User registration
- ✓ User login
- ✓ Invalid login handling
- ✓ Project creation
- ✓ Project listing
- ✓ Document upload
- ✓ Document listing
- ✓ Extraction generation
- ✓ Extraction retrieval
- ✓ Data persistence

### Expected Results
- All tests should pass (green checkmarks)
- Total execution time: ~30-60 seconds
- Zero failed tests for production readiness

### Manual Testing Checklist

If automated tests fail or for additional validation:

#### 1. Authentication Flow
- [ ] Register new user with valid email/password
- [ ] Verify registration returns access token
- [ ] Login with registered credentials
- [ ] Verify login returns access token
- [ ] Test invalid credentials (should return 401)
- [ ] Test duplicate registration (should return 400)

#### 2. Project Management
- [ ] Create new project with name and description
- [ ] List all projects (should show created project)
- [ ] Get specific project by ID
- [ ] Update project details
- [ ] Delete project (if implemented)

#### 3. Document Upload
- [ ] Upload .txt file
- [ ] Upload .pdf file (if supported)
- [ ] Upload .docx file (if supported)
- [ ] Verify file size limits
- [ ] Test invalid file types (should reject)
- [ ] List documents in project

#### 4. Extraction Generation
- [ ] Generate extraction for project with documents
- [ ] Verify extraction completes successfully
- [ ] Check extraction contains all required fields
- [ ] Verify extraction data structure matches schema

#### 5. Data Persistence
- [ ] Logout and login again
- [ ] Verify projects still exist
- [ ] Verify documents still exist
- [ ] Verify extraction data persists

## Phase 2: Document Quality Testing (2 hours)

### Test Cases

Three test documents are provided in `test_cases/` directory:

1. **test_case_1_technical_spec.txt** - Well-structured technical specification
2. **test_case_2_meeting_minutes.txt** - Meeting minutes (MOM)
3. **test_case_3_unstructured_notes.txt** - Unstructured notes/chat logs

### Testing Process

For each test case:

1. **Create Test Project**
   ```bash
   # Use the web UI or API to create a project
   # Name it according to test case (e.g., "Test Case 1 - Technical Spec")
   ```

2. **Upload Test Document**
   - Upload the corresponding test case file
   - Wait for upload confirmation

3. **Generate Extraction**
   - Click "Generate Extraction" or call API endpoint
   - Wait for processing (may take 30-60 seconds)

4. **Review Output Quality**
   - Use the quality assessment rubric below

### Quality Assessment Rubric

For each test case, score the extraction on a scale of 1-5:

#### 1. Schema Conformance (Weight: 20%)
- [ ] 5: Perfect JSON structure, all required fields present
- [ ] 4: Valid JSON, minor field naming issues
- [ ] 3: Valid JSON, some fields missing
- [ ] 2: Invalid JSON or major structural issues
- [ ] 1: Completely malformed output

#### 2. Coverage (Weight: 20%)
- [ ] 5: Captures 90%+ of source content accurately
- [ ] 4: Captures 70-89% of source content
- [ ] 3: Captures 50-69% of source content
- [ ] 2: Captures 30-49% of source content
- [ ] 1: Captures <30% of source content

#### 3. Contradiction Detection (Weight: 15%)
- [ ] 5: Identifies all contradictions in source
- [ ] 4: Identifies most contradictions (75%+)
- [ ] 3: Identifies some contradictions (50-74%)
- [ ] 2: Identifies few contradictions (25-49%)
- [ ] 1: Misses all contradictions

#### 4. Missing Information Detection (Weight: 15%)
- [ ] 5: Clearly flags all gaps and ambiguities
- [ ] 4: Flags most gaps (75%+)
- [ ] 3: Flags some gaps (50-74%)
- [ ] 2: Flags few gaps (25-49%)
- [ ] 1: Doesn't identify missing information

#### 5. No Hallucination (Weight: 20%)
- [ ] 5: Zero fabricated information
- [ ] 4: Minor speculation clearly marked as such
- [ ] 3: Some speculation without clear marking
- [ ] 2: Multiple fabrications or distortions
- [ ] 1: Significant hallucinations affecting accuracy

#### 6. Readability (Weight: 10%)
- [ ] 5: Professional, clear, well-organized
- [ ] 4: Clear with minor formatting issues
- [ ] 3: Understandable but could be clearer
- [ ] 2: Confusing structure or language
- [ ] 1: Difficult to understand

### Scoring Formula

```
Weighted Score = (Schema × 0.20) + (Coverage × 0.20) + (Contradiction × 0.15) + 
                 (Missing Info × 0.15) + (No Hallucination × 0.20) + (Readability × 0.10)
```

**Pass Threshold: 4.0/5.0**

### Quality Assessment Template

Use this template to document findings for each test case:

```markdown
## Test Case [1/2/3]: [Name]

### Document Characteristics
- Type: [Technical Spec / Meeting Minutes / Unstructured Notes]
- Length: [word count]
- Complexity: [Low / Medium / High]
- Structure: [Well-structured / Semi-structured / Unstructured]

### Extraction Results

#### Schema Conformance: [Score]/5
Notes: 

#### Coverage: [Score]/5
Notes:
- Captured correctly: [list key items]
- Missed: [list missed items]

#### Contradiction Detection: [Score]/5
Notes:
- Contradictions in source: [count]
- Contradictions detected: [count]
- Examples: 

#### Missing Information Detection: [Score]/5
Notes:
- Gaps identified: [list]
- Gaps missed: [list]

#### No Hallucination: [Score]/5
Notes:
- Hallucinations found: [count]
- Examples:

#### Readability: [Score]/5
Notes:

### Weighted Score: [X.XX]/5.0
**Result: [PASS/FAIL]**

### Key Findings
1. 
2. 
3. 

### Recommendations
1. 
2. 
3. 
```

## Common Issues and Troubleshooting

### Backend Issues
- **Database connection error**: Check PostgreSQL is running and DATABASE_URL is correct
- **OpenAI API error**: Verify OPENAI_API_KEY is valid and has credits
- **Import errors**: Ensure all dependencies are installed (`pip install -r requirements.txt`)

### Test Failures
- **Authentication fails**: Check SECRET_KEY is set in .env
- **Extraction timeout**: Increase timeout in test script or check OpenAI API status
- **File upload fails**: Check file size limits and supported formats

### Quality Issues
- **High hallucination rate**: May need to adjust prompts in `backend/utils/prompts.py`
- **Poor coverage**: Check if document parsing is working correctly
- **Missing contradictions**: Review contradiction detection logic in extraction service

## Test Results Documentation

After completing all tests, document results in `TEST_RESULTS.md`:

```markdown
# Test Results - [Date]

## Phase 1: Functional Testing
- Total Tests: [X]
- Passed: [X]
- Failed: [X]
- Duration: [X] seconds

### Failed Tests
[List any failed tests with details]

## Phase 2: Quality Testing

### Test Case 1: Technical Spec
- Weighted Score: [X.XX]/5.0
- Result: [PASS/FAIL]
- Key Issues: [list]

### Test Case 2: Meeting Minutes
- Weighted Score: [X.XX]/5.0
- Result: [PASS/FAIL]
- Key Issues: [list]

### Test Case 3: Unstructured Notes
- Weighted Score: [X.XX]/5.0
- Result: [PASS/FAIL]
- Key Issues: [list]

## Overall Assessment
[Summary of findings and recommendations]

## Production Readiness
- [ ] All functional tests pass
- [ ] Average quality score ≥ 4.0
- [ ] No critical security issues
- [ ] Performance acceptable
- [ ] Error handling robust

**Recommendation: [READY / NOT READY / READY WITH CAVEATS]**
```

## Time Allocation

- **Phase 1 Setup**: 15 minutes
- **Phase 1 Automated Tests**: 5 minutes
- **Phase 1 Manual Validation**: 30 minutes
- **Phase 1 Error Testing**: 15 minutes
- **Phase 1 Documentation**: 15 minutes
- **Phase 2 Test Case Preparation**: 15 minutes (already done)
- **Phase 2 Test Case 1 Execution**: 20 minutes
- **Phase 2 Test Case 2 Execution**: 20 minutes
- **Phase 2 Test Case 3 Execution**: 20 minutes
- **Phase 2 Analysis & Documentation**: 25 minutes

**Total: ~3 hours** (buffer included)

## Success Criteria

### Minimum Requirements for Demo
- ✓ Backend health check passes
- ✓ User can register and login
- ✓ User can create project
- ✓ User can upload documents
- ✓ Extraction generates without errors
- ✓ Extraction contains valid JSON structure
- ✓ At least 1 test case scores ≥ 4.0

### Production Ready Requirements
- ✓ All functional tests pass
- ✓ All 3 test cases score ≥ 4.0
- ✓ Error handling works correctly
- ✓ Data persists across sessions
- ✓ No critical security vulnerabilities
- ✓ Performance meets requirements (<5s extraction time)

## Next Steps After Testing

1. **Document all findings** in TEST_RESULTS.md
2. **Create bug tickets** for any issues found
3. **Prioritize fixes** based on severity
4. **Update documentation** with known limitations
5. **Prepare demo script** highlighting working features
6. **Plan improvements** for post-demo iteration