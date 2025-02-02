export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed - use POST' });
    }
  
    try {
      const { script, avatar_id, voice_id } = req.body;
  
      // Updated HeyGen API endpoint
      const response = await fetch('https://api.heygen.com/v2/video/generation', {
        method: 'POST',
        headers: {
          'X-Api-Key': process.env.HEYGEN_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          background: "#ffffff",
          video_inputs: [
            {
              script: {
                text: script,
                input_text: script
              },
              avatar: {
                avatar_id: avatar_id,
                voice_id: voice_id
              }
            }
          ]
        })
      });
  
      const data = await response.json();
      console.log('HeyGen response:', data);
      res.status(200).json(data);
    } catch (error) {
      console.error('Detailed error:', error);
      res.status(500).json({ 
        error: 'Failed to process request',
        details: error.message 
      });
    }
  }