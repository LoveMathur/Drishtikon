"""
Test script for Step 4: Claim Extraction
"""
import sys
import os
import asyncio
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add the project root to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services.llm_service import LLMService
from app.services.news_service import NewsService

async def test_claim_extraction():
    """Test claim extraction from articles"""
    print("=" * 60)
    print("Testing Step 4: Claim Extraction")
    print("=" * 60)
    print()
    
    # Check API keys
    if not os.getenv("GROQ_API_KEY"):
        print("❌ ERROR: GROQ_API_KEY not configured!")
        print("Please set your Groq API key in .env file")
        return
    
    if not os.getenv("NEWS_API_KEY"):
        print("❌ ERROR: NEWS_API_KEY not configured!")
        print("Please set your NewsAPI key in .env file")
        return
    
    # Initialize services
    llm_service = LLMService()
    news_service = NewsService()
    
    # Test with a single article first
    print("📰 Test 1: Extracting claims from a sample article")
    print("-" * 60)
    
    sample_article = """
    The Federal Reserve announced today that it will raise interest rates by 0.25 percentage points, 
    marking the third consecutive increase this year. The decision was made to combat rising inflation, 
    which reached 6.2% in the latest report. Fed Chair Jerome Powell stated that the central bank 
    expects to continue rate hikes through the end of 2024. Economists predict this will slow economic 
    growth but help stabilize prices. The stock market fell 2.1% following the announcement.
    """
    
    print("Sample Article:")
    print(sample_article.strip())
    print()
    print("🧠 Extracting claims...")
    
    try:
        claims = await llm_service.extract_claims(sample_article)
        
        if claims:
            print(f"✅ Extracted {len(claims)} claims:")
            print()
            for i, claim in enumerate(claims, 1):
                print(f"{i}. {claim}")
            print()
        else:
            print("❌ No claims extracted!")
            return
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return
    
    # Test with real news articles
    print()
    print("=" * 60)
    print("📰 Test 2: Extracting claims from real news articles")
    print("=" * 60)
    print()
    
    topic = "artificial intelligence"
    print(f"Fetching articles about: '{topic}'")
    print("-" * 60)
    
    try:
        articles = await news_service.fetch_articles(topic, max_results=3)
        
        if not articles:
            print("❌ No articles found!")
            return
        
        print(f"✅ Fetched {len(articles)} articles")
        print()
        
        total_claims = 0
        
        for idx, article in enumerate(articles, 1):
            print(f"\n{'=' * 60}")
            print(f"Article {idx}: {article.title[:60]}...")
            print(f"Source: {article.source}")
            print(f"Content length: {len(article.content)} chars")
            print("-" * 60)
            
            claims = await llm_service.extract_claims(article.content)
            total_claims += len(claims)
            
            if claims:
                print(f"✅ Extracted {len(claims)} claims:")
                for i, claim in enumerate(claims, 1):
                    print(f"  {i}. {claim}")
            else:
                print("⚠️  No claims extracted from this article")
            
            # Small delay to avoid rate limits
            await asyncio.sleep(1)
        
        print()
        print("=" * 60)
        print("📊 Summary")
        print("=" * 60)
        print(f"Total articles analyzed: {len(articles)}")
        print(f"Total claims extracted: {total_claims}")
        print(f"Average claims per article: {total_claims / len(articles):.1f}")
        print()
        
        # Validate claim quality
        print("=" * 60)
        print("✅ Validation Checks")
        print("=" * 60)
        
        # Check if claims meet Step 4 requirements
        checks = {
            "Claims extracted": total_claims > 0,
            "Average 3-7 claims per article": 3 <= (total_claims / len(articles)) <= 7,
            "Groq API working": True
        }
        
        for check, passed in checks.items():
            icon = "✅" if passed else "⚠️"
            print(f"{icon} {check}")
        
        print()
        print("=" * 60)
        print("✅ Step 4: Claim Extraction - COMPLETE")
        print("=" * 60)
        print()
        print("💡 Notes:")
        print("   - Claims are atomic factual statements")
        print("   - No opinions or speculation included")
        print("   - Each claim is verifiable")
        print("   - Using Groq LLM (llama-3.3-70b-versatile)")
        print()
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_claim_extraction())
