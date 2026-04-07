import { TrendingUp, MapPin, Globe2, Film, ArrowLeft } from 'lucide-react';
import Footer from './Footer';

const TrendingPage = ({ onBack }) => {
  const trendingCategories = [
    {
      title: "India & Geopolitics",
      icon: <MapPin className="w-6 h-6" />,
      stories: [
        { title: "Border tensions with neighboring countries", consensus: "high", sources: 8 },
        { title: "New trade agreement with EU nations", consensus: "medium", sources: 5 },
        { title: "Diplomatic visit to Southeast Asia", consensus: "high", sources: 12 },
        { title: "Regional cooperation on climate change", consensus: "medium", sources: 6 },
      ]
    },
    {
      title: "War Room",
      icon: <Globe2 className="w-6 h-6" />,
      stories: [
        { title: "Ukraine conflict enters new phase", consensus: "high", sources: 15 },
        { title: "Middle East tensions escalate", consensus: "medium", sources: 7 },
        { title: "NATO expansion discussions", consensus: "low", sources: 4 },
        { title: "Global arms treaty negotiations", consensus: "medium", sources: 9 },
      ]
    },
    {
      title: "Inside Parliament",
      icon: <TrendingUp className="w-6 h-6" />,
      stories: [
        { title: "Budget session key highlights", consensus: "high", sources: 10 },
        { title: "Opposition walkout over corruption charges", consensus: "medium", sources: 6 },
        { title: "New education policy debate", consensus: "low", sources: 3 },
        { title: "Healthcare reform bill discussion", consensus: "high", sources: 11 },
      ]
    },
    {
      title: "Celebs Corner",
      icon: <Film className="w-6 h-6" />,
      stories: [
        { title: "Bollywood star announces new project", consensus: "medium", sources: 5 },
        { title: "Celebrity charity event raises millions", consensus: "high", sources: 8 },
        { title: "Sports icon retirement speculation", consensus: "low", sources: 2 },
        { title: "Award show controversy sparks debate", consensus: "medium", sources: 7 },
      ]
    },
  ];

  const getConsensusColor = (level) => {
    switch (level) {
      case 'high': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-red-400';
      default: return 'text-white/50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Homepage
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">Drishtikon</h1>
                <p className="text-xs text-white/60">Trending Topics</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">Trending Now</span>
            </h2>
            <p className="text-white/60 text-lg">
              Explore the most discussed topics across categories
            </p>
          </div>

          {/* Trending Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {trendingCategories.map((category, idx) => (
              <div key={idx} className="glass-effect p-8 rounded-2xl hover:bg-white/10 transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-gradient">
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-bold">{category.title}</h3>
                </div>
                
                <div className="space-y-4">
                  {category.stories.map((story, storyIdx) => (
                    <div 
                      key={storyIdx}
                      className="border-l-2 border-white/20 pl-4 hover:border-orange-500/50 transition-all cursor-pointer group"
                    >
                      <p className="text-white/90 mb-2 group-hover:text-white transition-colors">
                        {story.title}
                      </p>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-white/50">{story.sources} sources</span>
                        <span className="text-white/30">•</span>
                        <span className={`font-semibold ${getConsensusColor(story.consensus)}`}>
                          {story.consensus} consensus
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <div className="glass-effect p-8 rounded-2xl max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Want to Analyze a Specific Topic?</h3>
              <p className="text-white/60 mb-6">
                Go to the homepage to search and analyze any topic in real-time
              </p>
              <button
                onClick={onBack}
                className="bg-gradient-to-r from-orange-500 to-pink-500 px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all"
              >
                Analyze a Topic
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default TrendingPage;
