import React, { useState, useEffect,useRef } from 'react';
import Fireworks from './components/Fireworks';
import ParticleText from './components/ParticleText';
import SplashCursor from './components/SplashCursor';
import ImageTrail from './components/ImageTrail';
import { Play, Pause, SkipForward } from 'lucide-react';

// The sequence of messages to display
const MESSAGES = [
  "再见 2025",
  "To 郭昕怡",
  "祝宝宝",
  "身体健康",
  "新年快乐",
  "一月一号 宜悦宜好！",
  "❤"
];

// Images for the trail effect
      const TRAIL_IMAGES = [
        "https://img.xiumi.us/xmi/ua/5A6Qb/i/11c89dc77dd294697cc4a9b534e26eaf-sz_75986.jpg?x-oss-process=style/xmwebp",
        "https://img.xiumi.us/xmi/ua/5A6Qb/i/81628dfc99fff37b79ceda8d20661f37-sz_164514.jpg?x-oss-process=style/xmwebp",
        "https://img.xiumi.us/xmi/ua/5A6Qb/i/34c452a14bb1130ee4cc6729941a0576-sz_91823.jpg?x-oss-process=style/xmwebp",
        
      ];

const MUSIC_URL = "https://lf9-music-east.douyinstatic.com/obj/ies-music-hj/7582538870085225253.mp3";

const App: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Handle audio play/pause based on isPlaying state
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((e) => {
          console.log("Autoplay blocked, waiting for interaction", e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Set initial volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
    }
  }, []);

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

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  const nextMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % MESSAGES.length);
  };

  const handleGlobalClick = () => {
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  return (
    <div 
      className="relative w-full h-screen bg-black overflow-hidden select-none"
      onClick={handleGlobalClick}
    >
      <audio ref={audioRef} src={MUSIC_URL} loop playsInline />

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
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white transition-all transform hover:scale-110 pointer-events-auto flex items-center gap-2"
          title={isPlaying ? "Pause" : "Play Music & Animation"}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button
          onClick={nextMessage}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white transition-all transform hover:scale-110 pointer-events-auto"
          title="Next Message"
        >
          <SkipForward size={24} />
        </button>
      </div>
      
      <div className="absolute bottom-4 left-0 right-0 text-center text-white/30 text-xs z-20 pointer-events-none">
        Click anywhere to play • Tap bottom for controls
      </div>
    </div>
  );
};

export default App;
