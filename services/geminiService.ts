
import { MathOperation, MathStoryResponse } from "../types";

export const generateMathContent = async (
  num1: number,
  num2: number,
  operation: MathOperation,
  forcedEmoji?: string
): Promise<MathStoryResponse> => {
  
  const controller = new AbortController();
  // 5s strict timeout to prevent spinning forever
  const TIMEOUT_MS = 5000;
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  // We wrap the fetch in a Promise.race to guarantee a rejection if the fetch hangs
  // despite the AbortController (some environments are tricky).
  const fetchPromise = fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        num1,
        num2,
        operation,
        forcedEmoji
      }),
      signal: controller.signal
    });

  const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Strict Timeout')), TIMEOUT_MS);
  });

  try {
    const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;

    clearTimeout(timeoutId);

    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data as MathStoryResponse;
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn("API Request Failed in Service (Timeout or Error):", error);
    throw error; 
  }
};
    