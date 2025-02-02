export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed - use POST' });
  }

  try {
    const { script, avatar_id, voice_id } = req.body;

    const generateResponse = await fetch('https://api.heygen.com/v2/video/generate', {
      method: 'POST',
      headers: {
        'x-api-Key': process.env.HEYGEN_API_KEY,    // Changed header format to match
        'content-type': 'application/json'          // Changed header format to match
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

    // Match the error handling from your working code
    if (data.error) {
      console.error("Error in API response:", JSON.stringify(data.error, null, 2));
      throw new Error("Video generation failed");
    } else if (data.data && data.data.video_id) {
      // Success case
      console.log("Video ID:", data.data.video_id);
      res.status(200).json(data);
    } else {
      console.error("Unexpected API response:", JSON.stringify(data, null, 2));
      throw new Error("Unexpected response structure");
    }

  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ 
      error: 'Failed to process request',
      details: error.message,
      stack: error.stack
    });
  }
}