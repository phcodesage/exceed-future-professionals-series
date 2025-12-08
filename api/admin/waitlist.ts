import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB, WaitlistEntry } from '../_lib/db';
import { verifyToken } from '../_lib/auth';
import { setCorsHeaders } from '../_lib/cors';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Handle CORS
    if (setCorsHeaders(req, res)) {
        return;
    }

    // Only allow GET
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Verify authentication
    const payload = verifyToken(req.headers.authorization as string);
    if (!payload) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // Connect to database
        await connectDB();

        // Fetch all waitlist entries
        const entries = await WaitlistEntry.find().sort({ createdAt: -1 });

        return res.status(200).json(entries);
    } catch (error) {
        console.error('Error fetching admin waitlist entries', error);
        return res.status(500).json({ message: 'Something went wrong.' });
    }
}
