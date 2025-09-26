import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET_KEY}`) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  try {
    const { data, error } = await supabase
      .from('noticias')
      .select('count(*)', { count: 'exact' });

    if (error) throw error;

    console.log('Keep-alive query executada com sucesso:', new Date().toISOString());
    res.status(200).json({ success: true, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Erro no keep-alive:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
}
