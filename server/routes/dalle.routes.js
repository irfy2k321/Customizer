// server/routes/dalle.routes.js

import express from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Try multiple Hugging Face models in order of preference
const HF_MODELS = [
  "stabilityai/stable-diffusion-xl-base-1.0",
  "runwayml/stable-diffusion-v1-5",
  "CompVis/stable-diffusion-v1-4",
  "stabilityai/stable-diffusion-2-1"
];

async function generateImage(prompt) {
  let lastError;
  
  // Try each model until one works
  for (const model of HF_MODELS) {
    try {
      console.log(`Trying model: ${model}`);
      
      const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            negative_prompt: "blurry, bad quality, distorted",
            num_inference_steps: 20,
            guidance_scale: 7.5
          }
        }),
      });

      if (response.ok) {
        console.log(`✅ Success with model: ${model}`);
        const imageBuffer = await response.arrayBuffer();
        return Buffer.from(imageBuffer).toString('base64');
      } else {
        const errorText = await response.text();
        console.log(`❌ Model ${model} failed: ${response.status} - ${errorText}`);
        lastError = new Error(`${model}: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.log(`❌ Model ${model} error:`, error.message);
      lastError = error;
      continue;
    }
  }
  
  // If all models failed, throw the last error
  throw new Error(`All models failed. Last error: ${lastError.message}`);
}

router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, message: 'A prompt is required.' });
    }

    // Validate prompt length
    if (prompt.length > 500) {
      return res.status(400).json({ 
        success: false, 
        message: 'Prompt is too long. Maximum 500 characters allowed.' 
      });
    }

    // Clean the prompt
    const cleanPrompt = prompt.trim();

    console.log('Generating image with prompt:', cleanPrompt);

    // Generate image using Hugging Face
    const imageBase64 = await generateImage(cleanPrompt);

    res.status(200).json({ 
      success: true, 
      photo: imageBase64,
      message: 'Image generated successfully with Hugging Face'
    });

  } catch (error) {
    console.error('Image generation error:', error);
    
    // Handle specific Hugging Face errors
    if (error.message.includes('503')) {
      return res.status(503).json({ 
        success: false, 
        message: 'Model is loading, please try again in a few seconds.' 
      });
    }
    
    if (error.message.includes('429')) {
      return res.status(429).json({ 
        success: false, 
        message: 'Rate limit exceeded. Please try again later.' 
      });
    }
    
    if (error.message.includes('401') || error.message.includes('Invalid token')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid Hugging Face API key. Please check your token.' 
      });
    }

    if (error.message.includes('404')) {
      return res.status(404).json({ 
        success: false, 
        message: 'All image generation models are currently unavailable. Please try again later.' 
      });
    }

    res.status(500).json({ 
      success: false, 
      message: `Image generation failed: ${error.message}` 
    });
  }
});

export default router;