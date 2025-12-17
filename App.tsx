import React, { useState, useEffect } from 'react';
import Fireworks from './components/Fireworks';
import ParticleText from './components/ParticleText';
import SplashCursor from './components/SplashCursor';
import ImageTrail from './components/ImageTrail';
import { Play, Pause, SkipForward } from 'lucide-react';

// The sequence of messages to display
const MESSAGES = [
  "再见 2025",
  "To 宝宝",
  "祝宝宝",
  "身体健康",
  "新年快乐",
  "幸福相随！",
  "❤"
];

// Images for the trail effect
const TRAIL_IMAGES = [
  "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=300&q=80", // Sparkler
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=300&q=80", // Heart
  "https://images.unsplash.com/photo-1490750967868-58cb75063ed4?w=300&q=80", // Flowers
  "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300&q=80", // Bokeh
  "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=300&q=80", // Sky
  "https://images.unsplash.com/photo-1520052205864-92d242b3a76b?w=300&q=80", // Pink Texture
];

const App: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-advance logic
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isPlaying) {
      timer = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % MESSAGES.length);
      }, 4000); // Change text every 4 seconds
    }
    return () => clearTimeout(timer);
  }, [currentIndex, isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const nextMessage = () => {
    setCurrentIndex((prev) => (prev + 1) % MESSAGES.length);
    // Reset timer effectively by triggering re-render
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none">
      {/* Top Layer: Fluid Splash Cursor (Visual overlay, input pass-through) */}
      <SplashCursor 
        SIM_RESOLUTION={128}
        DYE_RESOLUTION={1024}
        SPLAT_FORCE={6000}
      />
      
      {/* Mid Layer: Image Trail (Appears behind text but above fireworks) */}
      <ImageTrail items={TRAIL_IMAGES} />

      {/* Background Layer: Fireworks */}
      <div className="absolute inset-0 z-0">
        <Fireworks />
      </div>

      {/* Foreground Layer: Interactive Text Particles */}
      <div className="absolute inset-0 z-10">
        <ParticleText text={MESSAGES[currentIndex]} />
      </div>

      {/* Controls Overlay */}
      <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center items-center gap-6 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={togglePlay}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white transition-all transform hover:scale-110 pointer-events-auto"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button
          onClick={nextMessage}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white transition-all transform hover:scale-110 pointer-events-auto"
        >
          <SkipForward size={24} />
        </button>
      </div>
      
      <div className="absolute bottom-4 left-0 right-0 text-center text-white/30 text-xs z-20 pointer-events-none">
        Hover over text and background to interact • Tap bottom for controls
      </div>
    </div>
  );
};

export default App;