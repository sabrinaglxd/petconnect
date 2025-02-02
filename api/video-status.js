export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed - use POST' });
    }
  
    try {
      const { video_id } = req.body;
  
      if (!video_id) {
        return res.status(400).json({ error: 'video_id is required' });
      }
  
      // Using the correct endpoint from the documentation
      const url = `https://api.heygen.com/v2/videos/${video_id}`;  // Notice the plural 'videos'
      console.log('Calling URL:', url);
  
      const statusResponse = await fetch(url, {
        method: 'GET',
        headers: {
          'X-Api-Key': process.env.HEYGEN_API_KEY
        }
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