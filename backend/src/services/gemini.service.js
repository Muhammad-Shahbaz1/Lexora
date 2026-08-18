const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// The structured system prompt for Lexora
const LEXORA_SYSTEM_PROMPT = `You are Lexora, an expert AI legal document analyzer. Your role is to help everyday people understand complex legal documents.

Analyze the provided legal document carefully and return a VALID JSON object with EXACTLY this structure:

{
  "summary": {
    "english": "A clear, plain English summary of the entire document in 200-300 words. Explain what type of agreement this is, what the main parties agree to, and the most important terms.",
    "romanUrdu": "Usi summary ko Roman Urdu mein likho (200-300 alfaz). Bilkul simple aur aam language use karo jaise tum kisi dost ko samja rahe ho."
  },
  "riskFlags": [
    {
      "title": "Short title of the risk",
      "description": "Detailed explanation of why this clause or term is risky for the person signing",
      "severity": "high" 
    }
  ],
  "keyClauses": [
    {
      "clause": "The exact or paraphrased clause from the document",
      "explanation": "What this clause means in simple terms and why it matters"
    }
  ],
  "negotiationTips": [
    "Specific question or point to negotiate before signing. Be practical and actionable."
  ],
  "overallRiskLevel": "medium",
  "disclaimer": "This analysis is provided by Lexora AI for informational purposes only and does not constitute legal advice. Please consult a qualified legal professional before making any legal decisions."
}

CRITICAL RULES:
- severity values MUST be: "low", "medium", or "high" only
- overallRiskLevel MUST be: "low", "medium", or "high" only
- Include 2-5 riskFlags (more if the document has serious risks)
- Include 3-7 keyClauses 
- Include exactly 3-5 negotiationTips
- Return ONLY the JSON object, no markdown, no extra text
- Be honest about risks. Don't sugarcoat dangerous clauses.
- Focus on: rent agreements, job contracts, business agreements, NDAs, service agreements`;

/**
 * Fetch file from URL and convert to base64
 */
const fetchFileAsBase64 = async (url) => {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const base64 = Buffer.from(response.data, 'binary').toString('base64');
  return base64;
};

/**
 * Analyze a contract document using Gemini multimodal AI
 * @param {string} fileUrl - Cloudinary URL of the document
 * @param {string} mimeType - MIME type of the file
 * @param {string} category - Contract category (rent/job/business/other)
 */
const analyzeContract = async (fileUrl, mimeType, category) => {
  // Try models in order of preference (Gemini 3.7, 3.6, 3.5)
  const models = [
    'gemini-3.7-flash',
    'gemini-3.6-flash',
    'gemini-3.5-flash',
  ];

  let lastError;

  for (const modelName of models) {
    try {
      console.log(`🤖 Attempting analysis with model: ${modelName}`);
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: LEXORA_SYSTEM_PROMPT,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.1,
          maxOutputTokens: 8192,
        },
      });

      // Fetch and encode the file
      const base64Data = await fetchFileAsBase64(fileUrl);
      const effectiveMimeType =
        mimeType === 'application/pdf' ? 'application/pdf' : mimeType;

      const prompt = `Please analyze this ${category} legal document. Extract all important information, identify risks, and explain key clauses in plain English and Roman Urdu. Return the analysis as a JSON object following the exact schema defined in your instructions.`;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: effectiveMimeType,
            data: base64Data,
          },
        },
      ]);

      const responseText = result.response.text();
      console.log(`✅ Analysis complete with model: ${modelName}`);

      // Parse JSON response
      let parsed;
      try {
        parsed = JSON.parse(responseText);
      } catch {
        // Try to extract JSON from response if extra text exists
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Failed to parse AI response as JSON');
        }
      }

      // Validate required fields
      if (!parsed.summary || !parsed.riskFlags || !parsed.keyClauses) {
        throw new Error('AI response missing required fields');
      }

      return parsed;
    } catch (err) {
      console.warn(`⚠️ Model ${modelName} failed: ${err.message}`);
      lastError = err;
      continue;
    }
  }

  throw new Error(
    `All Gemini models failed. Last error: ${lastError?.message}`
  );
};

module.exports = { analyzeContract };
