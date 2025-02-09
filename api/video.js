export default async function handler(req, res) {
    // CORS headers
    const allowedOrigins = [
        'https://360.articulate.com',
        'https://review360.articulate.com',
        'https://articulateusercontent.com'
    ];
    
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin) || origin?.endsWith('.articulate.com')) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        // Extract data from request body
        const { script, avatar_id, voice_id } = req.body;

        // Validate required fields
        if (!script || !avatar_id || !voice_id) {
            return res.status(400).json({ 
                error: 'Missing required fields', 
                details: 'script, avatar_id, and voice_id are required' 
            });
        }

        // Make request to HeyGen API
        const response = await fetch('https://api.heygen.com/v2/video.generate', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'x-api-key': process.env.HEYGEN_API_KEY
            },
            body: JSON.stringify({
                "background": "#ffffff",
                "ratio": "16:9",
                "test": false,
                "version": "v2",
                "clips": [
                    {
                        "avatar_id": avatar_id,
                        "avatar_style": "normal",
                        "input_text": script,
                        "voice_id": voice_id,
                        "scale": 1.1,
                        "position_x": 0,
                        "position_y": 0
                    }
                ]
            })
        });

        // Log the raw response for debugging
        const responseText = await response.text();
        console.log('HeyGen Raw Response:', responseText);

        // Parse response as JSON if possible
        let responseData;
        try {
            responseData = JSON.parse(responseText);
        } catch (e) {
            console.error('Failed to parse HeyGen response:', e);
            return res.status(500).json({ 
                error: 'Invalid response from HeyGen',
                details: responseText
            });
        }

        // Check if response was successful
        if (!response.ok) {
            console.error('HeyGen API Error:', responseData);
            return res.status(response.status).json(responseData);
        }

        // Send successful response
        res.status(200).json(responseData);

    } catch (error) {
        console.error('Error generating video:', error);
        res.status(500).json({ 
            error: 'Failed to generate video',
            details: error.message
        });
    }
}