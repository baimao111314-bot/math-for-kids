import React, { useEffect, useState } from 'react';
import { MathOperation } from '../types';

interface MathAnimatorProps {
  num1: number;
  num2: number;
  operation: MathOperation;
  emoji: string;
  playTrigger?: number; // Change this to restart animation
}

export const MathAnimator: React.FC<MathAnimatorProps> = ({ num1, num2, operation, emoji, playTrigger }) => {
  const [animationStage, setAnimationStage] = useState(0);

  // Restart animation when numbers change or trigger updates
  useEffect(() => {
    setAnimationStage(0);
    const timer1 = setTimeout(() => setAnimationStage(1), 500); // Step 1: Start / Appear
    const timer2 = setTimeout(() => setAnimationStage(2), 2500); // Step 2: Conclude (Result)
    return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
    };
  }, [num1, num2, operation, playTrigger]);

  // Dimensions
  const itemSize = 50;
  const gap = 10;
  const rowMax = 10;
  
  const getPos = (index: number, offsetX = 0) => {
    const col = index % rowMax;
    const row = Math.floor(index / rowMax);
    return {
      x: col * (itemSize + gap) + offsetX,
      y: row * (itemSize + gap) + 40 
    };
  };

  const totalWidth = Math.min((num1 + num2) * (itemSize + gap), rowMax * (itemSize + gap)) + 20;
  const totalRows = Math.floor(Math.max(num1, num1 + num2) / rowMax) + 1;
  const totalHeight = totalRows * (itemSize + gap) + 80;

  if (operation === MathOperation.ADD) {
    return (
      <div className="w-full overflow-hidden flex flex-col items-center justify-center bg-indigo-900 rounded-3xl p-4 shadow-inner">
        <svg width="100%" height={totalHeight} viewBox={`0 0 ${Math.max(400, totalWidth)} ${totalHeight}`} className="max-w-md">
          {/* Group 1: Static start */}
          {Array.from({ length: num1 }).map((_, i) => {
            const pos = getPos(i, 20);
            return (
              <text key={`g1-${i}`} x={pos.x} y={pos.y} fontSize="35" className="animate-pulse">
                {emoji}
              </text>
            );
          })}

          {/* Group 2: Animated Slide In */}
          {Array.from({ length: num2 }).map((_, i) => {
            const finalPos = getPos(num1 + i, 20);
            const startX = finalPos.x + 150;
            const startY = finalPos.y;

            return (
              <g key={`g2-${i}`} style={{
                  transform: animationStage >= 1 ? `translate(${finalPos.x}px, ${finalPos.y}px)` : `translate(${startX}px, ${startY}px)`,
                  transition: `transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.1}s`,
                  opacity: animationStage >= 1 ? 1 : 0
              }}>
                 <text fontSize="35">{emoji}</text>
              </g>
            );
          })}
          
          {/* Grouping Bracket / Result Text */}
          <g style={{ opacity: animationStage >= 2 ? 1 : 0, transition: 'opacity 0.5s ease-in' }}>
              <rect x="10" y="10" width={totalWidth} height={totalHeight - 40} fill="none" stroke="white" strokeWidth="2" rx="10" strokeDasharray="10 5" />
              <text x="20" y={totalHeight - 10} fill="#4ade80" fontSize="20" fontFamily="sans-serif" fontWeight="bold">
                 Total: {num1 + num2}
              </text>
          </g>
        </svg>
        <p className="text-indigo-200 text-sm mt-2">{animationStage === 0 ? "Start..." : animationStage === 1 ? "Adding more..." : "Count them all together!"}</p>
      </div>
    );
  } else {
    // SUBTRACTION
    return (
      <div className="w-full overflow-hidden flex flex-col items-center justify-center bg-indigo-900 rounded-3xl p-4 shadow-inner">
        <svg width="100%" height={totalHeight} viewBox={`0 0 ${Math.max(400, totalWidth)} ${totalHeight}`} className="max-w-md">
          {Array.from({ length: num1 }).map((_, i) => {
            const pos = getPos(i, 20);
            const isRemoved = i >= (num1 - num2);
            
            return (
              <g key={`sub-${i}`} transform={`translate(${pos.x}, ${pos.y})`}>
                <text 
                  fontSize="35" 
                  style={{
                    opacity: (isRemoved && animationStage >= 2) ? 0.2 : 1,
                    transition: `opacity 0.5s ease-in`
                  }}
                >
                  {emoji}
                </text>
                
                {isRemoved && (
                  <path 
                    d="M -15 -15 L 15 15 M 15 -15 L -15 15" 
                    stroke="#ef4444" 
                    strokeWidth="6" 
                    strokeLinecap="round"
                    style={{
                        strokeDasharray: 100,
                        strokeDashoffset: animationStage >= 1 ? 0 : 100,
                        transition: `stroke-dashoffset 0.5s ease-out ${(i - (num1 - num2)) * 0.2}s`,
                        opacity: (animationStage >= 1) ? 1 : 0
                    }}
                    transform="translate(15, -10)"
                  />
                )}
              </g>
            );
          })}
           <text 
            x="20" 
            y={totalHeight - 10} 
            fill="#ef4444" 
            fontSize="20" 
            fontFamily="sans-serif" 
            fontWeight="bold"
            style={{ opacity: animationStage >= 2 ? 1 : 0, transition: 'opacity 0.5s' }}
           >
            {num1} - {num2} = {num1 - num2} left
          </text>
        </svg>
        <p className="text-indigo-200 text-sm mt-2">{animationStage === 0 ? "Start..." : animationStage === 1 ? "Cross them out..." : "How many are left?"}</p>
      </div>
    );
  }
};