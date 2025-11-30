import React, { useState, useEffect } from 'react';
import { MathOperation } from '../types';

interface MathVisualizerProps {
  num1: number;
  num2: number;
  operation: MathOperation;
  emoji: string;
  onCountChange?: (count: number) => void;
}

export const MathVisualizer: React.FC<MathVisualizerProps> = ({ num1, num2, operation, emoji, onCountChange }) => {
  // Track specifically which indices have been interacted with
  const [activeIndices, setActiveIndices] = useState<Set<number>>(new Set());

  // Reset when props change
  useEffect(() => {
    setActiveIndices(new Set());
    // Notify parent of reset
    onCountChange?.(0);
  }, [num1, num2, operation, emoji]);

  // Notify parent whenever activeIndices changes
  useEffect(() => {
    onCountChange?.(activeIndices.size);
  }, [activeIndices]);

  const toggleIndex = (index: number) => {
    const newSet = new Set(activeIndices);
    
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      // Check limits before adding
      if (newSet.size < num2) {
        newSet.add(index);
      }
    }
    setActiveIndices(newSet);
  };

  const renderItems = () => {
    const items = [];
    const count = activeIndices.size;
    
    if (num1 + num2 > 50) {
      return <div className="text-gray-500 text-lg">Numbers are too big to draw! Try smaller numbers.</div>;
    }

    if (operation === MathOperation.ADD) {
      // ADDITION VISUALIZATION
      // 1. Fixed Num1 Items
      for (let i = 0; i < num1; i++) {
        items.push(
          <div key={`n1-${i}`} className="text-4xl m-1 cursor-default animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
            {emoji}
          </div>
        );
      }
      
      // 2. Plus Sign
      items.push(
        <div key="plus" className="flex items-center justify-center text-3xl font-bold text-gray-300 mx-2">
          +
        </div>
      );

      // 3. Interactive Num2 Items (Ghost/Fill)
      for (let i = 0; i < num2; i++) {
        const isFilled = activeIndices.has(i);
        items.push(
          <button 
            key={`n2-${i}`} 
            onClick={() => toggleIndex(i)}
            className={`text-4xl m-1 w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ${
              isFilled 
                ? 'scale-110 opacity-100 bg-green-50' 
                : 'opacity-40 grayscale border-2 border-dashed border-gray-300 hover:bg-gray-50'
            }`}
          >
            {emoji}
          </button>
        );
      }
    } else {
      // SUBTRACTION VISUALIZATION
      // 1. Num1 Items (Click to cross out)
      for (let i = 0; i < num1; i++) {
        const isCrossedOut = activeIndices.has(i);
        // Allow clicking if it's already crossed (to undo) OR if we haven't reached the limit yet
        const canClick = isCrossedOut || activeIndices.size < num2;

        items.push(
          <button 
            key={`sub-${i}`} 
            onClick={() => canClick && toggleIndex(i)}
            disabled={!canClick}
            className={`text-4xl m-1 relative w-12 h-12 flex items-center justify-center transition-all duration-300 rounded-full ${
                !canClick ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-50 cursor-pointer'
            }`}
          >
             <span className={isCrossedOut ? 'opacity-30 blur-[1px]' : ''}>{emoji}</span>
             {isCrossedOut && (
               <div className="absolute inset-0 flex items-center justify-center text-red-500 font-bold text-5xl pointer-events-none animate-ping-short">
                 &times;
               </div>
             )}
          </button>
        );
      }
    }

    return items;
  };

  const getInstruction = () => {
      const currentCount = activeIndices.size;
      const isComplete = currentCount === num2;

      if (operation === MathOperation.ADD) {
          const currentTotal = num1 + currentCount;
          return (
              <div className={`w-full text-center mt-4 p-2 rounded-xl font-bold text-lg transition-colors ${isComplete ? 'bg-green-100 text-green-800' : 'bg-blue-50 text-blue-800'}`}>
                  {num1} + {currentCount} = {currentTotal}
                  {isComplete ? " ✅ Ready for the story!" : ""}
              </div>
          );
      } else {
          const remaining = num1 - currentCount;
          return (
              <div className={`w-full text-center mt-4 p-2 rounded-xl font-bold text-lg transition-colors ${isComplete ? 'bg-green-100 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  {num1} - {currentCount} = {remaining}
                  {isComplete ? " ✅ Ready for the story!" : ""}
              </div>
          );
      }
  }

  return (
    <div className="flex flex-col items-center w-full">
        <div className="w-full bg-white rounded-3xl p-6 border-4 border-dashed border-indigo-200 min-h-[150px] flex flex-wrap justify-center items-center select-none">
            {renderItems()}
        </div>
        {getInstruction()}
    </div>
  );
};