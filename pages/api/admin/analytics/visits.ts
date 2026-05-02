import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB, PageVisit } from '../../../../lib/db';
import { verifyToken } from '../../../../lib/auth';

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
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const visitsByDay = await PageVisit.aggregate([
      { $match: { createdAt: { $gte: weekAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          visits: { $sum: 1 },
          uniqueVisitors: { $addToSet: '$sessionId' },
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day',
            },
          },
          visits: 1,
          uniqueVisitors: { $size: '$uniqueVisitors' },
        },
      },
      { $sort: { date: 1 } },
    ]);

    return res.status(200).json(visitsByDay);
  } catch (error) {
    console.error('Error fetching analytics visits', error);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
}
