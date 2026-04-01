require('dotenv').config({ quiet: true });
const express = require('express');
const { callAI } = require('./callAI');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Health endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Helpful root route for browser checks
app.get('/', (req, res) => {
    res.json({
        message: 'API is running',
        endpoints: {
            health: 'GET /health',
            review: 'POST /review'
        }
    });
});

// Browser-friendly explanation for /review
app.get('/review', (req, res) => {
    res.status(405).json({
        error: 'Method Not Allowed',
        message: 'Use POST /review with JSON body: { "code": "..." }'
    });
});

// POST /review route
app.post('/review', async (req, res) => {
    const { code } = req.body;
    if (!code) {
        return res.status(400).json({ error: 'No code content provided' });
    }

    try {
        const promptPath = path.join(__dirname, '../prompts/system-prompt.txt');
        const systemPrompt = fs.readFileSync(promptPath, 'utf8');

        const feedback = await callAI(systemPrompt, code);
        res.json({ feedback });
    } catch (error) {
        console.error('Code review error:', error.message);
        res.status(500).json({
            error: 'AI Review failed',
            details: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
