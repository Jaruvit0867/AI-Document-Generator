# Test Cases Index - 3×3 Matrix

## Overview

This directory contains 9 comprehensive test cases organized in a 3×3 matrix:
- **3 Document Types:** Well-Structured, Meeting Minutes (MoM), Unstructured Notes
- **3 Domains:** E-Commerce, FinTech, HealthTech

Each test case is designed to evaluate the AI Document Generator's ability to extract requirements from different document formats and industry domains.

---

## Test Case Matrix

| Domain | Well-Structured Document | Meeting Minutes (MoM) | Unstructured Notes |
|--------|-------------------------|----------------------|-------------------|
| **E-Commerce** | ✅ FashionHub Platform | ✅ UrbanCart Marketplace | ✅ SoleSwap Sneaker Resale |
| **FinTech** | ✅ WealthWise Robo-Advisor | ✅ Mobile Banking App | ✅ QuickClaim InsurTech |
| **HealthTech** | ✅ CareConnect Telemedicine | ✅ Mindful Mental Health | ✅ FitLife Pro Wellness |

---

## Test Case Details

### E-Commerce Domain

#### 1. E-Commerce - Well-Structured
**File:** `ecommerce_well_structured.txt`  
**Project:** FashionHub - Fashion E-Commerce Platform  
**Lines:** 407 | **Complexity:** High  
**Description:** Comprehensive PRD for a fashion e-commerce platform with detailed functional requirements, NFRs, technical architecture, and compliance requirements.

**Key Features:**
- 63 functional requirements across 7 categories
- 39 non-functional requirements
- Multi-currency and multi-language support
- Payment processing and fraud detection
- Inventory management and order fulfillment

**Testing Focus:**
- Extraction of detailed requirement IDs (FR-001, NFR-001, etc.)
- Technical stack identification
- Integration requirements
- Compliance and legal requirements

---

#### 2. E-Commerce - Meeting Minutes
**File:** `ecommerce_meeting_minutes.txt`  
**Project:** UrbanCart - Multi-Vendor Marketplace  
**Lines:** 307 | **Complexity:** Medium  
**Description:** Kickoff meeting notes for a multi-vendor marketplace platform with discussions, decisions, and action items.

**Key Features:**
- Seller and buyer features
- Commission structure (12% platform fee)
- Technical stack decisions
- Timeline negotiations (6-8 months)
- Budget: $1M

**Testing Focus:**
- Extraction from conversational format
- Identifying decisions vs discussions
- Action items and next steps
- Conflicting information (timeline debate)
- Open questions and concerns

---

#### 3. E-Commerce - Unstructured Notes
**File:** `ecommerce_unstructured_notes.txt`  
**Project:** SoleSwap - Sneaker Resale Platform  
**Lines:** 307 | **Complexity:** High  
**Description:** Informal brain dump from client call about a sneaker resale marketplace with stream-of-consciousness notes.

**Key Features:**
- Peer-to-peer sneaker marketplace
- Authentication process for sneakers
- Bidding and buy-now options
- Real-time pricing
- Budget: $500k

**Testing Focus:**
- Structuring messy, informal content
- Extracting requirements from casual language
- Identifying concerns and questions
- Handling slang and informal expressions
- Separating facts from opinions

---

### FinTech Domain

#### 4. FinTech - Well-Structured
**File:** `fintech_well_structured.txt`  
**Project:** WealthWise - Robo-Advisor Investment Platform  
**Lines:** 607 | **Complexity:** Very High  
**Description:** Detailed technical specification for a robo-advisor platform with extensive compliance and regulatory requirements.

**Key Features:**
- 90 functional requirements
- 60 non-functional requirements
- SEC/FINRA compliance
- Tax-loss harvesting
- Portfolio management
- AUM-based fees (0.25%)

**Testing Focus:**
- Financial services compliance (SEC, FINRA, PCI DSS)
- Complex technical architecture
- Security requirements (SOC 2, encryption)
- Integration with financial services (Apex Clearing, Plaid)
- Regulatory constraints

---

#### 5. FinTech - Meeting Minutes
**File:** `test_case_2_meeting_minutes.txt` (existing)  
**Project:** Mobile Banking App  
**Lines:** 157 | **Complexity:** Medium  
**Description:** Meeting minutes from mobile banking app kickoff with business objectives, features, and technical discussions.

