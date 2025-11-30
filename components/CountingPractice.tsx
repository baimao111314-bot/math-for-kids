
import React, { useState } from 'react';

interface CountingPracticeProps {
  onBack: () => void;
}

export const CountingPractice: React.FC<CountingPracticeProps> = ({ onBack }) => {
  const [activeNumbers, setActiveNumbers] = useState<Set<number>>(new Set());
  const [hiddenNumbers, setHiddenNumbers] = useState<Set<number>>(new Set());
  const [activityMode, setActivityMode] = useState<string>("");

  const applyPreset = (mode: number) => {
    setHiddenNumbers(new Set()); // Clear hidden
    setActivityMode("");
    
    const newSet = new Set<number>();
    if (mode === 1) {
        // Show All (Reset)
        // No visual highlight, just clear
    } else if (mode > 1) {
        // Multiples
        for (let i = mode; i <= 100; i += mode) newSet.add(i);
    }
    setActiveNumbers(newSet);
  };

  const toggleNumber = (num: number) => {
      // If it's hidden, reveal it!
      if (hiddenNumbers.has(num)) {
          const newHidden = new Set(hiddenNumbers);
          newHidden.delete(num);
          setHiddenNumbers(newHidden);

          // Auto highlight to show it was found
          const newActive = new Set(activeNumbers);
          newActive.add(num);
          setActiveNumbers(newActive);
          return;
      }

      // Normal toggle
      const newSet = new Set(activeNumbers);
      if (newSet.has(num)) {
          newSet.delete(num);
      } else {
          newSet.add(num);
      }
      setActiveNumbers(newSet);
  };

  const clear = () => {
      setActiveNumbers(new Set());
      setHiddenNumbers(new Set());
      setActivityMode("");
  };

  const startActivity = () => {
      // Clear current state
      setActiveNumbers(new Set());
      const newHidden = new Set<number>();
      
      const activities = [
          'RANDOM', 'EVENS', 'ODDS', 'ROW', 'TENS'
      ];
      const type = activities[Math.floor(Math.random() * activities.length)];

      switch (type) {
          case 'RANDOM':
              setActivityMode("Find the missing numbers! 🕵️‍♀️");
              while (newHidden.size < 15) {
                  newHidden.add(Math.floor(Math.random() * 100) + 1);
              }
              break;
          case 'EVENS':
              setActivityMode("Where are the Even numbers? (2, 4, 6...)");
              for (let i = 2; i <= 100; i += 2) newHidden.add(i);
              break;
          case 'ODDS':
              setActivityMode("Where are the Odd numbers? (1, 3, 5...)");
              for (let i = 1; i <= 100; i += 2) newHidden.add(i);
              break;
          case 'ROW':
              const startRow = Math.floor(Math.random() * 9) * 10 + 1; // 1, 11, 21...
              setActivityMode(`Fill in the missing row! (${startRow}-${startRow+9})`);
              for (let i = 0; i < 10; i++) newHidden.add(startRow + i);
              break;
          case 'TENS':
               setActivityMode("Find the Tens! (10, 20, 30...)");
               for (let i = 10; i <= 100; i += 10) newHidden.add(i);
               break;
      }
      setHiddenNumbers(newHidden);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button 
            onClick={onBack}
            className="px-4 py-2 bg-white rounded-full shadow-md text-gray-600 hover:bg-gray-100 transition-colors font-bold border border-gray-200 flex items-center gap-2"
        >
            ⬅️ Back
        </button>
        <h1 className="text-2xl md:text-3xl font-extrabold text-indigo-600 tracking-tight text-center flex-1">
            Counting to 100 💯
        </h1>
        <div className="w-20"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-full">
        
        {/* Controls */}
        <div className="flex flex-row lg:flex-col gap-3 justify-center lg:justify-start lg:w-48 overflow-x-auto pb-2 lg:pb-0 shrink-0">
          
          {/* Activity Section */}
          <div className="bg-purple-50 p-3 rounded-xl border-2 border-purple-100 flex flex-col gap-2">
              <div className="text-purple-800 text-xs font-bold uppercase tracking-wider hidden lg:block">Play</div>
              <button 
                onClick={startActivity}
                className="px-4 py-3 rounded-xl font-bold text-sm md:text-base transition-all bg-purple-500 text-white shadow-purple-200 shadow-md hover:bg-purple-600 hover:scale-105 animate-pulse-slow"
              >
                Activities 🎲
              </button>
          </div>
          
          <div className="h-1 bg-gray-200 rounded hidden lg:block my-2"></div>

          <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2 hidden lg:block">View Modes</div>
          <button 
            onClick={() => applyPreset(1)}
            className="px-4 py-3 rounded-xl font-bold text-sm md:text-base transition-all whitespace-nowrap bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-100 hover:scale-105"
          >
            Show All
          </button>
          <button 
            onClick={() => applyPreset(2)}
            className="px-4 py-3 rounded-xl font-bold text-sm md:text-base transition-all whitespace-nowrap bg-white text-pink-500 hover:bg-pink-50 border border-pink-100 hover:scale-105"
          >
            Count by 2s
          </button>
          <button 
            onClick={() => applyPreset(5)}
            className="px-4 py-3 rounded-xl font-bold text-sm md:text-base transition-all whitespace-nowrap bg-white text-green-500 hover:bg-green-50 border border-green-100 hover:scale-105"
          >
            Count by 5s
          </button>
          <button 
            onClick={() => applyPreset(10)}
            className="px-4 py-3 rounded-xl font-bold text-sm md:text-base transition-all whitespace-nowrap bg-white text-orange-500 hover:bg-orange-50 border border-orange-100 hover:scale-105"
          >
            Count by 10s
          </button>
           <button 
            onClick={clear}
            className="px-4 py-3 rounded-xl font-bold text-sm md:text-base transition-all whitespace-nowrap bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            Clear
          </button>
        </div>

        {/* Grid Area */}
        <div className="flex-1 flex flex-col min-h-0">
             {/* Activity Title */}
             <div className={`
                mb-3 text-center transition-all duration-500 overflow-hidden
                ${activityMode ? 'opacity-100 max-h-20 py-2 bg-yellow-100 text-yellow-800 rounded-xl font-bold border-2 border-yellow-200 shadow-sm' : 'opacity-0 max-h-0'}
             `}>
                {activityMode}
             </div>

            <div className="flex-1 bg-white rounded-3xl shadow-xl p-4 md:p-6 border-4 border-indigo-100 overflow-y-auto">
                <div className="grid grid-cols-10 gap-1 md:gap-2 h-full content-center max-w-2xl mx-auto lg:max-w-none">
                    {Array.from({ length: 100 }).map((_, i) => {
                        const num = i + 1;
                        const active = activeNumbers.has(num);
                        const hidden = hiddenNumbers.has(num);

                        return (
                            <button 
                                key={num}
                                onClick={() => toggleNumber(num)}
                                className={`
                                    aspect-square rounded-lg flex items-center justify-center text-xs md:text-lg lg:text-xl font-bold transition-all duration-300 select-none relative
                                    ${hidden 
                                        ? 'bg-gray-100 border-2 border-dashed border-gray-300 text-transparent hover:bg-gray-200' 
                                        : active 
                                            ? 'bg-indigo-500 text-white transform scale-110 z-10 shadow-md' 
                                            : 'bg-indigo-50 text-indigo-300 hover:bg-indigo-100'
                                    }
                                `}
                            >
                                {hidden ? (
                                    <span className="text-gray-400 text-lg md:text-2xl">?</span>
                                ) : (
                                    num
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="mt-2 text-center text-gray-400 text-xs hidden lg:block">
                {hiddenNumbers.size > 0 ? "Tap the ? boxes to reveal numbers!" : "Click any box to color it!"}
            </div>
        </div>

      </div>
    </div>
  );
};
