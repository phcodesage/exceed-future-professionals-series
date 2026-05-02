import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB, PageVisit } from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { sessionId, page, referrer, userAgent } = req.body;

    if (!sessionId || !page) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    await connectDB();

    await (PageVisit as any).findOneAndUpdate(
      { sessionId },
      {
        sessionId,
        page,
        referrer: referrer || '',
        userAgent: userAgent || '',
        lastActive: new Date(),
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({ message: 'Visit tracked' });
  } catch (error) {
    console.error('Error tracking visit', error);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
}
