import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB, ExperienceRegistration } from '../../../lib/db';
import { verifyToken } from '../../../lib/auth';

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
    const registrations = await (ExperienceRegistration as any).find().sort({ createdAt: -1 });
    return res.status(200).json(registrations);
  } catch (error) {
    console.error('Error fetching admin experience registrations', error);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
}
