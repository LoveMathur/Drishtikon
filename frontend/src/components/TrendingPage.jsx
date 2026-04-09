import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, RefreshCw, Menu, Search, Flame } from 'lucide-react';
import TrendingCard from './TrendingCard';
import Footer from './Footer';

const TrendingPage = ({ onBack, onAnalyzeTopic }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyzingTopic, setAnalyzingTopic] = useState(null);

  // Fetch trending on mount
  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8001/api/trending');
      const data = await response.json();
      if (data.status === 'success') {
        setArticles(data.articles || []);
      } else {
         throw new Error('Fallback trigger');
      }
    } catch (err) {
      console.error('Trending fetch failed:', err);
      // Fallback UI data just in case during transition
      if (error === null) {
          setError('Could not connect to the server. Make sure the backend is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async (title) => {
    setAnalyzingTopic(title);
    if (onAnalyzeTopic) {
      await onAnalyzeTopic(title);
    }
    setAnalyzingTopic(null);
  };

  // Group articles by bias for the overview
  const biasGroups = {
    left: articles.filter(a => a.bias_bucket === 'left'),
    center: articles.filter(a => a.bias_bucket === 'center'),
    right: articles.filter(a => a.bias_bucket === 'right'),
  };

  const totalLeft = biasGroups.left.length;
  const totalCenter = biasGroups.center.length;
  const totalRight = biasGroups.right.length;
  const total = totalLeft + totalCenter + totalRight;

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-gray-900 font-sans antialiased flex flex-col">
      {/* ─── Ground News Style Header ─── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button className="text-gray-500 hover:text-gray-900 md:hidden">
                <Menu className="w-6 h-6" />
              </button>
              
              <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 text-gray-500 mr-2" />
                <div className="font-extrabold text-xl tracking-tight text-black flex items-center">
                  DRISHTI<span className="font-light">KON</span>
                </div>
              </div>
            </div>

            {/* Right: Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-700">
               <span className="text-black cursor-pointer border-b-2 border-black pb-1">Trending</span>
               <span className="hover:text-black cursor-pointer border-b-2 border-transparent hover:border-black transition-all pb-1" onClick={onBack}>Search</span>
               <span className="hover:text-black cursor-pointer border-b-2 border-transparent hover:border-black transition-all pb-1">Blindspot</span>
            </nav>
          </div>
        </div>
      </header>

      {/* ─── Content ─── */}
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
           
           {/* Section Header */}
           <div className="mb-8 border-b border-gray-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
             <div>
               <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                 <Flame className="w-3.5 h-3.5 text-red-500" /> Top Stories
               </div>
               <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                 Trending News
               </h1>
             </div>
             <div>
                {/* Bias Overview Bar (Small) */}
                {!loading && total > 0 && (
                  <div className="w-48">
                    <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase mb-1.5">
                      <span>L</span>
                      <span>Total: {total}</span>
                      <span>R</span>
                    </div>
                    <div className="flex h-1.5 rounded overflow-hidden">
                      {totalLeft > 0 && <div className="bg-[#2563eb]" style={{ width: `${(totalLeft / total) * 100}%` }}></div>}
                      {totalCenter > 0 && <div className="bg-[#9ca3af]" style={{ width: `${(totalCenter / total) * 100}%` }}></div>}
                      {totalRight > 0 && <div className="bg-[#dc2626]" style={{ width: `${(totalRight / total) * 100}%` }}></div>}
                    </div>
                  </div>
                )}
             </div>
           </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-32">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-sm font-semibold">Aggregating live stories...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto bg-white border border-red-200 rounded p-8 shadow-sm">
                <p className="text-red-700 font-bold mb-2">Feed Unavailable</p>
                <p className="text-gray-500 text-sm mb-6">{error}</p>
                <button
                  onClick={fetchTrending}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-gray-100 border border-gray-200 rounded text-sm font-bold text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" /> Retry Connection
                </button>
              </div>
            </div>
          )}

          {/* Articles Grid */}
          {!loading && !error && articles.length > 0 && (
            <>
              {/* Analyzing overlay */}
              {analyzingTopic && (
                <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
                  <div className="bg-white border border-gray-200 shadow-xl rounded-lg p-10 text-center max-w-sm">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-6" />
                    <p className="text-gray-900 font-bold text-lg mb-2">Analyzing Coverage</p>
                    <p className="text-gray-500 text-sm line-clamp-2">"{analyzingTopic}"</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest">
                  Live Feed
                </h3>
                <button
                  onClick={fetchTrending}
                  className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-widest hover:text-blue-600 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Refresh
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {articles.map((article, idx) => (
                  <TrendingCard
                    key={idx}
                    article={article}
                    onAnalyze={handleAnalyze}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* ─── Footer ─── */}
      <div className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="container mx-auto px-6 text-center text-sm font-semibold text-gray-400 uppercase tracking-widest">
          © 2026 Drishtikon &bull; Ground News Layout Mirror
        </div>
      </div>
    </div>
  );
};

export default TrendingPage;
