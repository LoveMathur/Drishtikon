# 🚀 Drishtikon - Complete Progress Report (Steps 1-6)

## 📊 Project Overview

**Drishtikon** is a multi-perspective news analysis system that extracts factual claims from diverse sources, clusters similar claims, and identifies consensus vs. disagreements across the political spectrum.

**Current Status:** Steps 1-6 Complete (60% of full project)

---

## ✅ What's Been Built (Steps 1-6)

### Step 1: Backend Foundation ✅
- **FastAPI** server with modular architecture
- Environment configuration (.env)
- Service-oriented architecture
- CORS enabled for frontend integration
- Health check endpoints

**Files:**
- `app/main.py` - FastAPI application
- `app/models/schemas.py` - Pydantic data models
- `app/routes/analyze.py` - Main analysis endpoint
- Service layer: 7 specialized services

---

### Step 2: News Aggregation ✅
- **NewsAPI** integration (100+ sources)
- Content filtering (min 100 chars)
- Duplicate removal (80% similarity)
- Fetch 10-15 unique articles per topic

**Capabilities:**
- ✅ Query any topic
- ✅ Get diverse sources
- ✅ Quality content filtering
- ✅ Deduplication

**Performance:**
- Response time: ~2 seconds
- Article quality: High
- Coverage: Excellent

---

### Step 3: Bias Classification ✅
- **60+ news sources** mapped
- Political spectrum: Left → Center → Right
- Granular classification (center-left, center-right)
- 85.7% coverage on real data

**Source Coverage:**
- Political news: 100% (CNN, Fox, NYT, WSJ, etc.)
- Tech/Business: 90% (Wired, Forbes, Bloomberg)
- Science: 100% (Nature, Scientific American)

**Bias Categories:**
- Left: CNN, MSNBC, HuffPost, Vox
- Center-Left: NYT, Washington Post, NPR, Guardian
- Center: BBC, Reuters, AP, Bloomberg, Business Insider
- Center-Right: WSJ, NY Post, Washington Times
- Right: Fox News, Breitbart, Daily Wire

---

### Step 4: Claim Extraction ✅
- **Groq LLM** (llama-3.3-70b-versatile)
- Extract 3-7 atomic facts per article
- Temperature: 0.1 (high consistency)
- NO opinions, only verifiable facts

**Claim Quality:**
- ✅ Atomic (one fact per claim)
- ✅ Verifiable
- ✅ One sentence each
- ✅ No duplicates
- ✅ No speculation

**Example Claims:**
- "The Federal Reserve raised interest rates by 0.25 percentage points"
- "Inflation reached 6.2% in the latest report"
- "Australia marks 50 years of monitoring the world's cleanest air"

**Performance:**
- LLM response: ~1-2 seconds per article
- Average claims: 3 per article
- Quality: High (validated)

---

### Step 5: Embeddings + Vector Storage ✅
- **Pinecone Inference API** (multilingual-e5-large)
- 1024-dimensional vectors
- Batch processing (100 per batch)
- Rich metadata storage

**Vector Metadata:**
```json
{
  "claim": "The actual claim text",
  "source": "NPR",
  "bias": "center-left",
  "topic": "climate change",
  "article_id": "topic_0"
}
```

**Capabilities:**
- ✅ Semantic search
- ✅ Similarity scoring
- ✅ Bias-filtered queries
- ✅ Topic filtering

**Performance:**
- Embedding generation: ~1-2 seconds for 30 claims
- Storage: ~500ms for 30 vectors
- Query: <100ms
- FREE (Pinecone free tier)

---

### Step 6: Intelligent Clustering ✅
- **Union-Find algorithm** for merging
- Similarity threshold: 0.85
- Handles transitive similarity
- **Key Innovation:** Goes beyond simple top_k

**Algorithm:**
1. Query Pinecone for each claim's neighbors (top_k=50)
2. Filter by similarity > 0.85
3. Build similarity graph
4. Merge overlapping groups (Union-Find)
5. Calculate consensus levels

**Consensus Scoring:**
- 50% cluster size
- 25% bias diversity
- 25% source diversity
- Range: 0.0 - 1.0

**Example:**
```
10 test claims → 3 clusters:
- Cluster 1: 7 Fed/rate hike claims (consensus: 0.53)
- Cluster 2: 2 market decline claims (consensus: 0.31)
- Cluster 3: 1 unemployment claim (consensus: 0.23)
```

