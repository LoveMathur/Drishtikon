import { useState, useEffect } from 'react';
import { Search, ArrowLeft, Loader2, Menu } from 'lucide-react';
import GroundNewsResults from './GroundNewsResults';
import Footer from './Footer';

const MainContent = ({ onBackToLanding, initialTopic = '', onTopicAnalyzed }) => {
  const [topic, setTopic] = useState(initialTopic);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // Auto-analyze when initialTopic is provided
  useEffect(() => {
    if (initialTopic) {
      setTopic(initialTopic);
      handleAnalyzeWithTopic(initialTopic);
      if (onTopicAnalyzed) onTopicAnalyzed();
    }
  }, [initialTopic]);

  const handleAnalyzeWithTopic = async (topicToAnalyze) => {
    if (!topicToAnalyze.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8001/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicToAnalyze.trim() })
      });
      const data = await response.json();
      if (data.status === 'success') {
        setResults(data.data);
      } else {
        setError(data.message || 'Analysis failed');
      }
    } catch (err) {
      console.error('Analysis failed:', err);
      setError('Could not connect to the analysis server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    await handleAnalyzeWithTopic(topic);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-gray-900 font-sans antialiased flex flex-col">
      {/* ─── Ground News Style Header ─── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-8">
          {/* Top Row: Logo & Search */}
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button className="text-gray-500 hover:text-gray-900 md:hidden">
                <Menu className="w-6 h-6" />
              </button>
              
              <div className="flex items-center gap-2 cursor-pointer" onClick={onBackToLanding}>
                {onBackToLanding && (
                  <ArrowLeft className="w-4 h-4 text-gray-500 mr-2" />
                )}
                <div className="font-extrabold text-xl tracking-tight text-black flex items-center">
                  DRISHTI<span className="font-light">KON</span>
                </div>
              </div>
            </div>

            {/* Middle: Search Bar (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                  placeholder="Search thousands of sources..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition-colors"
                />
              </div>
            </div>

            {/* Right: Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-700">
               <span className="hover:text-black cursor-pointer border-b-2 border-transparent hover:border-black transition-all pb-1">For You</span>
               <span className="hover:text-black cursor-pointer border-b-2 border-transparent hover:border-black transition-all pb-1">Local</span>
               <span className="hover:text-black cursor-pointer border-b-2 border-transparent hover:border-black transition-all pb-1">Blindspot</span>
            </nav>
          </div>
          
          {/* Mobile Search Row */}
          <div className="md:hidden pb-3">
             <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                  placeholder="Search thousands of sources..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-blue-500 sm:text-sm"
                />
              </div>
          </div>
        </div>
      </header>

      {/* ─── Main Content Area ─── */}
      <main className="flex-1">
        {/* Loading State */}
        {loading && (
          <section className="py-24">
            <div className="container mx-auto px-6 text-center">
              <Loader2 className="w-10 h-10 animate-spin text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Analyzing coverage for "{topic}"</h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                Scanning multiple news sources, categorizing bias, and extracting consensus claims...
              </p>
            </div>
          </section>
        )}

        {/* Error State */}
        {error && !loading && (
          <section className="py-12">
            <div className="container mx-auto px-6">
              <div className="max-w-lg mx-auto bg-white border border-red-200 rounded-md shadow-sm p-8 text-center">
                <p className="text-red-700 font-bold mb-2">Analysis Failed</p>
                <p className="text-gray-600 text-sm">{error}</p>
              </div>
            </div>
          </section>
        )}

        {/* Results Section */}
        {results && !loading && (
          <div className="py-6">
            <GroundNewsResults results={results} topic={topic} />
          </div>
        )}

        {/* Empty State */}
        {!results && !loading && !error && (
          <section className="py-32">
            <div className="container mx-auto px-6 text-center">
              <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-lg p-10 shadow-sm">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Search to analyze</h3>
                <p className="text-gray-500 text-sm">
                  Search any topic, person, or event to see how it's being covered across the political spectrum.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ─── Footer Wrapper (Needs to look clean in light mode) ─── */}
      <div className="bg-white border-t border-gray-200 py-6 mt-10">
        <div className="container mx-auto px-6 text-center text-sm text-gray-500">
          © 2026 Drishtikon (Ground News Style Demo).
        </div>
      </div>
    </div>
  );
};

export default MainContent;
