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
            # ─── Indian Sources ───
            # Left / Center-Left
            "the wire": "left",
            "thewire": "left",
            "scroll": "left",
            "scroll.in": "left",
            "newslaundry": "left",
            "newsclick": "left",
            "ndtv": "center-left",
            "the hindu": "center-left",
            "thehindu": "center-left",
            "deccan herald": "center-left",
            "the quint": "center-left",
            "thequint": "center-left",
            "telegraph india": "center-left",
            "national herald": "left",
            "the caravan": "left",
            
            # Center
            "times of india": "center",
            "timesofindia": "center",
            "hindustan times": "center",
            "hindustantimes": "center",
            "indian express": "center",
            "indianexpress": "center",
            "the print": "center",
            "theprint": "center",
            "aaj tak": "center",
            "livemint": "center",
            "mint": "center",
            "economic times": "center",
            "economictimes": "center",
            "business standard": "center",
            "moneycontrol": "center",
            "news18": "center",
            "india today": "center",
            "indiatoday": "center",
            "deccan chronicle": "center",
            "the statesman": "center",
            "dna india": "center",
            "mid-day": "center",
            "tribune": "center",
            "asian age": "center",
            "free press journal": "center",
            "outlook": "center-left",
            "outlook india": "center-left",
            
            # Right / Center-Right
            "wion": "center-right",
            "firstpost": "center-right",
            "news18": "center-right",
            "swarajya": "right",
            "opindia": "right",
            "republic": "right",
            "republic tv": "right",
            "republicworld": "right",
            "zee news": "right",
            "zeenews": "right",
            "organiser": "right",
            "pgurus": "right",
            "newsguard": "center-right",
            "the new indian express": "center",
            "newindianexpress": "center",
            
            # ─── International Sources ───
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
            "al jazeera": "center-left",
            "aljazeera": "center-left",
            
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
            "abc news": "center",
            
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
            "daily mail": "center-right",
            "dailymail": "center-right",
            "sky news": "center-right",
            
            # Tech/Business (generally center)
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
            Bias classification (left/center-left/center/center-right/right)
        """
        source_lower = source.lower()
        for key, bias in self.bias_map.items():
            if key in source_lower:
                return bias
        # Default to center instead of unknown so articles always appear in bias grouping
        return "center"
    
    def get_bias_bucket(self, bias: str) -> str:
        """
        Map detailed bias to a 3-bucket system (left/center/right)
        
        center-left → left
        center-right → right
        unknown → center
        """
        b = bias.lower() if bias else "center"
        if b in ("left", "center-left"):
            return "left"
        elif b in ("right", "center-right"):
            return "right"
        else:
            return "center"
