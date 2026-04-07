
# 🔗 Step 9: Pipeline Integration

## 🎯 Goal

Connect all services into one flow.

---

## 🧠 Flow

1. Fetch news
2. Classify bias
3. Extract claims
4. Generate embeddings
5. Store in Pinecone
6. Cluster claims
7. Score consensus
8. Generate output

---

## 📌 Endpoint

POST /analyze

---

## 📌 Final Output

Structured JSON with:
- consensus
- disagreements
- insights