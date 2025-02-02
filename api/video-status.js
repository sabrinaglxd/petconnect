export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed - use POST' });
    }
  
    try {
      const { video_id } = req.body;
  
      if (!video_id) {
        return res.status(400).json({ error: 'video_id is required' });
      }
  
      // Using exact format from HeyGen's curl example
      const url = `https://api-staging.heygen.com/v1/video_status.get?video_id=${video_id}`;
      console.log('Calling URL:', url);
  
      const statusResponse = await fetch(url, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'x-api-key': process.env.HEYGEN_API_KEY
        }
      });
  
      // Log response details
      console.log('Response Status:', statusResponse.status);
      const rawText = await statusResponse.text();
      console.log('Raw Response:', rawText);
  
      try {
        const statusData = JSON.parse(rawText);
        res.status(200).json(statusData);
      } catch (e) {
        throw new Error(`Could not parse response: ${rawText.substring(0, 100)}`);
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