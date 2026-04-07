# 🧠 Drishtikon - News Consensus Analyzer

An AI-powered platform that analyzes news from multiple sources and extracts **factual consensus and narrative differences**.

## 📌 Overview

Drishtikon helps users understand:
- What is commonly agreed upon (truth signals)
- Where narratives differ (bias / interpretation)

*NOTE: This is a hackathon project and prototype, not a production application.*

## 🧱 Tech Stack

- **Backend**: FastAPI (Python)
- **LLM**: Groq (llama-3.3-70b-versatile) - Fast & Free
- **Vector Database**: Pinecone
- **Embeddings**: Pinecone Inference API (nvidia/llama-3.2-nv-embedqa-1b-v2) - 4096 dimensions, Pinecone-hosted
- **Frontend**: React + Tailwind CSS (upcoming)
- **News Sources**: NewsAPI / GNews

## 🚀 Getting Started

### Prerequisites

- Python 3.14+
- Virtual environment

### Installation

1. **Create and activate virtual environment**:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies**:
```bash
pip install -r requirements.txt
```

3. **Configure environment variables**:
Edit `.env` file with your API keys:
```env
# Get Groq API key from: https://console.groq.com/
GROQ_API_KEY=your_groq_api_key_here

# Get NewsAPI key from: https://newsapi.org/
NEWS_API_KEY=your_news_api_key_here

# Get Pinecone details from: https://app.pinecone.io/
# Note: Pinecone hosts the embedding model, no separate NVIDIA key needed!
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_INDEX_NAME=drishtikon-claims
PINECONE_HOST=your_index_host_here

# Model Configuration
GROQ_MODEL=llama-3.3-70b-versatile
PINECONE_EMBED_MODEL=nvidia/llama-3.2-nv-embedqa-1b-v2
EMBEDDING_DIMENSION=4096
```

**How to get Pinecone Host:**
1. Go to https://app.pinecone.io/
2. Click on your index "drishtikon-claims"
3. Copy the **Host** URL (looks like: `drishtikon-claims-xxxxx.svc.xxx.pinecone.io`)

4. **Run the backend**:
```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

5. **Test the API**:
```bash
curl http://localhost:8000/

curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"topic": "AI regulation"}'
```

## 📂 Project Structure

```
news-consensus-analyzer/
├── app/
│   ├── main.py                 # FastAPI application entry point
│   ├── routes/
│   │   └── analyze.py          # API routes
│   ├── services/
│   │   ├── news_service.py     # News aggregation
│   │   ├── llm_service.py      # LLM claim extraction
│   │   ├── embedding_service.py # OpenAI embeddings
│   │   ├── pinecone_service.py  # Vector database operations
│   │   ├── clustering_service.py # Claim clustering
│   │   ├── consensus_service.py  # Consensus analysis
│   │   └── bias_service.py     # Bias classification
│   ├── models/
│   │   └── schemas.py          # Pydantic models
│   └── utils/
├── .env                        # Environment variables
├── requirements.txt            # Python dependencies
└── README.md                   # This file
```

## 🎯 API Endpoints

### GET `/`
Health check endpoint
```json
{
  "message": "Welcome to Drishtikon API",
  "status": "running",
  "version": "1.0.0"
}
```

### GET `/health`
Health check endpoint
```json
{
  "status": "healthy"
}
```

### POST `/api/analyze`
Analyze news consensus on a topic

**Request Body:**
```json
{
  "topic": "AI regulation"
}
```

**Response:**
```json
{
  "status": "processing",
  "message": "Analyzing topic: AI regulation",
  "data": {
    "topic": "AI regulation"
  }
}
```

## 🔧 Development

The project follows a modular architecture with clear separation of concerns:
- **Routes**: Handle HTTP requests/responses
- **Services**: Contain business logic
- **Models**: Define data schemas
- **Utils**: Utility functions

## 📝 Next Steps

See `project details/` folder for step-by-step implementation guide:
1. ✅ Step 1: Project Setup (Backend) - **COMPLETED**
2. Step 2: News Aggregation
3. Step 3: Claim Extraction
4. Step 4: Embedding Generation
5. Step 5: Vector Database Storage
6. Step 6: Clustering Logic
7. Step 7: Consensus Analysis
8. Step 8: Frontend Setup
9. Step 9: Integration
10. Step 10: Deployment

## 📄 License

MIT License - Hackathon Project
