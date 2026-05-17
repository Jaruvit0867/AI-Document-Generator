# Testing Quick Reference Card

## 🚀 Quick Start Commands

```bash
# Start Backend
cd backend && uvicorn main:app --reload

# Run Tests (Interactive)
python run_tests.py

# Run Tests (Direct)
python test_e2e.py

# Start Frontend (Optional)
cd frontend && npm run dev
```

## 📋 Quality Scoring Rubric

| Dimension | Weight | 1 | 2 | 3 | 4 | 5 |
|-----------|--------|---|---|---|---|---|
| Schema Conformance | 20% | Malformed | Major issues | Some missing | Minor issues | Perfect |
| Coverage | 20% | <30% | 30-49% | 50-69% | 70-89% | 90%+ |
| Contradiction Detection | 15% | 0% | 25-49% | 50-74% | 75%+ | 100% |
| Missing Info Detection | 15% | None | Few (25-49%) | Some (50-74%) | Most (75%+) | All |
| No Hallucination | 20% | Significant | Multiple | Some | Minor | Zero |
| Readability | 10% | Confusing | Poor | Acceptable | Clear | Professional |

**Pass Threshold:** 4.0/5.0

## 🎯 Test Cases Overview

| # | File | Type | Complexity | Lines |
|---|------|------|------------|-------|
| 1 | test_case_1_technical_spec.txt | Technical Spec | High | 107 |
| 2 | test_case_2_meeting_minutes.txt | Meeting Minutes | Medium | 157 |
| 3 | test_case_3_unstructured_notes.txt | Unstructured Notes | High | 157 |

## ✅ Functional Tests Checklist

- [ ] Health Check
- [ ] User Registration
- [ ] User Login
- [ ] Invalid Login Handling
- [ ] Create Project
- [ ] List Projects
- [ ] Upload Document
- [ ] List Documents
- [ ] Generate Extraction
- [ ] Get Extraction
- [ ] Data Persistence

## 📊 Quality Testing Workflow

For each test case:

1. **Create Project** → Name it "Test Case [N] - [Name]"
2. **Upload Document** → From test_cases/ directory
3. **Generate Extraction** → Wait 30-60 seconds
4. **Review Output** → Use rubric above
5. **Score Each Dimension** → 1-5 scale
6. **Calculate Weighted Score** → Use formula below
7. **Document Findings** → In TEST_RESULTS_TEMPLATE.md

## 🧮 Scoring Formula

```
Weighted Score = 
  (Schema × 0.20) + 
  (Coverage × 0.20) + 
  (Contradiction × 0.15) + 
  (Missing Info × 0.15) + 
  (No Hallucination × 0.20) + 
  (Readability × 0.10)
```

## 🔍 What to Look For

### Schema Conformance
- Valid JSON structure?
- All required fields present?
- Correct data types?

### Coverage
- Key requirements captured?
- Important details included?
- Nothing major missed?

### Contradiction Detection
- Conflicting info in source?
- Did AI flag contradictions?
- Listed in open_questions?

### Missing Info Detection
- Gaps in source document?
- Ambiguities identified?
- Questions raised appropriately?

### No Hallucination
- Any fabricated information?
- Speculation clearly marked?
- Domain correctly identified?

### Readability
- Clear and organized?
- Professional language?
- Easy to understand?

## ⚠️ Common Issues

| Issue | Solution |
|-------|----------|
| Backend not running | `cd backend && uvicorn main:app --reload` |
| Database error | Check PostgreSQL, verify DATABASE_URL |
| OpenAI error | Check API key and credits |
| Import error | `pip install -r requirements.txt` |
| Test timeout | Increase timeout or check API status |

## 📈 Performance Targets

| Operation | Target | Max |
|-----------|--------|-----|
| Registration | <1s | <2s |
| Login | <1s | <2s |
| Upload | <5s | <10s |
| Extraction | <60s | <120s |
| API Response | <2s | <5s |

## 🎯 Success Criteria

### Minimum (Demo Ready)
- [ ] 11/11 functional tests pass
- [ ] Valid JSON extraction
- [ ] 1+ test case scores ≥ 4.0

### Ideal (Production Ready)
- [ ] 11/11 functional tests pass
- [ ] 3/3 test cases score ≥ 4.0
- [ ] Average score ≥ 4.0
- [ ] No critical issues

## 📝 Documentation Files

- **TESTING_SUMMARY.md** - Overview & status
- **TESTING_README.md** - Quick start guide
- **TESTING_GUIDE.md** - Detailed procedures
- **TEST_RESULTS_TEMPLATE.md** - Results template

## ⏱️ Time Budget

| Phase | Task | Time |
|-------|------|------|
| **Phase 1** | Setup | 15m |
| | Automated Tests | 5m |
| | Manual Validation | 30m |
| | Error Testing | 15m |
| | Documentation | 15m |
| | **Subtotal** | **1h 20m** |
| **Phase 2** | Test Case 1 | 20m |
| | Test Case 2 | 20m |
| | Test Case 3 | 20m |
| | Analysis | 25m |
| | Documentation | 15m |
| | **Subtotal** | **1h 40m** |
| **Buffer** | | 1h |
| **TOTAL** | | **4h** |

## 🔗 Quick Links

- Backend: http://localhost:8000
- Frontend: http://localhost:3000
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

## 📞 Emergency Contacts

- OpenAI Status: https://status.openai.com/
- PostgreSQL Docs: https://www.postgresql.org/docs/

---

**Print this page for quick reference during testing!**