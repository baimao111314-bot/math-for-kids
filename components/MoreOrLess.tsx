
import React, { useState, useEffect } from 'react';

interface MoreOrLessProps {
    onBack: () => void;
}

type Sign = '>' | '<' | '=';

export const MoreOrLess: React.FC<MoreOrLessProps> = ({ onBack }) => {
    const [leftCount, setLeftCount] = useState(1);
    const [rightCount, setRightCount] = useState(1);
    const [emoji, setEmoji] = useState('🍎');
    const [result, setResult] = useState<'CORRECT' | 'WRONG' | 'PLAYING'>('PLAYING');
    const [selectedSign, setSelectedSign] = useState<Sign | null>(null);

    const emojis = ['🍎', '🍌', '🍪', '🐶', '🐱', '⚽', '🚗', '⭐', '🐞', '🦋'];

    const initGame = () => {
        const e = emojis[Math.floor(Math.random() * emojis.length)];
        setEmoji(e);
        
        // Generate numbers (include possibility of equality)
        const l = Math.floor(Math.random() * 10) + 1;
        // 30% chance of being equal, otherwise random
        const r = Math.random() < 0.3 ? l : Math.floor(Math.random() * 10) + 1;
        
        setLeftCount(l);
        setRightCount(r);
        setResult('PLAYING');
        setSelectedSign(null);
    };

    useEffect(() => {
        initGame();
    }, []);

    const checkAnswer = (sign: Sign) => {
        if (result === 'CORRECT') return;

        let correctSign: Sign = '=';
        if (leftCount > rightCount) correctSign = '>';
        if (leftCount < rightCount) correctSign = '<';

        setSelectedSign(sign);

        if (sign === correctSign) {
            setResult('CORRECT');
        } else {
            setResult('WRONG');
            setTimeout(() => {
                setResult('PLAYING');
                setSelectedSign(null);
            }, 1000);
        }
    };

    // SVG for the Alligator / Equal Signs
    const renderSymbolGraphic = (type: Sign, size: 'SMALL' | 'LARGE' = 'SMALL') => {
        const strokeW = size === 'LARGE' ? 8 : 4;
        const color = "#22c55e"; // Green

        if (type === '=') {
            return (
                <svg viewBox="0 0 100 100" className="w-full h-full p-2">
                     <line x1="20" y1="40" x2="80" y2="40" stroke={color} strokeWidth={strokeW} strokeLinecap="round" />
                     <line x1="20" y1="60" x2="80" y2="60" stroke={color} strokeWidth={strokeW} strokeLinecap="round" />
                     {size === 'LARGE' && <text x="50" y="90" fontSize="14" textAnchor="middle" fill={color} fontWeight="bold">Equal</text>}
                </svg>
            );
        }

        if (type === '>') {
            // Greater Than: Open to Left
            return (
                <svg viewBox="0 0 100 100" className="w-full h-full p-2">
                    <path d="M 20,20 L 80,50 L 20,80" fill="none" stroke={color} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round" />
                    {/* Teeth */}
                    <path d="M 20,20 L 35,30 L 50,25 L 65,35" fill="none" stroke={color} strokeWidth={Math.max(2, strokeW/3)} strokeLinecap="round" />
                    <path d="M 20,80 L 35,70 L 50,75 L 65,65" fill="none" stroke={color} strokeWidth={Math.max(2, strokeW/3)} strokeLinecap="round" />
                    <circle cx="30" cy="30" r={strokeW/1.5} fill="#15803d" />
                    {size === 'LARGE' && <text x="50" y="95" fontSize="14" textAnchor="middle" fill={color} fontWeight="bold">Greater</text>}
                </svg>
            );
        }

        if (type === '<') {
             // Less Than: Open to Right
             return (
                <svg viewBox="0 0 100 100" className="w-full h-full p-2">
                    <path d="M 80,20 L 20,50 L 80,80" fill="none" stroke={color} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round" />
                    {/* Teeth */}
                    <path d="M 80,20 L 65,30 L 50,25 L 35,35" fill="none" stroke={color} strokeWidth={Math.max(2, strokeW/3)} strokeLinecap="round" />
                    <path d="M 80,80 L 65,70 L 50,75 L 35,65" fill="none" stroke={color} strokeWidth={Math.max(2, strokeW/3)} strokeLinecap="round" />
                    <circle cx="70" cy="30" r={strokeW/1.5} fill="#15803d" />
                    {size === 'LARGE' && <text x="50" y="95" fontSize="14" textAnchor="middle" fill={color} fontWeight="bold">Less</text>}
                </svg>
            );
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col h-full">
            {/* Header with Exit Button */}
            <div className="flex items-center justify-between mb-4">
                <button 
                    onClick={onBack}
                    className="px-4 py-2 bg-white rounded-full shadow-md text-gray-600 hover:bg-gray-100 transition-colors font-bold border border-gray-200 flex items-center gap-2"
                >
                    ⬅️ Back
                </button>
                <h1 className="text-2xl md:text-3xl font-extrabold text-purple-600 tracking-tight text-center flex-1">
                    Compare Numbers 🐊
                </h1>
                <div className="w-20"></div> {/* Spacer for center alignment */}
            </div>

            <div className="flex-1 flex flex-col justify-center gap-8">
                
                {/* Visual Area */}
                <div className="flex items-end justify-center gap-2 md:gap-8">
                    
                    {/* LEFT GROUP */}
                    <div className="flex flex-col items-center">
                        <div className="bg-white rounded-3xl border-4 border-purple-100 p-4 w-32 md:w-48 min-h-[200px] flex flex-wrap content-center justify-center gap-2 shadow-sm">
                            {Array.from({ length: leftCount }).map((_, i) => (
                                <span key={i} className="text-3xl md:text-4xl animate-bounce-short" style={{ animationDelay: `${i * 0.1}s` }}>
                                    {emoji}
                                </span>
                            ))}
                        </div>
                        <div className="mt-3 bg-purple-100 text-purple-800 font-bold text-4xl w-16 h-16 rounded-full flex items-center justify-center shadow-inner border-2 border-purple-200">
                            {leftCount}
                        </div>
                    </div>

                    {/* CENTER STATUS */}
                    <div className="flex flex-col items-center justify-center w-24 md:w-32 self-center mb-16">
                        <div className={`w-24 h-24 md:w-32 md:h-32 transition-transform duration-300 ${result === 'CORRECT' ? 'scale-125' : 'scale-100'}`}>
                            {selectedSign ? renderSymbolGraphic(selectedSign, 'LARGE') : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-full border-4 border-dashed border-gray-300">
                                    <span className="text-4xl text-gray-400 font-bold">?</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT GROUP */}
                    <div className="flex flex-col items-center">
                        <div className="bg-white rounded-3xl border-4 border-purple-100 p-4 w-32 md:w-48 min-h-[200px] flex flex-wrap content-center justify-center gap-2 shadow-sm">
                            {Array.from({ length: rightCount }).map((_, i) => (
                                <span key={i} className="text-3xl md:text-4xl animate-bounce-short" style={{ animationDelay: `${i * 0.1}s` }}>
                                    {emoji}
                                </span>
                            ))}
                        </div>
                        <div className="mt-3 bg-purple-100 text-purple-800 font-bold text-4xl w-16 h-16 rounded-full flex items-center justify-center shadow-inner border-2 border-purple-200">
                            {rightCount}
                        </div>
                    </div>

                </div>

                {/* Interaction Area */}
                <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white mt-auto">
                    {result === 'CORRECT' ? (
                        <div className="text-center animate-bounce-in py-2">
                            <p className="text-3xl font-black text-green-500 mb-4 drop-shadow-sm">Correct! {leftCount} {selectedSign} {rightCount}</p>
                            <button 
                                onClick={initGame} 
                                className="px-10 py-4 bg-green-500 text-white rounded-2xl font-bold text-xl shadow-green-200 shadow-lg hover:bg-green-600 hover:-translate-y-1 transition-all"
                            >
                                Next Problem ➡️
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <p className="text-gray-500 font-bold mb-4 uppercase tracking-wider text-sm">Choose the correct sign</p>
                            <div className={`flex gap-4 md:gap-8 ${result === 'WRONG' ? 'animate-shake' : ''}`}>
                                <button 
                                    onClick={() => checkAnswer('<')}
                                    className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl border-b-8 border-green-200 hover:border-green-400 active:border-b-0 active:translate-y-2 transition-all shadow-lg flex items-center justify-center hover:bg-green-50"
                                >
                                    <div className="w-12 h-12 md:w-16 md:h-16">
                                        {renderSymbolGraphic('<')}
                                    </div>
                                </button>

                                <button 
                                    onClick={() => checkAnswer('=')}
                                    className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl border-b-8 border-green-200 hover:border-green-400 active:border-b-0 active:translate-y-2 transition-all shadow-lg flex items-center justify-center hover:bg-green-50"
                                >
                                    <div className="w-12 h-12 md:w-16 md:h-16">
                                        {renderSymbolGraphic('=')}
                                    </div>
                                </button>

                                <button 
                                    onClick={() => checkAnswer('>')}
                                    className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl border-b-8 border-green-200 hover:border-green-400 active:border-b-0 active:translate-y-2 transition-all shadow-lg flex items-center justify-center hover:bg-green-50"
                                >
                                    <div className="w-12 h-12 md:w-16 md:h-16">
                                        {renderSymbolGraphic('>')}
                                    </div>
                                </button>
                            </div>
                            {result === 'WRONG' && (
                                <p className="text-red-500 font-bold mt-4 animate-pulse">Oops! Try again.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
