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
        // Get video_id from query parameters
        const video_id = req.query.video_id;

        if (!video_id) {
            return res.status(400).json({ error: 'video_id is required as a query parameter' });
        }

        // Log the request details
        console.log('Checking status for video_id:', video_id);

        // Updated endpoint URL to match HeyGen's documentation
        const apiUrl = `https://api.heygen.com/v2/videos/${encodeURIComponent(video_id)}`;
        console.log('Making request to:', apiUrl);

        const statusResponse = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'x-api-key': process.env.HEYGEN_API_KEY
            }
        });

        console.log('HeyGen response status:', statusResponse.status);
        const responseText = await statusResponse.text();
        console.log('Raw HeyGen response:', responseText);

        try {
            const statusData = JSON.parse(responseText);
            return res.status(200).json(statusData);
        } catch (parseError) {
            console.error('Failed to parse HeyGen response:', responseText);
            return res.status(500).json({ 
                error: 'Invalid response from HeyGen',
                details: responseText
            });
        }

    } catch (error) {
        console.error('Error checking video status:', error);
        return res.status(500).json({ 
            error: 'Failed to check video status',
            details: error.message
        });
    }
}