import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB, PageVisit } from '../../../../api/_lib/db';
import { verifyToken } from '../../../../api/_lib/auth';

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
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const realTimeVisitors = await PageVisit.countDocuments({ lastActive: { $gte: fiveMinutesAgo } });
    const todayVisits = await PageVisit.countDocuments({ createdAt: { $gte: todayStart } });
    const todayUniqueVisitors = await PageVisit.distinct('sessionId', { createdAt: { $gte: todayStart } });
    const weekVisits = await PageVisit.countDocuments({ createdAt: { $gte: weekAgo } });
    const weekUniqueVisitors = await PageVisit.distinct('sessionId', { createdAt: { $gte: weekAgo } });
    const totalVisits = await PageVisit.countDocuments({});
    const totalUniqueVisitors = (await PageVisit.distinct('sessionId')).length;

    return res.status(200).json({
      realTimeVisitors,
      today: {
        visits: todayVisits,
        uniqueVisitors: todayUniqueVisitors.length,
      },
      week: {
        visits: weekVisits,
        uniqueVisitors: weekUniqueVisitors.length,
      },
      total: {
        visits: totalVisits,
        uniqueVisitors: totalUniqueVisitors,
      },
    });
  } catch (error) {
    console.error('Error fetching analytics summary', error);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
}
