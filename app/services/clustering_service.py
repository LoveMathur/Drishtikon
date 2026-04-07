"""
Clustering Service - Groups similar claims together
"""
from typing import List, Dict, Set, Tuple
from app.models.schemas import Claim, ClaimCluster
from app.services.pinecone_service import PineconeService
from app.services.embedding_service import EmbeddingService


class ClusteringService:
    """
    Service for clustering similar claims
    
    Per Step 6:
    1. Query Pinecone for neighbors of each claim
    2. Apply similarity threshold (0.85)
    3. Merge overlapping groups intelligently
    """
    
    def __init__(self):
        self.similarity_threshold = 0.85
        self.pinecone_service = PineconeService()
        self.embedding_service = EmbeddingService()
        
    async def cluster_claims(
        self, 
        claims: List[Claim],
        topic: str = None
    ) -> List[ClaimCluster]:
        """
        Cluster similar claims using Pinecone similarity search + intelligent merging
        
        Algorithm:
        1. For each claim, query Pinecone for similar neighbors (top_k=50)
        2. Filter by similarity threshold (>0.85)
        3. Build adjacency graph of similar claims
        4. Merge overlapping groups using Union-Find
        5. Create clusters from merged groups
        
        Args:
            claims: List of claims with embeddings
            topic: Optional topic filter
            
        Returns:
            List of claim clusters with consensus metrics
        """
        if not claims:
            return []
        
        print(f"🔄 Clustering {len(claims)} claims...")
        
        # Step 1: Build similarity graph
        similarity_graph = await self._build_similarity_graph(claims, topic)
        
        # Step 2: Merge overlapping groups using Union-Find
        clusters = self._merge_overlapping_groups(similarity_graph, claims)
        
        # Step 3: Create ClaimCluster objects with metadata
        claim_clusters = []
        for cluster_id, cluster_claims in enumerate(clusters):
            if len(cluster_claims) > 0:
                # Calculate consensus level (based on cluster size and diversity)
                consensus_level = self._calculate_consensus_level(cluster_claims)
                
                # Generate cluster summary (most common phrasing)
                summary = self._generate_cluster_summary(cluster_claims)
                
                claim_cluster = ClaimCluster(
                    cluster_id=cluster_id,
                    claims=cluster_claims,
                    consensus_level=consensus_level,
                    summary=summary
                )
                claim_clusters.append(claim_cluster)
        
        print(f"✅ Created {len(claim_clusters)} clusters from {len(claims)} claims")
        
        return claim_clusters
    
    async def _build_similarity_graph(
        self, 
        claims: List[Claim],
        topic: str = None
    ) -> Dict[str, Set[str]]:
        """
        Build graph of similar claims using Pinecone queries
        
        Returns:
            Dictionary mapping claim_id -> set of similar claim_ids
        """
        similarity_graph = {}
        
        for i, claim in enumerate(claims):
            claim_id = f"claim_{i}"
            
            # Query Pinecone for similar claims
            if claim.embedding:
                query_vector = claim.embedding
            else:
                # Generate embedding if not present
                query_vector = await self.embedding_service.generate_embedding(claim.text)
            
            # Query with higher top_k to find all similar claims
            filter_dict = {"topic": topic} if topic else None
            similar_results = await self.pinecone_service.query_similar(
                query_vector,
                top_k=50,  # High top_k to find all neighbors
                filter=filter_dict
            )
            
            # Filter by similarity threshold
            similar_claim_ids = set()
            for match in similar_results:
                if match['score'] >= self.similarity_threshold:
                    # Extract claim text and find its ID in our claims list
                    similar_claim_text = match['metadata'].get('claim', '')
                    
                    # Find matching claim in our list
                    for j, other_claim in enumerate(claims):
                        if other_claim.text == similar_claim_text and i != j:
                            similar_claim_ids.add(f"claim_{j}")
            
            similarity_graph[claim_id] = similar_claim_ids
            
            # Small delay to avoid rate limits
            if i < len(claims) - 1:
                import asyncio
                await asyncio.sleep(0.1)
        
        return similarity_graph
    
    def _merge_overlapping_groups(
        self, 
        similarity_graph: Dict[str, Set[str]],
        claims: List[Claim]
    ) -> List[List[Claim]]:
        """
        Merge overlapping groups using Union-Find algorithm
        
        If claim A is similar to B, and B is similar to C,
        then A, B, C should be in the same cluster.
        """
        # Union-Find data structure
        parent = {}
        
        def find(x):
            if x not in parent:
                parent[x] = x
            if parent[x] != x:
                parent[x] = find(parent[x])  # Path compression
            return parent[x]
        
        def union(x, y):
            root_x = find(x)
            root_y = find(y)
            if root_x != root_y:
                parent[root_x] = root_y
        
        # Build Union-Find structure
        for claim_id, similar_ids in similarity_graph.items():
            for similar_id in similar_ids:
                union(claim_id, similar_id)
        
        # Group claims by their root parent
        clusters_dict = {}
        for i in range(len(claims)):
            claim_id = f"claim_{i}"
            root = find(claim_id)
            if root not in clusters_dict:
                clusters_dict[root] = []
            clusters_dict[root].append(claims[i])
        
        # Convert to list of clusters
        clusters = list(clusters_dict.values())
        
        # Sort clusters by size (largest first)
        clusters.sort(key=len, reverse=True)
        
        return clusters
    
    def _calculate_consensus_level(self, claims: List[Claim]) -> float:
        """
        Calculate consensus level for a cluster
        
        Factors:
        - Cluster size (more claims = higher consensus)
        - Bias diversity (more diverse = higher consensus)
        - Source diversity (more sources = higher consensus)
        """
        if not claims:
            return 0.0
        
        # Size factor (normalized by logarithm)
        import math
        size_score = min(1.0, math.log(len(claims) + 1) / math.log(10))
        
        # Bias diversity
        unique_biases = len(set(c.bias for c in claims))
        bias_diversity = min(1.0, unique_biases / 5)  # Normalize by max 5 biases
        
        # Source diversity
        unique_sources = len(set(c.source for c in claims))
        source_diversity = min(1.0, unique_sources / 10)  # Normalize by max 10 sources
        
        # Weighted average
        consensus_level = (
            size_score * 0.5 +
            bias_diversity * 0.25 +
            source_diversity * 0.25
        )
        
        return round(consensus_level, 2)
    
    def _generate_cluster_summary(self, claims: List[Claim]) -> str:
        """
        Generate summary for cluster (use shortest claim as representative)
        """
        if not claims:
            return ""
        
        # Use the shortest claim as the summary (usually most concise)
        shortest_claim = min(claims, key=lambda c: len(c.text))
        return shortest_claim.text
    
    async def get_cluster_statistics(
        self, 
        clusters: List[ClaimCluster]
    ) -> Dict:
        """
        Get statistics about clusters
        """
        if not clusters:
            return {
                "total_clusters": 0,
                "total_claims": 0,
                "avg_cluster_size": 0,
                "consensus_clusters": 0,
                "disagreement_clusters": 0
            }
        
        total_claims = sum(len(c.claims) for c in clusters)
        avg_cluster_size = total_claims / len(clusters) if clusters else 0
        
        # Consensus vs disagreement (threshold at 0.6)
        consensus_clusters = sum(1 for c in clusters if c.consensus_level >= 0.6)
        disagreement_clusters = len(clusters) - consensus_clusters
        
        return {
            "total_clusters": len(clusters),
            "total_claims": total_claims,
            "avg_cluster_size": round(avg_cluster_size, 1),
            "largest_cluster": max(len(c.claims) for c in clusters),
            "smallest_cluster": min(len(c.claims) for c in clusters),
            "consensus_clusters": consensus_clusters,
            "disagreement_clusters": disagreement_clusters,
            "avg_consensus_level": round(
                sum(c.consensus_level for c in clusters) / len(clusters), 2
            )
        }
