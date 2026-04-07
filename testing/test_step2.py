"""
Test script for Step 2: News Aggregation
"""
import asyncio
import sys
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.news_service import NewsService
from app.services.bias_service import BiasService


async def test_news_service():
    """Test the news aggregation service"""
    print("=" * 60)
    print("Testing Step 2: News Aggregation")
    print("=" * 60)
    
    # Check API key
    api_key = os.getenv("NEWS_API_KEY")
    if not api_key or api_key == "your_news_api_key_here":
        print("\n❌ ERROR: NEWS_API_KEY not configured!")
        print("Please set your NewsAPI key in .env file")
        print("Get your free key at: https://newsapi.org/")
        return
    
    print(f"\n✅ NEWS_API_KEY found: {api_key[:10]}...")
    
    # Initialize services
    news_service = NewsService()
    bias_service = BiasService()
    
    # Test with a topic
    test_topic = "climate change"
    print(f"\n🔍 Fetching articles for topic: '{test_topic}'")
    print("-" * 60)
    
    try:
        articles = await news_service.fetch_articles(test_topic, max_results=10)
        
        if not articles:
            print("❌ No articles found. Possible reasons:")
            print("   - Invalid API key")
            print("   - Rate limit exceeded (free tier: 100 req/day)")
            print("   - No recent articles for this topic")
            return
        
        print(f"\n✅ Successfully fetched {len(articles)} articles!\n")
        
        # Display article details
        for i, article in enumerate(articles, 1):
            bias = bias_service.classify_bias(article.source)
            print(f"{i}. {article.title[:70]}...")
            print(f"   Source: {article.source} | Bias: {bias}")
            print(f"   Content length: {len(article.content)} chars")
            print(f"   URL: {article.url[:60]}...")
            print()
        
        # Summary
        print("=" * 60)
        print("Summary:")
        print(f"  Total articles: {len(articles)}")
        
        # Count by bias
        bias_counts = {}
        for article in articles:
            bias = bias_service.classify_bias(article.source)
            bias_counts[bias] = bias_counts.get(bias, 0) + 1
        
        print(f"  Bias distribution:")
        for bias, count in bias_counts.items():
            print(f"    - {bias}: {count}")
        
        print("\n✅ Step 2: News Aggregation - PASSED!")
        
    except Exception as e:
        print(f"\n❌ Error during testing: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(test_news_service())
