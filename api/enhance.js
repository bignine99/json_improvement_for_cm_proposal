import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { systemInstruction, prompt, model, temperature, thinkingBudget, maxOutputTokens } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'prompt is required' });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
        }

        const ai = new GoogleGenAI({ apiKey });

        let lastError;
        for (let attempt = 0; attempt < 3; attempt++) {
            try {
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

                const text = response.text || '{}';
                const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
                const parsed = JSON.parse(jsonStr);

                return res.status(200).json({ success: true, data: parsed });
            } catch (error) {
                lastError = error;
                const status = error?.status || error?.httpStatusCode;
                if (status === 400 || status === 401 || status === 403) throw error;
                if (attempt < 2) {
                    const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
                    await new Promise(r => setTimeout(r, delay));
                }
            }
        }
        throw lastError;

    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('Enhance Error:', message);
        return res.status(500).json({
            success: false,
            error: message,
            retryable: !['400', '401', '403'].some(code => message.includes(code))
        });
    }
}
