# Lexify — AI-Powered Dyslexia-Friendly Reader

Lexify is a full-stack web application designed to help people with dyslexia read complex text easily. It uses OpenAI's GPT-4o-mini model to simplify text, summarize it into bullet points, or clean up grammar. 

It also includes features like OpenDyslexic font support, text-to-speech, and readability grading before and after simplification.

## Features
- **3 Input Modes**: Paste text, upload a file (PDF or Image via OCR), or enter a webpage URL.
- **3 Simplification Modes**: Simplified English, Bullet points, or Plain text cleanup.
- **Readability Stats**: Flesch-Kincaid grade level calculation.
- **Accessibility Tools**: OpenDyslexic font, text-to-speech, letter/word spacing adjustments, and line height settings.
- **Chrome Extension**: Highlight text on any page and instantly simplify it.

## Quick Start

1. Install dependencies for the root, client, and server:
   ```bash
   npm run install:all
   ```

2. Set up environment variables:
   Copy `.env.example` to `.env` in the root folder and add your API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=5000
   ```

3. Run the development server (client & server concurrently):
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`.

## Tech Stack
- Frontend: React (Vite) + Tailwind CSS
- Backend: Node.js + Express
- AI: OpenAI GPT-4o-mini
- OCR & Parsing: Tesseract.js (browser) & pdf-parse (server)
- TTS: Web Speech API
