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
        const { script } = req.body;
        console.log('Attempting video generation with script:', script);

        // Log what we're sending to HeyGen
        const requestBody = {
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
        };
        console.log('HeyGen request body:', JSON.stringify(requestBody, null, 2));

        // Using production endpoint
        const generateResponse = await fetch('https://api.heygen.com/v2/video/generate', {
            method: 'POST',
            headers: {
                'X-Api-Key': process.env.HEYGEN_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        // Log the full response
        const responseText = await generateResponse.text();
        console.log('HeyGen Response Status:', generateResponse.status);
        console.log('HeyGen Raw Response:', responseText);

        // Try to parse the response
        let data;
        try {
            data = JSON.parse(responseText);
            console.log('Parsed Response:', data);
            res.status(200).json(data);
        } catch (parseError) {
            console.error('Failed to parse HeyGen response:', responseText);
            throw new Error(`Invalid response from HeyGen: ${responseText}`);
        }

    } catch (error) {
        console.error('Detailed generation error:', {
            message: error.message,
            stack: error.stack,
            cause: error.cause
        });
        res.status(500).json({ 
            error: 'Failed to process request',
            details: error.message,
            stack: error.stack
        });
    }
}