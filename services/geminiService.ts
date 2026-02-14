import { GoogleGenAI } from "@google/genai";

export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
  // NOTE: Ideally, the API key should come from a secure backend or user input.
  // For this demo, we assume the user has set it in the environment or we prompt for it.
  // We will access it from process.env if available, or rely on the UI to provide it.
  
  const apiKey = process.env.API_KEY || localStorage.getItem('GEMINI_API_KEY');

  if (!apiKey) {
    throw new Error("Gemini API Key não encontrada. Configure-a nas configurações.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const prompt = `Crie uma descrição atraente, criativa e vendedora para um produto de papelaria.
    Nome do produto: ${productName}
    Categoria: ${category}
    
    A descrição deve ter cerca de 2 parágrafos curtos. Use um tom encantador e organizado.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-latest',
      contents: prompt,
    });

    return response.text || "Não foi possível gerar a descrição.";
  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw new Error("Falha ao conectar com a IA.");
  }
};