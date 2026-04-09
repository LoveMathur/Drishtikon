import { useEffect, useMemo, useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoveRight, Flame } from "lucide-react";
import TestimonialsBackground from "./TestimonialsBackground";

// Memoized static components to prevent re-renders
const StaticHeading = memo(function StaticHeading() {
  return (
    <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
      News is now
    </span>
  );
});

const StaticDescription = memo(function StaticDescription() {
  return (
    <p className="text-lg md:text-xl leading-relaxed tracking-tight text-white/90 max-w-2xl text-center drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] font-medium">
      Analysis of news from multiple sources, key factual claims extracted,
      consensus and disagreements identified. We cut through bias and 
      noise, giving users clear, structured insights into what is actually
      happening.
    </p>
  );
});

const ActionButtons = memo(function ActionButtons({ onTrending, onHomepage }) {
  return (
    <div className="flex flex-row gap-3">
      <button
        onClick={onTrending}
        className="inline-flex items-center justify-center gap-4 h-11 px-8 rounded-md text-sm font-semibold border-2 border-white/40 bg-black/60 backdrop-blur-md text-white hover:bg-white/20 hover:border-white/60 transition-all shadow-lg shadow-white/20"
      >
        Trending <Flame className="w-4 h-4" />
      </button>
      <button
        onClick={onHomepage}
        className="inline-flex items-center justify-center gap-4 h-11 px-8 rounded-md text-sm font-semibold bg-white text-black hover:bg-gray-100 transition-all shadow-lg shadow-white/40"
      >
        Homepage <MoveRight className="w-4 h-4" />
      </button>
    </div>
  );
});

function AnimatedHero({ onHomepage, onTrending }) {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["unbiased", "trustworthy", "simplified", "transparent", "structured"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber((prev) => (prev === titles.length - 1 ? 0 : prev + 1));
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles.length]);

  // Memoize callbacks to prevent re-renders
  const handleHomepage = useCallback(() => {
    onHomepage && onHomepage();
  }, [onHomepage]);

  const handleTrending = useCallback(() => {
    onTrending && onTrending();
  }, [onTrending]);

  return (
    <div className="w-full min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* 3D Testimonials Background - Memoized */}
      <TestimonialsBackground />
      
      {/* Main Content with increased opacity */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-normal">
              <StaticHeading />
              <span 
                className="relative flex w-full justify-center text-center md:pb-4 md:pt-1"
                style={{ 
                  height: '1.2em',
                  minHeight: '1.2em'
                }}
              >
                &nbsp;
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={titleNumber}
                    className="absolute font-semibold text-gradient drop-shadow-[0_0_20px_rgba(249,115,22,0.8)]"
                    style={{
                      willChange: 'transform, opacity',
                      backfaceVisibility: 'hidden',
                      WebkitFontSmoothing: 'antialiased',
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      transition: {
                        duration: 0.5,
                        ease: [0.25, 0.1, 0.25, 1]
                      }
                    }}
                    exit={{ 
                      opacity: 0, 
                      scale: 0.8,
                      transition: {
                        duration: 0.3,
                        ease: [0.25, 0.1, 0.25, 1]
                      }
                    }}
                  >
                    {titles[titleNumber]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>

            <StaticDescription />
          </div>
          
          <ActionButtons onHomepage={handleHomepage} onTrending={handleTrending} />
        </div>
      </div>
    </div>
  );
}

export default AnimatedHero;
