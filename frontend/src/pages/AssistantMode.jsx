import React, { useState, useRef } from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';

const AssistantMode = () => {
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const [isFrontCamera, setIsFrontCamera] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const webcamRef = useRef(null);

    const handleCameraSwitch = () => {
        setIsFrontCamera(!isFrontCamera);
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

        setCapturedImage(imageSrc);
        setImageSrc(file); // Use the Blob object for sending to backend
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setCapturedImage(reader.result);
            setImageSrc(file); // for sending to backend
        };
        reader.readAsDataURL(file);
    };

    const sendImageToBackend = async () => {
        const formData = new FormData();
        formData.append('image', imageSrc); // Ensure imageSrc is the file object

        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/picture', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const { description } = response.data;
            setChatMessages((prevMessages) => [
                ...prevMessages,
                { text: description, type: 'bot' }
            ]);
        } catch (error) {
            console.error('Error uploading image:', error);
        }

        setIsLoading(false);
        setCapturedImage(null);
        setIsCameraOpen(false);
    };

    const sendTextMessage = async () => {
        if (userInput.trim() === '') return;

        const newMessage = { text: userInput, type: 'user' };
        setChatMessages([...chatMessages, newMessage]);

        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/assistant/text', { message: userInput });
            const result = response.data.response;

            setChatMessages((prevMessages) => [
                ...prevMessages,
                { text: result, type: 'bot' }
            ]);
        } catch (error) {
            console.error('Error sending message:', error);
        }

        setIsLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-r from-blue-300 to-purple-400">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">Assistant Mode</h2>

                <div className="mt-6 h-60 overflow-y-auto border-t border-gray-200 pt-4">
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
                        placeholder="Type a message..."
                        className="w-4/5 border rounded-l-lg p-2 focus:outline-none"
                    />
                    <button onClick={sendTextMessage} className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 transition-colors duration-300">
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
                                videoConstraints={{
                                    facingMode: isFrontCamera ? 'user' : { exact: 'environment' },
                                }}
                                className="w-full mb-4 rounded-lg shadow-md"
                            />
                            <button onClick={handleCapture} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors duration-300 mb-2">
                                Capture Image
                            </button>
                            {capturedImage && (
                                <button onClick={sendImageToBackend} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors duration-300">
                                    Send Image
                                </button>
                            )}
                            <button onClick={handleCameraSwitch} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors duration-300 mt-2">
                                Switch Camera
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
                        onChange={handleFileUpload}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </div>
            </div>
        </div>
    );
};

export default AssistantMode;
