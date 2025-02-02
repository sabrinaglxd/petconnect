export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed - use POST' });
    }
  
    try {
      const { video_id } = req.body;
  
      if (!video_id) {
        return res.status(400).json({ error: 'video_id is required' });
      }
  
      // Log the URL we're calling
      const url = `https://api.heygen.com/v2/video/status/${video_id}`;
      console.log('Calling URL:', url);
  
      const statusResponse = await fetch(url, {
        method: 'GET',
        headers: {
          'X-Api-Key': process.env.HEYGEN_API_KEY
        }
      });
  
      // Log the status code and raw response
      console.log('Response status:', statusResponse.status);
      const rawText = await statusResponse.text();
      console.log('Raw response:', rawText);
  
      // Try to parse if it looks like JSON
      if (rawText.trim().startsWith('{')) {
        const statusData = JSON.parse(rawText);
        res.status(200).json(statusData);
      } else {
        throw new Error(`Unexpected response format: ${rawText.substring(0, 100)}...`);
      }
  
    } catch (error) {
      console.error('Detailed error:', error);
      res.status(500).json({ 
        error: 'Failed to check video status',
        details: error.message,
        stack: error.stack
      });
    }
  }