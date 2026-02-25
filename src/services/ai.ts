import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateText(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("AI Error:", error);
    return "AI Interface temporarily unavailable.";
  }
}

export async function generateGymBackground(): Promise<string | null> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: "A view looking out of a massive luxury glass window into a highly photorealistic, cinematic, extremely luxurious modern gym interior. Dark aesthetic, moody dramatic lighting, subtle neon accents, wide angle architectural photography, 8k resolution, elegant, no people.",
    });
    
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Gen Error:", error);
    return null;
  }
}

export async function searchFoodAI(query: string): Promise<any> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Provide nutritional info for 100g or 1 standard serving of '${query}'. Return ONLY valid JSON: { "name": string, "em": string (emoji), "p": number, "c": number, "fat": number, "k": number, "f": number, "mode": "gram"|"count"|"ml", "unit": string, "cat": string, "veg": "Veg"|"Egg"|"Non-Veg", "tip": string }. No markdown formatting.`,
      config: {
        responseMimeType: "application/json",
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function generateWorkoutPlan(goal: string): Promise<any> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Generate a 7-day workout plan for a ${goal} goal. Return ONLY valid JSON: { "days": [ { "day": "Monday", "focus": "Chest", "exercises": [ { "name": "Bench Press", "sets": "3x10" } ] } ] }. No markdown.`,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error(e);
    return null;
  }
}
