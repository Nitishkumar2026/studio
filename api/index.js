const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Priority list of models based on availability in 2026
const MODELS_TO_TRY = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-flash-latest",
  "gemini-pro-latest"
];

// Prompt Template
const CAROUSEL_PROMPT = (topic) => `
You are an expert social media content creator. Generate a 5-slide Instagram carousel based on the topic: ${topic}.

Storytelling Framework:
- Slide 1: Hook
- Slide 2: Problem
- Slide 3: Insight
- Slide 4: Solution
- Slide 5: CTA

Return ONLY JSON:
{
  "slides": [
    { "title": "Title", "content": "Content" }
  ]
}
`;

// Helper: Attempt generation with fallback
async function generateWithFallback(topic) {
  let lastError = null;

  for (const modelName of MODELS_TO_TRY) {
    try {
      console.log(`[STUDIO-AI] Attempting generation with model: ${modelName}`);
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: { responseMimeType: "application/json" }
      });

      const result = await model.generateContent(CAROUSEL_PROMPT(topic));
      const responseText = result.response.text();
      return JSON.parse(responseText);
    } catch (error) {
      console.warn(`[STUDIO-AI] Failed with ${modelName}:`, error.message);
      lastError = error;
      
      // If it's not a service unavailable or rate limit error, maybe don't loop?
      // But usually, in this context, we want to try all options.
      continue; 
    }
  }

  throw lastError;
}

// API Route: Generate Carousel
app.post('/generate-carousel', async (req, res) => {
  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  try {
    const data = await generateWithFallback(topic);
    res.json(data);
  } catch (error) {
    console.error('All models failed:', error);
    res.status(500).json({ 
      error: 'Failed to generate carousel after multiple attempts.',
      details: error.message 
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', provider: 'gemini', fallbacks: MODELS_TO_TRY.length });
});

app.listen(PORT, () => {
  console.log(`Server is running with Fallback Logic on port ${PORT}`);
});
