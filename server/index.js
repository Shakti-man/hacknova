const express = require('express');
const cors = require('cors');
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
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// Routes
app.use('/api/simplify', simplifyRoute);

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
