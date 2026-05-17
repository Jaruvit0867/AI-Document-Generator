# Testing Suite - AI Document Generator

## Overview

This testing suite provides comprehensive testing tools for the AI Document Generator project, covering both functional testing and document quality assessment.

## 📁 Testing Files Structure

```
AI-Document-Generator-main/
├── test_e2e.py                      # Automated end-to-end test suite
├── run_tests.py                     # Interactive test runner with menu
├── TESTING_GUIDE.md                 # Comprehensive testing guide
├── TEST_RESULTS_TEMPLATE.md         # Template for documenting results
└── test_cases/                      # Test documents for quality testing
    ├── test_case_1_technical_spec.txt
    ├── test_case_2_meeting_minutes.txt
    └── test_case_3_unstructured_notes.txt
```

## 🚀 Quick Start

### Option 1: Interactive Test Runner (Recommended)

```bash
python run_tests.py
```

This will show an interactive menu with options to:
1. Run preflight checks only
2. Run automated E2E tests
3. Run preflight checks + E2E tests
4. Show testing guide
5. Open test results template
6. Exit

### Option 2: Direct E2E Test Execution

```bash
python test_e2e.py
```

This runs the automated functional tests directly.

## 📋 Prerequisites

### 1. Backend Setup

Ensure the backend is running:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend should be accessible at `http://localhost:8000`

### 2. Environment Configuration

Create `backend/.env` file with:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/ai_doc_gen
SECRET_KEY=your-secret-key-here
OPENAI_API_KEY=your-openai-api-key
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4
```

### 3. Database Setup

Ensure PostgreSQL is running with pgvector extension:

```bash
# Initialize database
python -c "from database import init_db; init_db()"
```

### 4. Python Dependencies

Install test dependencies:

```bash
pip install requests
```

## 🧪 Testing Phases

### Phase 1: Functional Testing (2 hours)

**Automated Tests Include:**
- ✓ Backend health check
- ✓ User registration and authentication
- ✓ Project creation and management
- ✓ Document upload functionality
- ✓ Extraction generation
- ✓ Data persistence validation
- ✓ Error handling (invalid credentials, etc.)

**Run Command:**
```bash
python test_e2e.py
```

**Expected Output:**
```
======================================================================
PHASE 1: FUNCTIONAL TESTING
======================================================================

Step 1: End-to-End Flow Testing

✓ Health Check
✓ User Registration
✓ User Login
✓ Create Project
✓ List Projects
✓ Upload Document (requirements.txt)
✓ List Documents
✓ Generate Extraction
✓ Get Extraction
✓ Data Persistence

Step 2: Error Handling Validation

✓ Invalid Login Handling

======================================================================
TEST SUMMARY
======================================================================
Total Tests: 11
Passed: 11
Failed: 0
Skipped: 0
Duration: 48.3s
======================================================================

✓ ALL TESTS PASSED
```

### Phase 2: Document Quality Testing (2 hours)

**Test Cases:**

1. **Test Case 1: Well-Structured Technical Spec**
   - File: `test_cases/test_case_1_technical_spec.txt`
   - Type: Detailed technical specification
   - Complexity: High
   - Tests: Comprehensive requirement extraction

2. **Test Case 2: Meeting Minutes (MOM)**
   - File: `test_cases/test_case_2_meeting_minutes.txt`
   - Type: Semi-structured meeting notes
   - Complexity: Medium
   - Tests: Information extraction from discussions

3. **Test Case 3: Unstructured Notes/Chat Logs**
   - File: `test_cases/test_case_3_unstructured_notes.txt`
   - Type: Informal, unstructured notes
   - Complexity: High
   - Tests: AI's ability to structure messy input

**Quality Assessment Rubric:**

Each test case is scored on 6 dimensions (1-5 scale):

| Dimension | Weight | Description |
|-----------|--------|-------------|
| Schema Conformance | 20% | Valid JSON structure with all required fields |
| Coverage | 20% | Percentage of source content captured accurately |
| Contradiction Detection | 15% | Ability to identify conflicting information |
| Missing Info Detection | 15% | Flags gaps and ambiguities in source |
| No Hallucination | 20% | Absence of fabricated information |
| Readability | 10% | Professional, clear, well-organized output |

**Pass Threshold:** 4.0/5.0 weighted score

**Manual Testing Process:**

1. Create a project for each test case
2. Upload the test document
3. Generate extraction
4. Review output using the rubric
5. Document findings in TEST_RESULTS_TEMPLATE.md

## 📊 Quality Scoring Example

```
Test Case 1: Technical Spec
├── Schema Conformance: 5/5 (Weight: 20%) = 1.00
├── Coverage: 4/5 (Weight: 20%) = 0.80
├── Contradiction Detection: 4/5 (Weight: 15%) = 0.60
├── Missing Info Detection: 5/5 (Weight: 15%) = 0.75
├── No Hallucination: 3/5 (Weight: 20%) = 0.60
└── Readability: 5/5 (Weight: 10%) = 0.50
    
