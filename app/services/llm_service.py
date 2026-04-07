"""
LLM Service - Handles claim extraction using Groq
"""
import os
from typing import List
from groq import Groq


class LLMService:
    """Service for LLM operations using Groq (claim extraction)"""
    
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        self.model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
        self.client = Groq(api_key=self.api_key) if self.api_key else None
        
    async def extract_claims(self, article_text: str, max_claims: int = 7) -> List[str]:
        """
        Extract factual claims from article text using Groq LLM
        
        Per Step 4 requirements:
        - Extract ATOMIC facts (not summaries)
        - Each claim = ONE verifiable statement
        - No opinions, speculation, or interpretations
        - 3-7 claims per article
        - Each claim = one sentence
        
        Args:
            article_text: The article content
            max_claims: Maximum number of claims to extract (default: 7)
            
        Returns:
            List of extracted claims (strings)
        """
        if not self.client:
            raise ValueError("Groq API key not configured")
            
        try:
            # Truncate article if too long to avoid token limits
            max_article_length = 3000
            if len(article_text) > max_article_length:
                article_text = article_text[:max_article_length] + "..."
            
            prompt = f"""Extract 3-7 ATOMIC factual claims from this news article.

CRITICAL RULES:
1. Each claim MUST be ONE VERIFIABLE FACT (not a summary)
2. Each claim MUST be ONE SENTENCE
3. NO opinions, analysis, or speculation
4. NO duplicate information
5. Focus on: statistics, events, statements, actions, dates
6. Keep claims SHORT and PRECISE

Article:
{article_text}

Return ONLY a valid JSON array of strings:
["claim 1", "claim 2", "claim 3"]

Do NOT include any explanation or markdown formatting."""
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a precise fact extractor. Extract only atomic, verifiable facts. No opinions. No summaries. One fact per claim."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.1,  # Low temperature for consistency
                max_tokens=500
            )
            
            # Parse the response
            claims_text = response.choices[0].message.content.strip()
            
            # Remove markdown code blocks if present
            if claims_text.startswith("```"):
                claims_text = claims_text.split("```")[1]
                if claims_text.startswith("json"):
                    claims_text = claims_text[4:]
                claims_text = claims_text.strip()
            
            # Parse JSON
            import json
            try:
                claims = json.loads(claims_text)
                if isinstance(claims, list):
                    # Validate and clean claims
                    validated_claims = []
                    for claim in claims[:max_claims]:
                        if isinstance(claim, str) and len(claim.strip()) > 10:
                            validated_claims.append(claim.strip())
                    return validated_claims
                return []
            except json.JSONDecodeError as e:
                print(f"JSON parsing error: {e}")
                print(f"Raw response: {claims_text[:200]}")
                # Fallback: try to extract claims from lines
                lines = [line.strip('- ').strip('"').strip() 
                        for line in claims_text.split('\n') 
                        if line.strip() and not line.strip().startswith('[')]
                return [line for line in lines if len(line) > 10][:max_claims]
                
        except Exception as e:
            print(f"Error extracting claims: {e}")
            return []

