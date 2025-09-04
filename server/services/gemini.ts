import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

// Initialize Gemini AI with API key
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "AIzaSyDEYem1-GKguHxavjPfC47ohpf9UCHiiWA"
);

// Chat session management
let currentChatSession: any = null;

export async function startChat(): Promise<void> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    currentChatSession = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });
  } catch (error) {
    console.error("Failed to start chat session:", error);
    throw new Error("Failed to initialize chat session");
  }
}

export async function sendMessage(message: string): Promise<string> {
  try {
    if (!currentChatSession) {
      await startChat();
    }

    const result = await currentChatSession.sendMessage(message);
    const response = await result.response;
    return response.text() || "I apologize, but I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Chat error:", error);
    throw new Error("Failed to get AI response. Please check your connection and try again.");
  }
}

export async function getChatHistory(): Promise<any[]> {
  try {
    if (!currentChatSession) {
      return [];
    }
    return currentChatSession.getHistory() || [];
  } catch (error) {
    console.error("Failed to get chat history:", error);
    return [];
  }
}

export async function generateText(prompt: string, options?: {
  temperature?: number;
  maxTokens?: number;
  model?: string;
}): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: options?.model || "gemini-2.5-flash" 
    });

    const generationConfig = {
      temperature: options?.temperature || 0.7,
      maxOutputTokens: options?.maxTokens || 1000,
    };

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });

    const response = await result.response;
    return response.text() || "Unable to generate content. Please try again.";
  } catch (error) {
    console.error("Text generation error:", error);
    throw new Error("Failed to generate text content. Please verify your API key and try again.");
  }
}

export async function analyzeImage(base64Image: string, mimeType: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    };

    const prompt = `Analyze this image in detail and provide:
1. A comprehensive description of what you see
2. Key objects, people, or elements identified
3. The setting or context
4. Any notable features, colors, or composition elements
5. Any text visible in the image
6. The overall mood or atmosphere

Please be thorough and descriptive in your analysis.`;

    const result = await model.generateContent({
      contents: [{ 
        role: "user", 
        parts: [imagePart, { text: prompt }] 
      }],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.4,
      },
    });

    const response = await result.response;
    return response.text() || "Unable to analyze the image. Please try uploading a different image.";
  } catch (error) {
    console.error("Image analysis error:", error);
    throw new Error("Failed to analyze image. Please ensure the image is valid and try again.");
  }
}

export async function generateContent(params: {
  topic: string;
  tone: string;
  length: string;
  type: string;
  instructions?: string;
}): Promise<string> {
  try {
    const { topic, tone, length, type, instructions } = params;

    let wordCount = "300-600";
    switch (length) {
      case "short":
        wordCount = "100-300";
        break;
      case "long":
        wordCount = "600-1000";
        break;
      default:
        wordCount = "300-600";
    }

    let contentPrompt = "";
    switch (type) {
      case "blog":
        contentPrompt = `Write a comprehensive blog post about "${topic}". 
        
Requirements:
- Tone: ${tone}
- Length: ${wordCount} words
- Include an engaging title
- Structure with clear headings and subheadings
- Provide valuable insights and information
- Include a compelling introduction and conclusion
- Make it SEO-friendly and engaging for readers`;
        break;
        
      case "social":
        contentPrompt = `Create engaging social media content about "${topic}".
        
Requirements:
- Tone: ${tone}
- Generate 3-5 different posts for various platforms
- Include relevant hashtags
- Keep posts concise and engaging
- Optimize for social media engagement
- Consider platform-specific formats (Twitter, LinkedIn, Instagram, etc.)`;
        break;
        
      case "email":
        contentPrompt = `Write an effective email campaign about "${topic}".
        
Requirements:
- Tone: ${tone}
- Length: ${wordCount} words
- Include compelling subject line
- Clear call-to-action
- Engaging opening and closing
- Personalized and conversion-focused
- Professional email structure`;
        break;
        
      default:
        contentPrompt = `Create content about "${topic}" with a ${tone} tone, approximately ${wordCount} words.`;
    }

    if (instructions) {
      contentPrompt += `\n\nAdditional instructions: ${instructions}`;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: contentPrompt }] }],
      generationConfig: {
        maxOutputTokens: 2000,
        temperature: 0.8,
      },
    });

    const response = await result.response;
    return response.text() || "Unable to generate content. Please try again with different parameters.";
  } catch (error) {
    console.error("Content generation error:", error);
    throw new Error("Failed to generate content. Please check your parameters and try again.");
  }
}

export async function analyzeSentiment(text: string): Promise<{
  rating: number;
  confidence: number;
  explanation: string;
}> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const prompt = `Analyze the sentiment of the following text and provide a detailed assessment:

Text: "${text}"

Please provide:
1. A sentiment rating from 1-5 (1 = very negative, 3 = neutral, 5 = very positive)
2. A confidence score from 0-1 (how confident you are in this assessment)
3. A brief explanation of your analysis

Respond in JSON format: {"rating": number, "confidence": number, "explanation": "string"}`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.3,
        responseMimeType: "application/json",
      },
    });

    const response = await result.response;
    const text_response = response.text();
    
    if (text_response) {
      try {
        return JSON.parse(text_response);
      } catch (parseError) {
        console.error("Failed to parse sentiment analysis response:", parseError);
        return {
          rating: 3,
          confidence: 0.5,
          explanation: "Unable to parse sentiment analysis response",
        };
      }
    }

    throw new Error("Empty response from sentiment analysis");
  } catch (error) {
    console.error("Sentiment analysis error:", error);
    throw new Error("Failed to analyze sentiment. Please try again.");
  }
}

export async function summarizeText(text: string, maxLength?: number): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const lengthInstruction = maxLength 
      ? `in approximately ${maxLength} words` 
      : "concisely while maintaining key points";

    const prompt = `Please summarize the following text ${lengthInstruction}:

${text}

Provide a clear, well-structured summary that captures the main ideas and important details.`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: maxLength ? Math.min(maxLength * 2, 1000) : 500,
        temperature: 0.4,
      },
    });

    const response = await result.response;
    return response.text() || "Unable to generate summary. Please try again.";
  } catch (error) {
    console.error("Text summarization error:", error);
    throw new Error("Failed to summarize text. Please try again.");
  }
}

// Health check function to verify API connectivity
export async function checkApiHealth(): Promise<{ status: string; model: string }> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: "Hello, respond with 'API working' to confirm connectivity." }] }],
      generationConfig: {
        maxOutputTokens: 10,
        temperature: 0.1,
      },
    });

    const response = await result.response;
    const text = response.text();
    
    return {
      status: text ? "connected" : "error",
      model: "gemini-2.5-flash",
    };
  } catch (error) {
    console.error("API health check failed:", error);
    throw new Error("Gemini API connection failed. Please check your API key and network connection.");
  }
}
