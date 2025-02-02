export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed - use POST' });
    }
  
    try {
      const { script, avatar_id, voice_id } = req.body;
  
      // Using test environment URL
      const generateResponse = await fetch('https://api-staging.heygen.com/v1/video.generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HEYGEN_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          avatar_id: avatar_id,
          voice_id: voice_id,
          script: script,
          version: "v1"
        })
      });
  
      console.log('Generate Response Status:', generateResponse.status);
      const generateData = await generateResponse.json();
      console.log('Generate Response Data:', generateData);
  
      // Check if we got a video_id
      if (!generateData.video_id) {
        throw new Error('No video_id received from HeyGen');
      }
  
      // Also use test environment for status check
      const statusResponse = await fetch(`https://api-staging.heygen.com/v1/video_status?video_id=${generateData.video_id}`, {
        headers: {
          'Authorization': `Bearer ${process.env.HEYGEN_API_KEY}`
        }
      });
  
      const statusData = await statusResponse.json();
      console.log('Status Response Data:', statusData);
  
      res.status(200).json(statusData);
    } catch (error) {
      console.error('Detailed error:', error);
      res.status(500).json({ 
        error: 'Failed to process request',
        details: error.message,
        stack: error.stack
      });
    }
  }