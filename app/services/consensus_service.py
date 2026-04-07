"""
Consensus Service - Analyzes consensus and disagreements
"""
from typing import List, Dict, Tuple
from app.models.schemas import ClaimCluster, ConsensusResult


class ConsensusService:
    """
    Service for consensus analysis
    
    Per Step 7:
    - Identify agreement vs disagreement
    - Count sources per cluster
    - Analyze bias distribution
    - Calculate agreement scores
    """
    
    def __init__(self):
        self.consensus_threshold = 0.6  # Clusters with consensus_level >= 0.6 are "consensus"
        self.min_sources_for_consensus = 2  # Need at least 2 sources
        
    async def analyze_consensus(
        self, 
        topic: str, 
        clusters: List[ClaimCluster],
        total_articles: int
    ) -> ConsensusResult:
        """
        Analyze consensus and disagreements from claim clusters
        
        High consensus = Multiple sources + diverse biases + large cluster
        Disagreement = Single source or single bias or small cluster
        
        Args:
            topic: The analyzed topic
            clusters: List of claim clusters
            total_articles: Total number of articles analyzed
            
        Returns:
            ConsensusResult with consensus/disagreement analysis
        """
        if not clusters:
            return ConsensusResult(
                topic=topic,
                total_articles=total_articles,
                total_claims=0,
                clusters=[],
                consensus_claims=[],
                disagreement_claims=[]
            )
        
        # Calculate total claims
        total_claims = sum(len(cluster.claims) for cluster in clusters)
        
        # Analyze each cluster for consensus
        consensus_analyses = []
        disagreement_analyses = []
        consensus_claims = []
        disagreement_claims = []
        
        for cluster in clusters:
            # Get cluster analysis
            analysis = self._analyze_cluster(cluster)
            
            # Classify as consensus or disagreement
            if self._is_consensus(cluster, analysis):
                consensus_analyses.append(analysis)
                consensus_claims.append(analysis['claim_summary'])
            else:
                disagreement_analyses.append(analysis)
                disagreement_claims.append(analysis['claim_summary'])
        
        # Store analyses for helper methods
        result = ConsensusResult(
            topic=topic,
            total_articles=total_articles,
            total_claims=total_claims,
            clusters=clusters,
            consensus_claims=consensus_claims,
            disagreement_claims=disagreement_claims
        )
        
        # Attach internal data for helper methods
        result._consensus_analyses = consensus_analyses
        result._disagreement_analyses = disagreement_analyses
        
        return result
    
    def _analyze_cluster(self, cluster: ClaimCluster) -> Dict:
        """
        Analyze a single cluster for consensus metrics
        
        Returns dict with:
        - claim_summary: Representative claim text
        - agreement_score: 0.0-1.0 (higher = more agreement)
        - sources: List of unique sources
        - bias_distribution: Count per bias
        - cluster_size: Number of claims
        """
        # Get unique sources
        sources = list(set(claim.source for claim in cluster.claims))
        
        # Get bias distribution
        bias_distribution = {}
        for claim in cluster.claims:
            bias = claim.bias
            bias_distribution[bias] = bias_distribution.get(bias, 0) + 1
        
        # Calculate agreement score
        agreement_score = self._calculate_agreement_score(
            cluster_size=len(cluster.claims),
            num_sources=len(sources),
            num_biases=len(bias_distribution),
            consensus_level=cluster.consensus_level
        )
        
        return {
            "claim_summary": cluster.summary,
            "agreement_score": agreement_score,
            "sources": sources,
            "bias_distribution": bias_distribution,
            "cluster_size": len(cluster.claims),
            "cluster_id": cluster.cluster_id,
            "consensus_level": cluster.consensus_level
        }
    
    def _calculate_agreement_score(
        self,
        cluster_size: int,
        num_sources: int,
        num_biases: int,
        consensus_level: float
    ) -> float:
        """
        Calculate agreement score for a cluster
        
        Factors:
        - Cluster size (more claims = more agreement)
        - Number of sources (more sources = more agreement)
        - Bias diversity (more biases = more reliable)
        - Consensus level from clustering
        
        Returns: 0.0-1.0 (higher = stronger agreement)
        """
        import math
        
        # Size factor (logarithmic scale)
        size_score = min(1.0, math.log(cluster_size + 1) / math.log(10))
        
        # Source factor (normalized)
        source_score = min(1.0, num_sources / 5)
        
        # Bias diversity factor (more diverse = more reliable)
        bias_score = min(1.0, num_biases / 5)
        
        # Weighted combination
        agreement_score = (
            size_score * 0.3 +
            source_score * 0.3 +
            bias_score * 0.2 +
            consensus_level * 0.2
        )
        
        return round(agreement_score, 2)
    
    def _is_consensus(self, cluster: ClaimCluster, analysis: Dict) -> bool:
        """
        Determine if a cluster represents consensus
        
        Criteria:
        - Agreement score >= threshold
        - At least 2 sources
        - Cluster size >= 2
        """
        return (
            analysis['agreement_score'] >= self.consensus_threshold and
            len(analysis['sources']) >= self.min_sources_for_consensus and
            analysis['cluster_size'] >= 2
        )
    
    def get_consensus_summary(self, result: ConsensusResult) -> Dict:
        """
        Get summary statistics about consensus analysis
        """
        if not result.clusters:
            return {
                "total_claims": 0,
                "consensus_count": 0,
                "disagreement_count": 0,
                "consensus_percentage": 0.0,
                "avg_consensus_score": 0.0,
                "most_agreed_claim": None,
                "most_disputed_claim": None
            }
        
        # Get the analyses from internal storage
        consensus_analyses = getattr(result, '_consensus_analyses', [])
        disagreement_analyses = getattr(result, '_disagreement_analyses', [])
        
        consensus_count = len(result.consensus_claims)
        disagreement_count = len(result.disagreement_claims)
        total_clusters = consensus_count + disagreement_count
        
        # Calculate percentages
        consensus_percentage = (consensus_count / total_clusters * 100) if total_clusters > 0 else 0
        
        # Average scores
        all_scores = [a['agreement_score'] for a in consensus_analyses + disagreement_analyses]
        avg_score = sum(all_scores) / len(all_scores) if all_scores else 0
        
        # Most agreed and most disputed
        most_agreed = consensus_analyses[0] if consensus_analyses else None
        most_disputed = disagreement_analyses[0] if disagreement_analyses else None
        
        return {
            "total_claims": result.total_claims,
            "total_clusters": total_clusters,
            "consensus_count": consensus_count,
            "disagreement_count": disagreement_count,
            "consensus_percentage": round(consensus_percentage, 1),
            "avg_consensus_score": round(avg_score, 2),
            "most_agreed_claim": most_agreed['claim_summary'] if most_agreed else None,
            "most_agreed_score": most_agreed['agreement_score'] if most_agreed else None,
            "most_disputed_claim": most_disputed['claim_summary'] if most_disputed else None,
            "most_disputed_score": most_disputed['agreement_score'] if most_disputed else None
        }
    
    def analyze_bias_patterns(self, result: ConsensusResult) -> Dict:
        """
        Analyze bias patterns in consensus vs disagreement
        
        Returns insights about which biases align on which topics
        """
        # Get the analyses from internal storage
        consensus_analyses = getattr(result, '_consensus_analyses', [])
        disagreement_analyses = getattr(result, '_disagreement_analyses', [])
        
        consensus_biases = {}
        disagreement_biases = {}
        
        # Analyze consensus claims
        for analysis in consensus_analyses:
            for bias, count in analysis['bias_distribution'].items():
                consensus_biases[bias] = consensus_biases.get(bias, 0) + count
        
        # Analyze disagreement claims
        for analysis in disagreement_analyses:
            for bias, count in analysis['bias_distribution'].items():
                disagreement_biases[bias] = disagreement_biases.get(bias, 0) + count
        
        return {
            "consensus_biases": consensus_biases,
            "disagreement_biases": disagreement_biases,
            "interpretation": self._interpret_bias_pattern(consensus_biases, disagreement_biases)
        }
    
    def _interpret_bias_pattern(
        self, 
        consensus_biases: Dict, 
        disagreement_biases: Dict
    ) -> str:
        """
        Interpret bias patterns to provide insights
        """
        if not consensus_biases and not disagreement_biases:
            return "No bias data available"
        
        # Check for cross-spectrum consensus
        consensus_bias_count = len(consensus_biases)
        
        if consensus_bias_count >= 3:
            return "High cross-spectrum agreement - claims agreed upon across political spectrum"
        elif consensus_bias_count >= 2:
            return "Moderate cross-spectrum agreement - some bipartisan consensus"
        elif consensus_bias_count == 1:
            single_bias = list(consensus_biases.keys())[0]
            return f"Single-bias consensus - agreement primarily from {single_bias} sources"
        else:
            return "No clear consensus pattern"
