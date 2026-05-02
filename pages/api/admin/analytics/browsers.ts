import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB, PageVisit } from '../../../../api/_lib/db';
import { verifyToken } from '../../../../api/_lib/auth';

function parseBrowser(ua: string | undefined) {
  if (!ua) return 'Unknown';
  if (ua.includes('Edg/')) return 'Edge';
  if (ua.includes('Chrome/') && !ua.includes('Edg/')) return 'Chrome';
  if (ua.includes('Safari/') && !ua.includes('Chrome/')) return 'Safari';
  if (ua.includes('Firefox/')) return 'Firefox';
  if (ua.includes('Opera/') || ua.includes('OPR/')) return 'Opera';
  return 'Other';
}

function parseDevice(ua: string | undefined) {
  if (!ua) return 'Unknown';
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'Tablet';
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return 'Mobile';
  return 'Desktop';
}

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
    const visits = await (PageVisit as any).find({}, { userAgent: 1, _id: 0 }).lean();

    const browserCounts: Record<string, number> = {};
    const deviceCounts: Record<string, number> = {};

    visits.forEach((visit) => {
      const browser = parseBrowser(visit.userAgent);
      const device = parseDevice(visit.userAgent);
      browserCounts[browser] = (browserCounts[browser] || 0) + 1;
      deviceCounts[device] = (deviceCounts[device] || 0) + 1;
    });

    return res.status(200).json({
      browsers: Object.entries(browserCounts).map(([name, count]) => ({ name, count })),
      devices: Object.entries(deviceCounts).map(([name, count]) => ({ name, count })),
    });
  } catch (error) {
    console.error('Error fetching browser analytics', error);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
}
