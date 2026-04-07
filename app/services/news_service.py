"""
News Service - Handles fetching news articles from NewsAPI
"""
import os
from typing import List, Optional
import httpx
from datetime import datetime, timedelta
from app.models.schemas import Article


class NewsService:
    """Service for fetching news articles from NewsAPI"""
    
    def __init__(self):
        self.api_key = os.getenv("NEWS_API_KEY")
        self.base_url = "https://newsapi.org/v2"
        
    async def fetch_articles(self, topic: str, max_results: int = 15) -> List[Article]:
        """
        Fetch news articles for a given topic from NewsAPI
        
        Args:
            topic: The news topic to search for
            max_results: Maximum number of articles to fetch (default 15)
            
        Returns:
            List of Article objects with unique, usable content
        """
        if not self.api_key:
            raise ValueError("NEWS_API_KEY not configured in .env")
        
        try:
            # Fetch from NewsAPI everything endpoint (last 30 days)
            articles = await self._fetch_from_newsapi(topic, max_results)
            
            # Filter and clean articles
            valid_articles = self._process_articles(articles)
            
            # Remove duplicates
            unique_articles = self._remove_duplicates(valid_articles)
            
            print(f"✅ Fetched {len(unique_articles)} unique articles for topic: '{topic}'")
            return unique_articles[:max_results]
            
        except Exception as e:
            print(f"❌ Error fetching articles: {e}")
            return []
    
    async def _fetch_from_newsapi(self, topic: str, max_results: int) -> List[dict]:
        """Fetch articles from NewsAPI"""
        
        # Calculate date range (last 7 days for better results)
        to_date = datetime.now()
        from_date = to_date - timedelta(days=7)
        
        params = {
            "q": topic,
            "apiKey": self.api_key,
            "language": "en",
            "sortBy": "relevancy",
            "pageSize": min(max_results, 100),  # NewsAPI max is 100
            "from": from_date.strftime("%Y-%m-%d"),
            "to": to_date.strftime("%Y-%m-%d")
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/everything",
                params=params,
                timeout=30.0
            )
            
            if response.status_code != 200:
                print(f"⚠️ NewsAPI returned status {response.status_code}: {response.text}")
                return []
            
            data = response.json()
            
            if data.get("status") != "ok":
                print(f"⚠️ NewsAPI error: {data.get('message', 'Unknown error')}")
                return []
            
            return data.get("articles", [])
    
    def _process_articles(self, raw_articles: List[dict]) -> List[Article]:
        """Process and clean raw articles from API"""
        processed = []
        
        for article_data in raw_articles:
            # Skip articles without content
            content = article_data.get("content") or article_data.get("description") or ""
            
            # NewsAPI often truncates content with "[+X chars]"
            # Remove this truncation indicator
            if "[+" in content and "chars]" in content:
                content = content.split("[+")[0].strip()
            
            # Skip if content is too short (less than 100 chars)
            if len(content) < 100:
                continue
            
            # Skip if content is just a title repeat
            title = article_data.get("title", "")
            if content == title:
                continue
            
            # Create Article object
            try:
                article = Article(
                    title=title,
                    source=article_data.get("source", {}).get("name", "Unknown"),
                    url=article_data.get("url", ""),
                    content=content,
                    published_at=article_data.get("publishedAt")
                )
                processed.append(article)
            except Exception as e:
                print(f"⚠️ Skipping invalid article: {e}")
                continue
        
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

