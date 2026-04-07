# 🧠 Step 4: Claim Extraction (CORE AI)

## 🎯 Goal

Extract factual claims from news articles using LLM.

---

## ❗ VERY IMPORTANT

This is NOT summarization.

We want:
- Atomic facts
- Verifiable statements
- No opinions

---

## 📌 Function

extract_claims(text: str) -> List[str]

---

## 🧾 Prompt Rules

- Extract only factual claims
- No opinions
- No duplicates
- Each claim = one sentence
- Max 3–7 claims

---

## 📌 Example Output

```json
[
 "Government increased tax by 5%",
 "Policy implemented on March 3"
]

⚠️ Important
Keep claims short
Avoid hallucination
Ensure consistency