export default async function handler(req, res) {
    // CORS headers remain the same
    
    try {
        const { script } = req.body;
        console.log('Attempting video generation with script:', script);

        // Log what we're sending to HeyGen
        const requestBody = {
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

        const generateResponse = await fetch('https://api-staging.heygen.com/v2/video/generate', {
            method: 'POST',
            headers: {
                'X-Api-Key': process.env.HEYGEN_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        // Log the full response
        const responseText = await generateResponse.text();
        console.log('HeyGen raw response:', responseText);

        // Try to parse the response
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            throw new Error(`Failed to parse HeyGen response: ${responseText}`);
        }

        res.status(200).json(data);
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