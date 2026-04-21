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
const CAROUSEL_PROMPT = (topic, format, tone, brandColor) => {
  let slideCount = 5;
  if (format === 'post') slideCount = 1;
  else if (format === 'story') slideCount = 3;

  return `
You are an expert social media content creator. Generate social media content for: ${topic}.

Format Details:
- Type: ${format.toUpperCase()} (Total slides to generate: ${slideCount})
- Tone of Voice: ${tone}
- Primary Brand Color: ${brandColor}

Rules for Storytelling based on slide count:
- If 1 slide: Hook + core insight + brief CTA.
- If 3 slides: Slide 1 (Hook), Slide 2 (Core insight/Problem-Solution), Slide 3 (CTA).
- If 5 slides: Slide 1 (Hook), Slide 2 (Problem), Slide 3 (Insight), Slide 4 (Solution), Slide 5 (CTA).

Output requirements:
For each slide, you MUST provide an "imagePrompt". This prompt should be a highly detailed, descriptive sentence for an AI image generator to create a stunning background or visual illustration that matches the slide content. It should NOT contain text directions, just visual ones. E.g. "A glowing lightbulb breaking out of a dark box with cinematic lighting".

Return ONLY JSON:
{
  "slides": [
    { 
      "title": "Short punchy Title", 
      "content": "Slide Content",
      "imagePrompt": "Detailed visual description of the slide's visual concept"
    }
  ]
}
`;
};

const REGENERATE_SLIDE_PROMPT = (topic, format, tone, slideIndex, originalTitle, originalContent, feedback) => {
  return `
You are rewriting Slide ${slideIndex + 1} of a ${format.toUpperCase()} for the topic: ${topic}.
Tone: ${tone}.

Original Title: ${originalTitle}
Original Content: ${originalContent}
User Feedback for rewrite (if any): ${feedback}

Write a new version of this slide that continues to flow within the format structure.
Provide a new "imagePrompt" based on the new content.

Return ONLY JSON:
{
  "title": "New Title",
  "content": "New Content",
  "imagePrompt": "New visual description"
}
`;
};

// Helper: Attempt generation with fallback
async function generateWithFallback(promptString) {
  let lastError = null;

  for (const modelName of MODELS_TO_TRY) {
    try {
      console.log(`[STUDIO-AI] Attempting generation with model: ${modelName}`);
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: { responseMimeType: "application/json" }
      });

      const result = await model.generateContent(promptString);
      const responseText = result.response.text();
      return JSON.parse(responseText);
    } catch (error) {
      console.warn(`[STUDIO-AI] Failed with ${modelName}:`, error.message);
      lastError = error;
      continue; 
    }
  }

  throw lastError;
}

// API Route: Generate Full Content
app.post('/generate-carousel', async (req, res) => {
  const { topic, format = 'carousel', tone = 'Professional', brandColor = '#4f6ef7' } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  try {
    const data = await generateWithFallback(CAROUSEL_PROMPT(topic, format, tone, brandColor));
    res.json(data);
  } catch (error) {
    console.error('All models failed:', error);
    res.status(500).json({ 
      error: 'Failed to generate carousel after multiple attempts.',
      details: error.message 
    });
  }
});

// API Route: Regenerate Single Slide
app.post('/regenerate-slide', async (req, res) => {
  const { topic, format, tone, slideIndex, originalTitle, originalContent, feedback } = req.body;

  try {
    const data = await generateWithFallback(REGENERATE_SLIDE_PROMPT(topic, format, tone, slideIndex, originalTitle, originalContent, feedback || "Make it more engaging"));
    res.json(data);
  } catch (error) {
    console.error('All models failed for regenerative slide:', error);
    res.status(500).json({ 
      error: 'Failed to regenerate slide.',
      details: error.message 
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', provider: 'gemini', fallbacks: MODELS_TO_TRY.length });
});

app.listen(PORT, () => {
  console.log(`Studio AI Server is running on port ${PORT}`);
});
