import { Globe2, MapPin, Film } from 'lucide-react';

const Footer = () => {
  const borderCountries = [
    "Pakistan", "China", "Nepal", "Bhutan", "Bangladesh", "Myanmar", "Sri Lanka"
  ];

  const continents = [
    "Asia", "Europe", "North America", "South America", "Africa", "Australia", "Antarctica"
  ];

  const reelTopics = [
    "Behind the Scenes",
    "Political Satire",
    "Fact Checks",
    "Breaking News",
    "Expert Opinions",
    "Data Visualization"
  ];

  return (
    <footer className="border-t border-white/10 bg-black/80 backdrop-blur-md mt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Trending in Borders */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-bold">Trending in Borders</h3>
            </div>
            <ul className="space-y-2">
              {borderCountries.map((country, idx) => (
                <li key={idx}>
                  <a href="#" className="text-white/60 hover:text-orange-500 transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-white/40 rounded-full group-hover:bg-orange-500"></span>
                    {country}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Trending Internationally */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Globe2 className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-bold">Trending Internationally</h3>
            </div>
            <ul className="space-y-2">
              {continents.map((continent, idx) => (
                <li key={idx}>
                  <a href="#" className="text-white/60 hover:text-blue-500 transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-white/40 rounded-full group-hover:bg-blue-500"></span>
                    {continent}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Trending in Reels */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Film className="w-5 h-5 text-pink-500" />
              <h3 className="text-lg font-bold">Trending in Reels</h3>
            </div>
            <ul className="space-y-2">
              {reelTopics.map((topic, idx) => (
                <li key={idx}>
                  <a href="#" className="text-white/60 hover:text-pink-500 transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-white/40 rounded-full group-hover:bg-pink-500"></span>
                    {topic}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-white/40 text-sm">
              © 2026 Drishtikon. Powered by AI • Real-time Consensus Analysis
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-white/60 hover:text-white transition-colors">About</a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
