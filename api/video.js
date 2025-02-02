export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed - use POST' });
    }
  
    try {
      const { background, video_inputs } = req.body;
  
      // Using the correct HeyGen API base URL
      const response = await fetch('https://api-production.heygen.com/v2/video/generation', {
        method: 'POST',
        headers: {
          'X-Api-Key': process.env.HEYGEN_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          background,
          video_inputs
        })
      });
  
      // Log the response status and data for debugging
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
  
      res.status(200).json(data);
    } catch (error) {
      console.error('Detailed error:', error);
      res.status(500).json({ 
        error: 'Failed to process request',
        details: error.message 
      });
    }
  }