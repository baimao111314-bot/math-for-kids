
import React, { useState, useEffect, useRef } from 'react';
import { MathOperation, MathState, MathStoryResponse } from '../types';
import { generateMathContent } from '../services/geminiService';
import { MathVisualizer } from './MathVisualizer';
import { MathAnimator } from './MathAnimator';
import { NumberLine } from './NumberLine';
import { NumberInput } from './NumberInput';
import { InteractiveStory } from './InteractiveStory';

// Curated list of child-friendly emojis for random selection
const THEMES = [
  '🍪', '🍎', '🍌', '🍦', // Food
  '🐶', '🐱', '🐸', '🦁', '🐰', // Animals
  '🚗', '🚀', '⚽', '🎈', // Objects
  '👽', '🤖', '👾' // Characters
];

enum Step {
  INPUT = 0,
  VISUALIZE = 1,
  STORY = 2,
  ANIMATION = 3,
  ANSWER = 4
}

interface WordProblemsProps {
  onBack: () => void;
}

export const WordProblems: React.FC<WordProblemsProps> = ({ onBack }) => {
  const [state, setState] = useState<MathState>({
    num1: 5,
    num2: 3,
    operation: MathOperation.ADD,
    result: 8
  });

  const [loading, setLoading] = useState(false);
  const [storyData, setStoryData] = useState<MathStoryResponse | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>(Step.INPUT);
  const [currentEmoji, setCurrentEmoji] = useState<string>('🎈');
  const [visualizerCount, setVisualizerCount] = useState(0); 
  const [replayTrigger, setReplayTrigger] = useState(0);

  // Refs for auto-scrolling
  const visualizerRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const res = state.operation === MathOperation.ADD 
      ? state.num1 + state.num2 
      : state.num1 - state.num2;
    
    setState(prev => ({ ...prev, result: res }));
    if (currentStep !== Step.INPUT) {
      setCurrentStep(Step.INPUT);
      setStoryData(null);
    }
  }, [state.num1, state.num2, state.operation]);

  useEffect(() => {
    if (state.operation === MathOperation.SUBTRACT && state.num1 < state.num2) {
        setState(prev => ({ ...prev, num2: prev.num1 }));
    }
  }, [state.num1, state.num2, state.operation]);

  const handleStart = async () => {
    setLoading(true);
    setVisualizerCount(0);
    
    const randomEmoji = THEMES[Math.floor(Math.random() * THEMES.length)];
    setCurrentEmoji(randomEmoji);

    try {
      setCurrentStep(Step.VISUALIZE);
      setTimeout(() => visualizerRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

      const data = await generateMathContent(state.num1, state.num2, state.operation, randomEmoji);
      if (data.emoji !== randomEmoji) {
          data.emoji = randomEmoji; 
      }
      setStoryData(data);
    } catch (e) {
      console.error(e);
      setStoryData({
        story: `Let's use our ${randomEmoji} to find the answer! We have ${state.num1} and then ${state.operation === MathOperation.ADD ? 'add' : 'take away'} ${state.num2}.`,
        emoji: randomEmoji,
        steps: ["Count the first group", "Adjust for the second group", "Count how many are left/total"],
        encouragement: "You can do it!"
      });
    } finally {
      setLoading(false);
    }
  };

  const nextToStory = () => {
    setCurrentStep(Step.STORY);
    setTimeout(() => storyRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const showProcess = () => {
    setCurrentStep(Step.ANIMATION);
    setReplayTrigger(prev => prev + 1);
    setTimeout(() => animationRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleReplay = () => {
      setReplayTrigger(prev => prev + 1);
  };

  const revealAnswer = () => {
    setCurrentStep(Step.ANSWER);
    setTimeout(() => answerRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const setRandom = () => {
    const op = Math.random() > 0.5 ? MathOperation.ADD : MathOperation.SUBTRACT;
    const n1 = Math.floor(Math.random() * 9) + 1; 
    const n2 = Math.floor(Math.random() * (op === MathOperation.SUBTRACT ? n1 : (10 - n1))) + 1;
    
    setState({
      num1: n1,
      num2: n2,
      operation: op,
      result: op === MathOperation.ADD ? n1 + n2 : n1 - n2
    });
    setStoryData(null);
    setCurrentStep(Step.INPUT);
  };

  return (
    <div className="w-full">
        {/* Header with Back Button */}
        <div className="flex items-center mb-6">
            <button 
                onClick={onBack}
                className="mr-4 p-2 bg-white rounded-full shadow-md text-gray-600 hover:bg-gray-100 transition-colors"
            >
                ⬅️ Back
            </button>
            <h1 className="text-3xl font-extrabold text-indigo-600 tracking-tight">
                Word Problems 📝
            </h1>
        </div>

        {/* STEP 1: Equation / Input Section */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-8 border-b-8 border-indigo-100">
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-2xl font-bold text-indigo-500">Step 1: The Problem</h2>
             <button
              onClick={setRandom}
              className="px-4 py-2 rounded-xl bg-yellow-100 text-yellow-700 font-bold hover:bg-yellow-200 transition-colors text-sm"
            >
              🎲 Random
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            <NumberInput 
              value={state.num1} 
              onChange={(val) => setState(prev => ({ ...prev, num1: val }))} 
              max={20}
            />

            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => setState(prev => ({ ...prev, operation: prev.operation === MathOperation.ADD ? MathOperation.SUBTRACT : MathOperation.ADD }))}
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl font-bold transition-colors ${
                  state.operation === MathOperation.ADD 
                    ? 'bg-green-100 text-green-600 border-4 border-green-200' 
                    : 'bg-red-100 text-red-500 border-4 border-red-200'
                }`}
              >
                {state.operation}
              </button>
            </div>

            <NumberInput 
              value={state.num2} 
              onChange={(val) => setState(prev => ({ ...prev, num2: val }))} 
              max={state.operation === MathOperation.SUBTRACT ? state.num1 : 20}
            />

            <div className="text-4xl font-black text-gray-300">=</div>

            {/* Answer Box */}
            <div className={`w-24 h-24 rounded-2xl border-4 border-dashed flex items-center justify-center text-5xl font-bold transition-all duration-500 ${
              currentStep === Step.ANSWER 
                ? 'bg-indigo-50 border-indigo-400 text-indigo-600 scale-110' 
                : 'bg-gray-50 border-gray-200 text-gray-300'
            }`}>
              {currentStep === Step.ANSWER ? state.result : '?'}
            </div>
          </div>

          {currentStep === Step.INPUT && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleStart}
                className="px-8 py-3 rounded-xl font-bold text-white text-xl shadow-lg bg-indigo-500 hover:bg-indigo-600 hover:-translate-y-1 transition-all w-full md:w-auto animate-pulse"
              >
                Let's Solve It! 👇
              </button>
            </div>
          )}
        </div>

        {/* STEP 2: Interactive Visuals */}
        {currentStep >= Step.VISUALIZE && (
          <div ref={visualizerRef} className="bg-white p-6 rounded-3xl shadow-lg border-b-8 border-pink-100 mb-8 animate-fade-in-up">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-pink-500 flex items-center gap-2">
                  Step 2: Tap to Count! 👆
                </h2>
             </div>
             
             <p className="text-gray-600 mb-4 text-center text-lg">
                {state.operation === MathOperation.ADD 
                  ? `Can you add ${state.num2} more ${currentEmoji}?` 
                  : `Can you cross out ${state.num2} ${currentEmoji}?`}
             </p>

             <MathVisualizer 
               num1={state.num1} 
               num2={state.num2} 
               operation={state.operation} 
               emoji={currentEmoji} 
               onCountChange={setVisualizerCount}
             />

             {/* Synchronized Number Line */}
             <div className="mt-8">
               <NumberLine 
                  start={state.num1}
                  change={state.num2}
                  operation={state.operation}
                  progress={visualizerCount}
               />
             </div>

             {currentStep === Step.VISUALIZE && (
               <div className="flex justify-center mt-6">
                 <button
                   onClick={nextToStory}
                   disabled={loading}
                   className="px-8 py-3 rounded-xl font-bold text-white text-xl shadow-lg bg-pink-500 hover:bg-pink-600 hover:-translate-y-1 transition-all"
                 >
                   {loading ? 'Making Story...' : 'Read the Story 👉'}
                 </button>
               </div>
             )}
          </div>
        )}

        {/* STEP 3: Story & Steps */}
        {currentStep >= Step.STORY && storyData && (
          <div ref={storyRef} className="grid md:grid-cols-2 gap-6 mb-8 animate-fade-in-up">
            {/* Interactive Story Card */}
            <div className="bg-white p-6 rounded-3xl shadow-lg border-b-8 border-orange-100">
              <h2 className="text-2xl font-bold text-orange-500 mb-4 flex items-center gap-2">
                Step 3: The Story 📖
              </h2>
              <InteractiveStory 
                story={storyData.story} 
                num1={state.num1} 
                num2={state.num2} 
                operation={state.operation} 
              />
            </div>

            {/* How to Solve Card */}
            <div className="bg-white p-6 rounded-3xl shadow-lg border-b-8 border-teal-100">
              <h2 className="text-2xl font-bold text-teal-600 mb-4 flex items-center gap-2">
                How to Solve 🧠
              </h2>
              <ul className="space-y-4">
                {storyData.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-4 text-xl text-gray-700">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
              
              {currentStep === Step.STORY && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={showProcess}
                    className="px-8 py-3 rounded-xl font-bold text-white text-xl shadow-lg bg-teal-500 hover:bg-teal-600 hover:-translate-y-1 transition-all w-full"
                  >
                    Watch it Happen! ✨
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* STEP 4: Animation & Number Line */}
        {currentStep >= Step.ANIMATION && storyData && (
          <div ref={animationRef} className="bg-white p-6 rounded-3xl shadow-lg border-b-8 border-purple-100 mb-8 animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-purple-600 flex items-center gap-2">
                  Step 4: Two ways to solve it! 🎬
                </h2>
                <button 
                  onClick={handleReplay}
                  className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-bold hover:bg-purple-200 transition-colors text-sm"
                >
                  ↺ Replay
                </button>
            </div>
            
            <div className="space-y-8">
              <div>
                <p className="text-gray-500 font-bold mb-2">Method 1: Using Objects</p>
                <MathAnimator 
                   num1={state.num1} 
                   num2={state.num2} 
                   operation={state.operation} 
                   emoji={currentEmoji}
                   playTrigger={replayTrigger}
                />
              </div>

              <div>
                <p className="text-gray-500 font-bold mb-2">Method 2: Using the Number Line</p>
                <NumberLine 
                  start={state.num1}
                  change={state.num2}
                  operation={state.operation}
                  trigger={replayTrigger}
                />
              </div>
            </div>

            {currentStep === Step.ANIMATION && (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={revealAnswer}
                    className="px-8 py-3 rounded-xl font-bold text-white text-xl shadow-lg bg-purple-500 hover:bg-purple-600 hover:-translate-y-1 transition-all"
                  >
                    See The Answer! 🏆
                  </button>
                </div>
              )}
          </div>
        )}

        {/* STEP 5: Final Answer */}
        {currentStep === Step.ANSWER && storyData && (
           <div ref={answerRef} className="bg-green-100 p-8 rounded-3xl text-center animate-bounce-in border-4 border-green-200 mb-8">
              <h2 className="text-3xl font-bold text-green-600 mb-2">🎉 {storyData.encouragement}</h2>
              <p className="text-4xl text-green-700 mt-4 font-black">
                 {state.num1} {state.operation} {state.num2} = {state.result}
              </p>
              <div className="mt-6">
                <button 
                  onClick={setRandom}
                  className="px-8 py-3 bg-white text-green-600 font-bold text-xl rounded-xl shadow hover:bg-green-50 transition-all transform hover:scale-105"
                >
                  Play Again 🔄
                </button>
              </div>
           </div>
        )}
    </div>
  );
}
