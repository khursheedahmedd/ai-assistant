import React, { useState, useRef } from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';

const HealthMode = () => {
    const [userInfo, setUserInfo] = useState({ fitness: '', diet: '', disease: '' });
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const webcamRef = useRef(null);

    // Handle form submission
    const handleFormSubmit = (e) => {
        e.preventDefault();
        setIsFormSubmitted(true);
        setChatMessages((prevMessages) => [
            ...prevMessages,
            { text: `User Info: Fitness - ${userInfo.fitness}, Diet - ${userInfo.diet}, Disease - ${userInfo.disease}`, type: 'user' }
        ]);
    };

    const handleCapture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        const byteString = atob(imageSrc.split(',')[1]);
        const mimeString = imageSrc.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        const file = new Blob([ab], { type: mimeString });

        sendImageToBackend(file);
    };

    const sendImageToBackend = async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/picture', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const description = response.data.description;
            setChatMessages((prevMessages) => [
                ...prevMessages,
                { text: description, type: 'bot' }
            ]);
            await getHealthSuggestion(description);
        } catch (error) {
            console.error('Error uploading image:', error);
        }

        setIsLoading(false);
        setIsCameraOpen(false);
    };

    const getHealthSuggestion = async (description) => {
        const prompt = `Help me about my health. I have the following diet: ${userInfo.diet}, and my disease is: ${userInfo.disease}. The food in the picture is: ${description}. Give a short answer and don't use heading`;

        try {
            const response = await axios.post('http://localhost:5000/api/assistant/text', { message: prompt });
            const result = response.data.response;

            setChatMessages((prevMessages) => [
                ...prevMessages,
                { text: result, type: 'bot' }
            ]);
        } catch (error) {
            console.error('Error getting health suggestion:', error);
        }
    };

    const sendTextMessage = async () => {
        if (userInput.trim() === '') return;

        const prompt = `User Info: Fitness - ${userInfo.fitness}, Diet - ${userInfo.diet}, Disease - ${userInfo.disease}. Question: ${userInput}`;
        setChatMessages([...chatMessages, { text: userInput, type: 'user' }]);

        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/assistant/text', { message: prompt });
            const result = response.data.response;

            setChatMessages((prevMessages) => [
                ...prevMessages,
                { text: result, type: 'bot' }
            ]);
        } catch (error) {
            console.error('Error sending message:', error);
        }

        setIsLoading(false);
        setUserInput('');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-r from-blue-300 to-purple-400">
            {!isFormSubmitted ? (
                <form onSubmit={handleFormSubmit} className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4 text-center">Health Information</h2>
                    <div className="mb-4">
                        <label className="block mb-1" htmlFor="fitness">Fitness Plan:</label>
                        <input
                            id="fitness"
                            type="text"
                            value={userInfo.fitness}
                            onChange={(e) => setUserInfo({ ...userInfo, fitness: e.target.value })}
                            className="w-full border rounded-md p-2 focus:outline-none"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1" htmlFor="diet">Diet Plan:</label>
                        <input
                            id="diet"
                            type="text"
                            value={userInfo.diet}
                            onChange={(e) => setUserInfo({ ...userInfo, diet: e.target.value })}
                            className="w-full border rounded-md p-2 focus:outline-none"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1" htmlFor="disease">Disease (if any):</label>
                        <input
                            id="disease"
                            type="text"
                            value={userInfo.disease}
                            onChange={(e) => setUserInfo({ ...userInfo, disease: e.target.value })}
                            className="w-full border rounded-md p-2 focus:outline-none"
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors duration-300">
                        Submit
                    </button>
                </form>
            ) : (
                <div className="sm:w-[40rem] w-full max-w-md p-6 bg-white rounded-lg shadow-lg flex flex-col h-full">
                    <h2 className="text-2xl font-bold mb-4 text-center">Chat with Assistant</h2>

                    <div className="mt-6 flex-grow overflow-y-auto border-t border-gray-200 pt-4">
                        {chatMessages.map((message, index) => (
                            <div
                                key={index}
                                className={`p-2 my-2 rounded-lg max-w-xs ${message.type === 'bot'
                                    ? 'bg-green-200 text-gray-800 self-start rounded-br-none'
                                    : 'bg-blue-500 text-white self-end rounded-bl-none'
                                    }`}
                            >
                                {message.text}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-center items-center mt-2">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        )}
                    </div>

                    <div className="flex mt-4">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Type a question..."
                            className="w-4/5 border rounded-l-md p-2 focus:outline-none"
                        />
                        <button onClick={sendTextMessage} className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 transition-colors duration-300">
                            Send
                        </button>
                    </div>

                    <div className="flex flex-col mt-4">
                        {isCameraOpen ? (
                            <>
                                <Webcam
                                    ref={webcamRef}
                                    audio={false}
                                    screenshotFormat="image/jpeg"
                                    className="w-full mb-4 rounded-lg shadow-md"
                                />
                                <button onClick={handleCapture} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors duration-300 mb-2">
                                    Capture Image
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsCameraOpen(true)}
                                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors duration-300 mb-2"
                            >
                                Open Camera
                            </button>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => sendImageToBackend(e.target.files[0])}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default HealthMode;
