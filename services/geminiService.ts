import { GoogleGenAI } from "@google/genai";

// Ensure the API key is available in the environment variables.
if (!process.env.API_KEY) {
  console.error("未设置 API_KEY 环境变量。");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateInspiration = async (systemInstruction: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: "请根据你的角色设定，生成一段新颖的、之前没有提过的、有趣且易于理解的知识内容。请确保每次生成的主题或比喻都和以往不同。",
      config: {
        systemInstruction: systemInstruction,
        temperature: 1.0,
        topP: 0.95,
      },
    });

    return response.text;
  } catch (error) {
    console.error("调用 Gemini API 时出错:", error);
    if (error instanceof Error) {
        if(error.message.includes('API key not valid')) {
            return "错误：API 密钥无效。请检查您的配置。";
        }
        return `错误：无法生成内容。请检查网络连接或 API 密钥。 ${error.message}`;
    }
    return "生成内容时发生未知错误。";
  }
};

export const polishText = async (text: string, fieldType: 'bio' | 'systemInstruction'): Promise<string> => {
  const systemInstructions = {
    bio: `你是一位优秀的文案编辑。你的任务是将用户提供的AI角色简介润色得更生动、吸引人，但保持其核心意思不变。简介应该简短精炼，最好在一句话以内。直接返回润色后的文本，不要包含任何额外解释或标签。`,
    systemInstruction: `你是一位AI提示工程专家。你的任务是优化用户提供的系统指令，使其更清晰、具体、有效，更能引导AI稳定地扮演角色并生成高质量内容。保持核心任务不变。直接返回优化后的指令文本，不要包含任何额外解释或标签。`
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: text,
      config: {
        systemInstruction: systemInstructions[fieldType],
        temperature: 0.5,
      },
    });

    let polishedText = response.text.trim();
    if (polishedText.startsWith('"') && polishedText.endsWith('"')) {
        polishedText = polishedText.substring(1, polishedText.length - 1);
    }
    return polishedText;

  } catch (error) {
    console.error(`调用 Gemini API 进行文本润色时出错 (类型: ${fieldType}):`, error);
    if (error instanceof Error) {
        if(error.message.includes('API key not valid')) {
            return "错误：API 密钥无效。请检查您的配置。";
        }
        return `错误：润色失败。 ${error.message}`;
    }
    return "润色时发生未知错误。";
  }
};