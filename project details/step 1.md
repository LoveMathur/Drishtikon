# 🧱 Step 1: Project Setup (Backend)

## 🎯 Goal

Create a scalable FastAPI backend with modular structure for hackathon.

---

## 📂 Folder Structure


news-consensus-analyzer/

app/
├── main.py
├── routes/
│ └── analyze.py
├── services/
│ ├── news_service.py
│ ├── llm_service.py
│ ├── embedding_service.py
│ ├── pinecone_service.py
│ ├── clustering_service.py
│ ├── consensus_service.py
│ └── bias_service.py
├── models/
│ └── schemas.py
└── utils/

.env
requirements.txt


---

## ⚙️ Requirements

- FastAPI app setup
- Environment variable support
- Basic route: POST /analyze
- JSON input/output

---

## 📌 Expected Input

```json
{
  "topic": "AI regulation"
}
📌 Expected Output (placeholder)
{
  "status": "processing"
}
🔥 Important
Keep code modular
No business logic in routes
Use services layer