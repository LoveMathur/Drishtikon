import { useState } from 'react';
import AnimatedHero from './components/AnimatedHero';
import MainContent from './components/MainContent';
import TrendingPage from './components/TrendingPage';
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing', 'homepage', 'trending'

  const navigateToHomepage = () => setCurrentPage('homepage');
  const navigateToTrending = () => setCurrentPage('trending');
  const navigateToLanding = () => setCurrentPage('landing');

  return (
    <div className="App">
      {currentPage === 'landing' && (
        <AnimatedHero 
          onHomepage={navigateToHomepage}
          onTrending={navigateToTrending}
        />
      )}
      
      {currentPage === 'homepage' && (
        <MainContent onBackToLanding={navigateToLanding} />
      )}
      
      {currentPage === 'trending' && (
        <TrendingPage onBack={navigateToHomepage} />
      )}
    </div>
  );
}

export default App;
