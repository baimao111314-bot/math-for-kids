
import React, { useState, useEffect, useRef } from 'react';
import { MathOperation, MathState, MathStoryResponse } from '../types';
import { generateMathContent } from '../services/geminiService';
import { MathVisualizer } from './MathVisualizer';
import { MathAnimator } from './MathAnimator';
import { NumberLine } from './NumberLine';
import { NumberInput } from './NumberInput';
import { InteractiveStory } from './InteractiveStory';

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
  const [usingFallback, setUsingFallback] = useState(false);
  const [storyData, setStoryData] = useState<MathStoryResponse | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>(Step.INPUT);
  const [currentEmoji, setCurrentEmoji] = useState<string>('🎈');
  const [visualizerCount, setVisualizerCount] = useState(0); 
  const [replayTrigger, setReplayTrigger] = useState(0);

  const visualizerRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);

  // Recalculate result when inputs change
  useEffect(() => {
    const res = state.operation === MathOperation.ADD 
      ? state.num1 + state.num2 
      : state.num1 - state.num2;
    
    setState(prev => ({ ...prev, result: res }));
  }, [state.num1, state.num2, state.operation]);

  // Ensure valid subtraction
  useEffect(() => {
    if (state.operation === MathOperation.SUBTRACT && state.num1 < state.num2) {
        setState(prev => ({ ...prev, num2: prev.num1 }));
    }
  }, [state.num1, state.num2, state.operation]);

  const createFallbackStory = (emoji: string) => {
      const opWord = state.operation === MathOperation.ADD ? 'find' : 'give away';
      return {
        story: `We have ${state.num1} ${emoji}. Then we ${opWord} ${state.num2} more. How many ${emoji} are there now?`,
        emoji: emoji,
        steps: [
            "Count the first group.", 
            state.operation === MathOperation.ADD ? "Add the new ones." : "Take away the others.", 
            "Count to find the answer!"
        ],
        encouragement: "You are doing great! 🌟"
      };
  };

  const handleStart = async () => {
    setLoading(true);
    setUsingFallback(false);
    setVisualizerCount(0);
    setStoryData(null);
    
    const randomEmoji = THEMES[Math.floor(Math.random() * THEMES.length)];
    setCurrentEmoji(randomEmoji);

    // Optimistic UI: Move to visualizer immediately
    setCurrentStep(Step.VISUALIZE);
    setTimeout(() => visualizerRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

    try {
      // Call service - Now secured with strict Promise.race timeout in service
      const data = await generateMathContent(state.num1, state.num2, state.operation, randomEmoji);
      
      // Ensure emoji consistency if backend returned a different one or fallback
      if (data.emoji !== randomEmoji) {
          data.emoji = randomEmoji; 
      }
      setStoryData(data);
    } catch (e) {
      console.warn("Service error, constructing local fallback:", e);
      setUsingFallback(true);
      setStoryData(createFallbackStory(randomEmoji));
    } finally {
      // Vital: Ensure loading is set to false even if everything crashes
      setLoading(false);
    }
  };

  const handleNextToStory = () => {
    // FORCE VALID DATA: Check if storyData exists. If not, creating it immediately.
    if (!storyData) {
        console.warn("Data missing during transition. Generating fallback.");
        const fallback = createFallbackStory(currentEmoji);
        setStoryData(fallback);
        setUsingFallback(true);
    }

    // Always advance step
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
        {/* Header */}
        <div className="flex items-center mb-6">
            <button 
                onClick={onBack}
                className="mr-4 px-4 py-2 bg-white rounded-full shadow-md text-gray-600 hover:bg-gray-100 transition-colors font-bold border border-gray-200"
            >
                ⬅️ Back
            </button>
            <h1 className="text-3xl font-extrabold text-indigo-600 tracking-tight">
                Word Problems 📝
            </h1>
        </div>

        {/* STEP 1: Input */}
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
              onChange={(val) => {
                  setState(prev => ({ ...prev, num1: val }));
                  setCurrentStep(Step.INPUT);
              }} 
              max={20}
            />

            <button
                onClick={() => {
                    setState(prev => ({ ...prev, operation: prev.operation === MathOperation.ADD ? MathOperation.SUBTRACT : MathOperation.ADD }));
                    setCurrentStep(Step.INPUT);
                }}
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl font-bold transition-colors ${
                  state.operation === MathOperation.ADD 
                    ? 'bg-green-100 text-green-600 border-4 border-green-200' 
                    : 'bg-red-100 text-red-500 border-4 border-red-200'
                }`}
            >
                {state.operation}
            </button>

            <NumberInput 
              value={state.num2} 
              onChange={(val) => {
                  setState(prev => ({ ...prev, num2: val }));
                  setCurrentStep(Step.INPUT);
              }}
              max={state.operation === MathOperation.SUBTRACT ? state.num1 : 20}
            />

            <div className="text-4xl font-black text-gray-300">=</div>

            <div className="w-24 h-24 rounded-2xl border-4 border-dashed border-gray-200 flex items-center justify-center text-5xl font-bold text-gray-300 bg-gray-50">
              ?
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

        {/* STEP 2: Visualize */}
        {currentStep >= Step.VISUALIZE && (
          <div ref={visualizerRef} className="bg-white p-6 rounded-3xl shadow-lg border-b-8 border-pink-100 mb-8 animate-fade-in-up">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-pink-500 flex items-center gap-2">
                  Step 2: Tap to Count! 👆
                </h2>
                {usingFallback && (
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-lg border border-gray-200">Offline Mode</span>
                )}
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

             <div className="mt-8">
               <NumberLine 
                  start={state.num1}
                  change={state.num2}
                  operation={state.operation}
                  progress={visualizerCount}
               />
             </div>

             {/* Only show NEXT button here if we are currently ON this step */}
             {currentStep === Step.VISUALIZE && (
               <div className="flex justify-center mt-6">
                 <button
                   onClick={handleNextToStory}
                   disabled={loading} 
                   className={`px-8 py-3 rounded-xl font-bold text-xl shadow-lg transition-all flex items-center gap-2 ${
                       loading 
                       ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                       : 'bg-pink-500 text-white hover:bg-pink-600 hover:-translate-y-1'
                   }`}
                 >
                   {loading ? (
                       <>
                        <span className="animate-spin text-2xl">⏳</span>
                        Making Story...
                       </>
                   ) : 'Read the Story 👉'}
                 </button>
               </div>
             )}
          </div>
        )}

        {/* STEP 3: Story - Always Render Container if Step matches */}
        {currentStep >= Step.STORY && (
          <div ref={storyRef} className="grid md:grid-cols-2 gap-6 mb-8 animate-fade-in-up">
            <div className="bg-white p-6 rounded-3xl shadow-lg border-b-8 border-orange-100">
              <h2 className="text-2xl font-bold text-orange-500 mb-4 flex items-center gap-2">
                Step 3: The Story 📖
              </h2>
              {/* Fallback display if storyData is somehow null despite checks */}
              {storyData ? (
                 <InteractiveStory 
                    story={storyData.story} 
                    num1={state.num1} 
                    num2={state.num2} 
                    operation={state.operation} 
                />
              ) : (
                  <div className="text-gray-400">Loading story...</div>
              )}
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-lg border-b-8 border-teal-100">
              <h2 className="text-2xl font-bold text-teal-600 mb-4 flex items-center gap-2">
                How to Solve 🧠
              </h2>
              <ul className="space-y-4">
                {storyData && storyData.steps ? storyData.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-4 text-xl text-gray-700">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                )) : (
                    <li className="text-gray-400">Loading steps...</li>
                )}
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
        
        {/* STEP 4: Animation */}
        {currentStep >= Step.ANIMATION && (
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

        {/* STEP 5: Answer */}
        {currentStep === Step.ANSWER && (
           <div ref={answerRef} className="bg-green-100 p-8 rounded-3xl text-center animate-bounce-in border-4 border-green-200 mb-8">
              <h2 className="text-3xl font-bold text-green-600 mb-2">
                  🎉 {storyData?.encouragement || "Good job!"}
              </h2>
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
    