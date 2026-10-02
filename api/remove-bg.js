// Vercel serverless function — proxies background removal to external API.
// The API key is read from the environment variable API_KEY (never exposed to the browser).
// Set API_KEY in your Vercel project's Environment Variables settings.

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '25mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'API key not configured. Add API_KEY to Vercel environment variables.' });
    return;
  }

  const { image, filename, type } = req.body || {};
  if (!image) {
    res.status(400).json({ error: 'No image provided.' });
    return;
  }

  // Decode base64 data URL sent by the browser
  const base64Data = image.replace(/^data:[^;]+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');

  // Build multipart form for the upstream API
  const form = new FormData();
  const blob = new Blob([buffer], { type: type || 'image/jpeg' });
  form.append('image_file', blob, filename || 'image.jpg');

  let upstream;
  try {
    upstream = await fetch('https://api.nanobanana.io/remove-bg', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}` },
      body: form,
    });
  } catch (err) {
    res.status(502).json({ error: 'Could not reach processing service. Try again later.' });
    return;
  }

  if (!upstream.ok) {
    let msg = `Processing service error: ${upstream.status}`;
    try {
      const j = await upstream.json();
      msg = j.message || j.error || msg;
    } catch {}
    res.status(upstream.status).json({ error: msg });
    return;
  }

  const resultBuffer = Buffer.from(await upstream.arrayBuffer());
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Content-Length', resultBuffer.length);
  res.status(200).send(resultBuffer);
}
