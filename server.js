import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config({ path: '.env.local' });

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const PORT = 3005;

// ─── Gemini Client ───
const getClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY not found in .env.local');
    return new GoogleGenAI({ apiKey });
};

// ─── Retry with Exponential Backoff ───
async function withRetry(fn, maxRetries = 3) {
    let lastError;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            const message = error?.message || String(error);
            const status = error?.status || error?.httpStatusCode;

            // Don't retry on invalid request (400) or auth errors (401/403)
            if (status === 400 || status === 401 || status === 403) {
                throw error;
            }

            // Retry on 429 (rate limit) or 500+ (server errors)
            if (attempt < maxRetries - 1) {
                const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
                console.log(`⚠️  Attempt ${attempt + 1} failed: ${message}. Retrying in ${Math.round(delay)}ms...`);
                await new Promise(r => setTimeout(r, delay));
            }
        }
    }
    throw lastError;
}

// ─── Main Enhance Endpoint ───
app.post('/api/enhance', async (req, res) => {
    try {
        const { systemInstruction, prompt, model, temperature, thinkingBudget, maxOutputTokens } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'prompt is required' });
        }

        const ai = getClient();

        const result = await withRetry(async () => {
            const response = await ai.models.generateContent({
                model: model || 'gemini-2.5-flash-lite',
                contents: prompt,
                config: {
                    systemInstruction: systemInstruction || '',
                    temperature: temperature ?? 0.3,
                    maxOutputTokens: maxOutputTokens ?? 8000,
                    responseMimeType: 'application/json'
                }
            });
            return response;
        });

        const text = result.text || '{}';
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(jsonStr);

        return res.json({ success: true, data: parsed });

    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('❌ Enhance Error:', message);
        return res.status(500).json({
            success: false,
            error: message,
            retryable: !['400', '401', '403'].some(code => message.includes(code))
        });
    }
});

// ─── Health Check ───
app.get('/api/health', (req, res) => {
    const hasKey = !!process.env.GEMINI_API_KEY;
    res.json({
        status: 'ok',
        apiKeyConfigured: hasKey,
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`\n🚀 CM Contents Enhancer API Server`);
    console.log(`   http://localhost:${PORT}`);
    console.log(`   API Key: ${process.env.GEMINI_API_KEY ? '✅ Configured' : '❌ Missing'}`);
    console.log(`   Retry: 3 attempts with exponential backoff\n`);
});