**Key Features:**
- Mobile-first banking app
- Must-have features (10 items)
- Security requirements (PCI DSS, SOC 2)
- Timeline: 5-7 months
- Budget: $850K

**Testing Focus:**
- Banking-specific requirements
- Security and compliance emphasis
- Timeline conflicts and negotiations
- Integration with legacy systems (Temenos T24)
- Risk identification

---

#### 6. FinTech - Unstructured Notes
**File:** `fintech_unstructured_notes.txt`  
**Project:** QuickClaim - InsurTech Claims Platform  
**Lines:** 267 | **Complexity:** High  
**Description:** Casual notes from insurtech startup call about health insurance claims processing app.

**Key Features:**
- OCR for medical bills
- AI claim prediction
- HIPAA compliance
- B2C and B2B model
- Budget: $400k

**Testing Focus:**
- Healthcare compliance (HIPAA)
- Unclear revenue model
- Technical complexity (OCR, AI)
- Regulatory concerns
- Founder uncertainty and questions

---

### HealthTech Domain

#### 7. HealthTech - Well-Structured
**File:** `healthtech_well_structured.txt`  
**Project:** CareConnect - Telemedicine Platform  
**Lines:** 1007 | **Complexity:** Very High  
**Description:** Comprehensive system requirements specification for a telemedicine platform with extensive clinical and compliance requirements.

**Key Features:**
- 90+ functional requirements
- Video consultation system
- E-prescribing (EPCS certified)
- EHR integration
- HIPAA compliance
- 12-month timeline

**Testing Focus:**
- Healthcare compliance (HIPAA, HITECH)
- Clinical workflows and safety protocols
- Medical terminology and standards (HL7 FHIR, CCDA)
- Integration with healthcare systems
- Patient safety requirements

---

#### 8. HealthTech - Meeting Minutes
**File:** `healthtech_meeting_minutes.txt`  
**Project:** Mindful - Mental Health & Therapy Platform  
**Lines:** 357 | **Complexity:** Medium-High  
**Description:** Kickoff meeting for mental health app with therapy, self-help tools, and crisis support.

**Key Features:**
- Video therapy sessions
- Self-help tools (mood tracking, journaling)
- 24/7 crisis support
- Therapist marketplace
- Budget: $1.5M
- Timeline: 8-9 months

**Testing Focus:**
- Mental health specific requirements
- Clinical protocols and safety
- Crisis intervention procedures
- Therapist vetting and quality assurance
- Ethical considerations

---

#### 9. HealthTech - Unstructured Notes
**File:** `healthtech_unstructured_notes.txt`  
**Project:** FitLife Pro - Fitness & Wellness Platform  
**Lines:** 307 | **Complexity:** High  
**Description:** Informal notes from fitness app client call with enthusiastic but scattered requirements.

**Key Features:**
- Workout tracking and videos
- Nutrition tracking
- Social features and gamification
- Wearable integration
- Coach marketplace
- Budget: $350k

**Testing Focus:**
- Overly ambitious scope
- Informal language and enthusiasm
- Scope creep and feature bloat
- Technical feasibility questions
- Founder inexperience indicators

---

## Document Characteristics Summary

### Well-Structured Documents
- **Format:** Formal technical specifications with numbered requirements
- **Structure:** Clear sections, tables, hierarchical organization
- **Language:** Professional, precise, technical
- **Complexity:** High - detailed and comprehensive
- **Expected AI Performance:** High accuracy (4.5-5.0/5.0)

### Meeting Minutes (MoM)
- **Format:** Semi-structured meeting notes with discussions and decisions
- **Structure:** Agenda-based with attendees, notes, action items
- **Language:** Conversational but organized
- **Complexity:** Medium - mix of decisions, discussions, and questions
- **Expected AI Performance:** Good accuracy (4.0-4.5/5.0)

### Unstructured Notes
- **Format:** Informal brain dumps and stream-of-consciousness
- **Structure:** Minimal - scattered thoughts and observations
- **Language:** Casual, slang, incomplete sentences, personal opinions
- **Complexity:** High - requires significant interpretation
- **Expected AI Performance:** Moderate accuracy (3.5-4.2/5.0)

