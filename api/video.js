export default async function handler(req, res) {
    // CORS headers stay the same
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
        const { video_id } = req.body;

        if (!video_id) {
            return res.status(400).json({ error: 'video_id is required' });
        }

        // Updated to match HeyGen's documentation exactly
        const statusResponse = await fetch('https://api.heygen.com/v2/video_status.get', {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'X-Api-Key': process.env.HEYGEN_API_KEY
            }
        });

        // Log raw response for debugging
        const rawResponse = await statusResponse.text();
        console.log('Raw HeyGen Response:', rawResponse);

        // Try to parse the response
        try {
            const statusData = JSON.parse(rawResponse);
            console.log('Parsed Status Data:', statusData);
            res.status(200).json(statusData);
        } catch (parseError) {
            console.error('Failed to parse HeyGen response:', rawResponse);
            res.status(500).json({
                error: 'Failed to parse HeyGen response',
                details: rawResponse
            });
        }

    } catch (error) {
        console.error('Error checking video status:', error);
        res.status(500).json({ 
            error: 'Failed to check video status',
            details: error.message
        });
    }
}