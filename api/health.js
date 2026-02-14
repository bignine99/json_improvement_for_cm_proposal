export default function handler(req, res) {
    const hasKey = !!process.env.GEMINI_API_KEY;
    res.status(200).json({
        status: 'ok',
        apiKeyConfigured: hasKey,
        timestamp: new Date().toISOString()
    });
}