**Why It's Smart:**
- Handles: "A similar to B, B similar to C" → A,B,C in one cluster
- No duplicates across clusters
- All claims accounted for
- Respects similarity threshold consistently

---

## 🔄 Complete Data Flow

```
User Input: "climate change"
    ↓
Step 2: NewsAPI fetches 10 articles
    ↓
Step 3: BiasService classifies each source
    ↓
Step 4: LLMService extracts 3-7 claims per article (30 total)
    ↓
Step 5: EmbeddingService generates 1024D vectors
    ↓
Step 5: PineconeService stores vectors with metadata
    ↓
Step 6: ClusteringService groups similar claims (15 clusters)
    ↓
Output: Structured analysis with articles, claims, and clusters
```

---

## 📊 Real Example Output

**Topic:** "climate change"

**Results:**
- ✅ 10 articles fetched
- ✅ 30 claims extracted
- ✅ 30 embeddings generated
- ✅ 30 vectors stored in Pinecone
- ✅ 15 clusters created

**Cluster Statistics:**
- Total clusters: 15
- Avg cluster size: 2.0
- Largest cluster: 6 claims
- High consensus clusters: 1
- Disagreement clusters: 14
- Avg consensus level: 0.31

**Sample Cluster:**
```
Cluster 1 (Size: 6, Consensus: 0.45)
Summary: "The Central Arizona Project brings water from the Colorado River to Arizona"

Claims:
1. The Central Arizona Project is a series of aqueducts and tunnels
2. The Central Arizona Project brings water from the Colorado River to Arizona
3. A section of the Central Arizona Project runs through a subdivision...

Sources: Vox (2x), NPR, Forbes
Biases: left, center-left, center
```

---

## 🌐 Demo UI Features

**Open `demo.html` in your browser to see:**

### Overview Section:
- ✅ Steps 1-6 Complete badge
- Topic search box
- Real-time API integration

### Statistics Dashboard:
- 📰 Articles fetched
- 💎 Claims extracted
- 🔗 Clusters created
- 💾 Embeddings stored
- 📊 Cluster statistics

### Articles Display:
- Title, source, bias
- Content length
- Extracted claims (expandable)
- Direct article links

### Clusters Section (NEW!):
- 🔗 Cluster cards with consensus levels
- 📌 Cluster summaries
- Source and bias badges
- Expandable claim lists
- High/low consensus indicators
- Statistics: avg size, largest cluster, consensus/disagreement counts

---

## 🎯 Technical Stack

### Backend:
- **Framework:** FastAPI (Python)
- **LLM:** Groq (llama-3.3-70b-versatile)
- **Embeddings:** Pinecone Inference API (multilingual-e5-large, 1024D)
- **Vector DB:** Pinecone v6 (serverless)
- **News:** NewsAPI.org

### APIs Required:
- ✅ NewsAPI key (100 requests/day free)
- ✅ Groq API key (30 requests/min free)
- ✅ Pinecone API key (embedding + storage free tier)

### Cost:
- **Total: $0/month** (all within free tiers)

---

## 📈 Performance Metrics

### Full Pipeline (10 articles):
- News fetch: ~2 seconds
- Bias classification: <1 second
- Claim extraction: ~15 seconds (10 articles)
- Embedding generation: ~1-2 seconds (30 claims)
- Vector storage: ~0.5 seconds
- Clustering: ~20-30 seconds (includes Pinecone queries)
- **Total: ~40-50 seconds**

### Quality Metrics:
- Article quality: ✅ High (filtered, deduplicated)
- Bias coverage: ✅ 85.7%
- Claim extraction: ✅ Atomic, factual, no opinions
- Embedding accuracy: ✅ 1024D semantic vectors
- Clustering quality: ✅ No duplicates, all claims accounted for

---

## 📁 Project Structure

```
Drishtikon/
├── app/
│   ├── main.py                    # FastAPI app
│   ├── routes/
│   │   └── analyze.py            # Main endpoint (Steps 2-6)
│   ├── services/
│   │   ├── news_service.py       # Step 2: News aggregation
│   │   ├── bias_service.py       # Step 3: Bias classification
│   │   ├── llm_service.py        # Step 4: Claim extraction
│   │   ├── embedding_service.py  # Step 5: Embeddings
│   │   ├── pinecone_service.py   # Step 5: Vector storage
│   │   └── clustering_service.py # Step 6: Clustering
│   └── models/
│       └── schemas.py            # Pydantic models
├── demo.html                      # Demo UI (Steps 1-6)
├── test_step2.py                 # News aggregation tests
├── test_step3.py                 # Bias classification tests
├── test_step4.py                 # Claim extraction tests
├── test_step5.py                 # Embeddings tests
├── test_step6.py                 # Clustering tests
├── requirements.txt              # Python dependencies
├── .env                          # API keys (user configured)
└── STEPx_COMPLETE.md            # Completion docs
```

