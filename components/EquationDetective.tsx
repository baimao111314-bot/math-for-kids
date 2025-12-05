
import React, { useState, useEffect } from 'react';

interface EquationDetectiveProps {
    onBack: () => void;
}

export const EquationDetective: React.FC<EquationDetectiveProps> = ({ onBack }) => {
    // --- STATE FOR EQUATION DETECTIVE GAME ---
    const [part1, setPart1] = useState(2);
    const [whole, setWhole] = useState(8);
    const [missingPart, setMissingPart] = useState(6);
    const [eqEmoji, setEqEmoji] = useState('⭐');
    const [eqEmoji2, setEqEmoji2] = useState('🟦');
    const [name, setName] = useState('Sam');
    const [eqOptions, setEqOptions] = useState<string[]>([]);
    const [selectedEqs, setSelectedEqs] = useState<number[]>([]); // Indices of selected options
    const [eqResult, setEqResult] = useState<'PLAYING' | 'SUCCESS'>('PLAYING');

    const emojis = ['🍎', '🍌', '🍪', '🐶', '🐱', '⚽', '🚗', '⭐', '🐞', '🦋'];
    const names = ['Sam', 'Mia', 'Leo', 'Zoe', 'Ben', 'Ava'];
    const shapes = ['🟦', '🟢', '🔺', '🟧'];

    // --- INIT EQUATION GAME ---
    const initEquations = () => {
        const n = names[Math.floor(Math.random() * names.length)];
        const e1 = emojis[Math.floor(Math.random() * emojis.length)];
        const e2 = shapes[Math.floor(Math.random() * shapes.length)];
        
        // Ensure Part 1 is smaller than Whole
        const p1 = Math.floor(Math.random() * 5) + 2; // 2 to 6
        const w = p1 + Math.floor(Math.random() * 5) + 2; // Total between 4 and 12
        const missing = w - p1;

        setName(n);
        setEqEmoji(e1);
        setEqEmoji2(e2);
        setPart1(p1);
        setWhole(w);
        setMissingPart(missing);
        setSelectedEqs([]);
        setEqResult('PLAYING');

        // Generate Options: We need 2 Correct and 2 Wrong
        // Correct forms: "p1 + ? = w" AND "w - p1 = ?"
        const correct1 = `${p1} + ⬜ = ${w}`;
        const correct2 = `${w} - ${p1} = ⬜`;
        
        // Wrong forms
        const wrong1 = `${w} + ${p1} = ⬜`; // Adding whole and part
        const wrong2 = `${p1} - ${w} = ⬜`; // Impossible subtraction (for this level)
        const wrong3 = `${missing} - ${w} = ${p1}`; // Confusing order
        const wrong4 = `⬜ + ${w} = ${p1}`;

        const wrongs = [wrong1, wrong2, wrong3, wrong4].sort(() => 0.5 - Math.random()).slice(0, 2);
        
        // Shuffle all 4
        const all = [correct1, correct2, ...wrongs].sort(() => 0.5 - Math.random());
        setEqOptions(all);
    };

    useEffect(() => {
        initEquations();
    }, []);

    // --- LOGIC EQUATIONS ---
    const toggleEquation = (index: number) => {
        if (eqResult === 'SUCCESS') return;
        
        const newSel = [...selectedEqs];
        if (newSel.includes(index)) {
            newSel.splice(newSel.indexOf(index), 1);
        } else {
            if (newSel.length < 2) newSel.push(index);
        }
        setSelectedEqs(newSel);

        // Check immediate win if 2 are selected
        if (newSel.length === 2) {
            const val1 = eqOptions[newSel[0]];
            const val2 = eqOptions[newSel[1]];
            
            // Simple string check since we controlled generation
            const isCorrect1 = val1.includes(`${part1} + ⬜ = ${whole}`) || val1.includes(`${whole} - ${part1} = ⬜`);
            const isCorrect2 = val2.includes(`${part1} + ⬜ = ${whole}`) || val2.includes(`${whole} - ${part1} = ⬜`);
            
            if (isCorrect1 && isCorrect2) {
                setEqResult('SUCCESS');
            }
        }
    };

    // Helper to render colored equation text
    const renderColoredEquation = (text: string) => {
        // text e.g. "2 + ⬜ = 8"
        const parts = text.split(' ');
        return (
            <div className="flex items-center gap-2">
                {parts.map((part, i) => {
                    let colorClass = "text-gray-700";
                    if (part === part1.toString()) colorClass = "text-blue-600 font-black"; // Part 1 Color
                    else if (part === whole.toString()) colorClass = "text-green-600 font-black"; // Whole Color
                    else if (part === '⬜') colorClass = "text-purple-400"; // Missing Part Color placeholder
                    
                    // If game is won, fill in the blank with Part 2 color
                    if (eqResult === 'SUCCESS' && part === '⬜') {
                        return <span key={i} className="text-purple-600 font-black underline">{missingPart}</span>;
                    }

                    return <span key={i} className={colorClass}>{part}</span>;
                })}
            </div>
        );
    };

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button 
                    onClick={onBack}
                    className="px-4 py-2 bg-white rounded-full shadow-md text-gray-600 hover:bg-gray-100 transition-colors font-bold border border-gray-200"
                >
                    ⬅️ Back
                </button>
                <h1 className="text-xl md:text-3xl font-extrabold text-blue-600 tracking-tight whitespace-nowrap">
                    Equation Detective 🕵️
                </h1>
            </div>

            <div className="flex-1 flex flex-col gap-6 animate-fade-in pb-10">
                
                {/* 1. The Story Card */}
                <div className="bg-white p-6 rounded-3xl shadow-lg border-l-8 border-blue-400">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">The Story 📖</h2>
                    <p className="text-2xl text-gray-700 leading-relaxed font-comic">
                        {name} drew <span className="text-blue-600 font-bold">{part1} {eqEmoji}</span>. 
                        Then {name === 'Sam' || name === 'Ben' || name === 'Leo' ? 'he' : 'she'} drew some <span className="text-purple-600 font-bold">{eqEmoji2}</span>. 
                        Now there are <span className="text-green-600 font-bold">{whole} shapes</span> altogether.
                    </p>
                </div>

                {/* 2. DUAL VISUALS: Number Bond & Bar Model */}
                <div className="flex flex-col md:flex-row gap-6">
                    
                    {/* A. Number Bond (Triangle) */}
                    <div className="flex-1 bg-white p-4 rounded-3xl shadow-lg border-4 border-dashed border-gray-200 flex flex-col items-center justify-center relative min-h-[220px]">
                        <h3 className="text-gray-400 font-bold text-xs uppercase absolute top-2 left-4">Number Bond</h3>
                        
                        {/* SVG Lines */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <line x1="50%" y1="35%" x2="25%" y2="65%" stroke="#cbd5e1" strokeWidth="4" />
                            <line x1="50%" y1="35%" x2="75%" y2="65%" stroke="#cbd5e1" strokeWidth="4" />
                        </svg>

                        {/* Top Circle (Whole) */}
                        <div className="relative mb-8 z-10">
                            <div className="w-20 h-20 rounded-full bg-green-100 border-4 border-green-500 flex items-center justify-center text-3xl font-black text-green-700 shadow-sm">
                                {whole}
                            </div>
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-green-600 text-xs font-bold uppercase">Whole</div>
                        </div>

                        <div className="flex gap-16 z-10">
                            {/* Left Circle (Part 1) */}
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full bg-blue-100 border-4 border-blue-500 flex items-center justify-center text-2xl font-black text-blue-700 shadow-sm">
                                    {part1}
                                </div>
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-blue-600 text-xs font-bold uppercase">Part</div>
                            </div>
                            {/* Right Circle (Part 2) */}
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full bg-purple-100 border-4 border-purple-500 flex items-center justify-center text-2xl font-black text-purple-700 shadow-sm">
                                    {eqResult === 'SUCCESS' ? missingPart : '?'}
                                </div>
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-purple-600 text-xs font-bold uppercase">Part</div>
                            </div>
                        </div>
                    </div>

                    {/* B. Bar Model */}
                    <div className="flex-[1.5] bg-white p-4 rounded-3xl shadow-lg border-4 border-dashed border-gray-200 flex flex-col items-center justify-center relative">
                        <h3 className="text-gray-400 font-bold text-xs uppercase absolute top-2 left-4">Bar Model</h3>
                        <div className="w-full max-w-md mt-6">
                            {/* Whole Bracket */}
                            <div className="flex justify-between text-green-600 text-sm font-bold px-1 mb-1">
                                <span>Total: {whole}</span>
                            </div>
                            <div className="w-full h-3 border-t-2 border-r-2 border-l-2 border-green-400 rounded-t-lg mb-1 relative"></div>
                            
                            {/* The Bar */}
                            <div className="flex w-full h-20 rounded-xl overflow-hidden shadow-inner border border-gray-100">
                                {/* Part 1 (Known) */}
                                <div className="bg-blue-100 flex items-center justify-center relative border-r-2 border-white" style={{ width: `${(part1/whole)*100}%` }}>
                                    <div className="flex flex-wrap justify-center gap-1 p-1 overflow-hidden">
                                        {Array.from({length: Math.min(part1, 10)}).map((_, i) => <span key={i} className="text-lg leading-none">{eqEmoji}</span>)}
                                    </div>
                                    <span className="absolute bottom-1 bg-white/50 px-2 rounded-full text-blue-700 font-black text-sm border border-blue-200">{part1}</span>
                                </div>
                                
                                {/* Part 2 (Unknown) */}
                                <div className="bg-purple-100 flex-1 flex items-center justify-center relative">
                                    {eqResult === 'SUCCESS' ? (
                                        <div className="flex flex-wrap justify-center gap-1 animate-bounce-in">
                                                {Array.from({length: Math.min(missingPart, 10)}).map((_, i) => <span key={i} className="text-lg leading-none">{eqEmoji2}</span>)}
                                                <span className="absolute bottom-1 bg-white/50 px-2 rounded-full text-purple-700 font-black text-sm border border-purple-200">{missingPart}</span>
                                        </div>
                                    ) : (
                                        <span className="text-3xl text-purple-300 font-bold animate-pulse">?</span>
                                    )}
                                </div>
                            </div>
                            
                            {/* Legend */}
                            <div className="flex justify-between mt-2 px-1">
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                    <span className="text-xs text-blue-600 font-bold">Part</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                    <span className="text-xs text-purple-600 font-bold">Part</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* 3. The Task: Select Equations */}
                <div className="flex-1 bg-blue-50 rounded-3xl p-6 border-4 border-blue-100 text-center">
                    <div className="flex flex-col items-center mb-6">
                        <h3 className="text-xl font-bold text-blue-800">
                            Find the Matching Equations
                        </h3>
                        <p className="text-sm text-blue-600">Select 1 Addition (+) and 1 Subtraction (-)</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                        {eqOptions.map((opt, idx) => {
                            const isSelected = selectedEqs.includes(idx);
                            const showResult = eqResult === 'SUCCESS';
                            // Determine if this specific option was actually a correct answer (for coloring at the end)
                            const isActuallyCorrect = opt.includes(`${part1} + ⬜ = ${whole}`) || opt.includes(`${whole} - ${part1} = ⬜`);

                            let btnClass = "bg-white border-4 border-transparent text-gray-600 shadow-sm";
                            if (isSelected) btnClass = "bg-white border-blue-400 shadow-md transform -translate-y-1";
                            if (showResult && isActuallyCorrect) btnClass = "bg-green-50 border-green-500 shadow-md transform -translate-y-1";
                            if (showResult && isSelected && !isActuallyCorrect) btnClass = "bg-red-50 border-red-300 opacity-60";

                            return (
                                <button
                                    key={idx}
                                    onClick={() => toggleEquation(idx)}
                                    disabled={eqResult === 'SUCCESS'}
                                    className={`p-4 rounded-2xl text-2xl font-mono transition-all duration-200 ${btnClass} ${!showResult && 'hover:bg-blue-50'}`}
                                >
                                    {renderColoredEquation(opt)}
                                </button>
                            )
                        })}
                    </div>

                    {eqResult === 'SUCCESS' && (
                        <div className="mt-6 animate-bounce-in">
                            <p className="text-green-600 font-bold text-xl mb-4">Great Detective Work! 🕵️‍♀️</p>
                            <button 
                                onClick={initEquations}
                                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg"
                            >
                                New Mystery ➡️
                            </button>
                        </div>
                    )}
                    {selectedEqs.length === 2 && eqResult !== 'SUCCESS' && (
                            <p className="text-red-400 font-bold mt-4 animate-pulse">Look closer at the colors!</p>
                    )}
                </div>
            </div>
        </div>
    );
};
