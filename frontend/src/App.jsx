import { useState } from 'react';
import AnimatedHero from './components/AnimatedHero';
import MainContent from './components/MainContent';
import TrendingPage from './components/TrendingPage';
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing', 'homepage', 'trending'
  const [topicToAnalyze, setTopicToAnalyze] = useState('');

  const navigateToHomepage = () => setCurrentPage('homepage');
  const navigateToTrending = () => setCurrentPage('trending');
  const navigateToLanding = () => setCurrentPage('landing');
  
  const analyzeTopicFromTrending = (topic) => {
    setTopicToAnalyze(topic);
    setCurrentPage('homepage');
  };

  return (
    <div className="App">
      {currentPage === 'landing' && (
        <AnimatedHero 
          onHomepage={navigateToHomepage}
          onTrending={navigateToTrending}
        />
      )}
      
      {currentPage === 'homepage' && (
        <MainContent 
          onBackToLanding={navigateToLanding}
          initialTopic={topicToAnalyze}
          onTopicAnalyzed={() => setTopicToAnalyze('')}
        />
      )}
      
      {currentPage === 'trending' && (
        <TrendingPage 
          onBack={navigateToHomepage}
          onAnalyzeTopic={analyzeTopicFromTrending}
        />
      )}
    </div>
  );
}

export default App;