---

## Domain Characteristics

### E-Commerce
- **Focus:** User experience, transactions, inventory, payments
- **Key Concerns:** Scalability, conversion rates, fraud prevention
- **Typical Features:** Shopping cart, checkout, product catalog, reviews
- **Compliance:** PCI DSS, GDPR, CCPA

### FinTech
- **Focus:** Financial transactions, security, compliance, regulations
- **Key Concerns:** Security, regulatory compliance, data protection
- **Typical Features:** Payments, accounts, transactions, reporting
- **Compliance:** SEC, FINRA, PCI DSS, SOC 2, AML/KYC

### HealthTech
- **Focus:** Patient care, clinical workflows, medical data, safety
- **Key Concerns:** HIPAA compliance, patient safety, clinical quality
- **Typical Features:** Patient records, appointments, prescriptions, telehealth
- **Compliance:** HIPAA, HITECH, FDA (for medical devices), state licensing

---

## Testing Strategy

### For Each Test Case:

1. **Upload Document** to AI Document Generator
2. **Generate Extraction** and wait for processing
3. **Evaluate Output** using 6-dimension rubric:
   - Schema Conformance (20%)
   - Coverage (20%)
   - Contradiction Detection (15%)
   - Missing Info Detection (15%)
   - No Hallucination (20%)
   - Readability (10%)
4. **Calculate Weighted Score** (Pass threshold: 4.0/5.0)
5. **Document Findings** in TEST_RESULTS_TEMPLATE.md

### Expected Challenges by Document Type:

**Well-Structured:**
- Challenge: Handling large volume of detailed requirements
- Risk: Missing some requirements due to length
- Strength: Clear structure aids extraction

**Meeting Minutes:**
- Challenge: Distinguishing decisions from discussions
- Risk: Treating questions as requirements
- Strength: Action items are usually clear

**Unstructured Notes:**
- Challenge: Structuring informal content
- Risk: Hallucinating structure that doesn't exist
- Strength: Tests AI's ability to handle real-world messy input

### Expected Challenges by Domain:

**E-Commerce:**
- Challenge: Balancing business and technical requirements
- Risk: Over-focusing on features, missing NFRs
- Strength: Familiar domain for most developers

**FinTech:**
- Challenge: Complex compliance and regulatory requirements
- Risk: Missing critical security/compliance requirements
- Strength: Well-defined industry standards

**HealthTech:**
- Challenge: Clinical terminology and patient safety
- Risk: Misunderstanding medical workflows
- Strength: Clear regulatory framework (HIPAA)

---

## Success Metrics

### Overall Test Suite Success:
- **Minimum (Demo Ready):** 6/9 test cases pass (≥4.0 score)
- **Good:** 7/9 test cases pass with average ≥4.0
- **Excellent:** 8/9 test cases pass with average ≥4.2
- **Outstanding:** 9/9 test cases pass with average ≥4.5

### By Document Type:
- Well-Structured: Average ≥4.3/5.0
- Meeting Minutes: Average ≥4.0/5.0
- Unstructured Notes: Average ≥3.7/5.0

### By Domain:
- E-Commerce: Average ≥4.0/5.0
- FinTech: Average ≥4.0/5.0
- HealthTech: Average ≥4.0/5.0

---

## Usage Instructions

1. **Select Test Case** based on what you want to test
2. **Create Project** in AI Document Generator
3. **Upload Test Case File** from this directory
4. **Generate Extraction** and review output
5. **Score Using Rubric** (see TESTING_GUIDE.md)
6. **Document Results** (see TEST_RESULTS_TEMPLATE.md)
7. **Compare Across Cases** to identify patterns

---

## File Naming Convention

Format: `{domain}_{document_type}.txt`

Examples:
- `ecommerce_well_structured.txt`
- `fintech_meeting_minutes.txt`
- `healthtech_unstructured_notes.txt`

---

## Maintenance

When adding new test cases:
1. Follow the naming convention
2. Update this index document
3. Add to the matrix table
4. Document key characteristics
5. Update expected performance metrics

---

**Last Updated:** May 17, 2026  
**Total Test Cases:** 9  
**Coverage:** 3 domains × 3 document types  
**Status:** Complete and ready for testing