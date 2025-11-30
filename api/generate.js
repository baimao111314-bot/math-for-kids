
export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // 1. Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  // 2. Validate Method
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { 
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Helper to return success response (even if it's a fallback)
  const returnSuccess = (data) => {
    return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
  };

  // Helper to generate a reliable fallback locally
  const getFallbackData = (n1, n2, op, emoji) => {
      const opText = op === '+' ? 'more come' : 'leave';
      const question = op === '+' ? 'How many now?' : 'How many are left?';
      return {
        story: `There are ${n1} ${emoji}. Then ${n2} ${opText}. ${question}`,
        emoji: emoji || '🍎',
        steps: [
            `Count the ${n1} ${emoji}.`,
            op === '+' ? `Add ${n2} more.` : `Cross out ${n2}.`,
            "Count to find the answer!"
        ],
        encouragement: "Great job! Keep going! 🌟"
      };
  };

  try {
    const { num1, num2, operation, forcedEmoji } = await req.json();
    const fallbackData = getFallbackData(num1, num2, operation, forcedEmoji);

    const apiKey = process.env.GEMINI_API_KEY;
    
    // 3. Fail-safe: If NO API Key, return fallback immediately
    if (!apiKey) {
      console.warn("Missing API Key. Returning fallback.");
      return returnSuccess(fallbackData);
    }

    const objectPrompt = forcedEmoji 
      ? `The story MUST include this object: ${forcedEmoji}.` 
      : `Use concrete objects (like apples, cars, cats).`;

    const promptText = `
      Write a math word problem for a 1st grader: ${num1} ${operation} ${num2}. 
      ${objectPrompt}
      Rules:
      1. Keep it very short (max 3 sentences).
      2. Use simple English.
      3. ALWAYS write numbers as digits (e.g., "5", not "five").
      4. Return ONLY raw JSON. Do not use Markdown blocks.
    `;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const safetySettings = [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
    ];

    const payload = {
      contents: [{ parts: [{ text: promptText }] }],
      safetySettings: safetySettings,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            story: { type: "STRING" },
            emoji: { type: "STRING" },
            steps: { 
              type: "ARRAY", 
              items: { type: "STRING" } 
            },
            encouragement: { type: "STRING" }
          }
        }
      }
    };

    // 4. Call Gemini
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error("Gemini API Error Status:", response.status);
      // Return fallback instead of erroring out
      return returnSuccess(fallbackData);
    }

    const data = await response.json();
    const textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResult) {
      console.error("Gemini returned empty content");
      return returnSuccess(fallbackData);
    }

    // 5. Clean and Parse JSON
    // Remove markdown code blocks if present
    let cleanJson = textResult.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Try to extract JSON object if there is extra text
    const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        cleanJson = jsonMatch[0];
    }

    try {
        const parsed = JSON.parse(cleanJson);
        // Ensure strictly required fields exist
        if (!parsed.story || !Array.isArray(parsed.steps)) {
            throw new Error("Missing required fields");
        }
        return returnSuccess(parsed);
    } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        // If AI returns bad JSON, return fallback
        return returnSuccess(fallbackData);
    }

  } catch (error) {
    console.error("Backend Handler Fatal Error:", error);
    // 6. Absolute Catch-All: Return fallback
    // We construct a basic fallback here since we might not have parsed body
    const fatalFallback = {
        story: "Let's count together to find the answer!",
        emoji: "🎈",
        steps: ["Count the first group.", "Count the changes.", "Find the total."],
        encouragement: "You can do it!"
    };
    return returnSuccess(fatalFallback);
  }
}
