import React from 'react';

interface NumberInputProps {
  value: number;
  onChange: (val: number) => void;
  max?: number;
}

export const NumberInput: React.FC<NumberInputProps> = ({ value, onChange, max = 20 }) => {
  return (
    <div className="flex flex-col items-center">
      <input
        type="number"
        value={value}
        onChange={(e) => {
          const val = parseInt(e.target.value);
          if (!isNaN(val) && val >= 0 && val <= 50) {
            onChange(val);
          }
        }}
        className="w-24 h-24 text-center text-5xl font-bold text-indigo-600 bg-indigo-50 border-4 border-indigo-200 rounded-2xl focus:border-indigo-400 focus:outline-none"
      />
      <div className="flex gap-2 mt-2">
        <button 
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-10 h-10 rounded-full bg-red-100 text-red-500 font-bold text-xl hover:bg-red-200 active:scale-90 transition-transform"
        >
          -
        </button>
        <button 
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-10 h-10 rounded-full bg-green-100 text-green-500 font-bold text-xl hover:bg-green-200 active:scale-90 transition-transform"
        >
          +
        </button>
      </div>
    </div>
  );
};
