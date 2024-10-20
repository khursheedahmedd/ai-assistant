const { processImage, processText } = require('../models/llamaModel');
const { cloneVoice, generateAudio } = require('../models/voiceModel');

// Picture Mode
const processPictureMode = async (req, res) => {
    // Check if the file is uploaded
    if (!req.file) {
        console.error('No file uploaded.');
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    const imageBuffer = req.file.buffer; // Get the uploaded file buffer
    console.log('Image buffer received:', imageBuffer);

    try {
        // Process the image using the Groq SDK
        const description = await processImage(imageBuffer);
        res.status(200).json({ description });
    } catch (error) {
        console.error('Error in Picture Mode:', error.message);
        res.status(500).json({ error: 'Failed to process image' });
    }
};



// Translation Mode
const processTranslationMode = async (req, res) => {
    const { text, audio } = req.body;
    try {
        let transcription;
        if (audio) {
            // Clone the voice and generate transcription
            const voiceId = await cloneVoice(audio);
            transcription = await processText(text); // Generate response based on text
        } else {
            // Process text directly if no audio is provided
            transcription = await processText(text);
        }
        res.status(200).json({ transcription });
    } catch (error) {
        console.error('Error in Translation Mode:', error.message);
        res.status(500).json({ error: 'Translation mode failed' });
    }
};

// Assistant Mode
const processAssistantMode = async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Image is required' });
    }

    try {
        const response = await processImage(message);
        res.status(200).json({ response });
    } catch (error) {
        console.error('Error in Image Assistant Mode:', error.message);
        res.status(500).json({ error: 'Assistant mode failed' });
    }
};

const simpleAssistantMode = async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const response = await processText(message);
        res.status(200).json({ response });
    } catch (error) {
        console.error('Error in Assistant Mode:', error);
        res.status(500).json({ error: 'Text processing failed' });
    }
};


// Health Mode
const processHealthMode = async (req, res) => {
    const { fitnessData, query, image } = req.body;
    try {
        let description = '';
        if (image) {
            // Process the image if provided
            description = await processImage(image);
        }
        // Combine fitness data, image description, and query for health advice
        const healthQuery = `${fitnessData} ${description} ${query}`;
        const suggestion = await processText(healthQuery);
        res.status(200).json({ suggestion });
    } catch (error) {
        console.error('Error in Health Mode:', error.message);
        res.status(500).json({ error: 'Health mode failed' });
    }
};

// Learn Mode
const processLearnMode = async (req, res) => {
    const { image } = req.body;
    try {
        // Process the image and generate a description using Llama model
        const description = await processImage(image);
        res.status(200).json({ description });
    } catch (error) {
        console.error('Error in Learn Mode:', error.message);
        res.status(500).json({ error: 'Learn mode failed' });
    }
};

// Speech Mode
const processSpeechMode = async (req, res) => {
    const { voiceSample, text } = req.body;
    try {
        let voiceId, audioResponse;
        if (voiceSample) {
            // Clone the voice for the first time
            voiceId = await cloneVoice(voiceSample);
        }

        // Generate text response using Llama model
        const responseText = await processText(text);

        if (voiceId) {
            // Generate audio response from text using the cloned voice
            audioResponse = await generateAudio(responseText, voiceId);
        }

        res.status(200).json({ response: responseText, audio: audioResponse });
    } catch (error) {
        console.error('Error in Speech Mode:', error.message);
        res.status(500).json({ error: 'Speech mode failed' });
    }
};

module.exports = {
    processPictureMode,
    processTranslationMode,
    processAssistantMode,
    simpleAssistantMode,
    processHealthMode,
    processLearnMode,
    processSpeechMode,
};
