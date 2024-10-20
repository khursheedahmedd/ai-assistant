import React, { useState } from 'react';
import { ReactMic } from 'react-mic';
import axios from 'axios';

const LanguageTranslationMode = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [textInput, setTextInput] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [voiceId, setVoiceId] = useState(null); // To store the cloned voice ID from 11 Labs
    const [userInput, setUserInput] = useState("");

    const handleTextSend = async () => {
        if (!textInput) return;

        const userMessage = textInput;
        setChatHistory((prev) => [...prev, { role: 'user', content: userMessage }]);
        setTextInput(""); // Clear input

        try {
            const res = await axios.post('http://localhost:5000/api/translation', {
                text: userMessage,
            });
            const assistantMessage = res.data.answer;

            setChatHistory((prev) => [...prev, { role: 'assistant', content: assistantMessage }]);
        } catch (error) {
            console.error("Error sending the message", error);
        }
    };

    const handleAudioStop = async (recordedBlob) => {
        const formData = new FormData();
        formData.append('audio', recordedBlob.blob);

        try {
            // Send the audio to backend and get the cloned voice ID if not already saved
            const res = await axios.post('http://localhost:5000/api/translation', formData);
            const { voiceId: newVoiceId, transcription, answerAudio } = res.data;

            if (!voiceId) setVoiceId(newVoiceId); // Save voice ID for future use

            setChatHistory((prev) => [...prev, { role: 'user', content: transcription }]);
            setChatHistory((prev) => [...prev, { role: 'assistant', content: `Audio response generated...` }]);

            // Play the audio response from the backend (generated from 11 Labs)
            const audio = new Audio(answerAudio);
            audio.play();
        } catch (error) {
            console.error("Error processing audio", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-300 to-purple-400 p-4">
            <h1 className="text-3xl font-bold mb-4">Language Translation Mode</h1>

            <div className="w-full md:w-2/3 bg-white rounded-lg shadow-md p-4">
                <div className="h-64 overflow-y-scroll">
                    {chatHistory.map((chat, index) => (
                        <div key={index} className={chat.role === 'user' ? "text-right" : "text-left"}>
                            <p className={chat.role === 'user' ? "bg-blue-100 inline-block p-2 rounded-lg mb-2" : "bg-gray-100 inline-block p-2 rounded-lg mb-2"}>
                                {chat.content}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Text Input */}
                <div className="mt-4 flex">
                    <input
                        type="text"
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Send a text message..."
                        className="w-full border-2 border-gray-300 p-2 rounded-lg"
                    />
                    <button
                        onClick={handleTextSend}
                        className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                        Send
                    </button>
                </div>

                {/* Audio Recording */}
                <div className="mt-4">
                    {/* <ReactMic
                        record={isRecording}
                        className="sound-wave"
                        onStop={handleAudioStop}
                    // strokeColor="#000000"
                    // backgroundColor="#FFFFFF" 
                    /> */}
                    <button
                        onClick={() => setIsRecording(!isRecording)}
                        className={`mt-2 px-4 py-2 ${isRecording ? 'bg-red-600' : 'bg-green-600'} text-white rounded-lg`}
                    >
                        {isRecording ? "Stop Recording" : "Record Audio"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LanguageTranslationMode;
