
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getWoodAdvice = async (totalBoardFeet: number): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `I have a total of ${totalBoardFeet.toFixed(2)} units of wood calculated using the (L*W*T*Q)/144 formula. 
      Based on this volume, please provide a concise professional advice:
      1. What kind of furniture or projects can be built with this much wood?
      2. Roughly how heavy would this be in Oak?
      3. Give me one pro tip for woodworkers regarding this volume.
      Keep the tone helpful and professional.`,
      config: {
        temperature: 0.7,
      },
    });

    return response.text || "Unable to generate advice at this time.";
  } catch (error) {
    console.error("Error fetching Gemini advice:", error);
    return "The wood expert is currently offline. Please try again later.";
  }
};
