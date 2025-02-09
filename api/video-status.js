export default async function handler(req, res) {
    // Debug logging at start
    console.log('=== Video Status Check Request Started ===');
    console.log('Request Method:', req.method);
    console.log('Request Query Parameters:', req.query);
    console.log('Request Body:', req.body);
    console.log('Request Headers:', req.headers);

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
        // Get video_id from query parameters or body
        const video_id = req.method === 'GET' ? req.query.video_id : req.body?.video_id;
        console.log('Extracted video_id:', video_id);

        if (!video_id) {
            console.log('No video_id provided');
            return res.status(400).json({ error: 'video_id is required as a query parameter' });
        }

        // Updated endpoint URL to match HeyGen's documentation
        const apiUrl = `https://api.heygen.com/v2/videos/${encodeURIComponent(video_id)}`;
        console.log('Making request to HeyGen:', apiUrl);

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
            console.log('Parsed response data:', statusData);
            return res.status(200).json(statusData);
        } catch (parseError) {
            console.error('Failed to parse HeyGen response:', parseError);
            return res.status(500).json({ 
                error: 'Invalid response from HeyGen',
                details: responseText
            });
        }

    } catch (error) {
        console.error('Error in video status check:', error);
        return res.status(500).json({ 
            error: 'Failed to check video status',
            details: error.message
        });
    }
}