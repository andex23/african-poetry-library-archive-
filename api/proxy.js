// Vercel Serverless Function — PDF Proxy for Google Drive
// Fetches PDF files from Google Drive, bypassing CORS restrictions

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Missing file ID' });
  }

  // Validate the ID looks like a Google Drive file ID (alphanumeric + hyphens/underscores)
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
    return res.status(400).json({ error: 'Invalid file ID' });
  }

  const driveUrl = `https://drive.google.com/uc?export=download&id=${id}`;

  try {
    // First request — may get a confirmation page for large files
    let response = await fetch(driveUrl, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PDF-Proxy/1.0)',
      },
    });

    // Check if Google returned an HTML confirmation page (for large files)
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('text/html')) {
      // Try the confirm bypass URL
      const confirmUrl = `https://drive.google.com/uc?export=download&id=${id}&confirm=t`;
      response = await fetch(confirmUrl, {
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; PDF-Proxy/1.0)',
        },
      });
    }

    if (!response.ok) {
      return res.status(response.status).json({ error: `Google Drive returned ${response.status}` });
    }

    const buffer = await response.arrayBuffer();

    // Set CORS and caching headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400'); // Cache 24h
    res.setHeader('Content-Length', buffer.byteLength);

    return res.send(Buffer.from(buffer));
  } catch (err) {
    console.error('Proxy error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch PDF from Google Drive' });
  }
}
