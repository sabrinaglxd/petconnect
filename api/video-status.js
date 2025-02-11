export const config = {
    runtime: 'edge'
};

export default async function handler(req) {
    const allowedOrigins = [
        'https://360.articulate.com',
        'https://review360.articulate.com',
        'https://articulateusercontent.com'
    ];
    
    const corsHeaders = {
        'Access-Control-Allow-Origin': req.headers.get('origin')?.endsWith('.articulate.com') ? 
            req.headers.get('origin') : allowedOrigins[0],
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Max-Age': '86400',
        'Content-Type': 'application/json'
    };

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: corsHeaders
        });
    }

    // Ensure GET method
    if (req.method !== 'GET') {
        return new Response(JSON.stringify({ error: 'Method not allowed. Please use GET.' }), {
            status: 405,
            headers: corsHeaders
        });
    }

    try {
        const url = new URL(req.url);
        const video_id = url.searchParams.get('video_id');
        console.log('Checking status for video_id:', video_id);

        if (!video_id) {
            return new Response(JSON.stringify({ error: 'video_id is required as a query parameter' }), {
                status: 400,
                headers: corsHeaders
            });
        }

        const apiUrl = `https://api.heygen.com/v1/video_status.get?video_id=${encodeURIComponent(video_id)}`;
        console.log('Making request to:', apiUrl);

        const statusResponse = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'x-api-key': process.env.HEYGEN_API_KEY  // Changed to lowercase
            }
        });

        console.log('Response status:', statusResponse.status);
        
        const responseText = await statusResponse.text();
        console.log('Raw response:', responseText);

        try {
            const data = JSON.parse(responseText);
            return new Response(JSON.stringify(data), {
                status: statusResponse.status,
                headers: corsHeaders
            });
        } catch (parseError) {
            console.error('Parse error:', parseError);
            return new Response(JSON.stringify({
                error: 'Failed to parse HeyGen response',
                details: responseText.substring(0, 100)
            }), {
                status: 500,
                headers: corsHeaders
            });
        }

    } catch (error) {
        console.error('Error in handler:', error);
        return new Response(JSON.stringify({
            error: 'Failed to check video status',
            details: error.message
        }), {
            status: 500,
            headers: corsHeaders
        });
    }
}