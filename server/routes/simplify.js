const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { calculateFleschKincaid } = require('../utils/readability');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') }); 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
router.post('/', async (req, res) => {
    const { text, mode } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    let systemPrompt = '';

    if (mode === 'simplified') {
        systemPrompt = `You are a reading assistant for people with dyslexia. 
        Rewrite the following text in simple English. Use short sentences (max 15 words). Keep all original meaning. 
        Also, identify 3-5 potentially "difficult" or "complex" words used in the original OR the rewritten text and provide very simple, one-sentence meanings for them.
        
        Return your response ONLY as a JSON object with this exact structure:
        {
          "simplifiedText": "the rewritten text here",
          "glossary": [
            {"word": "example", "definition": "a thing that shows what others are like"}
          ]
        }`;
    } else if (mode === 'bullets') {
        systemPrompt = `Summarize the following text into 5-8 bullet points. 
        Return your response ONLY as a JSON object with this exact structure:
        {
          "simplifiedText": "• Point 1\\n• Point 2",
          "glossary": []
        }`;
    } else if (mode === 'plain') {
        systemPrompt = `You are a text cleaning assistant. 
        Take the following text and clean up the grammar, remove excessive jargon, and break down very long paragraphs. 
        Make it readable for someone who wants the facts without complex academic language.
        
        Return your response ONLY as a JSON object with this exact structure:
        {
          "simplifiedText": "the cleaned text here",
          "glossary": []
        }`;
    } else {
        return res.status(400).json({ error: 'Invalid mode.' });
    }

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash", 
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `${systemPrompt}\n\nText:\n${text}`;
        const response = await model.generateContent(prompt);
        const resultText = response.response.text().trim();
        
        let parsedData;
        try {
            parsedData = JSON.parse(resultText);
        } catch (e) {
            // Fallback if Gemini fails to return perfect JSON
            parsedData = { simplifiedText: resultText, glossary: [] };
        }

        const readabilityBefore = calculateFleschKincaid(text);
        const readabilityAfter = calculateFleschKincaid(parsedData.simplifiedText);

        res.json({
            result: parsedData.simplifiedText,
            glossary: parsedData.glossary,
            readabilityBefore,
            readabilityAfter
        });

    } catch (error) {
        console.error("🔥 Gemini Error:", error.message);
        res.status(500).json({
            error: 'Failed to process text',
            details: error.message
        });
    }
});

module.exports = router;