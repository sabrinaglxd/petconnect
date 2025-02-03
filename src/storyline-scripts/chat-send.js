// Make function available globally
window.handleSend = handleSend;

async function handleSend() {
    var player = GetPlayer();
    
    // Disable send button using exact state name
    player.SetVar("Send Button.state", "Disabled");
    
    try {
        // Get and save user's message
        const userMessage = player.GetVar("userResponse");
        
        // Clear input field
        player.SetVar("userResponse", "Type your response here");
        
        // Get current chat history
        let currentHistory = player.GetVar("chatHistory") || "";
        
        // Send to ChatGPT
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: "system",
                        content: "You are Linda Collins, a 67-year-old retired teacher concerned about your Green-Cheeked Conure's feather plucking. Respond naturally and conversationally."
                    },
                    {
                        role: "user",
                        content: currentHistory + "\nVet Tech: " + userMessage
                    }
                ]
            })
        });

        const data = await response.json();
        
        // Update Linda's response
        player.SetVar("lindaResponse", data.choices[0].message.content);
        
        // Update chat history
        player.SetVar("chatHistory", currentHistory + "\nVet Tech: " + userMessage + "\nLinda: " + data.choices[0].message.content);
        
    } catch (error) {
        console.error('Error:', error);
        player.SetVar("lindaResponse", "I'm sorry, I'm having trouble connecting. Could you try again?");
    } finally {
        // Re-enable send button using exact state name
        player.SetVar("Send Button.state", "Normal");
    }
}