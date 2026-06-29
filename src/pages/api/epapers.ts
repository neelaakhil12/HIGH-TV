import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb', // Support large PDF uploads up to 50MB
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
      res.setHeader('Cache-Control', 'no-store, max-age=0, must-revalidate');
      return res.status(200).json(epapers);
    } catch (error) {
      console.error('Error fetching epapers in Pages API:', error);
      return res.status(500).json({ error: 'Failed to fetch epapers' });
    }
  }

  if (method === 'POST') {
    try {
      let data = req.body;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (e) {}
      }

      // If pdfUrl is a Base64 string, write it to public/uploads/epapers file storage
      if (data && data.pdfUrl && data.pdfUrl.startsWith('data:application/pdf;base64,')) {
        const base64Data = data.pdfUrl.replace(/^data:application\/pdf;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'epapers');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        const cleanTitleSlug = (data.title || 'edition').toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 20);
        const fileName = `epaper-${Date.now()}-${cleanTitleSlug}.pdf`;
        const filePath = path.join(uploadDir, fileName);
        
        fs.writeFileSync(filePath, buffer);
        
        // Save clean URL path in database
        data.pdfUrl = `/uploads/epapers/${fileName}`;
      }

      const epaper = await prisma.epaper.create({ data });
      return res.status(201).json(epaper);
    } catch (error: any) {
      console.error('Error creating epaper in Pages API:', error);
      return res.status(500).json({
        error: 'Failed to create epaper',
        message: error?.message || String(error),
        code: error?.code
      });
    }
  }

  if (method === 'PUT') {
    try {
      let data = req.body;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (e) {}
      }
      const { id, title, date, pdfUrl, section } = data;
      if (!id) return res.status(400).json({ error: 'Missing epaper id' });

      const existing = await prisma.epaper.findUnique({ where: { id } });
      let finalPdfUrl = existing?.pdfUrl || pdfUrl;

      if (pdfUrl && pdfUrl.startsWith('data:application/pdf;base64,')) {
        if (existing && existing.pdfUrl && existing.pdfUrl.startsWith('/uploads/epapers/')) {
          const oldPath = path.join(process.cwd(), 'public', existing.pdfUrl);
          if (fs.existsSync(oldPath)) {
            try { fs.unlinkSync(oldPath); } catch (e) {}
          }
        }

        const base64Data = pdfUrl.replace(/^data:application\/pdf;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'epapers');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const cleanTitleSlug = (title || 'edition').toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 20);
        const fileName = `epaper-${Date.now()}-${cleanTitleSlug}.pdf`;
        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, buffer);
        finalPdfUrl = `/uploads/epapers/${fileName}`;
      }

      const updated = await prisma.epaper.update({
        where: { id },
        data: {
          title,
          date,
          pdfUrl: finalPdfUrl,
          section
        }
      });
      return res.status(200).json(updated);
    } catch (error: any) {
      console.error('Error updating epaper in Pages API:', error);
      return res.status(500).json({ error: 'Failed to update epaper', message: error?.message });
    }
  }

  if (method === 'DELETE') {
    try {
      const id = String(req.query.id || '');
      const existing = await prisma.epaper.findUnique({ where: { id } });
      if (existing && existing.pdfUrl && existing.pdfUrl.startsWith('/uploads/epapers/')) {
        const filePath = path.join(process.cwd(), 'public', existing.pdfUrl);
        if (fs.existsSync(filePath)) {
          try { fs.unlinkSync(filePath); } catch (e) {}
        }
      }
      await prisma.epaper.delete({ where: { id } });
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting epaper in Pages API:', error);
      return res.status(500).json({ error: 'Failed to delete epaper' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  return res.status(405).end(`Method ${method} Not Allowed`);
}
