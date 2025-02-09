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
        // Get video_id from query parameters
        const video_id = req.query.video_id;

        if (!video_id) {
            return res.status(400).json({ error: 'video_id is required as a query parameter' });
        }

        // Make request to HeyGen API with exact v2 specifications
        const statusResponse = await fetch(`https://api.heygen.com/v2/video_status.get?video_id=${video_id}`, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'x-api-key': process.env.HEYGEN_API_KEY
            }
        });

        if (!statusResponse.ok) {
            const errorText = await statusResponse.text();
            console.error('HeyGen API Error:', errorText);
            throw new Error(`HeyGen API responded with status ${statusResponse.status}`);
        }

        const statusData = await statusResponse.json();
        console.log('Video Status Response:', statusData);
        res.status(200).json(statusData);

    } catch (error) {
        console.error('Error checking video status:', error);
        res.status(500).json({ 
            error: 'Failed to check video status',
            details: error.message
        });
    }
}