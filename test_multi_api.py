#!/usr/bin/env python3
"""
Test script for multi-source news API integration
"""
import asyncio
import sys
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/home/kirmaada/Projects/Drishtikon/.env')

sys.path.append('/home/kirmaada/Projects/Drishtikon')

from app.services.news_service import NewsService


async def test_multi_api_fetch():
    """Test fetching from all three news APIs"""
    
    print("=" * 70)
    print("Testing Multi-Source News API Integration (India-focused)")
    print("=" * 70)
    print()
    
    news_service = NewsService()
    
    # Test topic
    topic = "economy"
    print(f"📰 Fetching articles for topic: '{topic}'\n")
    
    # Fetch articles
    articles = await news_service.fetch_articles(topic, max_results=21)
    
    print("\n" + "=" * 70)
    print(f"RESULTS: {len(articles)} articles fetched")
    print("=" * 70)
    print()
    
    # Display results by source
    sources_count = {}
    for article in articles:
        source = article.source
        sources_count[source] = sources_count.get(source, 0) + 1
    
    print("Articles by source:")
    for source, count in sorted(sources_count.items()):
        print(f"  • {source}: {count} articles")
    
    print("\n" + "=" * 70)
    print("Sample Articles:")
    print("=" * 70)
    print()
    
    # Show first 5 articles
    for i, article in enumerate(articles[:5], 1):
        print(f"{i}. {article.title}")
        print(f"   Source: {article.source}")
        print(f"   URL: {article.url[:60]}...")
        print(f"   Content length: {len(article.content)} chars")
        print()
    
    print("=" * 70)
    print("✅ Multi-API Integration Test Complete!")
    print("=" * 70)


if __name__ == "__main__":
    asyncio.run(test_multi_api_fetch())
