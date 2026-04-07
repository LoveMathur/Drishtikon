#!/usr/bin/env python3
"""
Test Step 7: Consensus Analysis
Tests the consensus service and integration with the full pipeline.
"""

import os
import sys
import asyncio
from dotenv import load_dotenv

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

load_dotenv()

from app.services.consensus_service import ConsensusService
from app.models.schemas import ClaimCluster, Claim

async def test_consensus_analysis():
    """Test consensus analysis with mock clusters"""
    print("\n" + "="*60)
    print("Testing Step 7: Consensus Analysis")
    print("="*60 + "\n")
    
    # Initialize service
    consensus_service = ConsensusService()
    
    # Create mock clusters with different characteristics
    mock_clusters = [
        # High consensus cluster (multiple sources, multiple biases)
        ClaimCluster(
            cluster_id=1,
            claims=[
                Claim(text="Global temperatures increased 1.1°C above pre-industrial levels.", 
                      article_id="art1", source="bbc", bias="center-left"),
                Claim(text="Earth's average temperature has risen 1.1 degrees Celsius.", 
                      article_id="art2", source="nytimes", bias="center-left"),
                Claim(text="Climate data shows 1.1°C warming since 1850.", 
                      article_id="art3", source="reuters", bias="center")
            ],
            consensus_level=0.85,
            summary="Global temperatures have risen by 1.1°C since pre-industrial times."
        ),
        
        # Medium consensus cluster (fewer sources, same bias)
        ClaimCluster(
            cluster_id=2,
            claims=[
                Claim(text="EV sales grew 40% last year.", 
                      article_id="art4", source="techcrunch", bias="center-left"),
                Claim(text="Electric car purchases up 40% in 2023.", 
                      article_id="art5", source="theverge", bias="center-left")
            ],
            consensus_level=0.65,
            summary="Electric vehicle sales increased 40% in 2023."
        ),
        
        # Disagreement cluster (single source)
        ClaimCluster(
            cluster_id=3,
            claims=[
                Claim(text="Stock market hit record levels.", 
                      article_id="art6", source="wsj", bias="center-right")
            ],
            consensus_level=0.45,
            summary="Stock market reached all-time high."
        ),
        
        # Cross-spectrum consensus (diverse biases)
        ClaimCluster(
            cluster_id=4,
            claims=[
                Claim(text="Unemployment dropped to 3.7 percent.", 
                      article_id="art7", source="foxnews", bias="right"),
                Claim(text="Jobless rate at 3.7%, lowest in decade.", 
                      article_id="art8", source="cnn", bias="center-left"),
                Claim(text="3.7% unemployment reported for January.", 
                      article_id="art9", source="bbc", bias="center-left")
            ],
            consensus_level=0.90,
            summary="Unemployment rate fell to 3.7%."
        ),
        
        # Low consensus cluster
        ClaimCluster(
            cluster_id=5,
            claims=[
                Claim(text="Research indicates coffee could lower diabetes risk.", 
                      article_id="art10", source="healthline", bias="center"),
                Claim(text="Coffee consumption linked to reduced diabetes.", 
                      article_id="art11", source="medicalnewstoday", bias="center")
            ],
            consensus_level=0.55,
            summary="New study suggests coffee may reduce diabetes risk."
        )
    ]
    
    print(f"📊 Testing with {len(mock_clusters)} mock clusters\n")
    
    # Analyze consensus
    print("🔍 Running consensus analysis...")
    consensus_results = await consensus_service.analyze_consensus(
        topic="test topic",
        clusters=mock_clusters,
        total_articles=11
    )
    
    # Display results
    print(f"\n✅ Analysis complete!")
    print(f"   Total clusters: {len(mock_clusters)}")
    print(f"   Consensus claims: {len(consensus_results.consensus_claims)}")
    print(f"   Disagreement claims: {len(consensus_results.disagreement_claims)}")
    
    # Show consensus claims
    print("\n" + "="*60)
    print("CONSENSUS CLAIMS (widely agreed upon)")
    print("="*60)
    
    if consensus_results.consensus_claims:
        for i, claim in enumerate(consensus_results.consensus_claims, 1):
            print(f"\n{i}. {claim}")
    else:
        print("   None found")
    
    # Show disagreement claims
    print("\n" + "="*60)
    print("DISAGREEMENT/LOW CONSENSUS CLAIMS")
    print("="*60)
    
    if consensus_results.disagreement_claims:
        for i, claim in enumerate(consensus_results.disagreement_claims, 1):
            print(f"\n{i}. {claim}")
    else:
        print("   None found")
    
    # Get summary
    print("\n" + "="*60)
    print("SUMMARY STATISTICS")
    print("="*60)
    print(f"Total clusters analyzed: {len(mock_clusters)}")
    print(f"Total claims: {consensus_results.total_claims}")
    print(f"Consensus claims: {len(consensus_results.consensus_claims)}")
    print(f"Disagreement claims: {len(consensus_results.disagreement_claims)}")
    
    # Validation tests
    print("\n" + "="*60)
    print("VALIDATION TESTS")
    print("="*60)
    
    tests_passed = 0
    tests_total = 0
    
    # Test 1: Should have consensus and disagreement
    tests_total += 1
    if len(consensus_results.consensus_claims) > 0 and len(consensus_results.disagreement_claims) > 0:
        print("✅ Test 1: Both consensus and disagreement claims identified")
        tests_passed += 1
    else:
        print("❌ Test 1: Missing consensus or disagreement classification")
    
    # Test 2: Should have at least some consensus
    tests_total += 1
    if len(consensus_results.consensus_claims) >= 2:
        print("✅ Test 2: Multiple consensus claims identified")
        tests_passed += 1
    else:
        print("❌ Test 2: Too few consensus claims")
    
    # Test 3: All clusters accounted for
    tests_total += 1
    total_classified = len(consensus_results.consensus_claims) + len(consensus_results.disagreement_claims)
    if total_classified == len(mock_clusters):
        print(f"✅ Test 3: All {len(mock_clusters)} clusters classified")
        tests_passed += 1
    else:
        print(f"❌ Test 3: Classification mismatch ({total_classified} vs {len(mock_clusters)})")
    
    # Test 4: Result structure validation
    tests_total += 1
    if (consensus_results.topic == "test topic" and 
        consensus_results.total_articles == 11 and
        len(consensus_results.clusters) == len(mock_clusters)):
        print("✅ Test 4: Result structure valid")
        tests_passed += 1
    else:
        print("❌ Test 4: Result structure invalid")
    
    # Test 5: Claims are strings
    tests_total += 1
    all_strings = all(isinstance(c, str) for c in consensus_results.consensus_claims + consensus_results.disagreement_claims)
    if all_strings:
        print("✅ Test 5: All claims are strings")
        tests_passed += 1
    else:
        print("❌ Test 5: Claims are not strings")
    
    # Final results
    print("\n" + "="*60)
    print(f"FINAL RESULTS: {tests_passed}/{tests_total} tests passed")
    print("="*60)
    
    if tests_passed == tests_total:
        print("\n✅ Step 7 implementation PASSED all tests!")
        return True
    else:
        print(f"\n⚠️ Step 7 implementation passed {tests_passed}/{tests_total} tests")
        return False


if __name__ == "__main__":
    try:
        success = asyncio.run(test_consensus_analysis())
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
