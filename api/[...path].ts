import type { VercelRequest, VercelResponse } from '@vercel/node';

const BACKEND_URL = 'https://overlearnedly-multiseriate-jina.ngrok-free.dev';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const pathParts = (req.query.path as string[]) ?? [];
    const path = pathParts.join('/');
    
    const queryString = req.url?.includes('?') 
      ? req.url.slice(req.url.indexOf('?')) 
      : '';
    
    const targetUrl = `${BACKEND_URL}/${path}${queryString}`;

    console.log('[PROXY] →', req.method, targetUrl);

    const headers: Record<string, string> = {
      'ngrok-skip-browser-warning': 'true',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    };

    if (req.headers['content-type']) {
      headers['Content-Type'] = req.headers['content-type'] as string;
    }

    if (req.headers['cookie']) {
      headers['Cookie'] = req.headers['cookie'] as string;
    }

    const body = req.method !== 'GET' && req.method !== 'HEAD' 
      ? JSON.stringify(req.body) 
      : undefined;

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
    });

    console.log('[PROXY] ← status:', response.status);

    // Passa os cookies da resposta
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      res.setHeader('set-cookie', setCookie);
    }

    // Passa o content-type
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('content-type', contentType);
    }

    const text = await response.text();
    console.log('[PROXY] ← body:', text.slice(0, 200));

    res.status(response.status).send(text);
  } catch (err: any) {
    console.error('[PROXY] erro:', err.message);
    res.status(500).json({ error: 'Proxy error', message: err.message });
  }
}
