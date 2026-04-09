import { useState, useMemo } from 'react';
import { ExternalLink, Check, Info, FileText, Share } from 'lucide-react';

// ─── Bias Constants ───
const BIAS_COLORS = {
  left: { bg: 'bg-[#2563eb]', border: 'border-[#2563eb]', label: 'Left', text: 'text-[#2563eb]' },
  center: { bg: 'bg-[#9ca3af]', border: 'border-[#9ca3af]', label: 'Center', text: 'text-[#9ca3af]' },
  right: { bg: 'bg-[#dc2626]', border: 'border-[#dc2626]', label: 'Right', text: 'text-[#dc2626]' },
};

// ─── Exact Ground News Bias Bar ───
function GroundNewsBiasBar({ distribution, total }) {
  if (total === 0) return null;

  const pct = {
    left: Math.round((distribution.left / total) * 100) || 0,
    center: Math.round((distribution.center / total) * 100) || 0,
    right: Math.round((distribution.right / total) * 100) || 0,
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Bias Distribution</h2>
      </div>
      <div className="w-full flex h-6 rounded overflow-hidden">
        {pct.left > 0 && (
          <div className="bg-[#2563eb] h-full flex items-center justify-center font-bold text-white text-[11px]" style={{ width: `${pct.left}%` }}>
            {pct.left > 5 && `${pct.left}%`}
          </div>
        )}
        {pct.center > 0 && (
          <div className="bg-[#9ca3af] h-full flex items-center justify-center font-bold text-white text-[11px]" style={{ width: `${pct.center}%` }}>
            {pct.center > 5 && `${pct.center}%`}
          </div>
        )}
        {pct.right > 0 && (
          <div className="bg-[#dc2626] h-full flex items-center justify-center font-bold text-white text-[11px]" style={{ width: `${pct.right}%` }}>
             {pct.right > 5 && `${pct.right}%`}
          </div>
        )}
      </div>
      <div className="flex justify-between mt-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
        <span>Left</span>
        <span>Center</span>
        <span>Right</span>
      </div>
    </div>
  );
}

// ─── Article Image ───
function ArticleThumbnail({ src, alt }) {
  const [error, setError] = useState(false);
  if (!src || error) {
    return <div className="w-full h-full bg-gray-200 flex items-center justify-center"><FileText className="w-4 h-4 text-gray-400" /></div>;
  }
  return (
    <img src={src} alt={alt} className="w-full h-full object-cover" onError={() => setError(true)} loading="lazy" />
  );
}

// ─── AI Insights Summary (looks like GN summary) ───
function StorySummary({ summary }) {
  if (!summary) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-md p-6 mb-8 shadow-sm">
      <h3 className="text-[14px] font-bold text-gray-900 uppercase tracking-widest mb-4">Story Summary</h3>
      <ul className="space-y-3">
        <li className="flex items-start gap-3">
           <div className="mt-0.5"><Check className="w-4 h-4 text-gray-400" /></div>
           <p className="text-gray-700 text-sm leading-relaxed">{summary.most_agreed_claim || 'Multiple sources agree on key factual points.'}</p>
        </li>
        <li className="flex items-start gap-3">
           <div className="mt-0.5"><Check className="w-4 h-4 text-gray-400" /></div>
           <p className="text-gray-700 text-sm leading-relaxed">{summary.most_disputed_claim || 'Interpretations of the event differ based on the political leaning of the source.'}</p>
        </li>
      </ul>
    </div>
  );
}

// ─── Consensus Filter Tabs ───
function ConsensusTabs({ consensusClaims, biasClaims }) {
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All Statements', count: consensusClaims?.length || 0 },
    { id: 'left', label: 'Left Leaning', count: biasClaims?.left?.length || 0 },
    { id: 'center', label: 'Center Leaning', count: biasClaims?.center?.length || 0 },
    { id: 'right', label: 'Right Leaning', count: biasClaims?.right?.length || 0 },
  ];

  const displayedClaims = activeTab === 'all' ? consensusClaims : biasClaims?.[activeTab];

  return (
    <div className="mb-10">
       <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-4">Claim Extraction</h2>
       
       <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
         {tabs.map(tab => {
           let activeClass = 'bg-gray-100 text-gray-600 hover:bg-gray-200';
           if (activeTab === tab.id) {
             if (tab.id === 'left') activeClass = 'bg-[#2563eb] text-white';
             else if (tab.id === 'right') activeClass = 'bg-[#dc2626] text-white';
             else if (tab.id === 'center') activeClass = 'bg-[#9ca3af] text-white';
             else activeClass = 'bg-gray-900 text-white';
           }
           
           return (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors border border-transparent ${activeClass}`}
             >
               {tab.label}
               <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white/20' : 'bg-white text-gray-500'}`}>
                 {tab.count}
               </span>
             </button>
           );
         })}
       </div>

       {displayedClaims && displayedClaims.length > 0 ? (
         <div className="bg-white border border-gray-200 rounded-md divide-y divide-gray-100 shadow-sm">
           {displayedClaims.map((claim, idx) => (
             <div key={idx} className="p-4 hover:bg-gray-50 transition-colors">
               <p className="text-gray-800 text-sm leading-snug font-medium">{claim}</p>
             </div>
           ))}
         </div>
       ) : (
         <div className="bg-gray-50 border border-gray-200 border-dashed rounded-md p-8 text-center text-gray-500 text-sm">
           No matching claims found for this bias.
         </div>
       )}
    </div>
  );
}

