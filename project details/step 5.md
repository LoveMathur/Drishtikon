# 🔗 Step 5: Embeddings + Pinecone

## 🎯 Goal

Convert claims into vectors and store them.

---

## 🧠 Approach

- Use OpenAI embeddings
- Store in Pinecone

---

## 📌 Functions

- generate_embedding(text)
- upsert_claims(claims)
- query_similar(vector, top_k=30)

---

## 📦 Metadata

Each vector should include:
- claim text
- source
- bias

---

## ⚙️ Requirements

- Batch insert
- Efficient querying
- Top_k = 20–50

---

## ⚠️ Important

Pinecone is NOT clustering engine.
It only retrieves similar vectors.