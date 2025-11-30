
import React, { useState, useEffect } from 'react';

interface MakeTensProps {
    onBack: () => void;
}

type Mode = 'ADD' | 'SUBTRACT';

export const MakeTens: React.FC<MakeTensProps> = ({ onBack }) => {
    const [mode, setMode] = useState<Mode>('ADD');
    const [startCount, setStartCount] = useState(0); // For ADD: initial red dots. For SUBTRACT: always 10.
    const [targetSubtract, setTargetSubtract] = useState(0); // Only for SUBTRACT: how many to remove.
    const [userIndices, setUserIndices] = useState<Set<number>>(new Set()); 
    const [success, setSuccess] = useState(false);
    const [instruction, setInstruction] = useState("");
    const [showCheatSheet, setShowCheatSheet] = useState(false);

    const initGame = (currentMode: Mode) => {
        setSuccess(false);
        setUserIndices(new Set());

        if (currentMode === 'ADD') {
            const num = Math.floor(Math.random() * 9); 
            setStartCount(num);
            setInstruction(`We have ${num} red dots. How many more to make 10?`);
        } else {
            setStartCount(10);
            const toTake = Math.floor(Math.random() * 9) + 1; 
            setTargetSubtract(toTake);
            setInstruction(`We have 10 red dots. Take away ${toTake} dots!`);
        }
    };

    useEffect(() => {
        initGame(mode);
    }, [mode]);

    useEffect(() => {
        if (mode === 'ADD') {
            if (success) {
                setInstruction(`Hooray! ${startCount} + ${userIndices.size} = 10!`);
            } else if (userIndices.size > 0) {
                const currentTotal = startCount + userIndices.size;
                const remaining = 10 - currentTotal;
                if (remaining > 0) {
                    setInstruction(`You added ${userIndices.size}. Need ${remaining} more!`);
                } else if (remaining < 0) {
                     setInstruction(`Oops! Too many.`);
                }
            } else {
                setInstruction(`We have ${startCount} red dots. How many more to make 10?`);
            }
        } else {
            if (success) {
                setInstruction(`Perfect! 10 - ${targetSubtract} = ${10 - targetSubtract} left.`);
            } else {
                const currentTaken = userIndices.size;
                const leftToTake = targetSubtract - currentTaken;
                
                if (leftToTake > 0) {
                    setInstruction(`Tap ${leftToTake} more dots to cross them out.`);
                } else if (leftToTake < 0) {
                    setInstruction(`Oops! You crossed out too many. Unclick some.`);
                } else {
                    setInstruction(`Great! You took away ${targetSubtract}.`);
                }
            }
        }
    }, [userIndices.size, success, startCount, mode, targetSubtract]);

    const handleCellClick = (index: number) => {
        if (success) return;

        if (mode === 'ADD') {
            if (index < startCount) return;

            const newSet = new Set(userIndices);
            if (newSet.has(index)) newSet.delete(index);
            else newSet.add(index);
            
            setUserIndices(newSet);

            if (startCount + newSet.size === 10) setSuccess(true);
            else setSuccess(false);

        } else {
            const newSet = new Set(userIndices);
            if (newSet.has(index)) newSet.delete(index);
            else newSet.add(index); 

            setUserIndices(newSet);

            if (newSet.size === targetSubtract) setSuccess(true);
            else setSuccess(false);
        }
    };

    const renderCell = (index: number) => {
        let isRedDot = false;
        let isBlueStar = false;
        let isCrossed = false;
        let isInteractable = false;

        if (mode === 'ADD') {
            isRedDot = index < startCount;
            isBlueStar = userIndices.has(index);
            isInteractable = !isRedDot && !success;
        } else {
            isRedDot = true; 
            isCrossed = userIndices.has(index);
            isInteractable = !success;
        }

        return (
            <button
                key={index}
                onClick={() => handleCellClick(index)}
                disabled={!isInteractable}
                className={`
                    w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 border-4 border-gray-800 flex items-center justify-center transition-all duration-200 relative
                    ${isRedDot ? 'bg-red-50' : 'bg-white'}
                    ${isInteractable ? 'hover:bg-gray-50 cursor-pointer active:scale-95' : 'cursor-default'}
                `}
            >
                <div className="relative w-full h-full flex items-center justify-center">
                    <div className={`transition-all duration-300 transform ${isRedDot ? 'scale-100 opacity-100' : 'scale-0 opacity-0'} absolute`}>
                         <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-red-500 shadow-md border-2 border-red-600"></div>
                    </div>

                    <div className={`transition-all duration-300 transform ${isBlueStar ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-0 rotate-180'} absolute`}>
                         <div className="text-4xl sm:text-5xl md:text-6xl text-blue-500 drop-shadow-sm filter">★</div>
                    </div>

                    {mode === 'SUBTRACT' && (
                        <div className={`transition-all duration-300 transform ${isCrossed ? 'scale-100 opacity-100' : 'scale-150 opacity-0'} absolute inset-0 flex items-center justify-center`}>
                            <span className="text-5xl sm:text-6xl md:text-7xl text-gray-800 font-bold opacity-80">✖</span>
                        </div>
                    )}

                </div>
                
                {mode === 'ADD' && !isRedDot && !isBlueStar && !success && (
                    <div className="w-3 h-3 rounded-full bg-gray-300 absolute"></div>
                )}
            </button>
        );
    };

    const pairs = [
        { nums: "1 + 9", rhyme: "Feeling fine! 😎" },
        { nums: "2 + 8", rhyme: "Shut the gate! 🚪" },
        { nums: "3 + 7", rhyme: "From heaven! 👼" },
        { nums: "4 + 6", rhyme: "Pick up sticks! 🥢" },
        { nums: "5 + 5", rhyme: "High five! ✋" },
        { nums: "10 + 0", rhyme: "A Hero! 🦸" }
    ];

    return (
        <div className="w-full max-w-4xl mx-auto relative">
             {/* Cheat Sheet Modal */}
             {showCheatSheet && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border-4 border-yellow-300 relative">
                        <button 
                            onClick={() => setShowCheatSheet(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
                        >
                            ✕
                        </button>
                        <h2 className="text-2xl font-bold text-center text-purple-600 mb-6">Friends of 10 👯‍♀️</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {pairs.map((p, i) => (
                                <div key={i} className="bg-purple-50 p-3 rounded-xl flex justify-between items-center border border-purple-100">
                                    <span className="text-xl font-black text-purple-700">{p.nums}</span>
                                    <span className="text-gray-600 font-medium text-sm">{p.rhyme}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 text-center">
                            <button 
                                onClick={() => setShowCheatSheet(false)}
                                className="px-6 py-2 bg-yellow-400 text-yellow-900 rounded-xl font-bold hover:bg-yellow-500"
                            >
                                Got it! 👍
                            </button>
                        </div>
                    </div>
                </div>
             )}

             <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
                <div className="flex items-center self-start md:self-auto gap-4">
                    <button 
                        onClick={onBack}
                        className="px-4 py-2 bg-white rounded-full shadow-md text-gray-600 hover:bg-gray-100 transition-colors font-bold border border-gray-200"
                    >
                        ⬅️ Back
                    </button>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-blue-600 tracking-tight">
                        {mode === 'ADD' ? 'Make Ten 🔟' : 'Take from Ten 🔟'}
                    </h1>
                </div>

                <div className="flex gap-2">
                     <button 
                        onClick={() => setShowCheatSheet(true)}
                        className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg font-bold text-sm hover:bg-yellow-200 transition-colors border border-yellow-300"
                    >
                        🎶 Pairs Song
                    </button>

                    <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 flex">
                        <button
                            onClick={() => setMode('ADD')}
                            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${mode === 'ADD' ? 'bg-blue-100 text-blue-700 shadow-inner' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            ➕ Add
                        </button>
                        <button
                            onClick={() => setMode('SUBTRACT')}
                            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${mode === 'SUBTRACT' ? 'bg-red-100 text-red-700 shadow-inner' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            ➖ Subtract
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Side: Game Board */}
                <div className={`rounded-3xl p-6 shadow-xl border-b-8 flex flex-col items-center justify-center transition-colors duration-500 ${mode === 'ADD' ? 'bg-blue-600 border-blue-800' : 'bg-red-500 border-red-700'}`}>
                    
                    <div className="bg-yellow-100 p-3 sm:p-4 rounded-xl shadow-inner border-4 border-yellow-300 inline-block mb-6">
                        <div className="grid grid-cols-5 gap-0 border-4 border-gray-800 bg-gray-800">
                            {Array.from({ length: 10 }).map((_, i) => renderCell(i))}
                        </div>
                    </div>

                    <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 w-full text-center min-h-[80px] flex items-center justify-center border border-white/30">
                        <p className="text-white text-xl md:text-2xl font-bold font-comic drop-shadow-md">
                            {instruction}
                        </p>
                    </div>
                </div>

                {/* Right Side: Step-by-Step Breakdown */}
                <div className="flex flex-col gap-4">
                    
                    {mode === 'ADD' ? (
                        <>
                            <div className="p-4 rounded-2xl border-l-8 bg-white border-red-400 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 font-bold uppercase text-xs tracking-wider">Start</span>
                                    <span className="text-2xl font-bold text-red-500">{startCount}</span>
                                </div>
                                <p className="text-gray-700 font-medium">Red Dots</p>
                            </div>

                            <div className={`p-4 rounded-2xl border-l-8 transition-all duration-500 ${userIndices.size > 0 ? 'bg-white border-blue-400 shadow-md transform translate-x-2' : 'bg-gray-50 border-gray-200'}`}>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 font-bold uppercase text-xs tracking-wider">Add</span>
                                    <span className="text-2xl font-bold text-blue-500">{userIndices.size}</span>
                                </div>
                                <p className="text-gray-700 font-medium">Blue Stars</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="p-4 rounded-2xl border-l-8 bg-white border-red-400 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 font-bold uppercase text-xs tracking-wider">Start</span>
                                    <span className="text-2xl font-bold text-red-500">10</span>
                                </div>
                                <p className="text-gray-700 font-medium">Total Dots</p>
                            </div>

                            <div className={`p-4 rounded-2xl border-l-8 transition-all duration-500 ${userIndices.size > 0 ? 'bg-white border-gray-600 shadow-md transform translate-x-2' : 'bg-gray-50 border-gray-200'}`}>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 font-bold uppercase text-xs tracking-wider">Take Away</span>
                                    <span className="text-2xl font-bold text-gray-700">{userIndices.size}</span>
                                </div>
                                <p className="text-gray-700 font-medium">Target: {targetSubtract}</p>
                            </div>
                        </>
                    )}

                    <div className={`p-6 rounded-2xl border-l-8 transition-all duration-500 flex flex-col items-center justify-center text-center flex-grow ${success ? 'bg-green-100 border-green-500 shadow-xl scale-105' : 'bg-gray-50 border-gray-200 opacity-60'}`}>
                        {success ? (
                            <div className="animate-bounce-in">
                                <h3 className="text-green-700 font-bold text-lg mb-2">SOLVED!</h3>
                                <div className="text-4xl md:text-5xl font-black text-gray-800 mb-2 whitespace-nowrap">
                                    {mode === 'ADD' 
                                        ? `${startCount} + ${userIndices.size} = 10`
                                        : `10 - ${targetSubtract} = ${10 - targetSubtract}`
                                    }
                                </div>
                                <p className="text-green-600 font-medium mb-4">
                                    {mode === 'ADD' ? "You made a ten!" : "You solved the subtraction!"}
                                </p>
                                <button 
                                    onClick={() => initGame(mode)}
                                    className="px-8 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 shadow-lg active:scale-95 transition-transform"
                                >
                                    Play Again 🔄
                                </button>
                            </div>
                        ) : (
                            <div className="text-gray-400 font-bold text-xl">
                                {mode === 'ADD' ? (
                                    <>Make 10!</>
                                ) : (
                                    <>{10 - userIndices.size} left</>
                                )}
                                <br/>
                                <span className="text-sm font-normal">
                                    {mode === 'ADD' ? "Fill the empty boxes." : `Cross out ${targetSubtract} dots.`}
                                </span>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};
    