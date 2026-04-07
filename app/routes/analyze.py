from fastapi import APIRouter, HTTPException
from app.models.schemas import AnalyzeRequest, AnalyzeResponse, Claim
from app.services.news_service import NewsService
from app.services.bias_service import BiasService
from app.services.llm_service import LLMService
from app.services.embedding_service import EmbeddingService
from app.services.pinecone_service import PineconeService
from app.services.clustering_service import ClusteringService
from app.services.consensus_service import ConsensusService
import hashlib

router = APIRouter()


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_topic(request: AnalyzeRequest):
    """
    Main endpoint to analyze news consensus on a given topic.
    
    Steps implemented:
    - Step 2: Fetch and process news articles
    - Step 3: Classify bias
    - Step 4: Extract claims from articles
    - Step 5: Generate embeddings and store in Pinecone
    - Step 6: Cluster similar claims
    - Step 7: Analyze consensus vs disagreements
    
    Args:
        request: Contains the topic to analyze
        
    Returns:
        AnalyzeResponse with articles, claims, clusters, and consensus analysis
    """
    try:
        # Initialize services
        news_service = NewsService()
        bias_service = BiasService()
        llm_service = LLMService()
        embedding_service = EmbeddingService()
        pinecone_service = PineconeService()
        clustering_service = ClusteringService()
        consensus_service = ConsensusService()
        
        # Step 2: Fetch news articles
        articles = await news_service.fetch_articles(request.topic, max_results=10)
        
        if not articles:
            return AnalyzeResponse(
                status="error",
                message=f"No articles found for topic: {request.topic}",
                data={"topic": request.topic, "article_count": 0}
            )
        
        # Step 3: Classify bias for each article
        for article in articles:
            article.bias = bias_service.classify_bias(article.source)
        
        # Step 4: Extract claims from articles
        all_claims = []
        article_summaries = []
        
        for idx, article in enumerate(articles):
            # Extract claims from article
            claims_text = await llm_service.extract_claims(article.content)
            
            # Create Claim objects
            article_claims = []
            for claim_idx, claim_text in enumerate(claims_text):
                claim = Claim(
                    text=claim_text,
                    article_id=f"{request.topic}_{idx}",
                    source=article.source,
                    bias=article.bias
                )
                article_claims.append(claim)
                all_claims.append(claim)
            
            # Article summary with claims
            article_summaries.append({
                "title": article.title,
                "source": article.source,
                "bias": article.bias,
                "url": article.url,
                "content_length": len(article.content),
                "claims_count": len(article_claims),
                "claims": [c.text for c in article_claims]
            })
        
        # Step 5: Generate embeddings and store in Pinecone
        if all_claims:
            # Extract claim texts for batch embedding
            claim_texts = [claim.text for claim in all_claims]
            
            # Generate embeddings in batch
            print(f"🔄 Generating embeddings for {len(claim_texts)} claims...")
            embeddings = await embedding_service.generate_embeddings_batch(claim_texts)
            
            if embeddings and len(embeddings) == len(all_claims):
                # Prepare vectors for Pinecone with metadata
                vectors = []
                for i, (claim, embedding) in enumerate(zip(all_claims, embeddings)):
                    # Generate unique ID for the claim
                    claim_id = hashlib.md5(claim.text.encode()).hexdigest()
                    
                    vectors.append({
                        "id": claim_id,
                        "values": embedding,
                        "metadata": {
                            "claim": claim.text,
                            "source": claim.source,
                            "bias": claim.bias,
                            "topic": request.topic,
                            "article_id": claim.article_id
                        }
                    })
                
                # Store in Pinecone
                print(f"🔄 Storing {len(vectors)} vectors in Pinecone...")
                success = await pinecone_service.store_embeddings(vectors)
                
                if success:
                    print(f"✅ Successfully stored {len(vectors)} claim embeddings")
                    
                    # Attach embeddings to claims for clustering
                    for claim, embedding in zip(all_claims, embeddings):
                        claim.embedding = embedding
                else:
                    print("⚠️ Warning: Failed to store embeddings in Pinecone")
            else:
                print(f"⚠️ Warning: Embedding generation failed or incomplete")
        
        # Step 6: Cluster similar claims
        clusters = []
        cluster_stats = {}
        
        if all_claims:
            print(f"🔄 Clustering {len(all_claims)} claims...")
            clusters = await clustering_service.cluster_claims(all_claims, topic=request.topic)
            cluster_stats = await clustering_service.get_cluster_statistics(clusters)
            print(f"✅ Created {len(clusters)} clusters")
        
        # Step 7: Analyze consensus vs disagreements
        consensus_result = None
        consensus_summary = {}
        bias_patterns = {}
        
        if clusters:
            print(f"🔄 Analyzing consensus...")
            consensus_result = await consensus_service.analyze_consensus(
                topic=request.topic,
                clusters=clusters,
                total_articles=len(articles)
            )
            consensus_summary = consensus_service.get_consensus_summary(consensus_result)
            bias_patterns = consensus_service.analyze_bias_patterns(consensus_result)
            print(f"✅ Found {len(consensus_result.consensus_claims)} consensus claims and {len(consensus_result.disagreement_claims)} disagreements")
        
        # Format clusters for response
        cluster_summaries = []
        for cluster in clusters:
            cluster_summaries.append({
                "cluster_id": cluster.cluster_id,
                "size": len(cluster.claims),
                "consensus_level": cluster.consensus_level,
                "summary": cluster.summary,
                "claims": [c.text for c in cluster.claims],
                "sources": list(set(c.source for c in cluster.claims)),
                "biases": list(set(c.bias for c in cluster.claims))
            })
        
        return AnalyzeResponse(
            status="success",
            message=f"Successfully analyzed {len(articles)} articles with {len(consensus_result.consensus_claims) if consensus_result else 0} consensus claims",
            data={
                "topic": request.topic,
                "article_count": len(articles),
                "total_claims": len(all_claims),
                "embeddings_stored": len(all_claims) if all_claims else 0,
                "total_clusters": len(clusters),
                "cluster_stats": cluster_stats,
                "consensus_summary": consensus_summary,
                "bias_patterns": bias_patterns,
                "articles": article_summaries,
                "clusters": cluster_summaries,
                "consensus_claims": consensus_result.consensus_claims if consensus_result else [],
                "disagreement_claims": consensus_result.disagreement_claims if consensus_result else []
            }
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

