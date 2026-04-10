import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, RefreshCw, Menu, Flame, ChevronRight } from 'lucide-react';
import TrendingCard from './TrendingCard';
import Footer from './Footer';

const TrendingPage = ({ onBack, onAnalyzeTopic }) => {
  const [categoriesData, setCategoriesData] = useState([]);
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
      const response = await fetch('http://localhost:8001/api/trending_categories');
      const data = await response.json();
      if (data.status === 'success') {
        setCategoriesData(data.categories || []);
      } else {
         throw new Error('Fallback trigger');
      }
    } catch (err) {
      console.error('Trending fetch failed:', err);
      if (error === null) {
          setError('Could not connect to the server. Make sure the backend is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async (topicOrTitle) => {
    setAnalyzingTopic(topicOrTitle);
    if (onAnalyzeTopic) {
      await onAnalyzeTopic(topicOrTitle);
    }
    setAnalyzingTopic(null);
  };

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
                 <Flame className="w-3.5 h-3.5 text-red-500" /> Categorized Feed
               </div>
               <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                 Trending News
               </h1>
             </div>
             <div>
               <button
                  onClick={fetchTrending}
                  className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-widest hover:text-blue-600 transition-colors"
               >
                 <RefreshCw className="w-3.5 h-3.5" />
                 Refresh Feed
               </button>
             </div>
           </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-32">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-sm font-semibold">Aggregating and categorizing live stories...</p>
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

          {/* Articles By Category */}
          {!loading && !error && categoriesData.length > 0 && (
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

              <div className="space-y-16">
                {categoriesData.map((categorySection, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-6 pb-2 border-b-2 border-gray-900">
                      <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                        {categorySection.category}
                      </h3>
                      <button className="hidden sm:flex items-center text-sm font-bold text-blue-600 hover:underline">
                        View All <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>

                    {categorySection.articles && categorySection.articles.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categorySection.articles.map((article, aIdx) => (
                          <TrendingCard
                            key={aIdx}
                            article={article}
                            onAnalyze={() => handleAnalyze(article.title)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-gray-500 border border-dashed border-gray-300 rounded">
                        No articles currently available for {categorySection.category}.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* ─── Footer ─── */}
      <Footer onTopicClick={handleAnalyze} />
    </div>
  );
};

export default TrendingPage;
