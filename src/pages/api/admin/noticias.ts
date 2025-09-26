import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

interface Noticia {
  id: number;
  title: string;
  description: string;
  image: string;
  slug: string;
  link: string;
  date: string;
  category?: string;
  author?: string;
  tags?: string[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers['x-admin-auth'];
  console.log('Auth header:', authHeader); 
  console.log('Expected:', process.env.NEXT_PUBLIC_ADMIN_PASSWORD); 
  
  const isAuthenticated = authHeader === process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
  if (!isAuthenticated) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  if (req.method === 'POST') {
    try {
      const novaNoticia = {
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        slug: req.body.title.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-'),
        link: req.body.link,
        date: req.body.date,
        category: req.body.category,
        author: req.body.author,
        tags: req.body.tags ? req.body.tags.split(',').map((tag: string) => tag.trim()) : []
      };

      const { data, error } = await supabase
        .from('noticias')
        .insert([novaNoticia])
        .select()
        .single();

      if (error) throw error;

      res.status(200).json(data);
    } catch (error) {
      console.error('Erro ao salvar notícia:', error);
      res.status(500).json({ error: 'Erro ao salvar notícia' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
