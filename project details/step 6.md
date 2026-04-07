# 🧠 Step 6: Clustering (CORE LOGIC)

## 🎯 Goal

Group similar claims into clusters.

---

## 🧠 Approach

1. Query Pinecone for neighbors
2. Apply similarity threshold
3. Merge overlapping groups

---

## 📌 Logic

- similarity > 0.85 → same cluster
- Use merging to avoid duplicates

---

## 📌 Output

```json
[
  ["claim1", "claim2"],
  ["claim3", "claim4"]
]
⚠️ Important

This is your main innovation.

Do NOT rely only on top_k.
You must group intelligently.