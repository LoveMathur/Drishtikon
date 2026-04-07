"""
Bias Service - Classifies news source bias
"""
from typing import Dict


class BiasService:
    """Service for bias classification"""
    
    def __init__(self):
        # Simple bias mapping for common sources
        # Keys are lowercase substrings to match against
        self.bias_map = {
            # Left
            "cnn": "left",
            "msnbc": "left",
            "huffpost": "left",
            "huffington": "left",
            "vox": "left",
            "slate": "left",
            "new york times": "center-left",
            "nytimes": "center-left",
            "washington post": "center-left",
            "washingtonpost": "center-left",
            "the guardian": "center-left",
            "guardian": "center-left",
            "npr": "center-left",
            
            # Center
            "bbc": "center",
            "reuters": "center",
            "associated press": "center",
            "ap news": "center",
            "bloomberg": "center",
            "axios": "center",
            "the hill": "center",
            "politico": "center",
            "usa today": "center",
            
            # Right
            "fox news": "right",
            "foxnews": "right",
            "breitbart": "right",
            "daily wire": "right",
            "newsmax": "right",
            "new york post": "center-right",
            "nypost": "center-right",
            "wall street journal": "center-right",
            "wsj": "center-right",
            "washington times": "center-right",
            "national review": "center-right",
            
            # Tech/Business (generally center, focus on factual reporting)
            "wired": "center",
            "techcrunch": "center",
            "tech crunch": "center",
            "ars technica": "center",
            "arstechnica": "center",
            "the verge": "center",
            "verge": "center",
            "engadget": "center",
            "cnet": "center",
            "zdnet": "center",
            "business insider": "center",
            "businessinsider": "center",
            "gizmodo": "center-left",
            "mashable": "center-left",
            "slashdot": "center",
            "macrumors": "center",
            "9to5mac": "center",
            "venturebeat": "center",
            "fortune": "center",
            "forbes": "center",
            "cnbc": "center",
            "financial times": "center",
            "economist": "center",
            "yahoo": "center",
            "time": "center",
            "newsweek": "center",
            "new scientist": "center",
            "scientific american": "center-left",
            "nature": "center",
            "science": "center",
        }
        
    def classify_bias(self, source: str) -> str:
        """
        Classify the bias of a news source
        
        Args:
            source: The news source name
            
        Returns:
            Bias classification (left/center/right)
        """
        source_lower = source.lower()
        for key, bias in self.bias_map.items():
            if key in source_lower:
                return bias
        return "unknown"
