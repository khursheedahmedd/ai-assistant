const Groq = require('groq-sdk');
require('dotenv').config();

const groq = new Groq({ apiKey: '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' });

// Function to process the image using Llama 3.2 90B
exports.processImage = async (imageUrl) => {
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: `What's in this image?`, // Use a simple string here
                },
                {
                    role: 'user', // Another user message for the image
                    content: [
                        {
                            type: 'image_url',
                            image_url: {
                                url: imageUrl // Pass the image URL
                            }
                        }
                    ]
                },
                {
                    role: 'assistant',
                    content: "" // The assistant's response will be populated by the model
                }
            ],
            model: "llama-3.2-11b-vision-preview",
            temperature: 1,
            max_tokens: 1024,
            top_p: 1,
            stream: false,
            stop: null
        });

        // Return the response from the model
        return chatCompletion.choices[0].message.content;

    } catch (error) {
        console.error('Error processing image with Llama 3.2:', error.message);
        throw new Error('Image processing failed.');
    }
};

// Function to process text using Llama 3.1 70B Versatile
exports.processText = async (text) => {
    console.log(text)
    try {
        // Sending the text to the Llama 3.1 70B Versatile model
        const chatCompletion = await groq.chat.completions.create({
            "messages": [
                {
                    "role": "user",
                    "content": text
                }
            ],
            "model": "llama-3.1-70b-versatile",
            "temperature": 1,
            "max_tokens": 1024,
            "top_p": 1,
            "stream": false,
            "stop": null
        });

        // Extracting the response from the Llama API
        const responseMessage = chatCompletion.choices[0].message.content;
        return responseMessage;

    } catch (error) {
        console.error('Error processing text with Llama 3.1 70B Versatile:', error.message);
        throw new Error('Text processing failed.');
    }
};
