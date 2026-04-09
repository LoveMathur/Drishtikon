import { FileText } from 'lucide-react';
import { useState } from 'react';

// ─── Bias styling ───
const BIAS_COLORS = {
  left: { bg: 'bg-[#2563eb]', text: 'text-[#2563eb]' },
  center: { bg: 'bg-[#9ca3af]', text: 'text-[#9ca3af]' },
  right: { bg: 'bg-[#dc2626]', text: 'text-[#dc2626]' },
};

export default function TrendingCard({ article, onAnalyze }) {
  const [imgError, setImgError] = useState(false);
  const biasStyle = BIAS_COLORS[article.bias_bucket] || BIAS_COLORS.center;

  // Ground news label format
  const biasLabel = article.bias_bucket === 'left' ? 'L' :
                    article.bias_bucket === 'right' ? 'R' : 'C';

  return (
    <div
      onClick={() => onAnalyze && onAnalyze(article.title)}
      className="bg-white border border-gray-200 rounded overflow-hidden hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full group"
    >
      {/* Top Image Section */}
      <div className="w-full h-40 bg-gray-100 relative flex-shrink-0">
        {article.image_url && !imgError ? (
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileText className="w-6 h-6 text-gray-300" />
          </div>
        )}
        
        {/* Tiny Bias Letter Badge on top right of image */}
        <div className={`absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded text-[10px] font-black text-white ${biasStyle.bg} shadow-sm`}>
          {biasLabel}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-[16px] font-bold text-gray-900 leading-snug mb-3 line-clamp-3 group-hover:underline decoration-gray-400">
          {article.title}
        </h3>

        {/* Footer info stuck to bottom */}
        <div className="mt-auto border-t border-gray-100 pt-3 flex items-center gap-2">
           <div className={`w-3 h-3 rounded bg-white border-[3px] border-white ring-1 ring-gray-200 outline-none shadow-sm flex items-center justify-center`} style={{ backgroundColor: biasStyle.text.replace('text-[','').replace(']','') }}>
              {/* the inner dot is the bias color */}
              <div className={`w-full h-full ${biasStyle.bg}`}></div>
           </div>
           <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest truncate">
             {article.source}
           </span>
        </div>
      </div>
    </div>
  );
}
