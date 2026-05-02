import type { VercelRequest, VercelResponse } from '@vercel/node';

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:4173',
    'https://exceed-future-professionals-series.vercel.app',
];

export function setCorsHeaders(req: VercelRequest, res: VercelResponse): boolean {
    const origin = req.headers.origin;

    if (
        origin &&
        (allowedOrigins.includes(origin) ||
            // Allow all Vercel preview deployments for this project
            /^https:\/\/exceed-future-professionals-series[a-z0-9-]*\.vercel\.app$/.test(origin))
    ) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else if (!origin) {
        // Allow requests with no origin (like mobile apps or curl)
        res.setHeader('Access-Control-Allow-Origin', '*');
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return true;
    }

    return false;
}
