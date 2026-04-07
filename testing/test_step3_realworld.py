"""
Test Step 3: Bias Classification with Real NewsAPI Data
"""
import sys
import os
import asyncio
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add the project root to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services.news_service import NewsService
from app.services.bias_service import BiasService

async def test_realworld_bias():
    """Test bias classification with real news articles"""
    print("=" * 60)
    print("Testing Step 3: Bias Classification (Real-World)")
    print("=" * 60)
    print()
    
    # Check API key
    if not os.getenv("NEWS_API_KEY"):
        print("❌ ERROR: NEWS_API_KEY not configured!")
        print("Please set your NewsAPI key in .env file")
        return
    
    # Initialize services
    news_service = NewsService()
    bias_service = BiasService()
    
    # Test topic
    topic = "artificial intelligence"
    print(f"📰 Fetching articles about: '{topic}'")
    print("-" * 60)
    
    try:
        # Fetch articles
        articles = await news_service.fetch_articles(topic, max_results=15)
        
        if not articles:
            print("❌ No articles found!")
            return
        
        print(f"✅ Found {len(articles)} articles")
        print()
        
        # Classify bias for each article
        bias_counts = {}
        
        print("📊 Article Bias Classification:")
        print("-" * 60)
        
        for i, article in enumerate(articles, 1):
            bias = bias_service.classify_bias(article.source)
            article.bias = bias
            
            # Count biases
            if bias not in bias_counts:
                bias_counts[bias] = 0
            bias_counts[bias] += 1
            
            # Icon based on bias
            if "left" in bias:
                icon = "🔵"
            elif "right" in bias:
                icon = "🔴"
            elif bias == "center":
                icon = "⚪"
            else:
                icon = "⚫"
            
            # Truncate title for display
            title = article.title[:50] + "..." if len(article.title) > 50 else article.title
            print(f"{i:2}. {icon} [{bias.upper():<12}] {article.source}")
            print(f"    {title}")
            print()
        
        print("=" * 60)
        print("📈 Bias Distribution:")
        print("=" * 60)
        
        for bias in sorted(bias_counts.keys()):
            count = bias_counts[bias]
            percentage = (count / len(articles)) * 100
            bar = "█" * max(1, int(count * 2))
            print(f"{bias.upper():<15} | {bar} {count} ({percentage:.1f}%)")
        
        print()
        
        # Calculate mapping coverage
        mapped = sum(1 for a in articles if bias_service.classify_bias(a.source) != "unknown")
        coverage = (mapped / len(articles)) * 100
        
        print("=" * 60)
        print(f"✅ Coverage: {mapped}/{len(articles)} sources recognized ({coverage:.1f}%)")
        print("=" * 60)
        
        # Show unknown sources
        unknown_sources = set()
        for article in articles:
            if bias_service.classify_bias(article.source) == "unknown":
                unknown_sources.add(article.source)
        
        if unknown_sources:
            print()
            print("💡 Unknown Sources (can be added to bias_map):")
            for source in sorted(unknown_sources):
                print(f"   - {source}")
        
        print()
        print("=" * 60)
        print("✅ Step 3: Bias Classification - WORKING WITH REAL DATA")
        print("=" * 60)
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_realworld_bias())