---

## 🚀 What Works Right Now

### Via API (`http://localhost:8001/api/analyze`):
```bash
curl -X POST http://localhost:8001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"topic": "your topic here"}'
```

**Returns:**
- Article metadata (title, source, bias, URL)
- Extracted claims per article
- Cluster groups with consensus levels
- Cluster statistics
- Source and bias distribution

### Via Demo UI (`demo.html`):
1. Open in browser
2. Enter any topic
3. See complete analysis including:
   - Articles with bias labels
   - Extracted claims
   - **Intelligent clusters** ⭐
   - Consensus indicators
   - Statistics dashboard

---

## 🎯 What's Next (Remaining Steps)

### Step 7: Consensus Analysis (Not Started)
- Identify high consensus claims (widely agreed)
- Identify disagreements (conflicting claims)
- Analyze bias patterns in consensus/disagreement
- Generate consensus summary

### Step 8: Frontend Development (Not Started)
- React application
- Tailwind CSS styling
- Animated hero theme: https://21st.dev/community/components/tommyjepsen/animated-hero/default
- Interactive cluster visualization
- **Use npx** (NOT npm)

### Step 9: Integration (Not Started)
- Connect React frontend to FastAPI backend
- Real-time updates
- Enhanced visualizations
- User experience polish

### Step 10: Deployment (Not Started)
- Frontend: Vercel
- Backend: Render
- Environment configuration
- Production optimization

---

## 💡 Key Achievements

1. **Zero Cost:** All within free tiers
2. **High Quality:** 85% bias coverage, atomic claims, no duplicates
3. **Intelligent Clustering:** Union-Find algorithm (innovation)
4. **Fast:** ~40-50 seconds for complete analysis
5. **Modular:** Clean service architecture
6. **Tested:** Comprehensive test scripts for each step
7. **Documented:** Complete documentation for Steps 1-6

---

## 🎨 How to View Progress

### Option 1: Demo UI (Recommended)
```bash
# Open in browser:
file:///home/kirmaada/Projects/Drishtikon/demo.html

# Or use xdg-open:
xdg-open /home/kirmaada/Projects/Drishtikon/demo.html
```

**Features:**
- ✅ Beautiful gradient UI
- ✅ Real-time API integration
- ✅ Article cards with bias badges
- ✅ Expandable claim lists
- ✅ **NEW: Cluster visualization** ⭐
- ✅ Consensus indicators
- ✅ Statistics dashboard

### Option 2: API Documentation
```
http://localhost:8001/docs
```
- Auto-generated FastAPI docs
- Interactive API testing
- Schema definitions

### Option 3: Test Scripts
```bash
cd /home/kirmaada/Projects/Drishtikon
source venv/bin/activate

# Test each step individually:
python test_step2.py  # News aggregation
python test_step3.py  # Bias classification
python test_step4.py  # Claim extraction
python test_step5.py  # Embeddings
python test_step6.py  # Clustering
```

---

## 📊 Progress: 60% Complete

```
✅ Step 1: Backend Foundation
✅ Step 2: News Aggregation
✅ Step 3: Bias Classification
✅ Step 4: Claim Extraction
✅ Step 5: Embeddings + Vector Storage
✅ Step 6: Intelligent Clustering
⬜ Step 7: Consensus Analysis
⬜ Step 8: Frontend (React + Animated Hero Theme)
⬜ Step 9: Integration
⬜ Step 10: Deployment
```

**Timeline:** 6 out of 10 steps complete

---

## 🎉 Current Capabilities

✅ Fetch news from 100+ sources  
✅ Classify source bias (85% coverage)  
✅ Extract atomic factual claims (no opinions)  
✅ Generate semantic embeddings (1024D)  
✅ Store in vector database (Pinecone)  
✅ Intelligently cluster similar claims  
✅ Calculate consensus levels  
✅ Provide structured API responses  
✅ Beautiful demo UI with clustering visualization  

---

**Ready for Step 7: Consensus Analysis!** 🚀
