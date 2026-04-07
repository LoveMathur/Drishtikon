import { useState } from 'react';
import { Search, TrendingUp, Globe2, Users, Sparkles, ChevronRight, ArrowLeft } from 'lucide-react';
import NewsCard from './NewsCard';
import Footer from './Footer';

const MainContent = ({ onBackToLanding }) => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleAnalyze = async () => {
    if (!topic.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8001/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim() })
      });
      const data = await response.json();
      if (data.status === 'success') {
        setResults(data.data);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const trendingCategories = [
    {
      title: "India & Geopolitics",
      stories: [
        { title: "Border tensions with neighboring countries", consensus: "high", sources: 8 },
        { title: "New trade agreement with EU nations", consensus: "medium", sources: 5 },
        { title: "Diplomatic visit to Southeast Asia", consensus: "high", sources: 12 },
      ]
    },
    {
      title: "War Room",
      stories: [
        { title: "Ukraine conflict enters new phase", consensus: "high", sources: 15 },
        { title: "Middle East tensions escalate", consensus: "medium", sources: 7 },
        { title: "NATO expansion discussions", consensus: "low", sources: 4 },
      ]
    },
    {
      title: "Inside Parliament",
      stories: [
        { title: "Budget session key highlights", consensus: "high", sources: 10 },
        { title: "Opposition walkout over corruption charges", consensus: "medium", sources: 6 },
        { title: "New education policy debate", consensus: "low", sources: 3 },
      ]
    },
    {
      title: "Celebs Corner",
      stories: [
        { title: "Bollywood star announces new project", consensus: "medium", sources: 5 },
        { title: "Celebrity charity event raises millions", consensus: "high", sources: 8 },
        { title: "Sports icon retirement speculation", consensus: "low", sources: 2 },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {onBackToLanding && (
                <button
                  onClick={onBackToLanding}
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
              )}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gradient">Drishtikon</h1>
                  <p className="text-xs text-white/60">Multi-Source News Analysis</p>
                </div>
              </div>
            </div>
            <nav className="flex gap-6">
              <a href="#" className="text-white/80 hover:text-white transition-colors">Trending</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">Analysis</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">About</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section className="py-12 bg-gradient-to-b from-orange-900/20 to-transparent">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 className="text-4xl font-bold mb-4">Analyze Any Topic</h2>
            <p className="text-white/60">Enter a topic to see consensus vs disagreement across sources</p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-3">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                placeholder="e.g., climate change, economy, technology..."
                className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-orange-500/50 focus:bg-white/15 transition-all"
              />
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? 'Analyzing...' : 'Analyze'}
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {results && (
        <section className="py-12">
          <div className="container mx-auto px-6">
            <ResultsView results={results} />
          </div>
        </section>
      )}

      {/* Trending Categories */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="w-8 h-8 text-orange-500" />
            <h2 className="text-3xl font-bold">Trending Now</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingCategories.map((category, idx) => (
              <TrendingCategory key={idx} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

const ResultsView = ({ results }) => {
  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Articles" value={results.article_count} />
        <StatCard label="Claims Extracted" value={results.total_claims} />
        <StatCard label="Consensus" value={results.consensus_claims?.length || 0} color="text-green-400" />
        <StatCard label="Disagreements" value={results.disagreement_claims?.length || 0} color="text-orange-400" />
      </div>

      {/* Consensus */}
      {results.consensus_claims && results.consensus_claims.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            Consensus Claims (Widely Agreed Upon)
          </h3>
          <div className="space-y-3">
            {results.consensus_claims.map((claim, idx) => (
              <div key={idx} className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 hover:bg-green-500/15 transition-colors">
                <p className="text-white">{claim}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disagreements */}
      {results.disagreement_claims && results.disagreement_claims.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            Disagreement Claims (Limited Agreement)
          </h3>
          <div className="space-y-3">
            {results.disagreement_claims.map((claim, idx) => (
              <div key={idx} className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 hover:bg-orange-500/15 transition-colors">
                <p className="text-white/80">{claim}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, color = "text-white" }) => {
  return (
    <div className="glass-effect p-6 rounded-xl">
      <div className={`text-3xl font-bold ${color} mb-2`}>{value}</div>
      <div className="text-white/60 text-sm">{label}</div>
    </div>
  );
};

const TrendingCategory = ({ category }) => {
  return (
    <div className="glass-effect p-6 rounded-xl hover:bg-white/10 transition-all">
      <h3 className="text-xl font-bold mb-4 text-gradient">{category.title}</h3>
      <div className="space-y-3">
        {category.stories.map((story, idx) => (
          <div key={idx} className="border-l-2 border-white/20 pl-3 hover:border-orange-500/50 transition-colors cursor-pointer">
            <p className="text-sm text-white/90 mb-1">{story.title}</p>
            <div className="flex items-center gap-2 text-xs text-white/50">
              <span>{story.sources} sources</span>
              <span>•</span>
              <span className={`${getConsensusColor(story.consensus)}`}>
                {story.consensus} consensus
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const getConsensusColor = (level) => {
  switch (level) {
    case 'high': return 'text-green-400';
    case 'medium': return 'text-yellow-400';
    case 'low': return 'text-red-400';
    default: return 'text-white/50';
  }
};

export default MainContent;
