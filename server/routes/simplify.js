const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { calculateFleschKincaid } = require('../utils/readability');
require('dotenv').config({ path: '../../.env' }); // Assuming root .env

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
    const { text, mode } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    // Set system prompt based on mode
    let systemPrompt = '';
    if (mode === 'simplified') {
        systemPrompt = "You are a reading assistant for people with dyslexia. Rewrite the following text in plain, simple English. Use short sentences (max 15 words). Use common words only. Keep all the original meaning. Do not add opinions. Return only the rewritten text.";
    } else if (mode === 'bullets') {
        systemPrompt = "Summarise the following text as 5–8 concise bullet points in plain English. Each bullet must start with •. Return only the bullet points.";
    } else if (mode === 'plain') {
        systemPrompt = "Clean up the following text: fix grammar, remove jargon, shorten sentences. Return only the cleaned text.";
    } else {
        return res.status(400).json({ error: 'Invalid mode specified. Options: simplified, bullets, plain' });
    }

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: systemPrompt
        });

        const response = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text }] }],
            generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 1500,
            }
        });

        const resultText = response.response.text().trim();

        // Calculate Readability
        const readabilityBefore = calculateFleschKincaid(text);
        const readabilityAfter = calculateFleschKincaid(resultText);

        res.json({
            result: resultText,
            readabilityBefore,
            readabilityAfter
        });

    } catch (error) {
        console.error('Gemini Request Error:', error);
        res.status(500).json({ error: 'Failed to process text' });
    }
});

module.exports = router;
