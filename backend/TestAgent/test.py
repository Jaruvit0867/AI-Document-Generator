"""
Quantitative scoring of UrbanCart output v2 against rubric.
Source: ONLY messy notes (input_3) — not the full 3-file set.
"""

# ============================================================
# RAW CLAIM COUNTS
# ============================================================

total_claims = 52

# Breakdown
correct = 14
hallucinations = 9          # pure fabrications (incl. domain misclassification, fabricated user_flow steps, business_process steps, DB/infra speculation)
distortions = 13            # source exists but meaning changed (worries→requirements, questions→requirements)
silent_conflicts = 1        # cold-start 2-2.5s range
wrong_category = 2          # legal as NFR/feature
partial_correct = total_claims - (correct + hallucinations + distortions + silent_conflicts + wrong_category)

print(f"Claims breakdown:")
print(f"  Correct:             {correct}")
print(f"  Hallucinations:      {hallucinations}")
print(f"  Distortions:         {distortions}")
print(f"  Silent conflicts:    {silent_conflicts}")
print(f"  Wrong category:      {wrong_category}")
print(f"  Partial correct:     {partial_correct}")
print(f"  TOTAL:               {correct + hallucinations + distortions + silent_conflicts + wrong_category + partial_correct} / {total_claims}")

# ============================================================
# ACCURACY METRICS
# ============================================================

strict_accuracy = correct / total_claims * 100
lenient_accuracy = (correct + partial_correct) / total_claims * 100
pure_hallucination_rate = hallucinations / total_claims * 100
broad_halluc_rate = (hallucinations + distortions + wrong_category) / total_claims * 100

print(f"\n=== ACCURACY ===")
print(f"Strict accuracy:           {strict_accuracy:.1f}%  ({correct}/{total_claims} fully correct)")
print(f"Lenient accuracy:          {lenient_accuracy:.1f}%  (including partial)")

print(f"\n=== HALLUCINATION ===")
print(f"Pure hallucination rate:   {pure_hallucination_rate:.1f}%  ({hallucinations}/{total_claims} pure fabrications)")
print(f"Broad halluc + distortion: {broad_halluc_rate:.1f}%  (false/distorted/misplaced)")

# ============================================================
# CRITICAL FAILURE: DOMAIN MISCLASSIFICATION
# ============================================================
print(f"\n=== CRITICAL FAILURES ===")
print(f"  - Domain misclassified as 'fintech' (actual: e-commerce)")
print(f"  - 6 worries/questions promoted to requirements")
print(f"  - User flow & business process largely fabricated from generic knowledge")

# ============================================================
# CONTRADICTION DETECTION
# ============================================================
contradictions_in_source = 4  # cold-start, payment OVO conflict, iOS phase, NestJS vs FastAPI
contradictions_caught = 2  # NestJS/FastAPI (well done), cold-start partially (in open_q)
print(f"\n=== CONTRADICTION DETECTION ===")
print(f"  Source contradictions:   {contradictions_in_source}")
print(f"  Caught in open_questions: {contradictions_caught}")
print(f"  Detection rate:          {contradictions_caught/contradictions_in_source*100:.0f}%")

# ============================================================
# WEIGHTED RUBRIC
# ============================================================
scores = {
    'schema_conformance': {'score': 4, 'weight': 0.20,
        'note': 'Valid JSON, all top-level fields present'},
    'coverage':           {'score': 3, 'weight': 0.20,
        'note': 'Captures ~60% of messy notes content; only had 1 file as input'},
    'contradiction_det':  {'score': 2, 'weight': 0.15,
        'note': '50% detection; OVO conflict missed, age conflict missed'},
    'missing_info_det':   {'score': 4, 'weight': 0.15,
        'note': 'Strong open_questions section; most genuine gaps surfaced'},
    'no_hallucination':   {'score': 1, 'weight': 0.20,
        'note': f'9 pure fabrications including DOMAIN misclassification, fabricated user_flow, hedge-hallucination ("likely cloud hosting")'},
    'readability':        {'score': 4, 'weight': 0.10,
        'note': 'Clear structure and professional language'},
}

weighted = sum(s['score'] * s['weight'] for s in scores.values())

print(f"\n=== RUBRIC SCORE ===")
print(f"{'Dimension':<25} {'Score':>6} {'Weight':>8} {'Contrib':>8}")
print('-' * 60)
for k, s in scores.items():
    print(f"{k:<25} {s['score']:>6}/5 {s['weight']*100:>7.0f}% {s['score']*s['weight']:>8.2f}")
print('-' * 60)
print(f"{'WEIGHTED TOTAL':<25} {weighted:>30.2f}/5.0")
print(f"\nPass threshold: 4.0")
print(f"Result: {'FAIL' if weighted < 4.0 else 'PASS'} ({weighted:.2f})")

# ============================================================
# BOTTOM LINE
# ============================================================
print(f"\n{'='*60}")
print("BOTTOM LINE")
print(f"{'='*60}")
print(f"  Strict accuracy:           {strict_accuracy:.0f}%")
print(f"  Lenient accuracy:          {lenient_accuracy:.0f}%")
print(f"  Pure hallucination rate:   {pure_hallucination_rate:.0f}%")
print(f"  Broad halluc + distortion: {broad_halluc_rate:.0f}%")
print(f"  Contradiction detection:   {contradictions_caught/contradictions_in_source*100:.0f}%")
print(f"  Weighted score:            {weighted:.2f}/5.0 ({'FAIL' if weighted < 4 else 'PASS'})")