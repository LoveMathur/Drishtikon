"""
News Service - Handles fetching news articles from multiple sources
Supports: NewsAPI, GNews, NewsData.io
"""
import os
from typing import List, Optional
import httpx
from datetime import datetime, timedelta
from app.models.schemas import Article


class NewsService:
    """Service for fetching news articles from multiple sources (India-focused)"""
    
    def __init__(self):
        # API Keys
        self.news_api_key = os.getenv("NEWS_API_KEY")
        self.gnews_api_key = os.getenv("G_NEWS_API_KEY")
        self.newsdata_api_key = os.getenv("NEWS_DATA_API_KEY")
        
        # Base URLs
        self.newsapi_base = "https://newsapi.org/v2"
        self.gnews_base = "https://gnews.io/api/v4"
        self.newsdata_base = "https://newsdata.io/api/1"
        
    async def fetch_articles(self, topic: str, max_results: int = 21) -> List[Article]:
        """
        Fetch news articles for a given topic from all sources (India-focused)
        
        Args:
            topic: The news topic to search for
            max_results: Maximum number of articles to fetch total (default 21, 7 per source)
            
        Returns:
            List of Article objects from all sources combined
        """
        all_articles = []
        articles_per_source = 7  # Fetch 7 from each source
        
        print(f"🔍 Starting multi-API fetch for topic: '{topic}'")
        print(f"   API Keys available:")
        print(f"   - NewsAPI: {'✅' if self.news_api_key else '❌'}")
        print(f"   - GNews: {'✅' if self.gnews_api_key else '❌'}")
        print(f"   - NewsData: {'✅' if self.newsdata_api_key else '❌'}")
        print()
        
        # Fetch from all three sources in parallel
        try:
            async with httpx.AsyncClient() as client:
                # Fetch from NewsAPI (India-focused)
                if self.news_api_key:
                    print("📡 Fetching from NewsAPI...")
                    newsapi_articles = await self._fetch_from_newsapi(client, topic, articles_per_source)
                    all_articles.extend(newsapi_articles)
                    print(f"✅ NewsAPI: Fetched {len(newsapi_articles)} articles")
                
                # Fetch from GNews (India-focused)
                if self.gnews_api_key:
                    print("📡 Fetching from GNews...")
                    gnews_articles = await self._fetch_from_gnews(client, topic, articles_per_source)
                    all_articles.extend(gnews_articles)
                    print(f"✅ GNews: Fetched {len(gnews_articles)} articles")
                
                # Fetch from NewsData.io (India-focused)
                if self.newsdata_api_key:
                    print("📡 Fetching from NewsData...")
                    newsdata_articles = await self._fetch_from_newsdata(client, topic, articles_per_source)
                    all_articles.extend(newsdata_articles)
                    print(f"✅ NewsData: Fetched {len(newsdata_articles)} articles")
            
            print(f"\n📊 Total raw articles fetched: {len(all_articles)}")
            
            # Filter and clean articles
            valid_articles = self._process_articles(all_articles)
            
            # Remove duplicates across all sources
            unique_articles = self._remove_duplicates(valid_articles)
            
            print(f"✅ Total: {len(unique_articles)} unique articles for topic: '{topic}'")
            return unique_articles[:max_results]
            
        except Exception as e:
            print(f"❌ Error fetching articles: {e}")
            import traceback
            traceback.print_exc()
            return []
    
    async def fetch_trending(self, max_results: int = 20) -> List[Article]:
        """
        Fetch trending/top headlines from all sources for the trending page.
        Lightweight — no claim extraction needed.
        """
        all_articles = []
        articles_per_source = 8
        
        try:
            async with httpx.AsyncClient() as client:
                # NewsAPI top headlines
                if self.news_api_key:
                    try:
                        response = await client.get(
                            f"{self.newsapi_base}/top-headlines",
                            params={
                                "country": "in",
                                "apiKey": self.news_api_key,
                                "pageSize": articles_per_source
                            },
                            timeout=30.0
                        )
                        if response.status_code == 200:
                            data = response.json()
                            for a in data.get("articles", []):
                                a['_api_source'] = 'NewsAPI'
                            all_articles.extend(data.get("articles", []))
                    except Exception as e:
                        print(f"⚠️ NewsAPI trending error: {e}")
                
                # GNews top headlines
                if self.gnews_api_key:
                    try:
                        response = await client.get(
                            f"{self.gnews_base}/top-headlines",
                            params={
                                "lang": "en",
                                "country": "in",
                                "apikey": self.gnews_api_key,
                                "max": articles_per_source
                            },
                            timeout=30.0
                        )
                        if response.status_code == 200:
                            data = response.json()
                            for article in data.get("articles", []):
                                converted = {
                                    "title": article.get("title", ""),
                                    "description": article.get("description", ""),
                                    "content": article.get("content", ""),
                                    "url": article.get("url", ""),
                                    "urlToImage": article.get("image", ""),
                                    "publishedAt": article.get("publishedAt", ""),
                                    "source": {"name": article.get("source", {}).get("name", "GNews Source")},
                                    "_api_source": "GNews"
                                }
                                all_articles.append(converted)
                    except Exception as e:
                        print(f"⚠️ GNews trending error: {e}")
                
                # NewsData top headlines
                if self.newsdata_api_key:
                    try:
                        response = await client.get(
                            f"{self.newsdata_base}/latest",
                            params={
                                "apikey": self.newsdata_api_key,
                                "language": "en",
                                "country": "in",
                                "size": articles_per_source
                            },
                            timeout=30.0
                        )
                        if response.status_code == 200:
                            data = response.json()
                            if data.get("status") == "success":
                                for article in data.get("results", []):
                                    converted = {
                                        "title": article.get("title", ""),
                                        "description": article.get("description", ""),
                                        "content": article.get("content") or article.get("description", ""),
                                        "url": article.get("link", ""),
                                        "urlToImage": article.get("image_url", ""),
                                        "publishedAt": article.get("pubDate", ""),
                                        "source": {"name": article.get("source_id", "NewsData Source")},
                                        "_api_source": "NewsData"
                                    }
                                    all_articles.append(converted)
                    except Exception as e:
                        print(f"⚠️ NewsData trending error: {e}")
            
            # Process into Article objects
            valid_articles = self._process_articles(all_articles)
            unique_articles = self._remove_duplicates(valid_articles)
            return unique_articles[:max_results]
            
        except Exception as e:
            print(f"❌ Error fetching trending: {e}")
            return []
    
    async def _fetch_from_newsapi(self, client: httpx.AsyncClient, topic: str, max_results: int) -> List[dict]:
        """Fetch articles from NewsAPI (India-focused)"""
        
        # Calculate date range (last 7 days for better results)
        to_date = datetime.now()
        from_date = to_date - timedelta(days=7)
        
        # Use top-headlines for generic topics, everything for specific searches
        if topic.lower() in ["trending", "top", "latest", "news"]:
            endpoint = f"{self.newsapi_base}/top-headlines"
            params = {
                "country": "in",
                "apiKey": self.news_api_key,
                "pageSize": max_results
            }
        else:
            # Use everything endpoint — do NOT append "India" to the query
            # GNews and NewsData already filter by country=in
            # Appending "India" distorts search results and makes NewsAPI
            # the only source returning anything for non-India-specific queries
            endpoint = f"{self.newsapi_base}/everything"
            params = {
                "q": topic,
                "apiKey": self.news_api_key,
                "language": "en",
                "sortBy": "relevancy",
                "pageSize": max_results,
                "from": from_date.strftime("%Y-%m-%d"),
                "to": to_date.strftime("%Y-%m-%d")
            }
        
        try:
            response = await client.get(endpoint, params=params, timeout=30.0)
            
            if response.status_code != 200:
                print(f"⚠️ NewsAPI returned status {response.status_code}")
                return []
            
            data = response.json()
            
            if data.get("status") != "ok":
                print(f"⚠️ NewsAPI error: {data.get('message', 'Unknown error')}")
                return []
            
            articles = data.get("articles", [])
            # Tag source
            for article in articles:
                article['_api_source'] = 'NewsAPI'
            
            return articles
            
        except Exception as e:
            print(f"⚠️ NewsAPI fetch error: {e}")
            return []
    
    async def _fetch_from_gnews(self, client: httpx.AsyncClient, topic: str, max_results: int) -> List[dict]:
        """Fetch articles from GNews.io (India-focused)"""
        
        params = {
            "q": topic,
            "apikey": self.gnews_api_key,
            "lang": "en",
            "country": "in",  # India focus
            "max": max_results,
            "sortby": "relevance"
        }
        
        try:
            response = await client.get(
                f"{self.gnews_base}/search",
                params=params,
                timeout=30.0
            )
            
            if response.status_code != 200:
                print(f"⚠️ GNews returned status {response.status_code}")
                return []
            
            data = response.json()
            articles = data.get("articles", [])
            
            # Convert GNews format to NewsAPI-like format
            converted_articles = []
            for article in articles:
                converted = {
                    "title": article.get("title", ""),
                    "description": article.get("description", ""),
                    "content": article.get("content", ""),
                    "url": article.get("url", ""),
                    "urlToImage": article.get("image", ""),
                    "publishedAt": article.get("publishedAt", ""),
                    "source": {
                        "name": article.get("source", {}).get("name", "GNews Source")
                    },
                    "_api_source": "GNews"
                }
                converted_articles.append(converted)
            
            return converted_articles
            
        except Exception as e:
            print(f"⚠️ GNews fetch error: {e}")
            return []
    
    async def _fetch_from_newsdata(self, client: httpx.AsyncClient, topic: str, max_results: int) -> List[dict]:
        """Fetch articles from NewsData.io (India-focused)"""
        
        params = {
            "q": topic,
            "apikey": self.newsdata_api_key,
            "language": "en",
            "country": "in",  # India focus
            "size": max_results
        }
        
        try:
            response = await client.get(
                f"{self.newsdata_base}/latest",
                params=params,
                timeout=30.0
            )
            
            if response.status_code != 200:
                print(f"⚠️ NewsData returned status {response.status_code}")
                return []
            
            data = response.json()
            
            if data.get("status") != "success":
                print(f"⚠️ NewsData error: {data.get('message', 'Unknown error')}")
                return []
            
            articles = data.get("results", [])
            
            # Convert NewsData format to NewsAPI-like format
            converted_articles = []
            for article in articles:
                converted = {
                    "title": article.get("title", ""),
                    "description": article.get("description", ""),
                    "content": article.get("content") or article.get("description", ""),
                    "url": article.get("link", ""),
                    "urlToImage": article.get("image_url", ""),
                    "publishedAt": article.get("pubDate", ""),
                    "source": {
                        "name": article.get("source_id", "NewsData Source")
                    },
                    "_api_source": "NewsData"
                }
                converted_articles.append(converted)
            
            return converted_articles
            
        except Exception as e:
            print(f"⚠️ NewsData fetch error: {e}")
            return []
    
    def _process_articles(self, raw_articles: List[dict]) -> List[Article]:
        """Process and clean raw articles from all APIs"""
        processed = []
        
        print(f"  Processing {len(raw_articles)} raw articles...")
        
        for article_data in raw_articles:
            # Skip articles without content
            content = article_data.get("content") or article_data.get("description") or ""
            
            # NewsAPI often truncates content with "[+X chars]"
            # Remove this truncation indicator
            if "[+" in content and "chars]" in content:
                content = content.split("[+")[0].strip()
            
            # Skip if content is too short (less than 50 chars - lowered from 100)
            if len(content) < 50:
                continue
            
            # Skip if content is just a title repeat
            title = article_data.get("title", "")
            if content == title:
                continue
            
            # Create Article object
            try:
                api_source = article_data.get("_api_source", "Unknown API")
                source_name = article_data.get("source", {}).get("name", "Unknown")
                
                # Extract image URL (each API uses different field names)
                image_url = (
                    article_data.get("urlToImage") or
                    article_data.get("image") or
                    article_data.get("image_url") or
                    ""
                )
                
                article = Article(
                    title=title,
                    source=f"{source_name} ({api_source})",  # Include API source
                    url=article_data.get("url", "") or article_data.get("link", ""),
                    content=content,
                    published_at=article_data.get("publishedAt") or article_data.get("pubDate"),
                    image_url=image_url if image_url else None,
                    api_source=api_source
                )
                processed.append(article)
            except Exception as e:
                print(f"⚠️ Skipping invalid article: {e}")
                continue
        
        print(f"  ✓ {len(processed)} articles passed processing")
        return processed
    
    def _remove_duplicates(self, articles: List[Article]) -> List[Article]:
        """Remove duplicate articles based on title similarity"""
        unique_articles = []
        seen_titles = set()
        
        for article in articles:
            # Normalize title for comparison (lowercase, remove special chars)
            normalized_title = "".join(c.lower() for c in article.title if c.isalnum() or c.isspace())
            
            # Check if we've seen a very similar title
            is_duplicate = False
            for seen_title in seen_titles:
                # Simple similarity check: if 80% of words match, consider duplicate
                title_words = set(normalized_title.split())
                seen_words = set(seen_title.split())
                
                if len(title_words) > 0:
                    similarity = len(title_words & seen_words) / len(title_words)
                    if similarity > 0.8:
                        is_duplicate = True
                        break
            
            if not is_duplicate:
                unique_articles.append(article)
                seen_titles.add(normalized_title)
        
        return unique_articles
    
    def get_source_bias(self, source_name: str) -> str:
        """
        Get bias classification for a news source
        (This will be enhanced with bias_service in later steps)
        """
        from app.services.bias_service import BiasService
        bias_service = BiasService()
        return bias_service.classify_bias(source_name)
