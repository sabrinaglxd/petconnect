export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed - use POST' });
    }
  
    try {
      const { script, avatar_id, voice_id } = req.body;
  
      console.log('Sending request with:', { script, avatar_id, voice_id });
  
      const generateResponse = await fetch('https://api-staging.heygen.com/v1/video.generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HEYGEN_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          video_inputs: [{
            avatar_id: avatar_id,
            voice_id: voice_id,
            text: script
          }]
        })
      });
  
      // Log the raw response
      const rawResponse = await generateResponse.text();
      console.log('Raw response:', rawResponse);
  
      // Try to parse the response
      const generateData = JSON.parse(rawResponse);
      console.log('Generate Response Data:', generateData);
  
      res.status(200).json(generateData);
    } catch (error) {
      console.error('Detailed error:', error);
      res.status(500).json({ 
        error: 'Failed to process request',
        details: error.message,
        stack: error.stack
      });
    }
  }