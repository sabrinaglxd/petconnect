export default async function handler(req, res) {
    // Update CORS headers to handle Articulate domains
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

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { video_id } = req.body;

        if (!video_id) {
            return res.status(400).json({ error: 'video_id is required' });
        }

        // Using production endpoint
        const statusResponse = await fetch(`https://api.heygen.com/v2/video/status/${video_id}`, {
            method: 'GET',
            headers: {
                'X-Api-Key': process.env.HEYGEN_API_KEY
            }
        });

        const statusData = await statusResponse.json();
        res.status(200).json(statusData);

    } catch (error) {
        console.error('Error checking video status:', error);
        res.status(500).json({ 
            error: 'Failed to check video status',
            details: error.message
        });
    }
}