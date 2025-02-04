export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
  }

  if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
      const { script, avatar_id, voice_id } = req.body;

      const generateResponse = await fetch('https://api-staging.heygen.com/v2/video/generate', {
          method: 'POST',
          headers: {
              'X-Api-Key': process.env.HEYGEN_API_KEY,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              video_inputs: [
                  {
                      character: {
                          type: "avatar",
                          avatar_id: avatar_id,
                          avatar_style: "normal"
                      },
                      voice: {
                          type: "text",
                          input_text: script,
                          voice_id: voice_id,
                          speed: 1.1
                      }
                  }
              ],
              dimension: {
                  width: 1280,
                  height: 720
              }
          })
      });

      const data = await generateResponse.json();
      
      // Log the response for debugging
      console.log('HeyGen Response:', data);
      
      res.status(200).json(data);
  } catch (error) {
      console.error('Detailed error:', error);
      res.status(500).json({ 
          error: 'Failed to process request',
          details: error.message
      });
  }
}