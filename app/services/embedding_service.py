"""
Embedding Service - Generates embeddings using Pinecone Inference API
"""
import os
from typing import List
from pinecone import Pinecone


class EmbeddingService:
    """Service for generating embeddings using Pinecone Inference API"""
    
    def __init__(self):
        self.api_key = os.getenv("PINECONE_API_KEY")
        # Pinecone-hosted embedding model
        self.model_name = os.getenv("PINECONE_EMBED_MODEL", "multilingual-e5-large")
        self.embedding_dimension = int(os.getenv("EMBEDDING_DIMENSION", "1024"))
        
        # Initialize Pinecone client for inference
        if self.api_key:
            self.pc = Pinecone(api_key=self.api_key)
            print(f"✅ Initialized Pinecone Inference API: {self.model_name}")
        else:
            self.pc = None
            print("⚠️ Pinecone API key not set")
    
    async def generate_embedding(self, text: str) -> List[float]:
        """
        Generate embedding vector for given text using Pinecone Inference API
        
        Args:
            text: The text to embed
            
        Returns:
            Embedding vector (1024 dimensions for multilingual-e5-large)
        """
        if not self.pc:
            raise ValueError("Pinecone API key not configured")
        
        try:
            # Truncate text if too long
            max_chars = 2000
            if len(text) > max_chars:
                text = text[:max_chars]
            
            # Generate embedding using Pinecone's Inference API
            embeddings = self.pc.inference.embed(
                model=self.model_name,
                inputs=[text],
                parameters={"input_type": "passage"}
            )
            
            # Extract the embedding vector
            embedding = embeddings[0].values
            return embedding
            
        except Exception as e:
            print(f"❌ Error generating embedding: {e}")
            return []
    
    async def generate_embeddings_batch(self, texts: List[str]) -> List[List[float]]:
        """
        Generate embeddings for multiple texts (batch processing)
        
        Args:
            texts: List of texts to embed
            
        Returns:
            List of embedding vectors
        """
        if not self.pc:
            raise ValueError("Pinecone API key not configured")
        
        try:
            # Truncate texts if too long
            max_chars = 2000
            truncated_texts = [
                text[:max_chars] if len(text) > max_chars else text 
                for text in texts
            ]
            
            # Pinecone Inference supports batch requests
            # Process in batches of 100 to stay within rate limits
            batch_size = 100
            all_embeddings = []
            
            for i in range(0, len(truncated_texts), batch_size):
                batch = truncated_texts[i:i + batch_size]
                
                embeddings = self.pc.inference.embed(
                    model=self.model_name,
                    inputs=batch,
                    parameters={"input_type": "passage"}
                )
                
                batch_embeddings = [emb.values for emb in embeddings]
                all_embeddings.extend(batch_embeddings)
                
                print(f"✅ Generated {len(batch_embeddings)} embeddings (batch {i//batch_size + 1})")
            
            return all_embeddings
            
        except Exception as e:
            print(f"❌ Error generating batch embeddings: {e}")
            return []
    
    def get_embedding_dimension(self) -> int:
        """
        Get the dimension of the embedding model
        
        Returns:
            Embedding dimension (1024 for multilingual-e5-large)
        """
        return self.embedding_dimension



