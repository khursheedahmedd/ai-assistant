require('dotenv').config();
let fetch;
let FormData;

(async () => {
    fetch = (await import('node-fetch')).default;
    FormData = (await import('form-data')).default;
})();

// Clone a voice using a voice sample
exports.cloneVoice = async (voiceSample) => {
    const ElevenLabsClient = require('elevenlabs-client');
    const client = new ElevenLabsClient({ apiKey: process.env.ELEVEN_LABS_API_KEY });

    try {
        const formData = new FormData();
        formData.append("files", voiceSample);

        const voiceCloneResponse = await client.voices.add({
            files: [voiceSample],
            name: "Deceased Person Voice",
        });

        const voiceId = voiceCloneResponse.voice_id;
        console.log("Voice cloned successfully. Voice ID:", voiceId);

        return voiceId;
    } catch (error) {
        console.error("Error cloning voice:", error.message);
        throw new Error("Failed to clone voice.");
    }
};

// Generate audio from text using a specific voice ID
exports.generateAudio = async (text, voiceId) => {
    const apiKey = process.env.ELEVEN_LABS_API_KEY;
    const apiUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

    const requestBody = {
        text: text,
        output_format: "mp3_44100_128",
        voice_settings: {
            stability: 0.1,
            similarity_boost: 0.3,
            style: 0.2,
        },
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': apiKey,
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const audioStream = response.body;
        if (audioStream) {
            const reader = audioStream.getReader();
            const chunks = [];
            let result;

            // Read the stream and collect audio chunks
            while (!(result = await reader.read()).done) {
                chunks.push(result.value);
            }

            const audioBuffer = Buffer.concat(chunks);
            return audioBuffer;
        } else {
            console.error("No audio stream available.");
            throw new Error("Failed to generate audio stream.");
        }
    } catch (error) {
        console.error("Error generating audio:", error.message);
        throw new Error("Failed to generate audio.");
    }
};
