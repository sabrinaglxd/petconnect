export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed - use POST' });
    }
  
    try {
      // Get the messages from the request body
      const { messages } = req.body;
  
      // Call ChatGPT API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: messages,
          temperature: 0.7
        })
      });
  
      // Get the response data
      const data = await response.json();
  
      // Send the response back
      res.status(200).json(data);
    } catch (error) {
      // Handle any errors
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to process request' });
    }
  }