# Multi-Source News API Integration ✅

## Implementation Complete

Successfully integrated **3 news APIs** to fetch India-focused news articles:
1. **NewsAPI** (newsapi.org)
2. **GNews** (gnews.io)  
3. **NewsData.io** (newsdata.io)

## Key Features

### 1. **India-Focused Fetching** 🇮🇳
All three APIs are configured to prioritize Indian news:
- **NewsAPI**: Uses `country=in` for top headlines, adds "India" to search queries
- **GNews**: `country=in` parameter
- **NewsData.io**: `country=in` parameter

### 2. **7 Articles Per Source**
- Each API fetches **7 articles**
- Total: **21 articles** from all sources combined
- Ensures diversity and comprehensive coverage

### 3. **Parallel Fetching**
- All three APIs are queried **simultaneously** (async)
- Faster response times
- Single httpx.AsyncClient session

### 4. **Format Normalization**
All APIs return different formats, converted to unified structure:
```python
{
    "title": str,
    "source": str,  # e.g., "BBC (GNews)"
    "url": str,
    "content": str,
    "publishedAt": str
}
```

### 5. **Duplicate Removal**
- Articles are deduplicated **across all sources**
- Title similarity check (80% threshold)
- Ensures no duplicate analysis

### 6. **Quality Filtering**
- Minimum 100 characters of content
- Removes truncated content indicators
- Skips invalid/empty articles

## API Endpoints Used

### NewsAPI
- **Top Headlines**: `/v2/top-headlines?country=in`
- **Everything**: `/v2/everything?q={topic} India`

### GNews
- **Search**: `/v4/search?q={topic}&country=in&lang=en`

### NewsData.io
- **Latest**: `/1/latest?q={topic}&country=in&language=en`

## Configuration

All API keys are loaded from `.env`:
```env
NEWS_API_KEY=8c1284a622cf43eba4b3455d9822d0d6
G_NEWS_API_KEY=faf4dd78d8c13895a5cdc69132730172
NEWS_DATA_API_KEY=pub_b9492a5dfc4b4d22b2de43900fcc9b1a
```

## Processing Pipeline

```
1. User Query (e.g., "climate change")
   ↓
2. Fetch from 3 APIs in parallel (7 articles each)
   ↓
3. Normalize formats to unified Article schema
   ↓
4. Filter out low-quality articles
   ↓
5. Remove duplicates across sources
   ↓
6. Pass to existing pipeline:
   - Clustering (clustering_service.py)
   - Bias Detection (bias_service.py)
   - Consensus Analysis (consensus_service.py)
   - LLM Processing (llm_service.py)
```

## Changes Made

### File: `app/services/news_service.py`

**Updated:**
- ✅ Added GNews and NewsData.io API support
- ✅ Implemented India-focused filtering
- ✅ Parallel async fetching from all sources
- ✅ Format conversion for each API
- ✅ Source tagging (e.g., "BBC (GNews)")
- ✅ Enhanced duplicate detection
- ✅ Better error handling per source

**New Methods:**
- `_fetch_from_gnews()` - GNews API integration
- `_fetch_from_newsdata()` - NewsData.io API integration

**Modified Methods:**
- `fetch_articles()` - Now fetches from all 3 sources
- `_fetch_from_newsapi()` - Added India focus and client parameter
- `_process_articles()` - Handles all API formats

## Example Flow

### User searches for "climate change"

**NewsAPI fetches:**
- 7 articles about "climate change India"

**GNews fetches:**
- 7 articles from India about "climate change"

**NewsData.io fetches:**
- 7 articles from India about "climate change"

**Result:**
- ~21 unique articles from diverse sources
- All India-focused or India-relevant
- Ready for clustering, bias, consensus analysis

## Trending Page Behavior

When user clicks **"Trending"**:
- NewsAPI: Uses `/top-headlines?country=in`
- GNews: Searches trending topics with `country=in`
- NewsData.io: Latest news with `country=in`

Result: **India's top stories** from all sources

## Benefits

### Diversity
- 3 different API sources prevent single-point failure
- More comprehensive coverage

### India Focus
- Every query prioritizes Indian content
- Relevant to target audience

### Scalability
- Easy to add more APIs in future
- Modular design per API

### Quality
- Multiple sources increase credibility
- Cross-source verification possible

## Testing

To test the updated service:

```bash
# Restart backend
cd /home/kirmaada/Projects/Drishtikon
source venv/bin/activate
uvicorn app.main:app --reload --port 8001
```

Then test via frontend:
1. Search for any topic
2. Check backend logs for:
   - ✅ NewsAPI: Fetched X articles
   - ✅ GNews: Fetched X articles  
   - ✅ NewsData: Fetched X articles
   - ✅ Total: X unique articles

## Error Handling

If any API fails:
- Others continue working
- Graceful degradation
- Logs show which API failed
- User still gets results from working APIs

---

**Status**: ✅ All 3 APIs integrated and India-focused
**Articles per query**: 7 per source (21 total)
**Processing**: All existing services work on combined articles
**Ready for**: Clustering, bias, consensus, LLM analysis
