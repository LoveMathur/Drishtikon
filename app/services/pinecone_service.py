"""
Pinecone Service - Handles vector database operations
"""
import os
from typing import List, Dict, Any
from pinecone import Pinecone, ServerlessSpec


class PineconeService:
    """Service for Pinecone vector database operations (v6+ API)"""
    
    def __init__(self):
        self.api_key = os.getenv("PINECONE_API_KEY")
        self.index_name = os.getenv("PINECONE_INDEX_NAME", "drishtikon-claims")
        self.host = os.getenv("PINECONE_HOST")
        self.pc = None
        self.index = None
        
        if self.api_key:
            self._initialize_client()
    
    def _initialize_client(self):
        """Initialize Pinecone client"""
        try:
            # Initialize Pinecone with v6 API
            self.pc = Pinecone(api_key=self.api_key)
            
            # Connect to existing index
            if self.host:
                # Use host if provided
                self.index = self.pc.Index(host=self.host)
            else:
                # Use index name (will auto-detect host)
                self.index = self.pc.Index(self.index_name)
                
            print(f"✅ Connected to Pinecone index: {self.index_name}")
            
        except Exception as e:
            print(f"❌ Error initializing Pinecone: {e}")
            self.pc = None
            self.index = None
    
    async def store_embeddings(self, vectors: List[Dict[str, Any]]) -> bool:
        """
        Store embeddings in Pinecone
        
        Args:
            vectors: List of vector data with format:
                [
                    {
                        "id": "claim_1",
                        "values": [0.1, 0.2, ...],  # embedding vector
                        "metadata": {"claim": "text", "source": "...", "bias": "..."}
                    }
                ]
            
        Returns:
            Success status
        """
        if not self.index:
            raise ValueError("Pinecone index not initialized")
        
        try:
            # Upsert vectors in batches of 100
            batch_size = 100
            for i in range(0, len(vectors), batch_size):
                batch = vectors[i:i + batch_size]
                self.index.upsert(vectors=batch)
            
            print(f"✅ Stored {len(vectors)} vectors in Pinecone")
            return True
            
        except Exception as e:
            print(f"❌ Error storing embeddings: {e}")
            return False
    
    async def query_similar(
        self, 
        query_vector: List[float], 
        top_k: int = 10,
        filter: Dict[str, Any] = None
    ) -> List[Dict]:
        """
        Query similar embeddings from Pinecone
        
        Args:
            query_vector: The query embedding vector
            top_k: Number of similar results to return
            filter: Optional metadata filter
            
        Returns:
            List of similar vectors with metadata
        """
        if not self.index:
            raise ValueError("Pinecone index not initialized")
        
        try:
            # Query the index
            results = self.index.query(
                vector=query_vector,
                top_k=top_k,
                include_metadata=True,
                filter=filter
            )
            
            # Format results
            matches = []
            for match in results.matches:
                matches.append({
                    "id": match.id,
                    "score": match.score,
                    "metadata": match.metadata
                })
            
            return matches
            
        except Exception as e:
            print(f"❌ Error querying similar vectors: {e}")
            return []
    
    def get_index_stats(self) -> Dict[str, Any]:
        """
        Get index statistics
        
        Returns:
            Index stats including dimension, count, etc.
        """
        if not self.index:
            raise ValueError("Pinecone index not initialized")
        
        try:
            stats = self.index.describe_index_stats()
            return {
                "dimension": stats.dimension,
                "index_fullness": stats.index_fullness,
                "total_vector_count": stats.total_vector_count,
                "namespaces": stats.namespaces
            }
        except Exception as e:
            print(f"❌ Error getting index stats: {e}")
            return {}
    
    async def delete_by_filter(self, filter: Dict[str, Any]) -> bool:
        """
        Delete vectors by metadata filter
        
        Args:
            filter: Metadata filter for deletion
            
        Returns:
            Success status
        """
        if not self.index:
            raise ValueError("Pinecone index not initialized")
        
        try:
            self.index.delete(filter=filter)
            print(f"✅ Deleted vectors matching filter: {filter}")
            return True
        except Exception as e:
            print(f"❌ Error deleting vectors: {e}")
            return False

