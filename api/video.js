export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed - use POST' });
  }

  try {
    const { script, avatar_id, voice_id } = req.body;

    // Generate video
    const generateResponse = await fetch('https://api-staging.heygen.com/v1/video.generate', {
      method: 'POST',
      headers: {
        'X-Api-Key': process.env.HEYGEN_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: "v1alpha",
        clips: [
          {
            avatar_id: avatar_id,
            voice_id: voice_id,
            input_text: script
          }
        ]
      })
    });

    const generateData = await generateResponse.json();
    console.log('Generate Response:', generateData);
    
    // Just return the generation data for now
    res.status(200).json(generateData);

  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ 
      error: 'Failed to process request',
      details: error.message,
      stack: error.stack
    });
  }
}  });
  }
}