"""
Test script for Step 3: Bias Classification
"""
import sys
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add the project root to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services.bias_service import BiasService

def test_bias_classification():
    """Test bias classification service"""
    print("=" * 60)
    print("Testing Step 3: Bias Classification")
    print("=" * 60)
    print()
    
    # Initialize service
    bias_service = BiasService()
    
    # Test cases with various news sources
    test_sources = [
        # Left
        "CNN",
        "MSNBC",
        "HuffPost",
        "The New York Times",
        "Washington Post",
        
        # Center
        "BBC News",
        "Reuters",
        "Associated Press",
        "Bloomberg",
        
        # Right
        "Fox News",
        "Breitbart",
        "New York Post",
        "Wall Street Journal",
        
        # Unknown
        "Random News Source",
        "Tech Crunch",
        "Wired"
    ]
    
    print("📊 Testing Bias Classification for Various Sources:")
    print("-" * 60)
    
    bias_counts = {
        "left": 0,
        "center-left": 0,
        "center": 0,
        "center-right": 0,
        "right": 0,
        "unknown": 0
    }
    
    for source in test_sources:
        bias = bias_service.classify_bias(source)
        bias_counts[bias] += 1
        
        # Color coding for better readability
        if "left" in bias:
            icon = "🔵"
        elif "right" in bias:
            icon = "🔴"
        elif bias == "center":
            icon = "⚪"
        else:
            icon = "⚫"
        
        print(f"{icon} {source:<30} → {bias.upper()}")
    
    print()
    print("=" * 60)
    print("📈 Bias Distribution Summary:")
    print("=" * 60)
    
    for bias, count in bias_counts.items():
        if count > 0:
            percentage = (count / len(test_sources)) * 100
            bar = "█" * (count * 2)
            print(f"{bias.upper():<15} | {bar} {count} ({percentage:.1f}%)")
    
    print()
    
    # Test the mapping coverage
    total_mapped = sum(1 for source in test_sources if bias_service.classify_bias(source) != "unknown")
    coverage = (total_mapped / len(test_sources)) * 100
    
    print("=" * 60)
    print(f"✅ Coverage: {total_mapped}/{len(test_sources)} sources mapped ({coverage:.1f}%)")
    print("=" * 60)
    
    # Show all sources in the bias map
    print()
    print("📚 Current Bias Map Sources:")
    print("-" * 60)
    
    bias_groups = {}
    for source, bias in bias_service.bias_map.items():
        if bias not in bias_groups:
            bias_groups[bias] = []
        bias_groups[bias].append(source)
    
    for bias in ["left", "center-left", "center", "center-right", "right"]:
        if bias in bias_groups:
            sources = ", ".join(bias_groups[bias])
            print(f"{bias.upper():<15} : {sources}")
    
    print()
    print("=" * 60)
    print("✅ Step 3: Bias Classification - COMPLETE")
    print("=" * 60)
    print()
    print("Note: You can expand the bias_map in bias_service.py")
    print("      to include more news sources as needed.")
    print()

if __name__ == "__main__":
    try:
        test_bias_classification()
    except Exception as e:
        print(f"❌ Error testing bias classification: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
