import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB, WaitlistEntry } from '../../../api/_lib/db';
import { verifyToken } from '../../../api/_lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const payload = verifyToken(req.headers.authorization);
  if (!payload) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    await connectDB();
    const entries = await (WaitlistEntry as any).find().sort({ createdAt: -1 });
    return res.status(200).json(entries);
  } catch (error) {
    console.error('Error fetching admin waitlist entries', error);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
}
