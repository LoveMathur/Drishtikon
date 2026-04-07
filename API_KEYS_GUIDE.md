# 🔑 API Keys & Configuration Guide

## Required API Keys

### 1. Groq API (LLM) - FREE ✅
**What**: Fast LLM inference for claim extraction
**Cost**: Free tier available
**Get Key**: https://console.groq.com/

Steps:
1. Go to https://console.groq.com/
2. Sign up / Log in
3. Navigate to "API Keys"
4. Create new API key
5. Copy and paste into `.env` as `GROQ_API_KEY`

### 2. Pinecone (Vector Database + Embeddings) - FREE TIER ✅
**What**: Vector database + hosted embedding model
**Cost**: Free tier (1 serverless index, includes inference API)
**Get Key**: https://app.pinecone.io/

**Note**: Pinecone hosts the NVIDIA embedding model for you! No separate NVIDIA API key needed.

Steps:
1. Go to https://app.pinecone.io/
2. Sign up / Log in
3. Navigate to "API Keys"
4. Copy your API key
5. Paste into `.env` as `PINECONE_API_KEY`

**Get Host URL**:
1. Go to your indexes
2. Click on "drishtikon-claims" (your existing index)
3. Look for the **Host** field
4. Copy the full URL (e.g., `drishtikon-claims-xxxxx.svc.xxx.pinecone.io`)
5. Paste into `.env` as `PINECONE_HOST`

### 3. NewsAPI (News Sources) - FREE TIER ✅
**What**: News article aggregation
**Cost**: Free tier (100 requests/day)
**Get Key**: https://newsapi.org/

Steps:
1. Go to https://newsapi.org/
2. Sign up for free account
3. Get your API key from dashboard
4. Copy and paste into `.env` as `NEWS_API_KEY`

## ⚙️ Complete .env Configuration

```env
# API Keys (Only 3 needed!)
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEWS_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PINECONE_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Pinecone Configuration
# Pinecone hosts the embedding model - no separate NVIDIA key needed!
PINECONE_INDEX_NAME=drishtikon-claims
PINECONE_HOST=drishtikon-claims-xxxxx.svc.xxx.pinecone.io

# Model Configuration
GROQ_MODEL=llama-3.3-70b-versatile
PINECONE_EMBED_MODEL=nvidia/llama-3.2-nv-embedqa-1b-v2
EMBEDDING_DIMENSION=4096

# Application Settings
DEBUG=True
PORT=8000
```

## 🔍 Verification

After setting up all keys, test the configuration:

```bash
# Activate virtual environment
source venv/bin/activate

# Start the server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# In another terminal, test the API
curl http://localhost:8000/
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"topic": "AI regulation"}'
```

## 💰 Cost Breakdown

- **Groq**: FREE (with rate limits)
- **Pinecone**: FREE (1 serverless index + inference API included)
- **NewsAPI**: FREE (100 requests/day)

**Total Monthly Cost**: $0 (within free tiers) 🎉

**Note**: Pinecone hosts the NVIDIA embedding model for you as part of their Inference API - no additional cost or separate API key needed!

## 📊 Rate Limits (Free Tiers)

- **Groq**: ~30 requests/minute
- **Pinecone Inference**: Check current limits in Pinecone console
- **Pinecone Storage**: 100k vectors, unlimited queries
- **NewsAPI**: 100 requests/day

## 🚨 Troubleshooting

### "Pinecone API key not configured"
- Make sure `PINECONE_API_KEY` is set in `.env`
- Verify `PINECONE_HOST` is the full host URL from your index
- Make sure your index name matches `PINECONE_INDEX_NAME`

### "Error generating embedding"
- Check that your Pinecone index was created with inference enabled
- Verify the model name matches: `nvidia/llama-3.2-nv-embedqa-1b-v2`
- Check your Pinecone plan includes inference API access

### "Pinecone index not initialized"
- Check `PINECONE_API_KEY` is correct
- Verify `PINECONE_HOST` is the full host URL from your index
- Make sure your index exists and is active

### "Rate limit exceeded"
- Groq: Wait 1 minute or upgrade plan
- Pinecone: Check your quota in Pinecone console
- NewsAPI: You've hit daily limit (100 req/day)

## 🎯 Next Steps

Once all keys are configured:
1. ✅ Test each service individually
2. ✅ Proceed with Step 2: News Aggregation
3. ✅ Continue building the pipeline
