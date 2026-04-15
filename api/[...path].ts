import type { VercelRequest, VercelResponse } from '@vercel/node';

const BACKEND_URL = 'https://overlearnedly-multiseriate-jina.ngrok-free.dev';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const path = (req.query.path as string[])?.join('/') ?? '';
  const targetUrl = `${BACKEND_URL}/${path}${req.url?.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''}`;

  const headers: Record<string, string> = {
    'ngrok-skip-browser-warning': 'true',
    'Content-Type': 'application/json',
  };

  if (req.headers['cookie']) {
    headers['Cookie'] = req.headers['cookie'] as string;
  }

  if (req.headers['user-agent']) {
    headers['User-Agent'] = req.headers['user-agent'] as string;
  }

  const response = await fetch(targetUrl, {
    method: req.method,
    headers,
    body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
  });

  const setCookieHeader = response.headers.get('set-cookie');
  if (setCookieHeader) {
    res.setHeader('set-cookie', setCookieHeader);
  }

  const contentType = response.headers.get('content-type');
  if (contentType) {
    res.setHeader('content-type', contentType);
  }

  const text = await response.text();
  res.status(response.status).send(text);
}
