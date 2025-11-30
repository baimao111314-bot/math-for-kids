
import React, { useState } from 'react';
import { WordProblems } from './components/WordProblems';
import { MakeTens } from './components/MakeTens';
import { MoreOrLess } from './components/MoreOrLess';
import { CountingPractice } from './components/CountingPractice';
import { CalmDown } from './components/CalmDown';

type View = 'HOME' | 'WORD_PROBLEMS' | 'MAKE_TENS' | 'MORE_LESS' | 'COUNTING' | 'CALM';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('HOME');

  const renderView = () => {
    switch (currentView) {
      case 'WORD_PROBLEMS':
        return <WordProblems onBack={() => setCurrentView('HOME')} />;
      case 'MAKE_TENS':
        return <MakeTens onBack={() => setCurrentView('HOME')} />;
      case 'MORE_LESS':
        return <MoreOrLess onBack={() => setCurrentView('HOME')} />;
      case 'COUNTING':
        return <CountingPractice onBack={() => setCurrentView('HOME')} />;
      case 'CALM':
        return <CalmDown onBack={() => setCurrentView('HOME')} />;
      default:
        return renderHome();
    }
  };

  const renderHome = () => (
    <div className="flex flex-col items-center justify-center h-full animate-fade-in-up w-full">
      <header className="text-center mb-8">
        <h1 className="text-5xl md:text-6xl font-extrabold text-indigo-600 drop-shadow-sm tracking-tight wiggle inline-block cursor-default mb-2">
          Math Buddy 🚀
        </h1>
        <p className="text-xl text-gray-600">Choose a game to play!</p>
      </header>

      {/* Main Game Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl px-4 mb-12">
        {/* Card 1: Counting 1-100 (Swapped) */}
        <button 
          onClick={() => setCurrentView('COUNTING')}
          className="group relative bg-white rounded-3xl p-6 shadow-xl border-b-8 border-yellow-100 hover:border-yellow-300 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-center min-h-[180px]"
        >
          <div className="text-5xl mb-2 group-hover:scale-110 transition-transform duration-300">💯</div>
          <h2 className="text-2xl font-bold text-yellow-600">Counting 1-100</h2>
          <p className="text-gray-500 text-sm mt-1">Practice patterns</p>
        </button>

        {/* Card 2: Make Tens */}
        <button 
          onClick={() => setCurrentView('MAKE_TENS')}
          className="group relative bg-white rounded-3xl p-6 shadow-xl border-b-8 border-blue-100 hover:border-blue-300 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-center min-h-[180px]"
        >
          <div className="text-5xl mb-2 group-hover:scale-110 transition-transform duration-300">🔟</div>
          <h2 className="text-2xl font-bold text-blue-600">Make Tens</h2>
          <p className="text-gray-500 text-sm mt-1">Fill the frame</p>
        </button>

        {/* Card 3: More or Less */}
        <button 
          onClick={() => setCurrentView('MORE_LESS')}
          className="group relative bg-white rounded-3xl p-6 shadow-xl border-b-8 border-purple-100 hover:border-purple-300 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-center min-h-[180px]"
        >
          <div className="text-5xl mb-2 group-hover:scale-110 transition-transform duration-300">⚖️</div>
          <h2 className="text-2xl font-bold text-purple-600">Compare</h2>
          <p className="text-gray-500 text-sm mt-1">More or Less</p>
        </button>

         {/* Card 4: Word Problems (Swapped) */}
         <button 
          onClick={() => setCurrentView('WORD_PROBLEMS')}
          className="group relative bg-white rounded-3xl p-6 shadow-xl border-b-8 border-indigo-100 hover:border-indigo-300 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-center min-h-[180px]"
        >
          <div className="text-5xl mb-2 group-hover:scale-110 transition-transform duration-300">📝</div>
          <h2 className="text-2xl font-bold text-indigo-600">Word Problems</h2>
          <p className="text-gray-500 text-sm mt-1">Stories & Frogs</p>
        </button>
      </div>

      {/* Calm Down Footer Button */}
      <button
        onClick={() => setCurrentView('CALM')}
        className="flex items-center gap-3 px-6 py-3 bg-teal-50 text-teal-700 rounded-full border-2 border-teal-200 hover:bg-teal-100 hover:scale-105 transition-all shadow-sm group mb-4"
      >
         <span className="text-2xl group-hover:rotate-12 transition-transform">🌿</span>
         <span className="font-bold text-lg">Calm Down Corner</span>
      </button>

    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 font-sans pb-10 flex flex-col">
      <div className="max-w-6xl mx-auto w-full h-full flex-1 flex flex-col justify-center">
        {renderView()}
      </div>
    </div>
  );
}
