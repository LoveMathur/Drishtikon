import { Globe2, MapPin, Landmark } from 'lucide-react';

const Footer = ({ onTopicClick }) => {
  const borderCountries = [
    "Pakistan", "China", "Nepal", "Bhutan", "Bangladesh", "Myanmar", "Sri Lanka"
  ];

  const continents = [
    "Asia", "Europe", "North America", "South America", "Africa", "Australia", "Antarctica"
  ];

  const stateCouncil = [
    "North India", "South India", "East India", "West India", "Seven Sisters", "Central India"
  ];

  const handleLinkClick = (e, topic) => {
    e.preventDefault();
    if (onTopicClick) {
      onTopicClick(topic);
    }
  };

  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-300 mt-auto">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Happening in Borders */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-bold text-white tracking-wide">Happening in Borders</h3>
            </div>
            <ul className="space-y-3">
              {borderCountries.map((country, idx) => (
                <li key={idx}>
                  <a 
                    href="#" 
                    onClick={(e) => handleLinkClick(e, country)}
                    className="hover:text-white hover:underline transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-red-500 transition-colors"></span>
                    {country}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* International Affairs */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Globe2 className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-bold text-white tracking-wide">International Affairs</h3>
            </div>
            <ul className="space-y-3">
              {continents.map((continent, idx) => (
                <li key={idx}>
                  <a 
                    href="#" 
                    onClick={(e) => handleLinkClick(e, continent)}
                    className="hover:text-white hover:underline transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-blue-500 transition-colors"></span>
                    {continent}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* State Council */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Landmark className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-bold text-white tracking-wide">State Council</h3>
            </div>
            <ul className="space-y-3">
              {stateCouncil.map((region, idx) => (
                <li key={idx}>
                  <a 
                    href="#" 
                    onClick={(e) => handleLinkClick(e, region)}
                    className="hover:text-white hover:underline transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-orange-500 transition-colors"></span>
                    {region}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-500 text-sm font-semibold tracking-wide">
              © 2026 Drishtikon.
            </div>
            <div className="flex gap-6 text-sm font-semibold tracking-wide">
              <a href="#" className="text-gray-500 hover:text-white transition-colors">About</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
