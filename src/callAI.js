const axios = require('axios');

async function callAI(systemPrompt, userCode) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        throw new Error('OPENROUTER_API_KEY is missing from environment variables');
    }

    try {
        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: 'google/gemini-2.0-flash-001',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `Analyze the following code for bugs and improvements:\n\n${userCode}` }
                ]
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000,
                proxy: false
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        if (error.response) {
            const status = error.response.status;
            const apiMessage =
                error.response.data?.error?.message ||
                error.response.data?.message ||
                'Unknown API error';
            throw new Error(`OpenRouter error (${status}): ${apiMessage}`);
        }

        if (error.code === 'ECONNABORTED') {
            throw new Error('OpenRouter request timed out after 30 seconds');
        }

        throw new Error(`Network/client error: ${error.message}`);
    }
}

module.exports = { callAI };
