import { GoogleGenAI, Type } from "@google/genai";
import { MathOperation, MathStoryResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMathContent = async (
  num1: number,
  num2: number,
  operation: MathOperation,
  forcedEmoji?: string
): Promise<MathStoryResponse> => {
  const opWord = operation === MathOperation.ADD ? "addition" : "subtraction";
  
  // If we have a forced emoji, ensure the prompt uses it.
  const objectPrompt = forcedEmoji 
    ? `Use the object represented by this emoji: ${forcedEmoji}. The story MUST be about this object.` 
    : `Use concrete objects (fruits, toys, animals) that can be represented by a single emoji.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Create a math word problem for a 1st grader: ${num1} ${operation} ${num2}. ${objectPrompt}. Keep the story content short (maximum 30 words).`,
    config: {
      systemInstruction: "You are a friendly, enthusiastic kindergarten math teacher. Keep language very simple. Use short sentences. IMPORTANT: Always write numbers as digits (e.g., '5') not words (e.g., 'five'). Structure: Context -> Action -> Question.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          story: {
            type: Type.STRING,
            description: "A short, simple 3-sentence word problem (max 30 words). Use digits for numbers.",
          },
          emoji: {
            type: Type.STRING,
            description: "A single emoji character representing the object in the story.",
          },
          steps: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3 simple steps explaining how to solve it. Step 1: Start with..., Step 2: Add/Take away..., Step 3: Count result.",
          },
          encouragement: {
            type: Type.STRING,
            description: "A short phrase like 'Great job!' or 'You are a math whiz!'",
          },
        },
        required: ["story", "emoji", "steps", "encouragement"],
      },
    },
  });

  if (response.text) {
    return JSON.parse(response.text) as MathStoryResponse;
  }
  
  throw new Error("Failed to generate content");
};