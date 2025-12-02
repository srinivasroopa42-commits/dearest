import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getStylingAdvice = async (userQuery: string, currentContext: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are "Dearest AI", a sophisticated and helpful fashion stylist for the clothing brand "Dearest". 
    Your tone is elegant, encouraging, and helpful. 
    You have knowledge of general fashion trends. 
    
    CRITICAL: You will be provided with a "Context" describing what the user is currently looking at (e.g., a specific product, the checkout page, or the home page). 
    - If the user is viewing a specific product, tailor your advice to that product (e.g., styling tips, matching items, occasion suitability).
    - If the user is at checkout, be reassuring about their choices.
    - If the user is on the home page, guide them to the collection.

    If the user asks about specific products, recommend items generally found in a high-end minimalist wardrobe (Linen shirts, Silk dresses, Blazers) or items from the "Dearest" innerwear/loungewear collection.
    Keep responses concise (under 100 words) unless asked for details.`;

    const response = await ai.models.generateContent({
      model,
      contents: [
        { role: 'user', parts: [{ text: `Context: ${currentContext}\n\nUser Question: ${userQuery}` }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "I couldn't quite catch that fashion statement. Could you rephrase?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having a bit of a wardrobe malfunction (connection error). Please try again.";
  }
};