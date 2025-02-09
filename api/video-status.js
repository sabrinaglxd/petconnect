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

        // Updated to match HeyGen's V2 API format
        const statusResponse = await fetch('https://api.heygen.com/v2/videos/status', {
            method: 'POST',
            headers: {
                'X-Api-Key': process.env.HEYGEN_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                video_id: video_id
            })
        });

        const statusData = await statusResponse.json();
        console.log('Status Response:', statusData);
        res.status(200).json(statusData);

    } catch (error) {
        console.error('Error checking video status:', error);
        res.status(500).json({ 
            error: 'Failed to check video status',
            details: error.message
        });
    }
}