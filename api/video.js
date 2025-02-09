export default async function handler(req, res) {
    // CORS headers remain the same
    const allowedOrigins = [
        'https://articulateusercontent.com',
        'https://review360.articulate.com',
        '*'
    ];
    
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
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
        // Log the incoming request
        console.log('Received request body:', req.body);
        
        const { script } = req.body;
        
        // Verify script content
        if (!script) {
            throw new Error('No script provided in request');
        }
        
        console.log('Preparing HeyGen request with script:', script);

        try {
            const videoResponse = await fetch('https://api.heygen.com/v2/video/generate', {
                method: 'POST',
                headers: {
                    'X-Api-Key': process.env.HEYGEN_API_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    version: "v2",
                    video_inputs: [
                        {
                            character: {
                                type: "avatar",
                                avatar_id: "Georgia_expressive_2024112701",
                                avatar_style: "normal"
                            },
                            voice: {
                                type: "text",
                                input_text: script,
                                voice_id: "511ffd086a904ef593b608032004112c",
                                speed: 1.1
                            }
                        }
                    ],
                    dimension: {
                        width: 1280,
                        height: 720
                    }
                })
            });
        
            // Add these lines to see the raw response
            const rawResponse = await videoResponse.text();
            console.log('HeyGen Response Status:', videoResponse.status);
            console.log('HeyGen Raw Response:', rawResponse);
        
            try {
                const data = JSON.parse(rawResponse);
                console.log('Parsed Response:', data);
                res.status(200).json(data);
            } catch (parseError) {
                console.error('Failed to parse response:', rawResponse);
                throw new Error(`Invalid response from HeyGen: ${rawResponse}`);
            }
        

        } catch (fetchError) {
            console.error('Fetch error:', fetchError);
            throw new Error(`HeyGen API request failed: ${fetchError.message}`);
        }

    } catch (error) {
        console.error('Full error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        
        res.status(500).json({ 
            error: 'Failed to process request',
            details: error.message,
            stack: error.stack
        });
    }
}