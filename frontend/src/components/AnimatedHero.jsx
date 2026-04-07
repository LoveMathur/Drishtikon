import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, Flame } from "lucide-react";

function AnimatedHero({ onHomepage, onTrending }) {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["unbiased", "trustworthy", "simplified", "transparent", "structured"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full min-h-screen bg-black flex items-center justify-center">
      <div className="container mx-auto px-6">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-normal">
              <span className="text-cyan-50">News is now</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold text-gradient"
                    initial={{ opacity: 0, y: -100 }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-gray-400 max-w-2xl text-center">
              Analysis of news from multiple sources, key factual claims extracted,
              consensus and disagreements identified. We cut through bias and 
              noise, giving users clear, structured insights into what is actually
              happening.
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <button
              onClick={onTrending}
              className="inline-flex items-center justify-center gap-4 h-11 px-8 rounded-md text-sm font-medium border border-white/20 bg-transparent text-white hover:bg-white/10 transition-colors"
            >
              Trending <Flame className="w-4 h-4" />
            </button>
            <button
              onClick={onHomepage}
              className="inline-flex items-center justify-center gap-4 h-11 px-8 rounded-md text-sm font-medium bg-white text-black hover:bg-gray-200 transition-colors"
            >
              Homepage <MoveRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnimatedHero;
