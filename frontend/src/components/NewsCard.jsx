const NewsCard = ({ article, biasColor }) => {
  const getBiasStyle = (bias) => {
    switch (bias) {
      case 'left':
      case 'center-left':
        return 'bg-bias-left/20 border-bias-left/50 text-bias-left';
      case 'center':
        return 'bg-bias-center/20 border-bias-center/50 text-black';
      case 'right':
      case 'center-right':
        return 'bg-bias-right/20 border-bias-right/50 text-bias-right';
      default:
        return 'bg-white/10 border-white/30 text-white/70';
    }
  };

  return (
    <div className={`p-6 rounded-xl border ${getBiasStyle(article.bias)} hover:scale-[1.02] transition-all cursor-pointer`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-lg">{article.title}</h3>
        <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${getBiasStyle(article.bias)}`}>
          {article.bias.toUpperCase()}
        </span>
      </div>
      <p className="text-sm text-white/70 mb-3">{article.source}</p>
      <div className="text-xs text-white/50">
        {article.claims_count} claims extracted
      </div>
    </div>
  );
};

export default NewsCard;
