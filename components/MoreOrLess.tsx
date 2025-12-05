
import React, { useState, useEffect } from 'react';

interface MoreOrLessProps {
    onBack: () => void;
}

type Sign = '>' | '<' | '=';
type GameMode = 'COMPARE' | 'DIFFERENCE';

export const MoreOrLess: React.FC<MoreOrLessProps> = ({ onBack }) => {
    const [mode, setMode] = useState<GameMode>('COMPARE');

    // --- STATE FOR COMPARE GAME ---
    const [leftCount, setLeftCount] = useState(1);
    const [rightCount, setRightCount] = useState(1);
    const [emoji, setEmoji] = useState('🍎');
    const [result, setResult] = useState<'CORRECT' | 'WRONG' | 'PLAYING'>('PLAYING');
    const [selectedSign, setSelectedSign] = useState<Sign | null>(null);

    // --- STATE FOR DIFFERENCE WORD PROBLEM ---
    const [diffNum1, setDiffNum1] = useState(5); // Larger number
    const [diffNum2, setDiffNum2] = useState(3); // Smaller number
    const [diffEmoji1, setDiffEmoji1] = useState('🐶');
    const [diffEmoji2, setDiffEmoji2] = useState('🐱');
    const [diffPerson1, setDiffPerson1] = useState('Ali');
    const [diffPerson2, setDiffPerson2] = useState('Bo');
    const [showDiffAnswer, setShowDiffAnswer] = useState(false);

    const emojis = ['🍎', '🍌', '🍪', '🐶', '🐱', '⚽', '🚗', '⭐', '🐞', '🦋'];
    const people = ['Ali', 'Bo', 'Cat', 'Dan', 'Eve', 'Fox'];

    // --- INIT COMPARE GAME ---
    const initCompare = () => {
        const e = emojis[Math.floor(Math.random() * emojis.length)];
        setEmoji(e);
        const l = Math.floor(Math.random() * 10) + 1;
        const r = Math.random() < 0.3 ? l : Math.floor(Math.random() * 10) + 1;
        setLeftCount(l);
        setRightCount(r);
        setResult('PLAYING');
        setSelectedSign(null);
    };

    // --- INIT DIFFERENCE GAME ---
    const initDifference = () => {
        const n1 = Math.floor(Math.random() * 6) + 4; // 4 to 9 (Larger)
        const n2 = Math.floor(Math.random() * (n1 - 1)) + 1; // 1 to n1-1 (Smaller)
        
        const e1 = emojis[Math.floor(Math.random() * emojis.length)];
        let e2 = emojis[Math.floor(Math.random() * emojis.length)];
        while (e1 === e2) e2 = emojis[Math.floor(Math.random() * emojis.length)];

        const p1 = people[Math.floor(Math.random() * people.length)];
        let p2 = people[Math.floor(Math.random() * people.length)];
        while(p1 === p2) p2 = people[Math.floor(Math.random() * people.length)];

        setDiffNum1(n1);
        setDiffNum2(n2);
        setDiffEmoji1(e1);
        setDiffEmoji2(e2);
        setDiffPerson1(p1);
        setDiffPerson2(p2);
        setShowDiffAnswer(false);
    };

    useEffect(() => {
        if (mode === 'COMPARE') initCompare();
        else initDifference();
    }, [mode]);

    // --- LOGIC COMPARE ---
    const checkCompare = (sign: Sign) => {
        if (result === 'CORRECT') return;
        let correctSign: Sign = '=';
        if (leftCount > rightCount) correctSign = '>';
        if (leftCount < rightCount) correctSign = '<';
        setSelectedSign(sign);
        if (sign === correctSign) {
            setResult('CORRECT');
        } else {
            setResult('WRONG');
            setTimeout(() => { setResult('PLAYING'); setSelectedSign(null); }, 1000);
        }
    };

    // --- RENDER HELPERS ---
    const renderSymbolGraphic = (type: Sign, size: 'SMALL' | 'LARGE' = 'SMALL') => {
        const strokeW = size === 'LARGE' ? 8 : 4;
        const color = "#22c55e"; 
        if (type === '=') {
            return <svg viewBox="0 0 100 100" className="w-full h-full p-2"><line x1="20" y1="40" x2="80" y2="40" stroke={color} strokeWidth={strokeW} strokeLinecap="round" /><line x1="20" y1="60" x2="80" y2="60" stroke={color} strokeWidth={strokeW} strokeLinecap="round" />{size === 'LARGE' && <text x="50" y="90" fontSize="14" textAnchor="middle" fill={color} fontWeight="bold">Equal</text>}</svg>;
        }
        if (type === '>') {
            return <svg viewBox="0 0 100 100" className="w-full h-full p-2"><path d="M 20,20 L 80,50 L 20,80" fill="none" stroke={color} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round" /><path d="M 20,20 L 35,30 L 50,25 L 65,35" fill="none" stroke={color} strokeWidth={Math.max(2, strokeW/3)} strokeLinecap="round" /><path d="M 20,80 L 35,70 L 50,75 L 65,65" fill="none" stroke={color} strokeWidth={Math.max(2, strokeW/3)} strokeLinecap="round" /><circle cx="30" cy="30" r={strokeW/1.5} fill="#15803d" />{size === 'LARGE' && <text x="50" y="95" fontSize="14" textAnchor="middle" fill={color} fontWeight="bold">Greater</text>}</svg>;
        }
        if (type === '<') {
             return <svg viewBox="0 0 100 100" className="w-full h-full p-2"><path d="M 80,20 L 20,50 L 80,80" fill="none" stroke={color} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round" /><path d="M 80,20 L 65,30 L 50,25 L 35,35" fill="none" stroke={color} strokeWidth={Math.max(2, strokeW/3)} strokeLinecap="round" /><path d="M 80,80 L 65,70 L 50,75 L 35,65" fill="none" stroke={color} strokeWidth={Math.max(2, strokeW/3)} strokeLinecap="round" /><circle cx="70" cy="30" r={strokeW/1.5} fill="#15803d" />{size === 'LARGE' && <text x="50" y="95" fontSize="14" textAnchor="middle" fill={color} fontWeight="bold">Less</text>}</svg>;
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col h-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button 
                        onClick={onBack}
                        className="px-4 py-2 bg-white rounded-full shadow-md text-gray-600 hover:bg-gray-100 transition-colors font-bold border border-gray-200"
                    >
                        ⬅️ Back
                    </button>
                    <h1 className="text-xl md:text-3xl font-extrabold text-purple-600 tracking-tight whitespace-nowrap">
                        {mode === 'COMPARE' ? 'Compare 🐊' : 'Difference 📏'}
                    </h1>
                </div>

                {/* Mode Switcher */}
                <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 flex w-full md:w-auto">
                    <button
                        onClick={() => setMode('COMPARE')}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-lg font-bold text-sm transition-all ${mode === 'COMPARE' ? 'bg-purple-100 text-purple-700 shadow-inner' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        ⚖️ More or Less
                    </button>
                    <button
                        onClick={() => setMode('DIFFERENCE')}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-lg font-bold text-sm transition-all ${mode === 'DIFFERENCE' ? 'bg-orange-100 text-orange-700 shadow-inner' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        🤔 Word Problems
                    </button>
                </div>
            </div>

            {mode === 'COMPARE' ? (
                // --- EXISTING COMPARE GAME ---
                <div className="flex-1 flex flex-col justify-center gap-8 animate-fade-in">
                    <div className="flex items-end justify-center gap-2 md:gap-8">
                        {/* LEFT GROUP */}
                        <div className="flex flex-col items-center">
                            <div className="bg-white rounded-3xl border-4 border-purple-100 p-4 w-32 md:w-48 min-h-[200px] flex flex-wrap content-center justify-center gap-2 shadow-sm">
                                {Array.from({ length: leftCount }).map((_, i) => (
                                    <span key={i} className="text-3xl md:text-4xl animate-bounce-short" style={{ animationDelay: `${i * 0.1}s` }}>{emoji}</span>
                                ))}
                            </div>
                            <div className="mt-3 bg-purple-100 text-purple-800 font-bold text-4xl w-16 h-16 rounded-full flex items-center justify-center shadow-inner border-2 border-purple-200">{leftCount}</div>
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
                                    <span key={i} className="text-3xl md:text-4xl animate-bounce-short" style={{ animationDelay: `${i * 0.1}s` }}>{emoji}</span>
                                ))}
                            </div>
                            <div className="mt-3 bg-purple-100 text-purple-800 font-bold text-4xl w-16 h-16 rounded-full flex items-center justify-center shadow-inner border-2 border-purple-200">{rightCount}</div>
                        </div>
                    </div>

                    <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white mt-auto">
                        {result === 'CORRECT' ? (
                            <div className="text-center animate-bounce-in py-2">
                                <p className="text-3xl font-black text-green-500 mb-4 drop-shadow-sm">Correct! {leftCount} {selectedSign} {rightCount}</p>
                                <button onClick={initCompare} className="px-10 py-4 bg-green-500 text-white rounded-2xl font-bold text-xl shadow-green-200 shadow-lg hover:bg-green-600 hover:-translate-y-1 transition-all">Next Problem ➡️</button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <p className="text-gray-500 font-bold mb-4 uppercase tracking-wider text-sm">Choose the correct sign</p>
                                <div className={`flex gap-4 md:gap-8 ${result === 'WRONG' ? 'animate-shake' : ''}`}>
                                    <button onClick={() => checkCompare('<')} className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl border-b-8 border-green-200 hover:border-green-400 active:border-b-0 active:translate-y-2 transition-all shadow-lg flex items-center justify-center hover:bg-green-50"><div className="w-12 h-12 md:w-16 md:h-16">{renderSymbolGraphic('<')}</div></button>
                                    <button onClick={() => checkCompare('=')} className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl border-b-8 border-green-200 hover:border-green-400 active:border-b-0 active:translate-y-2 transition-all shadow-lg flex items-center justify-center hover:bg-green-50"><div className="w-12 h-12 md:w-16 md:h-16">{renderSymbolGraphic('=')}</div></button>
                                    <button onClick={() => checkCompare('>')} className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl border-b-8 border-green-200 hover:border-green-400 active:border-b-0 active:translate-y-2 transition-all shadow-lg flex items-center justify-center hover:bg-green-50"><div className="w-12 h-12 md:w-16 md:h-16">{renderSymbolGraphic('>')}</div></button>
                                </div>
                                {result === 'WRONG' && <p className="text-red-500 font-bold mt-4 animate-pulse">Oops! Try again.</p>}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                // --- NEW DIFFERENCE WORD PROBLEM GAME ---
                <div className="flex-1 flex flex-col gap-6 animate-fade-in pb-10">
                    <div className="bg-white p-6 rounded-3xl shadow-lg border-l-8 border-orange-400 text-center">
                         <h2 className="text-xl font-bold text-gray-800 mb-2">Word Problem 📖</h2>
                         <p className="text-2xl text-gray-700 leading-relaxed font-comic">
                            {diffPerson1} has <span className="text-blue-600 font-bold">{diffNum1} {diffEmoji1}</span>. {diffPerson2} has <span className="text-green-600 font-bold">{diffNum2} {diffEmoji2}</span>. <br/>
                            How many <span className="text-orange-600 font-bold underline">more</span> does {diffPerson1} have?
                         </p>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-xl border-4 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-x-auto">
                        <h3 className="text-gray-400 font-bold text-xs uppercase mb-4">Visual Match Up</h3>
                        
                        <svg viewBox={`0 0 ${Math.max(400, (diffNum1 + 1) * 60 + 50)} 220`} className="w-full h-full max-h-[300px] min-w-[300px]">
                            <defs>
                                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" fill="#cbd5e1" />
                                </marker>
                            </defs>
                            
                            {/* Row 1: The Larger Amount */}
                            {Array.from({length: diffNum1}).map((_, i) => (
                                <g key={`row1-${i}`} transform={`translate(${80 + i * 60}, 50)`}>
                                    <text fontSize="40" textAnchor="middle" dominantBaseline="middle">{diffEmoji1}</text>
                                    <text y="35" fontSize="12" textAnchor="middle" fill="#2563eb" fontWeight="bold">{i+1}</text>
                                </g>
                            ))}
                            <text x="50" y="55" fontSize="14" fontWeight="bold" fill="#2563eb" textAnchor="end">{diffPerson1}</text>

                            {/* Row 2: The Smaller Amount */}
                            {Array.from({length: diffNum2}).map((_, i) => (
                                <g key={`row2-${i}`} transform={`translate(${80 + i * 60}, 130)`}>
                                     <text fontSize="40" textAnchor="middle" dominantBaseline="middle">{diffEmoji2}</text>
                                     <text y="35" fontSize="12" textAnchor="middle" fill="#16a34a" fontWeight="bold">{i+1}</text>
                                     {/* Connection Line */}
                                     <line x1="0" y1="-50" x2="0" y2="-25" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4" />
                                </g>
                            ))}
                            <text x="50" y="135" fontSize="14" fontWeight="bold" fill="#16a34a" textAnchor="end">{diffPerson2}</text>

                            {/* Visualizing the Difference */}
                            {showDiffAnswer && (
                                <g className="animate-draw-path">
                                    {/* Bracket for extra items */}
                                    <path 
                                        d={`M ${80 + diffNum2 * 60 - 20} 80 L ${80 + diffNum1 * 60 - 40} 80`} 
                                        fill="none" 
                                        stroke="#ea580c" 
                                        strokeWidth="4" 
                                        strokeLinecap="round"
                                    />
                                    <line x1={80 + diffNum2 * 60 - 20} y1="75" x2={80 + diffNum2 * 60 - 20} y2="85" stroke="#ea580c" strokeWidth="4"/>
                                    <line x1={80 + diffNum1 * 60 - 40} y1="75" x2={80 + diffNum1 * 60 - 40} y2="85" stroke="#ea580c" strokeWidth="4"/>

                                    <text x={(80 + diffNum2 * 60 + 80 + diffNum1 * 60)/2 - 30} y="110" fontSize="14" fontWeight="bold" fill="#ea580c">
                                        {diffNum1 - diffNum2} More
                                    </text>
                                    
                                    {/* Highlight extra items */}
                                    {Array.from({length: diffNum1 - diffNum2}).map((_, i) => (
                                        <circle 
                                            key={`highlight-${i}`} 
                                            cx={80 + (diffNum2 + i) * 60} 
                                            cy="50" 
                                            r="25" 
                                            fill="none" 
                                            stroke="#ea580c" 
                                            strokeWidth="3" 
                                            strokeDasharray="5"
                                            className="animate-pulse"
                                        />
                                    ))}
                                </g>
                            )}
                        </svg>
                    </div>

                    <div className="bg-orange-50 p-6 rounded-3xl border-4 border-orange-100 flex flex-col items-center">
                        <h3 className="text-orange-800 font-bold mb-4">How do we write this?</h3>
                        
                        {!showDiffAnswer ? (
                            <button 
                                onClick={() => setShowDiffAnswer(true)}
                                className="px-8 py-3 bg-orange-500 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-orange-600 transition-all transform hover:scale-105"
                            >
                                Show me the Math! ✨
                            </button>
                        ) : (
                            <div className="flex flex-col items-center animate-fade-in-up w-full">
                                <div className="flex items-center gap-4 text-3xl md:text-5xl font-black bg-white px-8 py-4 rounded-2xl shadow-sm border-2 border-orange-200">
                                    <span className="text-blue-600">{diffNum1}</span>
                                    <span className="text-gray-400">-</span>
                                    <span className="text-green-600">{diffNum2}</span>
                                    <span className="text-gray-400">=</span>
                                    <span className="text-orange-600">{diffNum1 - diffNum2}</span>
                                </div>
                                <p className="text-gray-500 mt-2 font-bold text-sm">Larger - Smaller = Difference</p>
                                
                                <button 
                                    onClick={initDifference}
                                    className="mt-6 px-8 py-3 bg-white text-orange-600 border-2 border-orange-200 rounded-xl font-bold hover:bg-orange-50 transition-colors"
                                >
                                    Try Another 🔄
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            )}
        </div>
    );
};
