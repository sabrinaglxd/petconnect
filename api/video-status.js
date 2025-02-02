export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed - use POST' });
    }
  
    try {
      const { video_id } = req.body;
  
      if (!video_id) {
        return res.status(400).json({ error: 'video_id is required' });
      }
  
      const statusResponse = await fetch('https://api.heygen.com/v2/video/status', {
        method: 'POST',
        headers: {
          'x-api-Key': process.env.HEYGEN_API_KEY,
          'content-type': 'application/json'
        },
        body: JSON.stringify({ video_id })
      });
  
      const statusData = await statusResponse.json();
      console.log('Status Response:', statusData);
  
      res.status(200).json(statusData);
  
    } catch (error) {
      console.error('Detailed error:', error);
      res.status(500).json({ 
        error: 'Failed to check video status',
        details: error.message,
        stack: error.stack
      });
    }
  }