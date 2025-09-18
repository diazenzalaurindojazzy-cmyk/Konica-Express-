import { GoogleGenAI, Modality } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getResumeSuggestion = async (text: string, context: string): Promise<string> => {
  try {
    const prompt = `Você é um coach de carreira de classe mundial e especialista em redação de currículos. A sua tarefa é refinar e melhorar a secção do currículo fornecida.
Contexto: Você está a melhorar a secção "${context}".
Instruções:
1. Reescreva o texto seguinte para ser mais profissional, impactante e conciso.
2. Use verbos de ação fortes e quantifique as conquistas sempre que possível.
3. Garanta que o tom seja profissional e adequado para uma candidatura de emprego.
4. Não adicione nenhum preâmbulo ou explicação, apenas forneça o texto melhorado.

Texto Original:
"${text}"

Texto Melhorado:`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.5,
        maxOutputTokens: 250,
        thinkingConfig: { thinkingBudget: 125 },
      }
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error fetching suggestion from Gemini API:", error);
    return "Desculpe, não conseguimos gerar uma sugestão neste momento. Por favor, tente novamente mais tarde.";
  }
};


export const editImageWithGemini = async (base64ImageData: string, mimeType: string, prompt: string): Promise<string | null> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64ImageData,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        return null; // No image part found in the response
    } catch (error) {
        console.error("Error editing image with Gemini API:", error);
        return null;
    }
};

export const getTranslation = async (text: string, targetLanguage: string): Promise<string> => {
  try {
    const prompt = `Translate the following text to ${targetLanguage}. 
    Provide ONLY the translated text, without any additional explanations, introductions, or pleasantries.

    Original text:
    "${text}"

    Translated text:`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.3,
      }
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error fetching translation from Gemini API:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return `Sorry, an error occurred during translation. Please try again. Details: ${errorMessage}`;
  }
};

export const extractTextFromImage = async (base64ImageData: string, mimeType: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: 'Extract all text from this image, including handwritten and printed text. Provide only the extracted text, without any additional explanations, introductions, or formatting like markdown.',
          },
        ],
      },
      config: {
        temperature: 0.1, // Lower temperature for more deterministic text extraction
      }
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error extracting text with Gemini API:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return `Ocorreu um erro durante a extração do texto. Por favor, tente novamente. Detalhes: ${errorMessage}`;
  }
};
