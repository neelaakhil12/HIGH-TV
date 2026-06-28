import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb', // Support large PDF Base64 payloads up to 50MB
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method === 'GET') {
    try {
      const { date } = req.query;
      const where = date ? { date: String(date) } : {};
      const epapers = await prisma.epaper.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      });
      return res.status(200).json(epapers);
    } catch (error) {
      console.error('Error fetching epapers in Pages API:', error);
      return res.status(500).json({ error: 'Failed to fetch epapers' });
    }
  }

  if (method === 'POST') {
    try {
      const data = req.body;
      const epaper = await prisma.epaper.create({ data });
      return res.status(201).json(epaper);
    } catch (error) {
      console.error('Error creating epaper in Pages API:', error);
      return res.status(500).json({ error: 'Failed to create epaper' });
    }
  }

  if (method === 'DELETE') {
    try {
      const id = String(req.query.id || '');
      await prisma.epaper.delete({ where: { id } });
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting epaper in Pages API:', error);
      return res.status(500).json({ error: 'Failed to delete epaper' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  return res.status(405).end(`Method ${method} Not Allowed`);
}
