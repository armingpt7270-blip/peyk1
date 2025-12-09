import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

// Initialize the client safely
try {
  if (process.env.API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
} catch (error) {
  console.error("Failed to initialize Gemini Client:", error);
}

export const sendMessageToGemini = async (
  message: string,
  history: string[] = []
): Promise<string> => {
  if (!aiClient) {
    return "سرویس هوش مصنوعی در حال حاضر در دسترس نیست. لطفا کلید API را بررسی کنید.";
  }

  try {
    const model = 'gemini-2.5-flash';
    
    // Construct a context-aware prompt
    const systemInstruction = `
      شما یک دستیار هوشمند و مودب برای سامانه پیک موتوری "پیک هوشمند" هستید.
      مخاطب شما سفیران (پیک‌ها) هستند.
      وظیفه شما راهنمایی آنها در مورد مسائل عمومی، ایمنی رانندگی، و مسیریابی کلی است.
      به زبان فارسی صمیمی و محترمانه صحبت کنید.
      پاسخ‌های کوتاه و کاربردی بدهید.
    `;

    const chat = aiClient.chats.create({
      model: model,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    // In a real app, we would hydrate history properly using the History type
    // For this stateless function, we send the message directly.
    const response = await chat.sendMessage({
      message: message
    });

    return response.text || "متوجه نشدم، لطفا دوباره تلاش کنید.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "خطایی در ارتباط با هوش مصنوعی رخ داد.";
  }
};
