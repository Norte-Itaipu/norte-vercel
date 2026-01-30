import { NextApiRequest, NextApiResponse } from 'next';
import { getCachedData, setCachedData } from '@/lib/services/redis';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { key } = req.query;
    
    if (!key || typeof key !== 'string') {
      return res.status(400).json({ error: 'Key parameter is required' });
    }

    try {
      const data = await getCachedData(key);
      return res.status(200).json({ data });
    } catch (error) {
      console.error('Error getting cached data:', error);
      return res.status(500).json({ error: 'Failed to get cached data' });
    }
  }

  if (req.method === 'POST') {
    const { key, data, ttl } = req.body;

    if (!key || !data) {
      return res.status(400).json({ error: 'Key and data are required' });
    }

    try {
      await setCachedData(key, data, ttl || 3600);
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error setting cached data:', error);
      return res.status(500).json({ error: 'Failed to set cached data' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}