export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed - use POST' });
    }
  
    try {
      // Get the script from the request body
      const { script, avatar_id, voice_id } = req.body;
  
      // Log what we're sending to HeyGen
      console.log('Sending to HeyGen:', { script, avatar_id, voice_id });
  
      // Call HeyGen API
      const response = await fetch('https://api.heygen.com/v1/video.generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HEYGEN_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          script: script,
          avatar_id: avatar_id,
          voice_id: voice_id
        })
      });
  
      // Log the HeyGen response status
      console.log('HeyGen response status:', response.status);
  
      // Get the response data
      const data = await response.json();
      
      // Log the actual response
      console.log('HeyGen response:', data);
  
      res.status(200).json(data);
    } catch (error) {
      // Log the full error
      console.error('Detailed error:', error);
      res.status(500).json({ 
        error: 'Failed to process request',
        details: error.message 
      });
    }
  }