// ─── Article Column Card ───
function ArticleCard({ article }) {
  const bias = BIAS_COLORS[article.bias_bucket] || BIAS_COLORS.center;
  
  return (
    <a href={article.url} target="_blank" rel="noopener noreferrer" className="block bg-white border border-gray-200 rounded overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full">
      <div className="h-32 w-full flex-shrink-0 relative">
         <ArticleThumbnail src={article.image_url} alt={article.title} />
         {/* Top Border Bias Bar styling Ground News uses on images sometimes */}
      </div>
      <div className={`h-1 w-full ${bias.bg}`} /> 
      
      <div className="p-3 flex flex-col flex-grow">
        <div className="flex items-center gap-1.5 mb-2">
          <span className={`text-[10px] font-bold uppercase tracking-wider ${bias.text}`}>
            {bias.label}
          </span>
          <span className="text-[10px] text-gray-400">•</span>
          <span className="text-[11px] font-bold text-gray-600 truncate uppercase tracking-widest">{article.source}</span>
        </div>
        <h4 className="text-[15px] font-bold text-gray-900 leading-snug group-hover:underline decoration-gray-400 line-clamp-3">
          {article.title}
        </h4>
        <div className="mt-auto pt-3 text-[11px] text-gray-400 font-medium">
           {article.claims_count} Fact{article.claims_count !== 1 ? 's' : ''} Extracted
        </div>
      </div>
    </a>
  );
}

// ─── Full Component ───
export default function GroundNewsResults({ results, topic }) {
  if (!results) return null;

  const distribution = useMemo(() => {
    const dist = { left: 0, center: 0, right: 0 };
    results.articles?.forEach(a => { dist[a.bias_bucket || 'center']++; });
    return dist;
  }, [results.articles]);
  
  const totalArticles = distribution.left + distribution.center + distribution.right;

  return (
    <div className="container mx-auto px-4 md:px-8 max-w-6xl">
       {/* Top Header Block */}
       <div className="mb-8 border-b border-gray-200 pb-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
         <div>
           <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1">
             <Info className="w-3 h-3" /> Coverage Analysis
           </div>
           <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4 capitalize">
             {topic}
           </h1>
           <div className="flex items-center gap-4 text-sm font-semibold text-gray-500">
             <span>{totalArticles} Sources Sorted</span>
             <span className="w-1 h-1 rounded-full bg-gray-300"></span>
             <span>Updated Just Now</span>
           </div>
         </div>
         <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
           <Share className="w-4 h-4" /> Share
         </button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* Main Content (Left 8 cols) */}
         <div className="lg:col-span-8">
           <GroundNewsBiasBar distribution={distribution} total={totalArticles} />
           <StorySummary summary={results.consensus_summary} />
           <ConsensusTabs consensusClaims={results.consensus_claims} biasClaims={results.bias_claims} />
         </div>

         {/* Right Sidebar Coverage Card (Right 4 cols) */}
         <aside className="lg:col-span-4 hidden lg:block">
           <div className="bg-white border border-gray-200 rounded-md p-6 sticky top-24 shadow-sm">
             <h3 className="text-[14px] font-bold text-gray-900 uppercase tracking-widest mb-6">Coverage Details</h3>
             
             <div className="flex justify-between items-baseline mb-6 border-b border-gray-100 pb-4">
               <span className="text-gray-500 font-semibold text-sm">Total Sources</span>
               <span className="text-4xl font-extrabold text-gray-900">{totalArticles}</span>
             </div>

             <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded bg-[#2563eb]"></div>
                    <span className="font-bold text-sm text-gray-700">Left Bias</span>
                  </div>
                  <span className="font-bold text-gray-900">{distribution.left}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded bg-[#9ca3af]"></div>
                    <span className="font-bold text-sm text-gray-700">Center Bias</span>
                  </div>
                  <span className="font-bold text-gray-900">{distribution.center}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded bg-[#dc2626]"></div>
                    <span className="font-bold text-sm text-gray-700">Right Bias</span>
                  </div>
                  <span className="font-bold text-gray-900">{distribution.right}</span>
                </div>
             </div>
           </div>
         </aside>
       </div>

       {/* Article Columns Section */}
       <div className="mt-12 border-t border-gray-200 pt-10 pb-20">
         <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Coverage</h2>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column */}
            <div>
              <div className="flex items-center justify-between border-b-2 border-[#2563eb] pb-2 mb-4">
                <span className="font-black text-[#2563eb] uppercase tracking-wider text-sm">Left</span>
                <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{results.bias_grouped_articles?.left?.length || 0}</span>
              </div>
              <div className="space-y-4">
                {results.bias_grouped_articles?.left?.map(a => <ArticleCard key={a.url} article={a} />) || <p className="text-xs text-gray-400 text-center py-4">No sources</p>}
              </div>
            </div>
            
            {/* Center Column */}
            <div>
              <div className="flex items-center justify-between border-b-2 border-[#9ca3af] pb-2 mb-4">
                <span className="font-black text-[#9ca3af] uppercase tracking-wider text-sm">Center</span>
                <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{results.bias_grouped_articles?.center?.length || 0}</span>
              </div>
              <div className="space-y-4">
                {results.bias_grouped_articles?.center?.map(a => <ArticleCard key={a.url} article={a} />) || <p className="text-xs text-gray-400 text-center py-4">No sources</p>}
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div className="flex items-center justify-between border-b-2 border-[#dc2626] pb-2 mb-4">
                <span className="font-black text-[#dc2626] uppercase tracking-wider text-sm">Right</span>
                <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{results.bias_grouped_articles?.right?.length || 0}</span>
              </div>
              <div className="space-y-4">
                {results.bias_grouped_articles?.right?.map(a => <ArticleCard key={a.url} article={a} />) || <p className="text-xs text-gray-400 text-center py-4">No sources</p>}
              </div>
            </div>
         </div>
       </div>
    </div>
  );
}
