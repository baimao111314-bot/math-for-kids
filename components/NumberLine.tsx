import React, { useEffect, useState } from 'react';
import { MathOperation } from '../types';

interface NumberLineProps {
  start: number;
  change: number;
  operation: MathOperation;
  progress?: number; // If provided, controls manually. If undefined, runs auto animation.
  trigger?: number;  // Used to restart animation in auto mode
}

export const NumberLine: React.FC<NumberLineProps> = ({ start, change, operation, progress, trigger }) => {
  const [internalProgress, setInternalProgress] = useState(0);
  const isAuto = progress === undefined;

  // For auto mode, we animate internalProgress from 0 to 'change'
  useEffect(() => {
    if (!isAuto) return;

    setInternalProgress(0);
    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep < change) {
        currentStep++;
        setInternalProgress(currentStep);
      } else {
        clearInterval(interval);
      }
    }, 1000); // 1 jump per second

    return () => clearInterval(interval);
  }, [start, change, operation, isAuto, trigger]);

  const activeProgress = isAuto ? internalProgress : (progress || 0);

  const maxVal = 20;
  const totalWidth = 800;
  const padding = 40;
  const stepSize = (totalWidth - (padding * 2)) / maxVal;
  
  const getX = (val: number) => padding + (val * stepSize);

  // Calculate where the frog currently is
  const frogValue = operation === MathOperation.ADD 
    ? Math.min(maxVal, start + activeProgress)
    : Math.max(0, start - activeProgress);

  // Render Jumps (Arcs)
  const renderJumps = () => {
    const jumps = [];
    for (let i = 0; i < activeProgress; i++) {
        const fromVal = operation === MathOperation.ADD ? start + i : start - i;
        const toVal = operation === MathOperation.ADD ? start + i + 1 : start - i - 1;
        
        const x1 = getX(fromVal);
        const x2 = getX(toVal);
        const midX = (x1 + x2) / 2;
        // Arc height depends on distance, but here distance is fixed stepSize.
        // Negative Y is "up" in SVG
        const controlY = 30; // Control point height

        jumps.push(
            <path 
                key={`jump-${i}`}
                d={`M ${x1} 100 Q ${midX} ${controlY} ${x2} 100`}
                fill="none"
                stroke={operation === MathOperation.ADD ? "#3b82f6" : "#ef4444"} // Blue for add, Red for sub
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="1000"
                strokeDashoffset="0"
                className="animate-draw-path"
            />
        );
    }
    return jumps;
  };

  return (
    <div className="w-full overflow-x-auto bg-green-50 rounded-3xl p-4 border-4 border-green-200 shadow-inner mt-6">
      <h3 className="text-center text-green-700 font-bold mb-2">
        {isAuto ? "Froggy Jumps! 🐸" : "Watch the frog jump as you count! 🐸"}
      </h3>
      <svg width="100%" viewBox={`0 0 ${totalWidth} 160`} className="min-w-[600px]">
        {/* Main Line */}
        <line x1={padding} y1="100" x2={totalWidth - padding} y2="100" stroke="#4ade80" strokeWidth="4" strokeLinecap="round" />
        
        {/* Ticks and Numbers */}
        {Array.from({ length: maxVal + 1 }).map((_, i) => (
          <g key={i}>
            <line 
              x1={getX(i)} 
              y1="90" 
              x2={getX(i)} 
              y2="110" 
              stroke="#22c55e" 
              strokeWidth="2" 
            />
            <text 
              x={getX(i)} 
              y="130" 
              textAnchor="middle" 
              className="text-lg font-bold fill-green-800"
              style={{ fontSize: '16px', fontFamily: 'Comic Sans MS, sans-serif' }}
            >
              {i}
            </text>
          </g>
        ))}

        {/* Start Marker */}
        <circle 
            cx={getX(start)} 
            cy="100" 
            r="6" 
            fill="white" 
            stroke="#22c55e" 
            strokeWidth="3"
        />
        <text x={getX(start)} y="80" textAnchor="middle" fontSize="12" fill="#15803d" fontWeight="bold">START</text>

        {/* Jumps */}
        {renderJumps()}

        {/* The Frog */}
        <g 
            transform={`translate(${getX(frogValue) - 20}, 50)`} 
            className="transition-transform duration-500 ease-in-out"
        >
            <text fontSize="40">🐸</text>
        </g>
      </svg>
      <div className="flex justify-between px-4 mt-2 text-sm text-gray-500 font-bold">
         <span>Start at {start}</span>
         <span>{operation === MathOperation.ADD ? `Jump forward ${change} times` : `Jump back ${change} times`}</span>
      </div>
    </div>
  );
};