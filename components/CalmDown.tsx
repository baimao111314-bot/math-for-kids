
import React, { useState, useEffect } from 'react';

interface CalmDownProps {
  onBack: () => void;
}

export const CalmDown: React.FC<CalmDownProps> = ({ onBack }) => {
  const [phase, setPhase] = useState<'In' | 'Hold' | 'Out'>('In');
  const [text, setText] = useState("Breathe In...");
  const [flowers, setFlowers] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const cycle = () => {
      if (showCelebration) return; // Stop cycle visuals if celebrating (optional, but cleaner)

      // 4-4-4 breathing technique simplified for kids
      setPhase('In');
      setText("Breathe In... 🌸");
      
      setTimeout(() => {
        setPhase('Hold');
        setText("Hold... 🐢");
        
        setTimeout(() => {
            setPhase('Out');
            setText("Breathe Out... 💨");
        }, 4000); // Hold for 4s

      }, 4000); // Breathe In for 4s
    };

    if (!showCelebration) {
        cycle();
        const interval = setInterval(cycle, 12000); // Total cycle 12s
        return () => clearInterval(interval);
    }
  }, [showCelebration]);

  const handleCollectFlower = () => {
      if (flowers < 5) {
          const newCount = flowers + 1;
          setFlowers(newCount);
          if (newCount === 5) {
              triggerCelebration();
          }
      }
  };

  const triggerCelebration = () => {
      setShowCelebration(true);
      // Simple text to speech
      if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance("Well done! You did a great job.");
          utterance.rate = 0.9;
          utterance.pitch = 1.2;
          window.speechSynthesis.speak(utterance);
      }
  };

  const reset = () => {
      setFlowers(0);
      setShowCelebration(false);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-teal-50 to-blue-100 rounded-3xl relative overflow-hidden p-6">
       
       {/* Full Screen Confetti Overlay */}
       {showCelebration && (
         <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
            {/* Generating 30 falling flowers with random delays */}
            {Array.from({ length: 30 }).map((_, i) => (
                <div 
                    key={i}
                    className="absolute text-4xl animate-fall"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: '-10%',
                        animationDuration: `${3 + Math.random() * 2}s`,
                        animationDelay: `${Math.random() * 2}s`
                    }}
                >
                    {['🌸', '🌺', '🌻', '🌼', '🌷', '💐'][Math.floor(Math.random() * 6)]}
                </div>
            ))}
            <style>{`
                @keyframes fall {
                    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
                }
                .animate-fall {
                    animation-name: fall;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                }
            `}</style>
         </div>
       )}

       {/* Success Modal */}
       {showCelebration && (
           <div className="absolute inset-0 z-40 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
               <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border-4 border-yellow-300 transform scale-100 animate-bounce-in">
                   <div className="text-6xl mb-4">🏆</div>
                   <h2 className="text-3xl font-extrabold text-teal-600 mb-2">Well Done!</h2>
                   <p className="text-gray-500 mb-6">You are calm and ready to learn!</p>
                   <button 
                       onClick={reset}
                       className="px-8 py-3 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-600 shadow-lg"
                   >
                       Start Again
                   </button>
               </div>
           </div>
       )}

       <button 
            onClick={onBack}
            className="absolute top-6 left-6 px-4 py-2 bg-white/80 rounded-full shadow-sm text-teal-700 hover:bg-white transition-colors font-bold flex items-center gap-2 backdrop-blur-sm z-30"
        >
            ⬅️ Back
        </button>

      <h2 className="text-3xl font-bold text-teal-800 mb-4 z-10">Calm Down Corner 🌿</h2>
      
      {/* Visuals */}
      <div className="relative flex items-center justify-center mb-8">
          <div className={`absolute rounded-full border-4 border-teal-200 transition-all duration-[4000ms] ease-in-out ${phase === 'In' ? 'w-80 h-80 opacity-50' : phase === 'Out' ? 'w-32 h-32 opacity-20' : 'w-80 h-80 opacity-50'}`}></div>
          <div className={`
            rounded-full bg-gradient-to-br from-teal-300 to-blue-300 shadow-2xl flex items-center justify-center
            transition-all duration-[4000ms] ease-in-out
            ${phase === 'In' ? 'w-72 h-72 scale-100' : phase === 'Out' ? 'w-72 h-72 scale-50' : 'w-72 h-72 scale-100'}
          `}>
             <span className="text-6xl animate-pulse">
                {phase === 'In' ? '😤' : phase === 'Hold' ? '😐' : '😌'}
             </span>
          </div>
      </div>

      <p className={`text-2xl font-bold text-teal-700 transition-opacity duration-500 mb-8 ${phase === 'Hold' ? 'opacity-100' : 'opacity-80'}`}>
          {text}
      </p>

      {/* Interactive Section */}
      <div className="flex flex-col items-center gap-6 w-full max-w-md bg-white/60 p-6 rounded-3xl backdrop-blur-sm z-20">
          
          {/* Progress (Flowers) */}
          <div className="flex gap-2 h-12 items-center justify-center">
              {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className={`text-4xl transition-all duration-500 ${i < flowers ? 'opacity-100 scale-110' : 'opacity-20 grayscale scale-75'}`}>
                      🌸
                  </div>
              ))}
          </div>

          <button
            onClick={handleCollectFlower}
            disabled={showCelebration}
            className="px-8 py-4 bg-teal-600 text-white rounded-2xl font-bold text-xl shadow-lg hover:bg-teal-700 active:scale-95 transition-all w-full relative overflow-hidden group"
          >
              <span className="relative z-10">I finished a breath! 💨</span>
              <div className="absolute inset-0 bg-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </button>
          
          <p className="text-teal-800 text-sm font-medium">Collect 5 flowers to finish!</p>
      </div>

    </div>
  );
};
