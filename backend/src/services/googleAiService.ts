import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Simple wrapper around Google Generative AI SDK.
 * Requires env var GOOGLE_GENAI_API_KEY.
 */
class GoogleAiService {
  private client: GoogleGenerativeAI | null = null;

  private getClient() {
    if (!this.client) {
      const apiKey = process.env.GOOGLE_GENAI_API_KEY;
      if (!apiKey) {
        throw new Error("Missing GOOGLE_GENAI_API_KEY env variable");
      }
      this.client = new GoogleGenerativeAI(apiKey);
    }
    return this.client;
  }

  async generateChatResponse(
    prompt: string,
    history: { role: "user" | "model"; parts: string }[] = [],
    images?: Array<{ data: string; mimeType: string }>
  ) {
    try {
      const modelId = process.env.GEMINI_MODEL_ID || 'gemini-1.5-pro';
      const model = this.getClient().getGenerativeModel({ model: modelId });
      // Optional: log once for debugging
      if (process.env.NODE_ENV !== 'production') {
        console.debug(`[GoogleAiService] Using Gemini model: ${modelId}`);
      }

      // Add system instruction for better formatting
      const systemInstruction = `Bạn là một trợ lý AI chuyên nghiệp về nhiếp ảnh và phân tích hình ảnh.

**QUY TẮC ĐỊNH DẠNG QUAN TRỌNG:**

1. **Bảng phân tích LUÔN ĐẦU TIÊN** - Không có khoảng trắng thừa:
| Tiêu chí | Đánh giá | Điểm | Ghi chú |
|----------|----------|------|---------|
| 📸 Chất lượng | Tốt/Khá/TB/Kém | X/10 | Tóm tắt ngắn |
| 💡 Ánh sáng | Tốt/Khá/TB/Kém | X/10 | Exposure, contrast |
| 🎯 Bố cục | Tốt/Khá/TB/Kém | X/10 | Composition, framing |
| ✨ Độ sắc nét | Tốt/Khá/TB/Kém | X/10 | Focus, sharpness |
| 😊 Cảm xúc | Tích cực/TB/Tiêu cực | X/10 | Expression, mood |

2. **Sau bảng - Phần phân tích (KHÔNG dòng trống thừa):**
**📋 Tổng quan:** [1-2 câu ngắn gọn]
**✅ Điểm mạnh:** [Liệt kê 2-3 điểm chính]
**⚠️ Cần cải thiện:** [Liệt kê 1-2 điểm nếu có]
**💡 Khuyến nghị:** [Lời khuyên cụ thể và hữu ích]

**QUY TẮC QUAN TRỌNG:**
- KHÔNG có dòng trống thừa giữa các section
- Sử dụng emoji tinh tế cho từng section
- Mỗi phần ngắn gọn, súc tích (2-3 câu)
- Viết liền mạch, không ngắt đoạn nhiều
- Bảng luôn là phần đầu tiên

Trả lời bằng tiếng Việt, văn phong chuyên nghiệp nhưng thân thiện.`

      // Build user parts with optional inline images
      const userParts: any[] = [{ text: prompt }];
      if (images && images.length) {
        for (const img of images) {
          if (img?.data && img?.mimeType) {
            userParts.push({ inlineData: { data: img.data, mimeType: img.mimeType } });
          }
        }
      }

      const contents = [
        { role: 'user', parts: [{ text: systemInstruction }] },
        { role: 'model', parts: [{ text: 'Tôi hiểu. Tôi sẽ trả lời một cách chuyên nghiệp với định dạng markdown rõ ràng, bao gồm bảng phân tích khi cần thiết. Hãy gửi câu hỏi hoặc hình ảnh để tôi phân tích.' }] },
        ...history.map(h => ({ role: h.role, parts: [{ text: h.parts }] })),
        { role: 'user', parts: userParts }
      ];

      const result = await model.generateContent({ contents });
      return result.response.text();
    } catch (err: any) {
      // Log full error details for server-side debugging
      console.error('[GoogleAiService] generateChatResponse error:', err);

      // Provide more user-friendly error messages to upstream callers
      const rawMsg = typeof err?.message === 'string' ? err.message : '';
      const msg = rawMsg.toLowerCase();

      if (msg.includes('missing google_genai_api_key')) {
        throw new Error('AI service not configured. Please set GOOGLE_GENAI_API_KEY on the server.');
      }

      if (msg.includes('permission') || msg.includes('401') || msg.includes('unauthorized')) {
        throw new Error('Invalid or unauthorized Google GenAI API key.');
      }

      if (msg.includes('quota') || msg.includes('rate') || msg.includes('exceed')) {
        throw new Error('Google AI quota exceeded. Please try again later.');
      }

      // Generic fallback
      throw new Error('Google AI service is currently unavailable.');
    }
  }
}

export default new GoogleAiService(); 