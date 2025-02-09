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
        const video_id = req.query.video_id;
        console.log('Checking status for video_id:', video_id);

        if (!video_id) {
            return res.status(400).json({ error: 'video_id is required as a query parameter' });
        }

        // Using v1 endpoint as fallback
        const apiUrl = `https://api.heygen.com/v1/videos/${encodeURIComponent(video_id)}`;
        console.log('Making request to:', apiUrl);

        const statusResponse = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'x-api-key': process.env.HEYGEN_API_KEY
            }
        });

        console.log('Response status:', statusResponse.status);
        
        // Check content type
        const contentType = statusResponse.headers.get('content-type');
        console.log('Response content type:', contentType);

        const responseText = await statusResponse.text();
        console.log('Raw response:', responseText);

        // Try to parse as JSON only if it looks like JSON
        if (responseText.trim().startsWith('{') || responseText.trim().startsWith('[')) {
            try {
                const data = JSON.parse(responseText);
                return res.status(200).json(data);
            } catch (parseError) {
                console.error('Parse error:', parseError);
                return res.status(500).json({
                    error: 'Failed to parse HeyGen response',
                    details: responseText.substring(0, 100) // First 100 chars for debugging
                });
            }
        } else {
            // If response doesn't look like JSON, send appropriate error
            console.error('Unexpected response format:', responseText.substring(0, 100));
            return res.status(500).json({
                error: 'Unexpected response format from HeyGen',
                details: responseText.substring(0, 100)
            });
        }

    } catch (error) {
        console.error('Error in handler:', error);
        return res.status(500).json({
            error: 'Failed to check video status',
            details: error.message
        });
    }
}