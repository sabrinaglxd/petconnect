export default async function handler(req, res) {
    // CORS headers remain the same
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
        // Log the incoming request body for debugging
        console.log('Incoming request body:', req.body);

        // Extract data from request body
        const { script, avatar_id, voice_id } = req.body;

        // Validate required fields
        if (!script || !avatar_id || !voice_id) {
            console.log('Missing required fields:', { script, avatar_id, voice_id });
            return res.status(400).json({ 
                error: 'Missing required fields', 
                details: 'script, avatar_id, and voice_id are required' 
            });
        }

        // Log the request we're about to make to HeyGen
        const requestBody = {
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
        };
        console.log('HeyGen request body:', requestBody);

        // Make request to HeyGen API
        const response = await fetch('https://api.heygen.com/v2/video.generate', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'x-api-key': process.env.HEYGEN_API_KEY
            },
            body: JSON.stringify(requestBody)
        });

        // Log response details for debugging
        console.log('HeyGen response status:', response.status);
        console.log('HeyGen response headers:', Object.fromEntries(response.headers.entries()));

        // Read the response as text first
        const responseText = await response.text();
        console.log('HeyGen raw response:', responseText);

        // Try to parse as JSON if possible
        let responseData;
        try {
            responseData = JSON.parse(responseText);
        } catch (e) {
            console.error('Failed to parse HeyGen response as JSON:', e);
            return res.status(500).json({ 
                error: 'Invalid JSON response from HeyGen',
                details: responseText
            });
        }

        // Check if response was successful
        if (!response.ok) {
            console.error('HeyGen API Error:', responseData);
            return res.status(response.status).json({
                error: 'HeyGen API error',
                details: responseData
            });
        }

        // Send successful response
        res.status(200).json(responseData);

    } catch (error) {
        console.error('Error in video generation endpoint:', error);
        res.status(500).json({ 
            error: 'Failed to generate video',
            details: error.message,
            stack: error.stack
        });
    }
}