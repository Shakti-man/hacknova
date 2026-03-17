const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const simplifyRoute = require('./routes/simplify');

dotenv.config({ path: '../.env' }); // Note: check where .env is located (root)

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Private-Network', 'true');
  next();
});
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const upload = multer({ storage: multer.memoryStorage() });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Routes
app.use('/api/simplify', simplifyRoute);

// OCR Route for Images (Powered by Gemini)
app.post('/api/ocr-image', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Conversion to Gemini inlineData format
    const imagePart = {
      inlineData: {
        data: req.file.buffer.toString("base64"),
        mimeType: req.file.mimetype,
      },
    };

    const prompt = "Please transcribe the text in this image accurately. Return only the extracted text without any commentary or additional formatting.";
    const result = await model.generateContent([prompt, imagePart]);
    const extractedText = result.response.text().trim();

    if (!extractedText) {
      throw new Error('Gemini returned empty text');
    }

    res.json({ text: extractedText });
  } catch (error) {
    console.error('Gemini OCR Error Details:', error);
    res.status(500).json({ 
      error: 'Failed to extract text from image',
      details: error.message 
    });
  }
});

// PDF Parsing (keeps pdf-parse, but backend is now more modular)
app.post('/api/parse-pdf', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const data = await pdfParse(req.file.buffer);
    res.json({ text: data.text });
  } catch (error) {
    console.error('PDF Parse Error:', error);
    res.status(500).json({ error: 'Failed to parse PDF file' });
  }
});

app.get('/api/fetch-url', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'Missing url query parameter' });
  }
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch the URL' });
    }
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Remove script and style tags
    $('script, style, noscript, iframe, nav, footer, header').remove();
    
    // Extract text from body
    const text = $('body').text().replace(/\s\s+/g, ' ').trim();
    
    res.json({ text });
  } catch (error) {
    console.error('Fetch URL Error:', error);
    res.status(500).json({ error: 'Failed to fetch contents from the URL' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
