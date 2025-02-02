export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed - use POST' });
    }
  
    try {
      const { script, avatar_id, voice_id } = req.body;
  
      console.log('Using API Key:', process.env.HEYGEN_API_KEY?.substring(0, 5) + '...');  // Only log first 5 chars for security
  
      const generateResponse = await fetch('https://api-staging.heygen.com/v1/video.generate', {
        method: 'POST',
        headers: {
          'X-Api-Key': process.env.HEYGEN_API_KEY,  // Changed from 'Authorization'
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
  
      const rawResponse = await generateResponse.text();
      console.log('Raw response:', rawResponse);
      
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