Weighted Score: 4.25/5.0 ✓ PASS
```

## 📝 Documenting Results

Use the provided template to document your findings:

```bash
# Copy template to create your results file
cp TEST_RESULTS_TEMPLATE.md TEST_RESULTS_$(date +%Y%m%d).md
```

Fill in:
- Executive summary
- Functional test results
- Quality scores for each test case
- Issues found (categorized by severity)
- Performance metrics
- Production readiness assessment

## 🔍 Troubleshooting

### Backend Not Running

**Error:** `Connection refused` or `Backend is not running`

**Solution:**
```bash
cd backend
uvicorn main:app --reload
```

### Database Connection Error

**Error:** `Could not connect to database`

**Solution:**
1. Ensure PostgreSQL is running
2. Check DATABASE_URL in .env file
3. Verify database exists: `psql -l`
4. Initialize database: `python -c "from database import init_db; init_db()"`

### OpenAI API Error

**Error:** `Invalid API key` or `Rate limit exceeded`

**Solution:**
1. Verify OPENAI_API_KEY in .env file
2. Check API key has credits
3. Check rate limits on OpenAI dashboard

### Import Errors

**Error:** `ModuleNotFoundError: No module named 'X'`

**Solution:**
```bash
cd backend
pip install -r requirements.txt
```

### Test Failures

If tests fail:
1. Check backend logs for errors
2. Verify all environment variables are set
3. Ensure database is initialized
4. Check OpenAI API status
5. Review error messages in test output

## 📈 Performance Benchmarks

Expected performance metrics:

| Operation | Target | Acceptable Range |
|-----------|--------|------------------|
| User Registration | <1s | <2s |
| User Login | <1s | <2s |
| Project Creation | <1s | <2s |
| Document Upload | <5s | <10s |
| Extraction Generation | <60s | <120s |
| API Response Time | <2s | <5s |

## ✅ Success Criteria

### Minimum for Demo
- [ ] Backend health check passes
- [ ] User can register and login
- [ ] User can create project
- [ ] User can upload documents
- [ ] Extraction generates without errors
- [ ] Extraction contains valid JSON
- [ ] At least 1 test case scores ≥ 4.0

### Production Ready
- [ ] All functional tests pass
- [ ] All 3 test cases score ≥ 4.0
- [ ] Error handling works correctly
- [ ] Data persists across sessions
- [ ] No critical security vulnerabilities
- [ ] Performance meets benchmarks

## 🎯 Time Allocation

Recommended time allocation for complete testing:

- **Setup & Verification:** 15 minutes
- **Phase 1 Automated Tests:** 5 minutes
- **Phase 1 Manual Validation:** 30 minutes
- **Phase 1 Error Testing:** 15 minutes
- **Phase 1 Documentation:** 15 minutes
- **Phase 2 Test Case 1:** 20 minutes
- **Phase 2 Test Case 2:** 20 minutes
- **Phase 2 Test Case 3:** 20 minutes
- **Phase 2 Analysis:** 25 minutes
- **Final Documentation:** 15 minutes

**Total:** ~3 hours (with buffer)

## 📚 Additional Resources

- **TESTING_GUIDE.md** - Detailed testing procedures and guidelines
- **TEST_RESULTS_TEMPLATE.md** - Template for documenting test results
- **backend/API_DOCUMENTATION.md** - API endpoint documentation
- **DEPLOYMENT.md** - Deployment and infrastructure guide

## 🤝 Contributing Test Cases

To add new test cases:

1. Create a new file in `test_cases/` directory
2. Use descriptive filename: `test_case_N_description.txt`
3. Include diverse content types and complexity levels
4. Document expected behavior and edge cases
5. Update this README with the new test case

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review backend logs: `backend/logs/` (if logging is configured)
3. Check OpenAI API status: https://status.openai.com/
4. Review test output for specific error messages

## 🔄 Continuous Testing

For ongoing development:

1. Run automated tests before each commit
2. Run full quality tests before major releases
3. Update test cases as features evolve
4. Document any new issues or edge cases discovered
5. Maintain test results history for trend analysis

## 📊 Test Coverage

Current test coverage:

- **Authentication:** ✓ Complete
- **Project Management:** ✓ Complete
- **Document Upload:** ✓ Complete
- **Extraction Generation:** ✓ Complete
- **Error Handling:** ✓ Basic (can be expanded)
- **Performance Testing:** ⚠ Manual only
- **Security Testing:** ⚠ Basic (needs security audit)
- **Load Testing:** ✗ Not implemented

## 🎓 Best Practices

1. **Always run preflight checks** before testing
2. **Document all findings** immediately
3. **Use consistent test data** for reproducibility
4. **Test in clean environment** (fresh database)
5. **Verify backend logs** for hidden errors
6. **Compare results** across test runs
7. **Report issues** with reproduction steps

---

**Last Updated:** 2026-05-17  
**Version:** 1.0.0  
**Maintainer:** Development Team