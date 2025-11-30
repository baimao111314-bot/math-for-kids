import React, { useState } from 'react';
import { MathOperation } from '../types';

interface InteractiveStoryProps {
    story: string;
    num1: number;
    num2: number;
    operation: MathOperation;
}

export const InteractiveStory: React.FC<InteractiveStoryProps> = ({ story, num1, num2, operation }) => {
    const [highlightNumbers, setHighlightNumbers] = useState(false);
    const [highlightAction, setHighlightAction] = useState(false);

    // List of common action words for K-2 math
    const actionWords = [
        'add', 'plus', 'more', 'together', 'total', 'join', // Addition
        'take', 'left', 'away', 'minus', 'gave', 'ate', 'lost', 'flew', 'ran', 'jumped', 'hopped' // Subtraction
    ];

    const renderStory = () => {
        const words = story.split(' ');
        return words.map((word, index) => {
            // Clean punctuation for matching
            const cleanWord = word.replace(/[.,!?;:]/g, '').toLowerCase();
            const punctuation = word.match(/[.,!?;:]/g)?.[0] || '';
            const coreWord = word.replace(/[.,!?;:]/g, '');

            let styleClass = "text-gray-800 transition-colors duration-300";
            let scaleClass = "";

            // Check for numbers
            const isNum1 = cleanWord === num1.toString();
            const isNum2 = cleanWord === num2.toString();

            if (highlightNumbers && (isNum1 || isNum2)) {
                styleClass = "text-blue-600 bg-blue-100 px-1 rounded border border-blue-200 font-bold shadow-sm";
                scaleClass = "transform scale-110";
            }

            // Check for action words
            if (highlightAction && actionWords.includes(cleanWord)) {
                styleClass = "text-orange-600 bg-orange-100 px-1 rounded border border-orange-200 font-bold shadow-sm";
                scaleClass = "transform scale-110";
            }

            // Use inline-block for the wrapper to treat it as a unit, but allow wrapping in the paragraph
            return (
                <span key={index} className={`inline-block mr-1.5 mb-1 transition-transform duration-300 ${scaleClass}`}>
                    <span className={styleClass}>{coreWord}</span>{punctuation}
                </span>
            );
        });
    };

    return (
        <div className="flex flex-col gap-4 w-full h-full justify-between">
            <div className="text-xl md:text-2xl leading-relaxed font-medium text-gray-700 break-words w-full">
                {renderStory()}
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                <button 
                    onClick={() => setHighlightNumbers(!highlightNumbers)}
                    className={`flex-1 min-w-[140px] px-3 py-2 rounded-xl text-sm font-bold transition-all border-2 flex items-center justify-center gap-2 ${
                        highlightNumbers 
                        ? 'bg-blue-100 border-blue-300 text-blue-700 shadow-inner' 
                        : 'bg-white border-blue-200 text-blue-500 hover:bg-blue-50'
                    }`}
                >
                    {highlightNumbers ? 'Hide Numbers 1️⃣' : 'Find Numbers 1️⃣'}
                </button>

                <button 
                    onClick={() => setHighlightAction(!highlightAction)}
                    className={`flex-1 min-w-[140px] px-3 py-2 rounded-xl text-sm font-bold transition-all border-2 flex items-center justify-center gap-2 ${
                        highlightAction 
                        ? 'bg-orange-100 border-orange-300 text-orange-700 shadow-inner' 
                        : 'bg-white border-orange-200 text-orange-500 hover:bg-orange-50'
                    }`}
                >
                    {highlightAction ? 'Hide Actions 🏃' : 'Find Actions 🏃'}
                </button>
            </div>
        </div>
    );
};